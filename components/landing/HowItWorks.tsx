"use client";

import { Upload, Cpu, Download } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Your Video",
    description:
      "Drop in any long-form video — podcasts, webinars, interviews, vlogs, tutorials. Supports MP4, MOV, AVI and direct YouTube/Vimeo links.",
    color: "from-violet-500 to-purple-600",
    glow: "rgba(124,58,237,0.4)",
    details: ["YouTube & Vimeo links", "Up to 4K resolution", "Any duration"],
  },
  {
    step: "02",
    icon: Cpu,
    title: "AI Analyzes & Clips",
    description:
      "VidShort's AI watches the entire video, scores every moment by virality potential, detects highlights, and generates clips automatically.",
    color: "from-cyan-500 to-blue-600",
    glow: "rgba(6,182,212,0.4)",
    details: ["Virality scoring", "Auto transcript", "Smart framing"],
  },
  {
    step: "03",
    icon: Download,
    title: "Export & Publish",
    description:
      "Review your clips, tweak captions, add branding, then export or publish directly to your social platforms in one click.",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.4)",
    details: ["Branded templates", "Direct publish", "Bulk export"],
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-[#080810] py-28 overflow-hidden">
      {/* BG Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-5">
            Simple 3-Step Process
          </div>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-white mb-5 leading-tight">
            Go From Raw Footage{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              To Viral Clips
            </span>{" "}
            in Minutes
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            No editing skills needed. No complex software. Just upload and let AI do the heavy lifting.
          </p>
        </div>

        {/* Steps */}
        <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-4">
          {/* Connector line — desktop */}
          <div className="hidden lg:block absolute top-16 left-[calc(33.33%-48px)] right-[calc(33.33%-48px)] h-px bg-gradient-to-r from-violet-500/40 via-cyan-500/40 to-emerald-500/40" />

          {steps.map(({ step, icon: Icon, title, description, color, glow, details }, i) => (
            <div key={step} id={`step-${i + 1}`} className="flex-1 relative group">
              {/* Card */}
              <div
                className="rounded-2xl border border-white/5 bg-[#111118]/80 backdrop-blur-sm p-8 h-full transition-all duration-300 hover:-translate-y-2"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 64px ${glow.replace("0.4", "0.2")}`;
                  (e.currentTarget as HTMLElement).style.borderColor = glow.replace("rgba", "rgba").replace("0.4", "0.3");
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)";
                }}
              >
                {/* Step Number */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    style={{ boxShadow: `0 0 24px ${glow}` }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                    {/* Step label */}
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0A0A0F] border border-white/10 text-[10px] font-bold text-white flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <span className="text-5xl font-black text-white/5 select-none">{step}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{description}</p>

                {/* Detail pills */}
                <div className="flex flex-wrap gap-2">
                  {details.map((d) => (
                    <span
                      key={d}
                      className="text-xs px-3 py-1 rounded-full bg-white/4 border border-white/8 text-slate-400"
                    >
                      ✓ {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arrow between steps — mobile */}
              {i < 2 && (
                <div className="lg:hidden flex justify-center my-2 text-slate-600 text-2xl">↓</div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-semibold text-base transition-colors group"
          >
            Start your free trial
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
