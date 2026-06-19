"use client";

/**
 * CostComparisonChart — competitor cost analysis as a horizontal bar graph.
 *
 * Honesty note: the only competitor figure the site asserts anywhere is the
 * "$200–400+ per exam" per-exam-bank range (see UWORLD_COMPARE_ROWS). This chart
 * is derived purely from that asserted range × 6 boards versus our REAL annual
 * Pro price (TIER_ANNUAL_USD) — no invented competitor numbers — so it stays
 * consistent with the rest of the page and the disclaimer below.
 */

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Crown } from "lucide-react";
import { TIER_ANNUAL_USD } from "@/lib/subscription-tiers";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { formatTrialCtaLabel } from "@/lib/site";

const EXAM_COUNT = 6;
const PER_EXAM_LOW = 200;
const PER_EXAM_HIGH = 400;

const ANYEXAM_ANNUAL = TIER_ANNUAL_USD.pro; // real Pro yearly total
const SEPARATE_LOW = PER_EXAM_LOW * EXAM_COUNT; // 6 banks, low end
const SEPARATE_HIGH = PER_EXAM_HIGH * EXAM_COUNT; // 6 banks, high end
const CHART_MAX = SEPARATE_HIGH;

// "Up to" is the legally safest savings claim form: it caps the comparison at
// the high end of the publicly advertised per-exam range under stated assumptions.
const SAVINGS_HIGH = SEPARATE_HIGH - ANYEXAM_ANNUAL;
const PRICING_YEAR = new Date().getFullYear();

const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

type Bar = {
  name: string;
  sublabel: string;
  amountLabel: string;
  /** Fill width as a % of CHART_MAX. */
  pct: number;
  /** Optional lighter "range" extension width as a % of CHART_MAX. */
  rangePct?: number;
  highlight: boolean;
};

const BARS: Bar[] = [
  {
    name: "AnyExamEasy",
    sublabel: "One plan · all 6 boards",
    amountLabel: `${usd(ANYEXAM_ANNUAL)}/yr`,
    pct: (ANYEXAM_ANNUAL / CHART_MAX) * 100,
    highlight: true,
  },
  {
    name: "Separate exam banks",
    sublabel: `6 boards × ${usd(PER_EXAM_LOW)}–${usd(PER_EXAM_HIGH)} each`,
    amountLabel: `${usd(SEPARATE_LOW)}–${usd(SEPARATE_HIGH)}+`,
    pct: (SEPARATE_LOW / CHART_MAX) * 100,
    rangePct: ((SEPARATE_HIGH - SEPARATE_LOW) / CHART_MAX) * 100,
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
              One plan vs. six subscriptions
            </h3>
            <p className="mt-1.5 text-sm text-[var(--color-ink-muted)]">
              Annual cost to prep for all six boards.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-[var(--color-accent)]/10 px-3 py-1.5 text-sm font-bold text-[var(--color-accent)]">
            Save up to {usd(SAVINGS_HIGH)}/yr*
          </span>
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
                aria-label={`${bar.name}: ${bar.amountLabel} for all six boards`}
              >
                {/* Range extension (lighter) behind the solid fill */}
                {bar.rangePct ? (
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-ink)]/10"
                    initial={reduceMotion ? false : { width: 0 }}
                    whileInView={{ width: `${Math.min(bar.pct + bar.rangePct, 100)}%` }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  />
                ) : null}
                <motion.div
                  className={
                    bar.highlight
                      ? "absolute inset-y-0 left-0 rounded-full bg-[var(--color-accent)]"
                      : "absolute inset-y-0 left-0 rounded-full bg-[var(--color-ink)]/35"
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
            Six licensing exams, one subscription — for less than a single per-exam bank.
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
        *Illustrative comparison for general information only — an estimate, not a quote. Per-exam
        question-bank pricing reflects publicly advertised ranges ($200–400+ per board) as of{" "}
        {PRICING_YEAR} and varies by provider, promotion, and subscription length; actual savings
        depend on which and how many exams you buy. The AnyExamEasy figure is the current annual Pro
        plan price. All product names, logos, and brands are property of their respective owners;
        AnyExamEasy is independent and is not affiliated with, endorsed by, or sponsored by any other
        provider.
      </p>
    </section>
  );
}
