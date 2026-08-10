import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PracticeReadinessSummary } from "@/lib/learning/honest-readiness";
import { roadmapHref } from "@/lib/learning/roadmap-links";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

const BAND_STYLES: Record<
  PracticeReadinessSummary["bandKey"],
  { badge: string; bar: string }
> = {
  ready: {
    badge: "bg-emerald-600/15 text-emerald-800 dark:text-emerald-300",
    bar: "bg-emerald-500",
  },
  almost: {
    badge: "bg-amber-500/15 text-amber-900 dark:text-amber-200",
    bar: "bg-amber-500",
  },
  not_yet: {
    badge: "bg-[var(--color-surface)] text-[var(--color-ink-muted)] ring-1 ring-[var(--color-border)]",
    bar: "bg-[var(--color-ink-muted)]",
  },
};

export function DashboardReadinessHome({
  examSlug,
  summary,
  categoriesLabel = "Blueprint domains",
}: {
  examSlug: ExamSlug;
  summary: PracticeReadinessSummary;
  /** e.g. "Client Needs" for NCLEX */
  categoriesLabel?: string;
}) {
  const styles = BAND_STYLES[summary.bandKey];
  const bars = summary.categoryBars;

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
                styles.badge
              )}
            >
              {summary.overallScore}% practice
            </span>
          </div>
          <p className={cn(dbUi.sectionHint, "mt-1.5 max-w-xl")}>{summary.reason}</p>
          <p className="mt-1 text-[11px] text-[var(--color-ink-muted)]">
            {summary.totalAttempts} answers · {summary.overallCoveragePct}% bank coverage
          </p>
        </div>
        <Link
          href={roadmapHref(examSlug)}
          className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-[var(--color-accent)] hover:underline"
        >
          Full roadmap
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      {bars.length > 0 ? (
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            {categoriesLabel}
          </p>
          <ul className="mt-2 space-y-2.5" role="list">
            {bars.map((bar) => (
              <li key={bar.categoryId}>
                <div className="flex items-baseline justify-between gap-2">
                  <Link
                    href={bar.practiceHref}
                    className="min-w-0 truncate text-[13px] font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] hover:underline"
                  >
                    {bar.label}
                  </Link>
                  <span className="shrink-0 text-[11px] tabular-nums text-[var(--color-ink-muted)]">
                    {bar.readinessScore}% · {bar.blueprintWeightPct}% of exam
                  </span>
                </div>
                <div
                  className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]/70"
                  role="meter"
                  aria-valuenow={bar.readinessScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${bar.label} practice score ${bar.readinessScore}%`}
                >
                  <div
                    className={cn("h-full rounded-full transition-[width] duration-500", styles.bar)}
                    style={{ width: `${Math.max(4, Math.min(100, bar.readinessScore))}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
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
