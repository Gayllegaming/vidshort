"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Play, Sparkles, TrendingUp, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const floatingStats = [
  { icon: TrendingUp, label: "10x More Views", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: Clock, label: "Save 5hrs/day", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  { icon: Zap, label: "30s Processing", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0F] pt-16"
    >
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Radial Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full bg-violet-800/15 blur-[80px]" />
      </div>

      {/* Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24 flex flex-col lg:flex-row items-center gap-16">
        {/* Left — Text */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Top Badge */}
          <div
            id="hero-badge"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold uppercase tracking-widest mb-6 animate-[fadeInDown_0.6s_ease-out]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Video Intelligence
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-white mb-6 animate-[fadeInUp_0.7s_ease-out]">
            Turn Long Videos{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Into Viral
            </span>{" "}
            Short Clips
          </h1>

          {/* Sub-headline */}
          <p className="text-[clamp(1rem,2vw,1.2rem)] text-slate-400 max-w-xl leading-relaxed mb-10 animate-[fadeInUp_0.8s_ease-out]">
            VidShort uses cutting-edge AI to automatically detect the most engaging moments in your videos and repurpose them as short-form content for TikTok, Reels & Shorts — in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-[fadeInUp_0.9s_ease-out]">
            <Button
              id="hero-cta-primary"
              size="lg"
              className="group bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-0 font-bold text-base px-8 py-6 rounded-xl hover:opacity-90 hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] transition-all duration-300 animate-[glow-pulse_3s_ease-in-out_infinite]"
            >
              Start Creating Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            <Button
              id="hero-cta-secondary"
              size="lg"
              variant="outline"
              className="group border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 font-semibold text-base px-8 py-6 rounded-xl transition-all duration-300"
            >
              <Play className="mr-2 w-5 h-5 text-violet-400 group-hover:text-violet-300 transition-colors" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Line */}
          <p className="text-slate-500 text-sm animate-[fadeInUp_1s_ease-out]">
            No credit card required · 3 free clips/month · Cancel anytime
          </p>

          {/* Floating Stat Pills */}
          <div className="flex flex-wrap gap-3 mt-8 animate-[fadeInUp_1.1s_ease-out]">
            {floatingStats.map(({ icon: Icon, label, color, bg }) => (
              <div
                key={label}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${bg} backdrop-blur-sm text-xs font-semibold ${color}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Video Mockup */}
        <div className="flex-1 flex justify-center lg:justify-end animate-[fadeInRight_0.8s_ease-out]">
          <div className="relative w-full max-w-lg">
            {/* Glow behind card */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/30 to-cyan-500/20 blur-3xl -z-10 scale-110" />

            {/* Main card */}
            <div className="relative rounded-2xl border border-white/8 bg-[#111118]/80 backdrop-blur-xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-5 py-3 bg-white/5 border-b border-white/5">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-auto text-xs text-slate-500 font-mono">vidshort.ai — processing</span>
              </div>

              {/* Video area */}
              <div className="p-5 space-y-4">
                {/* Input video */}
                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-500 font-mono w-20 shrink-0">INPUT</div>
                  <div className="flex-1 h-16 rounded-lg bg-gradient-to-r from-slate-800 to-slate-700 overflow-hidden relative flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/50 rounded px-1.5 py-0.5 text-[10px] text-white font-mono">
                      45:32
                    </div>
                  </div>
                </div>

                {/* AI Processing */}
                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-500 font-mono w-20 shrink-0">AI</div>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 animate-[shimmer_2s_infinite]" style={{ backgroundSize: "200% 100%" }} />
                  </div>
                  <span className="text-xs text-violet-400 font-mono">76%</span>
                </div>

                {/* Output clips */}
                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-500 font-mono w-20 shrink-0">CLIPS</div>
                  <div className="flex gap-2 flex-1">
                    {["0:58", "1:02", "0:45"].map((dur, i) => (
                      <div
                        key={i}
                        className="flex-1 h-16 rounded-lg border border-violet-500/20 bg-gradient-to-br from-violet-900/40 to-cyan-900/20 flex flex-col items-center justify-center gap-1"
                      >
                        <Play className="w-3 h-3 text-violet-400 fill-violet-400" />
                        <span className="text-[9px] text-slate-400 font-mono">{dur}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platforms */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-500">Export to:</span>
                  {["TikTok", "Reels", "Shorts"].map((p) => (
                    <Badge
                      key={p}
                      className="text-[9px] bg-violet-500/10 text-violet-300 border-violet-500/20 px-2 py-0.5"
                    >
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2 backdrop-blur-sm animate-[float_5s_ease-in-out_infinite]">
              <span className="text-emerald-400 text-xs font-bold">✓ Clip Ready!</span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-violet-500/10 border border-violet-500/30 rounded-xl px-3 py-2 backdrop-blur-sm animate-[float_7s_ease-in-out_infinite_1s]">
              <span className="text-violet-300 text-xs font-bold">⚡ 28s processed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0A0A0F] to-transparent pointer-events-none" />
    </section>
  );
}
