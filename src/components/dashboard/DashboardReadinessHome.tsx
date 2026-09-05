"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DomainMap } from "@/components/dashboard/DomainMap";
import type { PracticeReadinessSummary } from "@/lib/learning/honest-readiness";
import { roadmapHref } from "@/lib/learning/roadmap-links";
import { domainTilesFromReadiness } from "@/lib/study/domain-map";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

const BAND_STYLES: Record<PracticeReadinessSummary["bandKey"], string> = {
  ready: "bg-emerald-600/15 text-emerald-800",
  almost: "bg-amber-500/15 text-amber-900",
  not_yet:
    "bg-[var(--color-surface)] text-[var(--color-ink-muted)] ring-1 ring-[var(--color-border)]",
};

/** Legacy readiness panel — prefers DomainMap when used outside the graphic hero. */
export function DashboardReadinessHome({
  examSlug,
  summary,
  categoriesLabel = "Blueprint domains",
}: {
  examSlug: ExamSlug;
  summary: PracticeReadinessSummary;
  categoriesLabel?: string;
}) {
  const tiles = domainTilesFromReadiness(summary);

  return (
    <section
      aria-labelledby="dashboard-readiness-heading"
      className={cn(dbUi.surface, "p-4 sm:p-5")}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={dbUi.eyebrow}>Practice readiness</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h2
              id="dashboard-readiness-heading"
              className="text-[18px] font-semibold tracking-tight text-[var(--color-ink)]"
            >
              {summary.bandLabel}
            </h2>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide",
                BAND_STYLES[summary.bandKey]
              )}
            >
              {summary.overallScore}% practice
            </span>
          </div>
          <p className={cn(dbUi.sectionHint, "mt-1.5 max-w-xl")}>{summary.reason}</p>
        </div>
        <Link
          href={roadmapHref(examSlug)}
          className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-[var(--color-accent)] hover:underline"
        >
          Full map
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      {tiles.length > 0 ? (
        <div className="mt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            {categoriesLabel}
          </p>
          <DomainMap tiles={tiles} variant="compact" aria-label={categoriesLabel} />
        </div>
      ) : null}

      <details className="mt-4 rounded-xl border border-[var(--color-border)]/70 bg-[var(--color-surface)]/50 px-3 py-2">
        <summary className="cursor-pointer text-[12px] font-semibold text-[var(--color-ink-muted)]">
          How we classify Ready / Almost / Not yet
        </summary>
        <ul className="mt-2 space-y-1.5 pb-1 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
          {summary.criteria.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="border-t border-[var(--color-border)]/60 pt-2 text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
          {summary.disclaimer}
        </p>
      </details>
    </section>
  );
}
