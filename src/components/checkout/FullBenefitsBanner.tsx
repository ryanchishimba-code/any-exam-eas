"use client";

import { Check, ShieldCheck } from "lucide-react";
import { MARKETING_QUESTION_COUNTS } from "@/lib/marketing/bank-stats";

const BENEFITS = [
  `${MARKETING_QUESTION_COUNTS.total} board-style questions`,
  "NCLEX, USMLE, NAPLEX, PANCE & Top 500",
  "Adaptive practice & performance analytics",
  "OER-backed rationales with citations",
];

type FullBenefitsBannerProps = {
  /** Highlight when a discount is active */
  discounted?: boolean;
};

export function FullBenefitsBanner({ discounted = false }: FullBenefitsBannerProps) {
  return (
    <section
      className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white p-5"
      aria-label="Subscription benefits"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
          <ShieldCheck className="h-5 w-5" strokeWidth={2} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-slate-900">
            Full benefits included
            {discounted && (
              <span className="ml-1.5 font-normal text-emerald-700">· even with your discount</span>
            )}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Your discount changes price only. You receive the same complete subscription as
            members paying standard rates — no reduced features or limits.
          </p>
        </div>
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {BENEFITS.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm text-slate-700"
          >
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
              strokeWidth={2.5}
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
