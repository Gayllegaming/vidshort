"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What types of videos does VidShort support?",
    a: "VidShort supports any long-form video content — podcasts, interviews, webinars, tutorials, vlogs, lectures, gaming streams, and more. You can upload MP4, MOV, AVI, MKV files or paste a direct YouTube or Vimeo link. There's no strict duration limit (Agency plan supports unlimited length).",
  },
  {
    q: "How does the AI know which moments are the best?",
    a: "Our proprietary AI model analyzes multiple signals simultaneously: speech energy and emotional tone, transcript content and keyword density, historical engagement patterns from millions of viral clips, visual activity levels, audience attention decay models, and more. The result is a virality score for each potential clip that's proven to be highly accurate.",
  },
  {
    q: "Can I edit the clips after the AI generates them?",
    a: "Absolutely! Every AI-generated clip opens in our built-in editor where you can trim start/end points, edit captions word-by-word, change the reframe crop, add emojis, swap templates, add your logo, adjust text styles, and more — all in a no-code, timeline-free editor.",
  },
  {
    q: "What platforms can I publish to directly?",
    a: "VidShort currently supports direct publishing to TikTok, Instagram Reels, YouTube Shorts, LinkedIn Video, Twitter/X, and Facebook Reels. You can also download clips locally in any resolution for manual upload anywhere.",
  },
  {
    q: "How accurate are the auto-generated captions?",
    a: "Our speech recognition engine achieves 97%+ accuracy for English content and 93%+ for other supported languages. Captions are word-level time-synced, so you can click any word in the transcript to jump to that moment in the video. Editing a single word auto-updates the caption overlay.",
  },
  {
    q: "Is my video data kept private?",
    a: "Yes. All uploaded videos are encrypted at rest (AES-256) and in transit (TLS 1.3). We never share, sell, or use your content to train our models without explicit consent. Videos are automatically deleted from our servers 30 days after processing (or immediately on request). We are SOC 2 Type II certified.",
  },
  {
    q: "Can multiple team members use the same account?",
    a: "The Agency plan supports up to 10 team seats with role-based permissions (Admin, Editor, Viewer). Each seat gets their own login but shares the same clip quota and brand assets. Additional seats can be added for $9/seat/month.",
  },
  {
    q: "What happens if I exceed my monthly clip limit?",
    a: "You'll receive an email notification at 80% usage. Once you hit the limit, you can either wait for the next billing cycle, purchase a clip top-up pack, or upgrade your plan. We never auto-charge beyond your plan — no surprise bills.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-[#0A0A0F] py-28 overflow-hidden">
      {/* BG Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-5">
            Got Questions?
          </div>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-white mb-5 leading-tight">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-slate-400 text-lg">
            Everything you need to know about VidShort. Can't find what you're looking for?{" "}
            <a href="mailto:support@vidshort.ai" className="text-violet-400 hover:text-violet-300 transition-colors">
              Ask us directly.
            </a>
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              id={`faq-item-${i}`}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                openIndex === i
                  ? "border-violet-500/30 bg-violet-950/20 shadow-[0_0_30px_rgba(124,58,237,0.08)]"
                  : "border-white/5 bg-[#111118]/60 hover:border-white/10"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span
                  className={`font-semibold text-base transition-colors duration-200 ${
                    openIndex === i ? "text-white" : "text-slate-200 group-hover:text-white"
                  }`}
                >
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 transition-all duration-300 ${
                    openIndex === i ? "rotate-180 text-violet-400" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
              </button>

              <div
                id={`faq-answer-${i}`}
                className={`transition-all duration-300 ease-out ${
                  openIndex === i ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <p className="px-6 pb-6 text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 rounded-2xl border border-white/5 bg-gradient-to-br from-violet-950/30 to-cyan-950/20 p-8 text-center">
          <h3 className="text-white font-bold text-xl mb-2">Still have questions?</h3>
          <p className="text-slate-400 text-sm mb-5">
            Our support team is available 24/7 to help you get the most out of VidShort.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:support@vidshort.ai"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/8 transition-all duration-200"
            >
              ✉ Email Support
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-sm text-white font-semibold hover:opacity-90 transition-opacity"
            >
              💬 Live Chat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
