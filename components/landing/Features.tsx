"use client";

import {
  Brain,
  Captions,
  LayoutGrid,
  Wand2,
  Gauge,
  Share2,
  Languages,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Moment Detection",
    description:
      "Our proprietary AI analyzes speech, energy levels, and audience retention patterns to automatically surface the most engaging moments.",
    gradient: "from-violet-500 to-purple-600",
    glow: "rgba(124,58,237,0.25)",
    badge: "Core",
  },
  {
    icon: Captions,
    title: "Auto Captions & Subtitles",
    description:
      "Generate accurate captions in 95+ languages with animated text overlays that maximize watch time and accessibility.",
    gradient: "from-cyan-500 to-blue-600",
    glow: "rgba(6,182,212,0.25)",
    badge: "Popular",
  },
  {
    icon: LayoutGrid,
    title: "Multi-Format Export",
    description:
      "Automatically reframe 16:9 footage to 9:16 vertical format. Export perfectly sized clips for TikTok, Reels, Shorts and more.",
    gradient: "from-fuchsia-500 to-pink-600",
    glow: "rgba(217,70,239,0.25)",
    badge: null,
  },
  {
    icon: Wand2,
    title: "B-Roll & Filler Removal",
    description:
      "Cut dead air, filler words ('uh', 'um', pauses) and non-essential B-roll automatically to keep viewers hooked.",
    gradient: "from-orange-500 to-amber-600",
    glow: "rgba(249,115,22,0.25)",
    badge: null,
  },
  {
    icon: Gauge,
    title: "Blazing Fast Processing",
    description:
      "Process 1-hour videos in under 60 seconds using our distributed GPU cloud infrastructure. No waiting, just creating.",
    gradient: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.25)",
    badge: "Fast",
  },
  {
    icon: Share2,
    title: "One-Click Social Post",
    description:
      "Schedule and publish directly to TikTok, Instagram, YouTube Shorts, and LinkedIn from one unified dashboard.",
    gradient: "from-rose-500 to-red-600",
    glow: "rgba(244,63,94,0.25)",
    badge: null,
  },
  {
    icon: Languages,
    title: "AI Dubbing & Translation",
    description:
      "Automatically dub your clips in 40+ languages with natural-sounding AI voices — expand your global reach instantly.",
    gradient: "from-violet-500 to-cyan-500",
    glow: "rgba(124,58,237,0.2)",
    badge: "New",
  },
  {
    icon: BarChart3,
    title: "Virality Score Predictor",
    description:
      "Each clip gets an AI-powered virality score based on hook strength, pacing, emotional resonance, and trending analysis.",
    gradient: "from-yellow-500 to-orange-500",
    glow: "rgba(234,179,8,0.25)",
    badge: null,
  },
];

export default function Features() {
  return (
    <section id="features" className="relative bg-[#0A0A0F] py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-violet-600/8 blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-cyan-500/8 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold uppercase tracking-widest mb-5">
            Everything You Need
          </div>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-white mb-5 leading-tight">
            Supercharge Your{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Content Workflow
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            From raw footage to viral clips — VidShort handles every step of the short-form content pipeline with AI precision.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, description, gradient, glow, badge }, i) => (
            <div
              key={title}
              id={`feature-card-${i}`}
              className="group relative rounded-2xl border border-white/5 bg-[#111118]/70 backdrop-blur-sm p-6 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 cursor-default"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 48px ${glow}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Badge */}
              {badge && (
                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {badge}
                </span>
              )}

              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-white font-semibold text-base mb-2 leading-snug">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
