"use client";

import { useMemo } from "react";
import {
  CRITERION_LABELS,
  QUALITY_CRITERIA,
  type QuestionQualityRating,
} from "@/lib/questions/quality-rubric";
import { cn } from "@/lib/utils";

const GRADE_COLOR: Record<QuestionQualityRating["grade"], string> = {
  Excellent: "text-teal-700 bg-teal-50 border-teal-200",
  Strong: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Adequate: "text-slate-700 bg-slate-50 border-slate-200",
  "Needs work": "text-amber-800 bg-amber-50 border-amber-200",
  Weak: "text-rose-700 bg-rose-50 border-rose-200",
};

function scoreBarClass(score: number): string {
  if (score >= 8) return "bg-teal-500";
  if (score >= 6) return "bg-amber-400";
  return "bg-rose-500";
}

export function QuestionQualityRubricPanel({
  rating,
  className,
}: {
  rating: QuestionQualityRating;
  className?: string;
}) {
  const rows = useMemo(
    () =>
      QUALITY_CRITERIA.map((key) => ({
        key,
        label: CRITERION_LABELS[key],
        score: rating.criteria[key],
        feedback: rating.feedback[key],
      })),
    [rating]
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-sm font-semibold",
            GRADE_COLOR[rating.grade]
          )}
        >
          {rating.grade} · {rating.overall}/10
        </span>
        {rating.needsImprovement ? (
          <span className="text-xs font-medium text-amber-700">Needs improvement</span>
        ) : (
          <span className="text-xs font-medium text-teal-700">Board-ready</span>
        )}
      </div>

      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={row.key}>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-medium text-[var(--color-ink)]">{row.label}</span>
              <span className="tabular-nums font-semibold text-[var(--color-ink-muted)]">
                {row.score}/10
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
              <div
                className={cn("h-full rounded-full transition-all", scoreBarClass(row.score))}
                style={{ width: `${row.score * 10}%` }}
              />
            </div>
            {row.feedback ? (
              <p className="mt-1 text-[11px] leading-snug text-[var(--color-ink-muted)]">
                {row.feedback}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
