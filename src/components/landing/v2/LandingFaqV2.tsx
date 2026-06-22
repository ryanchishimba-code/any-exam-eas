"use client";

/**
 * LandingFaqV2 — objection-handling FAQ before the final CTA.
 *
 * Uses native <details>/<summary> for a zero-JS, accessible accordion, and
 * emits FAQPage JSON-LD (answers mirror the visible copy) for SEO rich results.
 * All billing copy is derived from lib/site so it never drifts from checkout.
 */

import { ChevronDown } from "lucide-react";
import { PLATFORM_EXAM_LIST } from "@/lib/landing/content";
import { TOP_500_DRUGS_COUNT } from "@/lib/marketing/bank-stats";
import { formatMonthlyPrice, formatTrialLabel } from "@/lib/site";

const FAQ: { q: string; a: string }[] = [
  {
    q: "Which exams are included?",
    a: `All six are on one subscription: ${PLATFORM_EXAM_LIST}. USMLE covers Step 1, Step 2 CK, and Step 3.`,
  },
  {
    q: "How much does it cost?",
    a: `Basic starts at ${formatMonthlyPrice("basic")}/month and Pro at ${formatMonthlyPrice(
      "pro"
    )}/month — both include all six exams. Annual billing saves roughly 17% versus monthly. That's typically less than a single per-exam UWorld or AMBOSS subscription.`,
  },
  {
    q: "Is there a free trial? Do I need a card?",
    a: `Yes — a ${formatTrialLabel()}. A payment method is required at checkout, but you are not charged until the trial ends. Cancel before your trial ends and you won't be charged.`,
  },
  {
    q: "How is this different from UWorld or AMBOSS?",
    a: "UWorld sells a separate subscription per exam, and AMBOSS focuses primarily on USMLE/medical. AnyExamEasy gives you six boards under one plan, with an integrated blueprint Roadmap, Deep Dive review modules opened from missed questions, a 3D Anatomy Explorer, and the Top 503 Drugs deck included.",
  },
  {
    q: "Are the questions actually high quality?",
    a: `Every item is QA-gated before it reaches your session. You get board-style clinical vignettes with teachable rationales — not template-swapped distractors or repetitive stems. The ${TOP_500_DRUGS_COUNT} Top Drugs pharmacology deck and reference tools are linked right from practice.`,
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel anytime from your account settings. Canceling before your trial ends means you won't be charged at all.",
  },
  {
    q: "Why not just buy UWorld for the one exam I'm taking?",
    a: `UWorld is a strong QBank — if you only need raw practice questions for a single board and the $200–400+ price tag fits your budget, it's a reasonable choice. Where AnyExamEasy differs: you get a structured blueprint Roadmap, Deep Dive review modules opened from the questions you miss, reference tools (Top 503 Drugs, lab values, calculators), and six boards under one plan. If you're only studying one exam and want just a QBank, we're transparent that you should compare. If you want guided prep or are studying more than one board, AnyExamEasy typically costs less and gives you more.`,
  },
  {
    q: "Is this genuinely enough to pass my board exam?",
    a: `No prep service can honestly guarantee a pass — and we won't. What we can say: every item is QA-gated before it enters your session (no bulk filler or template-swapped distractors), Roadmaps are aligned to current blueprints, and rationales are written to build real understanding. Students who pass do so because of how consistently they study, not because of any single resource. We're a serious tool built by clinicians — not a test-dump shortcut.`,
  },
  {
    q: "What if I'm only studying for one exam right now?",
    a: "That's fine — you can focus entirely on a single board. The Roadmap, question bank, and Deep Dives are all scoped per exam, so you're never forced to juggle six tracks at once. The multi-exam value is there when you need it (think recertification, dual licensing, or a second credential), but it doesn't clutter your experience when you don't.",
  },
];

export function LandingFaqV2() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-[var(--color-border)] bg-[var(--color-surface)] py-20 sm:py-24"
      aria-labelledby="faq-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Questions, answered
          </p>
          <h2
            id="faq-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl"
          >
            Everything you need to know
          </h2>
        </div>

        <div className="mt-10 divide-y divide-[var(--color-border)] overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-apple-sm)]">
          {FAQ.map((item) => (
            <details key={item.q} className="group px-5 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-base font-semibold text-[var(--color-ink)] [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-[var(--color-ink-muted)] transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="-mt-1 pb-5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
