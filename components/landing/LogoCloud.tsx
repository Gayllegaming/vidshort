"use client";

const logos = [
  { name: "TikTok", abbr: "TK", color: "from-pink-500 to-red-500" },
  { name: "YouTube", abbr: "YT", color: "from-red-600 to-red-700" },
  { name: "Instagram", abbr: "IG", color: "from-purple-600 to-pink-500" },
  { name: "LinkedIn", abbr: "LI", color: "from-blue-600 to-blue-700" },
  { name: "Twitter / X", abbr: "𝕏", color: "from-slate-700 to-slate-800" },
  { name: "Facebook", abbr: "FB", color: "from-blue-500 to-blue-600" },
  { name: "Spotify", abbr: "SP", color: "from-emerald-600 to-green-700" },
  { name: "Twitch", abbr: "TW", color: "from-violet-700 to-purple-800" },
];

const stats = [
  { value: "50K+", label: "Active creators", sub: "on the platform" },
  { value: "2.8M+", label: "Clips created", sub: "and counting" },
  { value: "98%", label: "Customer satisfaction", sub: "in NPS surveys" },
  { value: "10x", label: "Average view increase", sub: "within 30 days" },
];

export default function LogoCloud() {
  return (
    <section id="logo-cloud" className="relative bg-[#080810] py-16 overflow-hidden border-y border-white/[0.04]">
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-violet-600/6 blur-[80px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Trusted By heading */}
        <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-10">
          Trusted by creators publishing on
        </p>

        {/* Platform logos row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {logos.map(({ name, abbr, color }) => (
            <div
              key={name}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-200 group"
              title={name}
            >
              <div
                className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-sm`}
              >
                {abbr}
              </div>
              <span className="text-slate-400 text-sm font-medium group-hover:text-slate-300 transition-colors">
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-16" />

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ value, label, sub }, i) => (
            <div
              key={label}
              id={`stat-${i}`}
              className="group text-center p-6 rounded-2xl border border-white/4 bg-white/[0.015] hover:bg-white/[0.04] hover:border-violet-500/20 transition-all duration-300"
            >
              <p className="text-[clamp(2rem,4vw,2.8rem)] font-black bg-gradient-to-br from-violet-400 to-cyan-400 bg-clip-text text-transparent leading-none mb-2">
                {value}
              </p>
              <p className="text-white font-semibold text-sm mb-0.5">{label}</p>
              <p className="text-slate-600 text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
