import React from "react";
import { CreditCard, Check } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect for testing the AI capabilities.",
      features: ["5 videos per month", "Standard processing", "720p export", "Watermark included"],
      cta: "Current Plan",
      current: true,
    },
    {
      name: "Pro",
      price: "$29",
      description: "Best for growing creators.",
      features: ["Unlimited videos", "Priority processing", "4K export", "No watermark", "Auto-scheduling"],
      cta: "Upgrade to Pro",
      current: false,
      popular: true,
    },
    {
      name: "Agency",
      price: "$99",
      description: "For teams and content agencies.",
      features: ["Multiple team members", "API access", "White-label reports", "Dedicated support"],
      cta: "Contact Sales",
      current: false,
    },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-heading font-black text-white">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Scale your short-form content production with AI. Choose a plan that fits your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={cn(
              "relative p-8 rounded-3xl border transition-all duration-500 flex flex-col h-full",
              plan.popular 
                ? "bg-primary/5 border-primary shadow-[0_0_40px_rgba(124,58,237,0.1)] scale-105 z-10" 
                : "bg-raised border-border/50 hover:border-primary/20"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-heading font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-xs text-muted-foreground">{plan.description}</p>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Check className="h-3 w-3 text-emerald-500" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button 
              className={cn(
                "w-full py-4 rounded-2xl font-black text-sm transition-all",
                plan.current 
                  ? "bg-muted text-muted-foreground cursor-default" 
                  : plan.popular
                    ? "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95"
                    : "bg-white text-black hover:scale-[1.02] active:scale-95"
              )}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
