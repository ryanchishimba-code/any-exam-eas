"use client";

/**
 * CostComparisonChart — multi-exam value without third-party price claims.
 * Shows only the current AnyExamEasy Pro annual price alongside a qualitative
 * note that stacking single-exam products usually costs more overall.
 */

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Crown } from "lucide-react";
import { TIER_ANNUAL_USD } from "@/lib/subscription-tiers";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { COMPARE_HONESTY_DISCLAIMER } from "@/lib/seo/competitor-comparison";
import { formatTrialCtaLabel } from "@/lib/site";

const EXAM_COUNT = 6;
const ANYEXAM_ANNUAL = TIER_ANNUAL_USD.pro;

const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

type Bar = {
  name: string;
  sublabel: string;
  amountLabel: string;
  pct: number;
  highlight: boolean;
};

const BARS: Bar[] = [
  {
    name: "AnyExamEasy",
    sublabel: `One plan · all ${EXAM_COUNT} boards`,
    amountLabel: `${usd(ANYEXAM_ANNUAL)}/yr`,
    pct: 38,
    highlight: true,
  },
  {
    name: "Typical single-exam stack",
    sublabel: `${EXAM_COUNT} separate products — pricing varies widely`,
    amountLabel: "Varies by provider",
    pct: 100,
    highlight: false,
  },
];

export function CostComparisonChart() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="cost-compare-heading"
      className="mx-auto w-full max-w-3xl"
    >
      <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-md)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              Cost analysis
            </p>
            <h3
              id="cost-compare-heading"
              className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-ink)] sm:text-3xl"
            >
              One plan vs. stacking single-exam prep
            </h3>
            <p className="mt-1.5 text-sm text-[var(--color-ink-muted)]">
              Annual Pro covers every board on the platform — no per-exam renewals.
            </p>
          </div>
        </div>

        <ul className="mt-7 space-y-6" role="list">
          {BARS.map((bar, i) => (
            <li key={bar.name}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span className="flex items-center gap-1.5 text-sm font-bold text-[var(--color-ink)]">
                  {bar.highlight ? (
                    <Crown className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
                  ) : null}
                  {bar.name}
                </span>
                <span
                  className={
                    bar.highlight
                      ? "text-base font-extrabold text-[var(--color-accent)]"
                      : "text-base font-bold text-[var(--color-ink-muted)]"
                  }
                >
                  {bar.amountLabel}
                </span>
              </div>

              <div
                className="relative h-9 w-full overflow-hidden rounded-full bg-[var(--color-surface)]"
                role="img"
                aria-label={`${bar.name}: ${bar.amountLabel}`}
              >
                <motion.div
                  className={
                    bar.highlight
                      ? "absolute inset-y-0 left-0 rounded-full bg-[var(--color-accent)]"
                      : "absolute inset-y-0 left-0 rounded-full bg-[var(--color-ink)]/20"
                  }
                  initial={reduceMotion ? false : { width: 0 }}
                  whileInView={{ width: `${Math.max(bar.pct, 6)}%` }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>

              <p className="mt-1.5 text-xs text-[var(--color-ink-muted)]">{bar.sublabel}</p>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-col items-start gap-3 border-t border-[var(--color-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-[var(--color-ink)]">
            Six licensing exams on one subscription — built for multi-board timelines.
          </p>
          <Link
            href={LANDING_TRIAL_HREF}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-apple-btn)] transition hover:shadow-[var(--shadow-apple-btn-hover)] hover:brightness-105"
          >
            {formatTrialCtaLabel()}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
        {COMPARE_HONESTY_DISCLAIMER} Bar lengths are illustrative, not quotes from other providers.
      </p>
    </section>
  );
}
