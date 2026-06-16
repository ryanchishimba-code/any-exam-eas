"use client";

import Link from "next/link";
import { ArrowRight, Brain, Clock } from "lucide-react";
import { spacedReviewHref } from "@/lib/edtech/practice-links";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { SpacedReviewSummary } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

export function DashboardSpacedReview({
  examSlug,
  spacedReview,
}: {
  examSlug: ExamSlug;
  spacedReview: SpacedReviewSummary;
}) {
  const { dueCount, weakDueCount } = spacedReview;
  if (dueCount === 0) return null;

  return (
    <section aria-labelledby="dashboard-spaced-heading" className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-indigo-600" aria-hidden />
            <h2 id="dashboard-spaced-heading" className={dbUi.sectionTitle}>
              Spaced review
            </h2>
          </div>
          <p className={cn(dbUi.sectionHint, "mt-0.5")}>
            Missed questions resurface on a smart schedule — review them before they slip.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/90 to-violet-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4">
          <Stat label="Due now" value={dueCount} />
          {weakDueCount > 0 ? (
            <Stat label="Weak & due" value={weakDueCount} accent />
          ) : null}
          <div className="flex items-center gap-1.5 text-[12px] text-indigo-800/80">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            Adaptive engine schedules your next review
          </div>
        </div>
        <Link
          href={spacedReviewHref(examSlug, Math.min(25, Math.max(10, dueCount)))}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Review due questions
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-indigo-700/70">{label}</p>
      <p
        className={cn(
          "text-2xl font-bold tabular-nums",
          accent ? "text-rose-600" : "text-indigo-900"
        )}
      >
        {value}
      </p>
    </div>
  );
}
