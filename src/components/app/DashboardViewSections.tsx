"use client";

import { DashboardRecentActivity } from "@/components/dashboard/DashboardRecentActivity";
import { DashboardSpacedReview } from "@/components/dashboard/DashboardSpacedReview";
import type { ExamRoadmapData } from "@/lib/learning/exam-roadmap";
import type { RecentTestRow, SpacedReviewSummary, WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";

export function DashboardViewSections({
  examSlug,
  spacedReview,
  recentTests,
  srsInFocus = false,
  practiceFieldId,
}: {
  examSlug: ExamSlug;
  /** Kept for call-site compatibility; weak topics live on hero chips. */
  weakTopics?: WeakTopicRow[];
  spacedReview: SpacedReviewSummary;
  /** Kept for call-site compatibility; blueprint map lives on the hero + /roadmap. */
  roadmap?: ExamRoadmapData | null;
  recentTests: RecentTestRow[];
  /** When Today's focus already surfaces SRS, skip the duplicate card. */
  srsInFocus?: boolean;
  /** @deprecated Roadmap preview removed — hero DomainMap is the Home graphic. */
  hideRoadmapPreview?: boolean;
  practiceFieldId?: string;
}) {
  const showRecent = recentTests.length > 0;
  const showSpacedReview = spacedReview.dueCount > 0 && !srsInFocus;

  return (
    <>
      {showSpacedReview ? (
        <DashboardSpacedReview
          examSlug={examSlug}
          spacedReview={spacedReview}
          practiceFieldId={practiceFieldId}
        />
      ) : null}

      {showRecent ? (
        <details className="group rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)]">
          <summary className="cursor-pointer list-none px-4 py-3.5 text-[13px] font-semibold text-[var(--color-ink)] marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-3">
              <span>Recent sessions</span>
              <span className="text-[12px] font-medium text-[var(--color-ink-muted)] group-open:hidden">
                Show {Math.min(3, recentTests.length)}
              </span>
              <span className="hidden text-[12px] font-medium text-[var(--color-ink-muted)] group-open:inline">
                Hide
              </span>
            </span>
          </summary>
          <div className="border-t border-[var(--color-border)]/60">
            <DashboardRecentActivity examSlug={examSlug} recentTests={recentTests} embedded />
          </div>
        </details>
      ) : null}
    </>
  );
}
