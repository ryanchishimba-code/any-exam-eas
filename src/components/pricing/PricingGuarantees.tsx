"use client";

import { Check } from "lucide-react";
import {
  BILLING_GUARANTEE_HEADLINE,
  BILLING_GUARANTEE_POINTS,
  BILLING_POLICY_SHORT,
} from "@/lib/billing-plans";
import { cn } from "@/lib/utils";

type PricingGuaranteesProps = {
  className?: string;
  variant?: "full" | "compact";
};

export function PricingGuarantees({ className, variant = "full" }: PricingGuaranteesProps) {
  if (variant === "compact") {
    return (
      <section
        className={cn(
          "rounded-2xl border border-black/[0.06] bg-slate-50/50 px-4 py-4",
          className
        )}
        aria-label="Why Any Exam Easy"
      >
        <p className="text-sm font-semibold leading-snug text-[var(--color-ink)]">
          {BILLING_GUARANTEE_HEADLINE}
        </p>
        <ul className="mt-3 space-y-2">
          {BILLING_GUARANTEE_POINTS.slice(0, 2).map((point) => (
            <li
              key={point}
              className="flex gap-2 text-xs leading-relaxed text-[var(--color-ink-muted)]"
            >
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" aria-hidden />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
          {BILLING_POLICY_SHORT}
        </p>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "rounded-[28px] border border-black/[0.06] bg-gradient-to-b from-white to-slate-50/60 p-6 sm:p-8",
        className
      )}
      aria-label="Why Any Exam Easy"
    >
      <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)] sm:text-xl">
        {BILLING_GUARANTEE_HEADLINE}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
        One subscription for every major board — without stacking $99+ single-exam apps. You won&apos;t
        regret investing in prep that matches how you actually learn.
      </p>

      <ul className="mt-6 space-y-3">
        {BILLING_GUARANTEE_POINTS.map((point) => (
          <li
            key={point}
            className="flex gap-3 text-sm leading-relaxed text-[var(--color-ink-muted)]"
          >
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]"
              strokeWidth={2.5}
              aria-hidden
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 rounded-2xl border border-black/[0.06] bg-white/80 px-4 py-3 text-xs leading-relaxed text-[var(--color-ink-muted)]">
        {BILLING_POLICY_SHORT}
      </p>
    </section>
  );
}
