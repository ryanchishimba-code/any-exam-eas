"use client";

/**
 * LandingFaqV2 — objection-handling FAQ before the final CTA.
 *
 * Uses native <details>/<summary> for a zero-JS, accessible accordion, and
 * emits FAQPage JSON-LD (answers mirror the visible copy) for SEO rich results.
 * All billing copy is derived from lib/site so it never drifts from checkout.
 */

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { SupportPhoneLink } from "@/components/contact/SupportPhoneLink";
import { PLATFORM_EXAM_LIST } from "@/lib/landing/content";
import { LEGAL_ENTITY } from "@/lib/legal";
import { PRO_ANNUAL_SAVINGS_PERCENT } from "@/lib/pricing-defaults";
import { formatMonthlyPrice, formatTrialLabel, formatTrialQuestionLimit } from "@/lib/site";

const HELP_ANSWER = `Email ${LEGAL_ENTITY.supportEmail} or call ${LEGAL_ENTITY.supportPhone.display}. ${LEGAL_ENTITY.supportPhone.availableLabel}.`;

const FAQ: { q: string; a: string; body?: ReactNode }[] = [
  {
    q: "Which exams are included?",
    a: `All six are on one subscription: ${PLATFORM_EXAM_LIST}. USMLE covers Step 1, Step 2 CK, and Step 3.`,
  },
  {
    q: "How much does it cost?",
    a: `Pro is ${formatMonthlyPrice("pro")}/month and includes all six exams. Annual billing saves ${PRO_ANNUAL_SAVINGS_PERCENT}% versus monthly. Roadmap, Deep Dive, and Full Exam stay on the same plan.`,
  },
  {
    q: "Is there a free trial? Do I need a card?",
    a: `Yes — a ${formatTrialLabel()} with ${formatTrialQuestionLimit()}. No payment method required at signup. Upgrade anytime for unlimited questions, Deep Dive modules, and advanced analytics.`,
  },
  {
    q: "How is this different from UWorld or AMBOSS?",
    a: `UWorld sells a separate subscription per exam, and AMBOSS focuses primarily on USMLE/medical. AnyExamEasy gives you six boards under one plan, with an integrated blueprint Roadmap, Deep Dive review modules opened from missed questions, timed Full Exams, and a 3D Anatomy Explorer.`,
  },
  {
    q: "Are the questions actually high quality?",
    a: "A student session only serves items that are active, qa-passed, and still eligible. Flawed items can be hidden without deleting them, and you can report an issue from the rationale. Read the standards page for the gate, the official outlines, and the corrections policy.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime in Settings. That opens Stripe billing and stops the next charge. Canceling before a trial ends means you are not charged. Paid charges are non-refundable except where the law requires a refund.",
  },
  {
    q: "Why not just buy UWorld for the one exam I'm taking?",
    a: "Other Qbanks are often sold one exam at a time. AnyExamEasy is one plan for six boards, with a blueprint roadmap, review opened from the questions you miss, and timed practice exams.",
  },
  {
    q: "Is this genuinely enough to pass my board exam?",
    a: "No prep service can honestly guarantee a pass, and we will not. Items have to pass a quality gate before a student session can serve them. Roadmaps follow published blueprints, and a rationale shows a source when the item stores one. Passing still depends on how you study. Read how questions are reviewed for the exact gate.",
  },
  {
    q: "Are you affiliated with NCSBN, NABP, NBME, UWorld, or RxPrep?",
    a: "No. AnyExamEasy is independent. We are not affiliated with NCSBN, NABP, NBME, UWorld, or RxPrep. Official board documents belong to those organizations — always read their materials before your exam.",
  },
  {
    q: "How do I get help?",
    a: HELP_ANSWER,
    body: (
      <>
        Email{" "}
        <a
          href={`mailto:${LEGAL_ENTITY.supportEmail}`}
          className="font-semibold text-[var(--color-accent)] hover:underline"
        >
          {LEGAL_ENTITY.supportEmail}
        </a>{" "}
        or call <SupportPhoneLink className="font-semibold text-[var(--color-accent)] hover:underline" />.{" "}
        {LEGAL_ENTITY.supportPhone.availableLabel}.
      </>
    ),
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
            Before you start
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
                {item.body ?? item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
