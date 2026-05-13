"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTABanner() {
  return (
    <section
      id="cta-banner"
      className="relative bg-[#080810] py-24 overflow-hidden"
    >
      {/* Animated glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/20 blur-[130px] rounded-full animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[300px] bg-cyan-500/12 blur-[100px] rounded-full animate-[float_10s_ease-in-out_infinite_2s]" />
      </div>

      {/* Dotted grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Glowing border card */}
      <div className="relative max-w-4xl mx-auto px-6 lg:px-12">
        <div className="relative rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-950/40 via-[#111118]/80 to-cyan-950/30 backdrop-blur-xl p-14 text-center shadow-[0_0_80px_rgba(124,58,237,0.15)]">
          {/* Inner glow ring */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/5 via-transparent to-cyan-500/5 pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/40 bg-violet-500/15 text-violet-300 text-xs font-semibold uppercase tracking-widest mb-7">
            <Sparkles className="w-3.5 h-3.5" />
            Start For Free Today
          </div>

          {/* Headline */}
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-white leading-tight mb-5">
            Ready to Turn Your Videos{" "}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Into Growth Machines?
            </span>
          </h2>

          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Join 50,000+ creators already using VidShort to multiply their reach, save hours every week, and grow on every platform — simultaneously.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              id="cta-banner-primary"
              size="lg"
              className="group bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-0 font-bold text-base px-10 py-6 rounded-xl hover:opacity-90 hover:shadow-[0_0_50px_rgba(124,58,237,0.5)] transition-all duration-300"
            >
              Get Started Free — No Card Needed
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            <Button
              id="cta-banner-secondary"
              size="lg"
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-base px-8 py-6 rounded-xl"
            >
              View Pricing →
            </Button>
          </div>

          {/* Social proof micro line */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500">
            <span>✓ 14-day free trial</span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-700" />
            <span>✓ 3 free clips/month forever</span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-700" />
            <span>✓ Cancel anytime</span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-700" />
            <span>✓ No watermark on paid plans</span>
          </div>
        </div>
      </div>
    </section>
  );
}
