import React from "react";
import { Calendar } from "lucide-react";

export default function SchedulePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20">
        <Calendar className="w-12 h-12 text-cyan-500" />
      </div>
      <h1 className="text-3xl font-heading font-black text-white">Schedule Posts</h1>
      <p className="text-muted-foreground max-w-md">
        Connect your social media accounts to automatically schedule and post your viral clips to TikTok, Reels, and Shorts.
      </p>
      <button className="px-8 py-3 rounded-xl bg-cyan-500 text-white font-bold shadow-lg hover:shadow-cyan-500/20 transition-all">
        Connect Accounts
      </button>
    </div>
  );
}
