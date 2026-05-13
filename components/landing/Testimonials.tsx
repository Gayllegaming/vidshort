"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Travel & Lifestyle Creator",
    handle: "@priyaexplores",
    avatar: "PS",
    avatarBg: "from-violet-500 to-fuchsia-500",
    rating: 5,
    quote:
      "VidShort completely transformed my workflow. I used to spend 4+ hours editing my podcast clips — now I get 10 viral-ready shorts in under 5 minutes. My TikTok grew 3x in 2 months!",
    platform: "TikTok · 890K followers",
    metrics: "+340% views",
    metricColor: "text-emerald-400",
  },
  {
    name: "Marcus Chen",
    role: "Tech Educator & YouTuber",
    handle: "@marcustech",
    avatar: "MC",
    avatarBg: "from-cyan-500 to-blue-500",
    rating: 5,
    quote:
      "The AI moment detection is genuinely mind-blowing. It picks highlights better than I do manually. My Shorts channel hit 100K subscribers in 3 weeks using only VidShort clips.",
    platform: "YouTube · 1.2M subscribers",
    metrics: "100K subs in 3 weeks",
    metricColor: "text-cyan-400",
  },
  {
    name: "Aisha Patel",
    role: "Marketing Agency Founder",
    handle: "Elevate Social",
    avatar: "AP",
    avatarBg: "from-amber-500 to-orange-500",
    rating: 5,
    quote:
      "We manage 15 clients and VidShort cut our video editing costs by 60%. The batch processing and direct social publishing features alone are worth the agency plan 10x over.",
    platform: "Agency · 15 clients",
    metrics: "60% cost reduction",
    metricColor: "text-amber-400",
  },
  {
    name: "Jake Morrison",
    role: "Fitness Coach",
    handle: "@jakefitness",
    avatar: "JM",
    avatarBg: "from-emerald-500 to-teal-500",
    rating: 5,
    quote:
      "I was skeptical at first, but the virality score predictor is scary accurate. I focus only on clips with high scores and my engagement rate went up 280% in the first month.",
    platform: "Instagram · 450K followers",
    metrics: "+280% engagement",
    metricColor: "text-emerald-400",
  },
  {
    name: "Sofia Reyes",
    role: "Business Podcast Host",
    handle: "Startup Stories",
    avatar: "SR",
    avatarBg: "from-rose-500 to-pink-500",
    rating: 5,
    quote:
      "Auto captions in 40+ languages opened up an entire global audience I never had access to. My podcast clips now reach Spanish and Portuguese markets without any extra effort.",
    platform: "Spotify · 80K listeners",
    metrics: "4 new market segments",
    metricColor: "text-rose-400",
  },
  {
    name: "David Kim",
    role: "Gaming Streamer",
    handle: "@davidplays",
    avatar: "DK",
    avatarBg: "from-indigo-500 to-violet-500",
    rating: 5,
    quote:
      "Clipping my 6-hour Twitch streams used to be a nightmare. VidShort finds the clutch moments, hype plays and funny bits automatically. It's like having a dedicated clip editor 24/7.",
    platform: "Twitch · 220K followers",
    metrics: "6hrs → 10 clips in 45s",
    metricColor: "text-indigo-400",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative bg-[#080810] py-28 overflow-hidden">
      {/* BG Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[400px] bg-violet-600/8 blur-[120px] rounded-full" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[300px] bg-cyan-500/6 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-semibold uppercase tracking-widest mb-5">
            <Star className="w-3 h-3 fill-rose-400 text-rose-400" /> Loved By Creators
          </div>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-white mb-5 leading-tight">
            Join{" "}
            <span className="bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">
              50,000+ Creators
            </span>{" "}
            Already Growing
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Real results from real creators who use VidShort every day to grow their audience.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              id={`testimonial-${i}`}
              className="break-inside-avoid rounded-2xl border border-white/5 bg-[#111118]/80 backdrop-blur-sm p-6 hover:border-violet-500/20 hover:shadow-[0_8px_40px_rgba(124,58,237,0.1)] transition-all duration-300 group"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-violet-500/40 mb-4 group-hover:text-violet-500/60 transition-colors" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.quote}"</p>

              {/* Metric pill */}
              <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-white/4 border border-white/8 mb-5 ${t.metricColor}`}>
                📈 {t.metrics}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                  <p className="text-violet-400 text-xs">{t.platform}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust metrics row */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: "50K+", label: "Active Creators" },
            { value: "2.8M+", label: "Clips Generated" },
            { value: "4.9/5", label: "Average Rating" },
            { value: "99.7%", label: "Uptime SLA" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="rounded-xl border border-white/5 bg-[#111118]/50 p-5 text-center"
            >
              <p className="text-3xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                {value}
              </p>
              <p className="text-slate-500 text-xs uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
