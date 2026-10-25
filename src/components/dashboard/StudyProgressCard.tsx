import type { CSSProperties } from "react";
import Link from "next/link";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { StudyCompletionResult } from "@/lib/learning/study-completion/compute-study-completion";
import {
  studyProgressCardRows,
  studyProgressMicrocopy,
  studyProgressNextStep,
  studyProgressRingPercent,
} from "@/lib/learning/study-completion/study-progress-card-model";
import { cn } from "@/lib/utils";
import "./study-progress-card.css";

export function StudyProgressCard({ data }: { data: StudyCompletionResult }) {
  const rows = studyProgressCardRows(data);
  const ringPct = studyProgressRingPercent(data.overallPercent);
  const microcopy = studyProgressMicrocopy(ringPct);
  const nextStep = studyProgressNextStep(data);
  const estimate = data.readinessEstimate;

  return (
    <section
      className={cn(dbUi.surface, "p-4 sm:p-5")}
      aria-labelledby="study-progress-title"
      data-study-progress-card="true"
    >
      <div className="flex items-start gap-4">
        <div
          className="study-progress-card__ring study-progress-card__ring--animate"
          style={
            {
              "--study-progress-ring-pct": ringPct,
              "--study-progress-ring-target": ringPct,
            } as CSSProperties
          }
          role="img"
          aria-label={`Overall study progress ${ringPct} percent`}
        >
          <span className="study-progress-card__ring-value">{ringPct}%</span>
        </div>

        <div className="min-w-0 flex-1">
          <p id="study-progress-title" className="text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">
            Study progress
          </p>
          <p className="mt-0.5 text-[12px] leading-snug text-[var(--color-ink-muted)]">{microcopy}</p>

          <ul className="mt-3 space-y-2" aria-label="Study milestones">
            {rows.map((row) => (
              <li key={row.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-0.5">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-[12px] font-medium text-[var(--color-ink)]">{row.label}</span>
                  <div
                    className={cn(
                      "study-progress-card__row-bar min-w-[3.5rem] flex-1 max-w-[5.5rem]",
                      row.met && "study-progress-card__row-bar--met"
                    )}
                    aria-hidden
                  >
                    <span style={{ width: `${row.progressPercent}%` }} />
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 text-[11px] tabular-nums",
                    row.met ? "font-semibold text-emerald-700" : "text-[var(--color-ink-muted)]"
                  )}
                >
                  {row.done}/{row.target}
                  {row.met ? " ✓" : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-3 text-[12px] leading-snug">
        <Link href={nextStep.href} className="font-medium text-[var(--color-accent)] hover:underline">
          {nextStep.label}
        </Link>
      </p>

      <p className="mt-2.5 text-[11px] leading-snug text-[var(--color-ink-muted)]">
        {estimate.status === "insufficient_data" ? (
          <span>{estimate.message}</span>
        ) : (
          <span
            title={estimate.disclaimer}
            className="inline-flex max-w-full flex-wrap items-center gap-1.5"
          >
            <span
              className="rounded-md bg-[var(--color-border)]/40 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]"
            >
              Readiness estimate
            </span>
            <span className="tabular-nums text-[var(--color-ink)]">
              {estimate.score}/100 · {estimate.band}
            </span>
            <span className="text-[10px] text-[var(--color-ink-muted)]">(not a prediction)</span>
          </span>
        )}
      </p>
    </section>
  );
}
