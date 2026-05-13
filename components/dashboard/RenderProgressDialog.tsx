"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, AlertCircle, Download, Sparkles } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface RenderProgressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shortId: number;
  onSuccess: (videoUrl: string) => void;
}

export default function RenderProgressDialog({
  isOpen,
  onClose,
  shortId,
  onSuccess,
}: RenderProgressDialogProps) {
  const [status, setStatus] = useState<string>("pending");
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isOpen && status !== "completed" && !error) {
      const pollStatus = async () => {
        try {
          const { data } = await axios.get(`/api/shorts/${shortId}/render`);
          setStatus(data.status);
          setProgress(data.progress);
          
          if (data.status === "completed" && data.videoUrl) {
            setVideoUrl(data.videoUrl);
            onSuccess(data.videoUrl);
          } else if (data.status === "error") {
            setError("Rendering failed. Please try again.");
          }
        } catch (err) {
          console.error("Failed to poll render status:", err);
        }
      };

      interval = setInterval(pollStatus, 2000);
      pollStatus();
    }

    return () => clearInterval(interval);
  }, [isOpen, status, shortId, error, onSuccess]);

  const handleDownload = () => {
    if (videoUrl) {
      window.open(videoUrl, "_blank");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#0f0f0f] border-white/10 text-white rounded-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            {status === "completed" ? (
              <span className="text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> Ready for Download!
              </span>
            ) : error ? (
              <span className="text-red-400 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" /> Rendering Error
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" /> Finalizing Your Short
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            {status === "completed" 
              ? "Your high-quality short has been rendered successfully with all your custom styles."
              : error 
              ? error 
              : "We're using Remotion to bake your captions and styles into the video. This takes a moment."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-8">
          {status === "completed" ? (
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                 <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <Button 
                onClick={handleDownload}
                className="w-full py-6 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-2"
              >
                <Download className="w-5 h-5" /> Download Video
              </Button>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <Button onClick={onClose} variant="outline" className="border-white/10 text-white hover:bg-white/5">
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <Progress value={progress} className="h-4 bg-white/5" />
                <div 
                  className="absolute inset-0 bg-primary/20 blur-xl opacity-50 -z-10 transition-all duration-1000" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {progress}% Complete
                </div>
                <div className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
                  {status === "rendering" ? "REMOTE_RENDER_ACTIVE" : "INITIALIZING_LAMBDA"}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-muted-foreground italic text-center">
                Remotion Lambda is processing {Math.ceil(progress / 5)}/20 compute chunks...
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
