"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Video, Sparkles, Download, Calendar, Trash2 } from "lucide-react";
import RemotionShortPlayer from "@/components/RemotionShortPlayer";
import EditCaptionModal from "@/components/dashboard/EditCaptionModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MyVideosPage() {
  const [shorts, setShorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const { data } = await axios.get("/api/shorts");
        setShorts(data);
      } catch (error) {
        console.error("Failed to fetch shorts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShorts();
  }, []);

  const handleDelete = async (shortId: number) => {
    if (!confirm("Are you sure you want to delete this short? This action cannot be undone.")) return;
    
    setDeletingId(shortId);
    try {
      await axios.delete(`/api/shorts/${shortId}`);
      setShorts(prev => prev.filter(s => s.id !== shortId));
      toast.success("Short deleted successfully");
    } catch (error) {
      console.error("Failed to delete short:", error);
      toast.error("Failed to delete short. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
          <Video className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-heading font-black text-white">My Videos</h1>
        <p className="text-muted-foreground max-w-md">
          You haven't generated any videos yet. Start by uploading a long-form video to create your first viral clips!
        </p>
        <button 
          onClick={() => router.push("/dashboard")}
          className="px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-lg hover:shadow-primary/20 transition-all"
        >
          Create New Video
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-black text-white mb-2">My Clips</h1>
          <p className="text-muted-foreground">Manage and edit all your generated viral shorts in one place.</p>
        </div>
        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60">
          Total Clips: <span className="text-primary font-bold">{shorts.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {shorts.map((short, index) => (
          <div key={short.id} className="bg-[#111] border border-white/10 rounded-3xl p-6 flex flex-col gap-6 shadow-xl hover:border-white/20 transition-all group">
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/5">
              <RemotionShortPlayer videoUrl={short.videoUrl} short={short} />
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-bold rounded-full">
                  Short #{short.id}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" /> SEO: {short.seoScore}/100
                </span>
                <button 
                  onClick={() => handleDelete(short.id)}
                  disabled={deletingId === short.id}
                  className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all disabled:opacity-50"
                  title="Delete Short"
                >
                  {deletingId === short.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              <div className="mb-6 flex-1">
                <h4 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Topic / Hook</h4>
                <p className="text-white/90 text-sm leading-relaxed line-clamp-2">
                  {short.reason}
                </p>
              </div>
              
              <div className="flex flex-col gap-3 mt-auto">
                <div className="flex items-center gap-3">
                  <button className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Download
                  </button>
                  <button className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    <Calendar className="w-4 h-4" /> Schedule
                  </button>
                </div>
                
                <EditCaptionModal 
                  short={short} 
                  videoUrl={short.videoUrl} 
                  onUpdate={(newStyle) => {
                    const updatedShorts = [...shorts];
                    updatedShorts[index] = { ...short, captionStyle: JSON.stringify(newStyle) };
                    setShorts(updatedShorts);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
