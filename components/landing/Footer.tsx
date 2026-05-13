"use client";

import Link from "next/link";
import { Zap, MessageSquare, PlaySquare, Camera, Code2, Briefcase } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
    { label: "Roadmap", href: "#" },
  ],
  "Use Cases": [
    { label: "Podcasters", href: "#" },
    { label: "YouTubers", href: "#" },
    { label: "Agencies", href: "#" },
    { label: "Coaches & Educators", href: "#" },
    { label: "Streamers", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press Kit", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "GDPR", href: "#" },
    { label: "Security", href: "#" },
  ],
};

const socials = [
  { icon: MessageSquare, label: "Twitter / X", href: "#" },
  { icon: PlaySquare, label: "YouTube", href: "#" },
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: Briefcase, label: "LinkedIn", href: "#" },
  { icon: Code2, label: "GitHub", href: "#" },
];

const integrations = [
  "TikTok", "YouTube Shorts", "Instagram Reels",
  "LinkedIn Video", "Twitter / X", "Facebook Reels",
];

export default function Footer() {
  return (
    <footer id="footer" className="relative bg-[#06060D] border-t border-white/5 overflow-hidden">
      {/* Subtle glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-violet-600/8 blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">

        {/* Integrations strip */}
        <div className="border-b border-white/5 py-8">
          <p className="text-xs text-slate-500 uppercase tracking-widest text-center mb-5">
            Publish directly to
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {integrations.map((platform) => (
              <span
                key={platform}
                className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-400 border border-white/6 bg-white/3 hover:text-white hover:border-violet-500/30 hover:bg-violet-500/8 transition-all duration-200 cursor-default"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>

        {/* Main footer grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 py-14">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            {/* Logo */}
            <Link href="/" id="footer-logo" className="inline-flex items-center gap-2 group mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-[0_0_14px_rgba(124,58,237,0.4)] group-hover:shadow-[0_0_22px_rgba(124,58,237,0.6)] transition-shadow duration-300">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Vid<span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Short</span>
              </span>
            </Link>

            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-[220px]">
              AI-powered platform that transforms long videos into viral short clips automatically.
            </p>

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-white/8 bg-white/4 flex items-center justify-center text-slate-500 hover:text-white hover:border-violet-500/30 hover:bg-violet-500/10 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-5 tracking-wide">{category}</h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-200 hover:underline underline-offset-2"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} VidShort AI, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </span>
            <span>·</span>
            <span>SOC 2 Certified</span>
            <span>·</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
