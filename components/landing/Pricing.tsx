"use client";

import { useState } from "react";
import { Check, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    id: "starter",
    name: "Starter",
    desc: "Perfect for creators just getting started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    ctaLabel: "Get Started Free",
    ctaVariant: "outline" as const,
    features: [
      "3 clips per month",
      "Up to 30-min input video",
      "720p export quality",
      "Auto captions (EN only)",
      "Basic templates",
      "VidShort watermark",
    ],
    notIncluded: ["Multi-platform export", "AI dubbing", "Virality score", "Priority processing"],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    desc: "For serious creators scaling their content",
    monthlyPrice: 29,
    yearlyPrice: 19,
    ctaLabel: "Start Pro Trial",
    ctaVariant: "default" as const,
    features: [
      "100 clips per month",
      "Up to 3-hour input video",
      "4K export quality",
      "Auto captions (95+ languages)",
      "Premium templates",
      "No watermark",
      "Multi-platform export",
      "Virality score predictor",
      "Priority processing",
    ],
    notIncluded: ["AI dubbing", "Team seats", "API access"],
    popular: true,
  },
  {
    id: "agency",
    name: "Agency",
    desc: "For teams and agencies managing multiple brands",
    monthlyPrice: 99,
    yearlyPrice: 69,
    ctaLabel: "Start Agency Trial",
    ctaVariant: "outline" as const,
    features: [
      "Unlimited clips",
      "Unlimited video length",
      "4K export quality",
      "Auto captions (95+ languages)",
      "Custom branded templates",
      "No watermark",
      "Multi-platform export",
      "Virality score predictor",
      "Instant processing",
      "AI dubbing (40+ languages)",
      "10 team seats",
      "API access",
      "Dedicated support",
    ],
    notIncluded: [],
    popular: false,
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative bg-[#0A0A0F] py-28 overflow-hidden">
      {/* BG Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/12 blur-[130px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-cyan-500/8 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-5">
            <Star className="w-3 h-3" /> Simple Pricing
          </div>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-white mb-5 leading-tight">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-amber-400 to-violet-400 bg-clip-text text-transparent">
              Growth Plan
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/8 rounded-full p-1.5">
            <button
              id="pricing-monthly-toggle"
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                !yearly
                  ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              id="pricing-yearly-toggle"
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                yearly
                  ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Save 35%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              id={`pricing-${plan.id}`}
              className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "border-violet-500/50 bg-gradient-to-b from-violet-950/60 to-[#111118]/80 shadow-[0_0_60px_rgba(124,58,237,0.2)]"
                  : "border-white/6 bg-[#111118]/70 hover:border-white/10 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
              } backdrop-blur-sm`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                  🔥 Most Popular
                </div>
              )}

              {/* Plan name */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  {plan.popular && (
                    <Zap className="w-4 h-4 text-violet-400 fill-violet-400" />
                  )}
                </div>
                <p className="text-slate-400 text-sm">{plan.desc}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black text-white">
                    ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-slate-400 text-sm mb-2">/mo</span>
                </div>
                {yearly && plan.monthlyPrice > 0 && (
                  <p className="text-emerald-400 text-xs font-semibold mt-1">
                    Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
                  </p>
                )}
                {plan.monthlyPrice === 0 && (
                  <p className="text-slate-500 text-xs mt-1">Free forever</p>
                )}
              </div>

              {/* CTA */}
              <Button
                id={`pricing-cta-${plan.id}`}
                className={`w-full mb-8 font-bold text-sm py-5 rounded-xl transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-0 hover:opacity-90 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]"
                    : "border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20"
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.ctaLabel}
              </Button>

              {/* Divider */}
              <div className="border-t border-white/5 mb-6" />

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center text-slate-700">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <p className="text-center text-slate-500 text-sm mt-10">
          All plans include 14-day free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  );
}
