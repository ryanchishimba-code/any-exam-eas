"use client";

import Link from "next/link";
import { ArrowRight, Brain } from "lucide-react";
import { spacedReviewHref } from "@/lib/edtech/practice-links-core";
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

  const reviewCount = Math.min(25, Math.max(10, dueCount));

  return (
    <section aria-labelledby="dashboard-spaced-heading" className="space-y-2.5">
      <div className="px-0.5">
        <div className="flex items-center gap-2">
          <Brain className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
          <h2 id="dashboard-spaced-heading" className={dbUi.sectionTitle}>
            Spaced review
          </h2>
        </div>
        <p className={cn(dbUi.sectionHint, "mt-0.5")}>
          Missed questions resurface on a smart schedule.
        </p>
      </div>

      <Link
        href={spacedReviewHref(examSlug, reviewCount)}
        className={cn(dbUi.exploreLink, "w-full justify-between")}
      >
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[var(--color-ink)]">
            {dueCount} due now
            {weakDueCount > 0 ? (
              <span className="font-medium text-[var(--color-ink-muted)]">
                {" "}
                · {weakDueCount} weak
              </span>
            ) : null}
          </p>
          <p className={dbUi.sectionHint}>Review before they slip from memory.</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-[var(--color-accent)]">
          Start
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </Link>
    </section>
  );
}
