"use client";

import Link from "next/link";
import { ArrowRight, Target, Flag, AlertCircle } from "lucide-react";
import { buildFullExamInsights } from "@/lib/questions/exam-insights";
import { feUi } from "@/lib/study/full-exam-ui";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamResultsAnalysis } from "@/types/full-exam";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  score: number;
  analysis: FullExamResultsAnalysis;
  answers: ExamAnswerRecord[];
  onReviewMissed?: () => void;
};

export function FullExamResultsInsights({
  examSlug,
  score,
  analysis,
  answers,
  onReviewMissed,
}: Props) {
  const insights = buildFullExamInsights(examSlug, score, analysis, answers);
  const uniqueActions = insights.actions.filter(
    (action, index, arr) => arr.findIndex((a) => a.href === action.href) === index
  );

  return (
    <section className={cn(feUi.panel, "p-5 sm:p-6")} aria-labelledby="exam-insights-heading">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10">
          <Target className="h-5 w-5 text-[var(--color-accent)]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="exam-insights-heading" className={feUi.sectionTitle}>
            {insights.headline}
          </h2>
          <p className={cn(feUi.sectionHint, "mt-1")}>{insights.subline}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {insights.missedCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-700">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden />
            {insights.missedCount} missed
          </span>
        ) : null}
        {insights.flaggedCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800">
            <Flag className="h-3.5 w-3.5" aria-hidden />
            {insights.flaggedCount} flagged
          </span>
        ) : null}
      </div>

      {onReviewMissed && insights.missedCount > 0 ? (
        <button
          type="button"
          onClick={onReviewMissed}
          className={cn(feUi.footerBtn, "mt-4 w-full justify-center sm:w-auto")}
        >
          Review missed questions
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      ) : null}

      {uniqueActions.length > 0 ? (
        <ul className="mt-5 space-y-2">
          {uniqueActions.slice(0, 4).map((action) => (
            <li key={action.href}>
              <Link
                href={action.href}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition",
                  action.priority === "high"
                    ? "border-[var(--color-accent)]/25 bg-[var(--color-accent)]/5 hover:bg-[var(--color-accent)]/10"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-black/[0.02]"
                )}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-ink)]">{action.label}</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
