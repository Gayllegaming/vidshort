"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  UploadCloud, 
  FileVideo, 
  X, 
  Play, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";

export function UploadVideo() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setIsComplete(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setIsComplete(false);
      setUploadProgress(0);
    }
  };

  const startUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // 1. Get Presigned URL
      const { data: presignedData } = await axios.post("/api/upload", {
        fileName: file.name,
        contentType: file.type || "video/mp4",
      });

      const { presignedUrl, projectId } = presignedData;
      setProjectId(projectId);

      // 2. Upload directly to S3
      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type || "video/mp4",
        },
        onUploadProgress: (progressEvent) => {
           if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              // Scale progress from 20 to 80
              setUploadProgress(20 + (progress * 0.6));
           }
        }
      });

      // 3. Notify server of completion to trigger Inngest
      await axios.post("/api/upload", {
        projectId,
        fileName: file.name,
        contentType: file.type || "video/mp4",
        complete: true
      });

      setUploadProgress(100);

      // Navigate to the status page
      router.push(`/dashboard/projects/${projectId}`);

    } catch (error: any) {
      console.error("Upload failed", error);
      setIsUploading(false);
      const errorMsg = error.response?.data?.error || error.message || "Upload failed. Please try again.";
      alert(errorMsg);
    }
  };

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (projectId && isUploading) {
       pollInterval = setInterval(async () => {
          try {
             const res = await axios.get(`/api/project/${projectId}`);
             const project = res.data;
             
             if (project) {
                setUploadProgress(project.progress || 10);
                if (project.status === "completed") {
                   setIsComplete(true);
                   setIsUploading(false);
                   clearInterval(pollInterval);
                   
                   if (project.videoUrl) {
                      console.log("Generated Signed Video URL:", project.videoUrl);
                   }
                }
             }
          } catch (error) {
             console.error("Polling error", error);
          }
       }, 2000); // Poll every 2 seconds
    }

    return () => {
       if (pollInterval) clearInterval(pollInterval);
    };
  }, [projectId, isUploading]);

  const reset = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setIsUploading(false);
    setUploadProgress(0);
    setIsComplete(false);
    setProjectId(null);
  };

  return (
    <div className="relative group">
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-cyan-500/20 to-primary/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000" />
      
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111118]/80 backdrop-blur-2xl">
        <div className="p-8 md:p-12">
          {!file ? (
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="group/drop cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl py-16 px-6 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="video/*" 
                className="hidden" 
              />
              
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover/drop:scale-150 transition-transform duration-500" />
                <div className="relative h-20 w-20 flex items-center justify-center rounded-2xl bg-raised border border-white/10 group-hover/drop:border-primary/30 group-hover/drop:-translate-y-1 transition-all duration-300">
                  <UploadCloud className="h-10 w-10 text-primary animate-bounce-slow" />
                </div>
              </div>

              <h2 className="text-2xl font-heading font-black text-white mb-2 text-center">
                Ready to go viral?
              </h2>
              <p className="text-muted-foreground text-center max-w-sm mb-8">
                Drag and drop your long-form video here, or click to browse your files.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Max 2GB
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                  <FileVideo className="w-3.5 h-3.5" />
                  MP4, MOV, WEBM
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                    <FileVideo className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-none mb-1">{file.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to process
                    </p>
                  </div>
                </div>
                {!isUploading && !isComplete && (
                  <button 
                    onClick={reset}
                    className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Preview Area */}
              {!isUploading && !isComplete && (
                <div className="relative group/preview aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black">
                  <video 
                    src={previewUrl!} 
                    className="h-full w-full object-contain"
                    muted
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                      <Play className="h-6 w-6 fill-current" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
                    Preview
                  </div>
                </div>
              )}

              {/* Progress Area */}
              {(isUploading || isComplete) && (
                <div className="space-y-4 py-8">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-white flex items-center gap-2">
                      {isComplete ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          Upload Complete!
                        </>
                      ) : (
                        <>
                          <Loader2 className="h-4 w-4 text-primary animate-spin" />
                          Uploading and analyzing...
                        </>
                      )}
                    </span>
                    <span className="text-muted-foreground font-mono">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                  
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={cn(
                        "h-full transition-all duration-300 rounded-full",
                        isComplete ? "bg-emerald-500" : "bg-primary"
                      )}
                      style={{ width: `${uploadProgress}%` }}
                    >
                      <div className="h-full w-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center animate-pulse">
                    {isComplete 
                      ? "Hang tight! Redirecting to the AI editor..." 
                      : "We're preparing your video for AI moment detection."}
                  </p>
                </div>
              )}

              {/* Actions */}
              {!isUploading && !isComplete && (
                <div className="flex gap-4">
                  <button 
                    onClick={reset}
                    className="flex-1 py-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={startUpload}
                    className="flex-[2] py-4 rounded-2xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    Upload and Generate Clips
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {isComplete && (
                <button 
                  onClick={() => router.push(`/dashboard/projects/${projectId}`)}
                  className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all"
                >
                  GO TO EDITOR
                </button>
              )}

            </div>
          )}
        </div>
      </div>

      {/* Decorative blobs */}
      <div className="absolute -top-12 -right-12 h-64 w-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 h-64 w-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
