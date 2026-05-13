"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { 
  CheckCircle2, 
  Loader2, 
  Video, 
  FileText, 
  Sparkles,
  ArrowLeft,
  Download,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import RemotionShortPlayer from "@/components/RemotionShortPlayer";
import EditCaptionModal from "@/components/dashboard/EditCaptionModal";
import RenderProgressDialog from "@/components/dashboard/RenderProgressDialog";

interface Project {
  projectId: string;
  status: string;
  progress: number;
  videoUrl?: string;
  transcription?: string;
  shorts?: any[];
}

const STEPS = [
  { id: "pending", label: "Initialization", icon: Video },
  { id: "uploading", label: "Uploading to S3", icon: Loader2 },
  { id: "upload-completed", label: "Upload Successful", icon: CheckCircle2 },
  { id: "transcribing", label: "AI Transcription", icon: FileText },
  { id: "completed", label: "Finalizing", icon: Sparkles },
];

export default function ProjectStatusPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [renderingShortId, setRenderingShortId] = useState<number | null>(null);

  useEffect(() => {
    let retryCount = 0;
    const pollProject = async () => {
      try {
        const { data } = await axios.get(`/api/project/${projectId}`);
        setProject(data);
        setError(null);
        retryCount = 0; // Reset on success
      } catch (err: any) {
        console.error("Failed to fetch project:", err);
        
        // Only show error if it's NOT a 404, or if we've tried a few times already
        // This handles the race condition where the redirect happens before the DB commit is visible
        if (err.response?.status === 404) {
          retryCount++;
          if (retryCount > 5) {
            setError("Project not found. It may have been deleted or the ID is incorrect.");
          }
        } else {
          setError("An error occurred while connecting to the server.");
        }
      }
    };

    const interval = setInterval(pollProject, 2000);
    pollProject(); // Initial fetch

    return () => clearInterval(interval);
  }, [projectId]);

  const handleDownloadClick = async (short: any) => {
    // If videoUrl is already present and status is completed, just download
    if (short.videoUrl && short.status === "completed") {
      window.open(short.videoUrl, "_blank");
      return;
    }

    // Otherwise, trigger render
    try {
      setRenderingShortId(short.id);
      await axios.post(`/api/shorts/${short.id}/render`);
    } catch (err) {
      console.error("Failed to trigger render:", err);
      setRenderingShortId(null);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const isCompleted = project.status === "completed" || project.status === "shorts-generated";

  // Redesigned view for completed projects
  if (isCompleted) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-heading font-black text-white mb-2 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              Your Viral Shorts Are Ready!
            </h1>
            <p className="text-muted-foreground">
              We've identified the most engaging moments. Review, download, or schedule them below.
            </p>
          </div>
          <button 
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>

        {(!project.shorts || project.shorts.length === 0) ? (
          <div className="p-12 text-center border border-white/10 rounded-3xl bg-white/5">
            <h2 className="text-2xl font-bold text-white mb-2">No Shorts Generated</h2>
            <p className="text-muted-foreground">The AI couldn't find suitable segments for shorts in this video.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {project.shorts.map((short, index) => (
                <div key={short.id || index} className="bg-[#111] border border-white/10 rounded-3xl p-6 flex flex-col gap-6 shadow-xl hover:border-white/20 transition-all">
                  <RemotionShortPlayer videoUrl={project.videoUrl} short={short} />
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-bold rounded-full">
                        Clip #{index + 1}
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-1 rounded-full">
                        <Sparkles className="w-3.5 h-3.5" /> SEO: {short.seoScore}/100
                      </span>
                    </div>
                    
                    <div className="mb-6 flex-1">
                      <h4 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Why this works</h4>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {short.reason}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-3 mt-auto">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleDownloadClick(short)}
                          className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" /> 
                          {short.videoUrl && short.status === "completed" ? "Download" : "Render & Download"}
                        </button>
                        <button className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                          <Calendar className="w-4 h-4" /> Schedule
                        </button>
                      </div>
                      
                      <EditCaptionModal 
                        short={short} 
                        videoUrl={project.videoUrl!} 
                        onUpdate={(newStyle) => {
                          const updatedShorts = [...(project.shorts || [])];
                          updatedShorts[index] = { ...short, captionStyle: JSON.stringify(newStyle), videoUrl: null, status: "pending" };
                          setProject({ ...project, shorts: updatedShorts });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {renderingShortId && (
              <RenderProgressDialog
                isOpen={!!renderingShortId}
                onClose={() => setRenderingShortId(null)}
                shortId={renderingShortId}
                onSuccess={(url) => {
                  if (project.shorts) {
                    const updatedShorts = project.shorts.map(s => 
                      s.id === renderingShortId ? { ...s, videoUrl: url, status: "completed" } : s
                    );
                    setProject({ ...project, shorts: updatedShorts });
                  }
                }}
              />
            )}
          </>
        )}
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex(s => s.id === project.status);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading font-black text-white mb-2">
            Magic in the Works
          </h1>
          <p className="text-muted-foreground">
            We're transforming your video into viral content.
          </p>
        </div>
        <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
        </div>
      </div>

      <div className="relative mb-16">
        {/* Progress Bar Background */}
        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${project.progress}%` }}
          >
            <div className="h-full w-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
          </div>
        </div>
        <div className="absolute top-6 left-0 text-xs font-mono text-muted-foreground">
          STAGING: {project.progress}% COMPLETE
        </div>
      </div>

      <div className="grid gap-6">
        {STEPS.map((step, index) => {
          const stepCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const Icon = step.icon;

          return (
            <div 
              key={step.id}
              className={cn(
                "group relative p-6 rounded-2xl border transition-all duration-500",
                stepCompleted ? "bg-emerald-500/5 border-emerald-500/20" : 
                isActive ? "bg-primary/5 border-primary/30" : "bg-white/5 border-white/5 opacity-40"
              )}
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center transition-colors",
                  stepCompleted ? "bg-emerald-500 text-white" : 
                  isActive ? "bg-primary text-white animate-pulse" : "bg-white/10 text-muted-foreground"
                )}>
                  {stepCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                
                <div className="flex-1">
                  <h3 className={cn(
                    "text-lg font-bold mb-0.5",
                    stepCompleted ? "text-emerald-400" : "text-white"
                  )}>
                    {step.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stepCompleted ? "Step finished successfully" : isActive ? "Processing now..." : "Waiting to start"}
                  </p>
                </div>

                {isActive && (
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
