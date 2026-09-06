"use client";

/**
 * Compact three-stat strip under the homepage hero.
 */

import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";
import { SEO_LIVE_STATS } from "@/lib/seo/seo-copy";

export function LandingStatsStrip({ bankCounts }: { bankCounts: LandingBankCountsDisplay }) {
  const total = bankCounts.totalLabel || SEO_LIVE_STATS.questionCount;
  const stats = [
    { value: total, label: "QA-gated questions" },
    { value: "6 boards", label: "One login" },
    { value: `${SEO_LIVE_STATS.trialDays}-day`, label: "No-card trial" },
  ] as const;

  return (
    <section
      className="aee-hero-handoff border-b border-[var(--color-border)] bg-[var(--color-bg)] py-12 sm:py-14"
      aria-label="Platform stats"
    >
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-5 sm:grid-cols-3 sm:gap-8 sm:px-6">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--color-ink-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
