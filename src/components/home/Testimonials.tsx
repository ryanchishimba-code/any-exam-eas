"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatTrialIntroPrice, formatTrialLabel } from "@/lib/site";

const testimonial = {
  quote:
    "I paid $340 for a USMLE course and got average results. Now I only pay $30/month with AnyExamEasy and I'm getting much better results with smarter AI-powered studying.",
  name: "Dr. Michael Chen",
  credential: "USMLE Step 1 Pass",
  beforeCost: "$340",
  afterCost: "$30/mo",
};

export function Testimonials() {
  return (
    <section
      className="apple-section relative overflow-hidden bg-[#000000] py-[clamp(5rem,12vw,8rem)] text-white"
      aria-labelledby="testimonials-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,113,227,0.22),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_100%,rgba(0,113,227,0.08),transparent)]" />

      <div className="relative mx-auto max-w-[980px] px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2997ff]">
            Real results
          </p>
          <h2
            id="testimonials-heading"
            className="mt-3 text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em] text-white"
          >
            Smarter prep. Better scores.
            <br className="hidden sm:block" />
            {" "}A fraction of the cost.
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mt-14 max-w-4xl"
        >
          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <div className="flex min-w-[10rem] flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-5 backdrop-blur-sm">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#86868b]">
                Before
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-[#86868b] line-through decoration-white/30">
                {testimonial.beforeCost}
              </p>
              <p className="mt-1 text-xs text-[#86868b]">Traditional course</p>
            </div>

            <ArrowRight className="hidden h-5 w-5 shrink-0 text-[#2997ff] sm:block" aria-hidden />

            <div className="flex min-w-[10rem] flex-col items-center rounded-2xl border border-[#2997ff]/40 bg-[#0071e3]/15 px-8 py-5 shadow-[0_0_40px_rgba(0,113,227,0.2)] backdrop-blur-sm">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#2997ff]">
                With Any Exam Easy
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
                {testimonial.afterCost}
              </p>
              <p className="mt-1 text-xs text-[#a1a1a6]">AI-powered studying</p>
            </div>
          </div>

          <figure className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur-md md:p-12">
            <blockquote>
              <p className="text-center text-[clamp(1.25rem,2.8vw,1.75rem)] font-medium leading-[1.45] tracking-[-0.02em] text-white">
                &ldquo;I paid{" "}
                <span className="text-[#86868b] line-through decoration-white/25">
                  $340 for a USMLE course
                </span>{" "}
                and got average results. Now I only pay{" "}
                <span className="text-[#2997ff]">$30/month with AnyExamEasy</span> and I&apos;m
                getting{" "}
                <span className="font-semibold text-white">much better results</span> with smarter
                AI-powered studying.&rdquo;
              </p>
            </blockquote>

            <figcaption className="mt-10 flex flex-col items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-base font-semibold text-white">{testimonial.name}</p>
                <p className="mt-1 text-sm text-[#a1a1a6]">{testimonial.credential}</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                Verified pass
              </div>
            </figcaption>
          </figure>

          <div className="mt-10 text-center">
            <Button
              href="/signup?plan=trial"
              className="!bg-[#0071e3] !px-10 !py-4 !text-base !text-white shadow-[0_8px_32px_rgba(0,113,227,0.45)] hover:!bg-[#0077ed]"
            >
              Start {formatTrialLabel()} — {formatTrialIntroPrice()}
            </Button>
            <p className="mt-4 text-xs text-[#86868b]">
              Join thousands preparing smarter · Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
