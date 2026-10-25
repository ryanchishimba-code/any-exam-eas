"use client";

/**
 * CostComparisonChart — multi-exam value without third-party price claims or implied savings bars.
 */

import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";
import { TIER_ANNUAL_USD } from "@/lib/subscription-tiers";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { COMPARE_HONESTY_DISCLAIMER } from "@/lib/seo/competitor-comparison";
import { formatTrialCtaLabel } from "@/lib/site";

const EXAM_COUNT = 6;
const ANYEXAM_ANNUAL = TIER_ANNUAL_USD.pro;

const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

const ROWS = [
  {
    approach: "AnyExamEasy Pro",
    annual: `${usd(ANYEXAM_ANNUAL)}/yr`,
    notes: `One subscription · all ${EXAM_COUNT} boards on the platform`,
    highlight: true,
  },
  {
    approach: "Typical single-exam stack",
    annual: "Varies by provider",
    notes: `Often ${EXAM_COUNT} separate products if you prep for every board we cover`,
    highlight: false,
  },
] as const;

export function CostComparisonChart() {
  return (
    <section
      aria-labelledby="cost-compare-heading"
      className="mx-auto w-full max-w-3xl"
    >
      <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-md)] sm:p-8">
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
            Published annual Pro price only — we do not quote other providers.
          </p>
        </div>

        <div className="mt-7 overflow-x-auto rounded-2xl border border-[var(--color-border)]">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <th scope="col" className="px-4 py-3 font-semibold text-[var(--color-ink)]">
                  Approach
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-[var(--color-ink)]">
                  Annual billing
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-[var(--color-ink)]">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.approach} className="border-b border-[var(--color-border)] last:border-0">
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-[var(--color-ink)]"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {row.highlight ? (
                        <Crown className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
                      ) : null}
                      {row.approach}
                    </span>
                  </th>
                  <td
                    className={
                      row.highlight
                        ? "px-4 py-3 font-bold text-[var(--color-accent)]"
                        : "px-4 py-3 text-[var(--color-ink-muted)]"
                    }
                  >
                    {row.annual}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-ink-muted)]">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
        {COMPARE_HONESTY_DISCLAIMER}
      </p>
    </section>
  );
}
