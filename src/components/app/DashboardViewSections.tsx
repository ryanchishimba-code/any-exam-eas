"use client";

import { DashboardContinueRow } from "@/components/dashboard/DashboardContinueRow";
import { DashboardExploreRow } from "@/components/dashboard/DashboardExploreRow";
import { DashboardRoadmapPreview } from "@/components/dashboard/DashboardRoadmapPreview";
import { DashboardRecentActivity } from "@/components/dashboard/DashboardRecentActivity";
import { DashboardSpacedReview } from "@/components/dashboard/DashboardSpacedReview";
import { DashboardWeakTopics } from "@/components/dashboard/DashboardWeakTopics";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { ExamRoadmapData } from "@/lib/learning/exam-roadmap";
import type { RecentTestRow, SpacedReviewSummary, WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

export function DashboardViewSections({
  examSlug,
  weakTopics,
  spacedReview,
  roadmap,
  recentTests,
  srsInFocus = false,
}: {
  examSlug: ExamSlug;
  weakTopics: WeakTopicRow[];
  spacedReview: SpacedReviewSummary;
  roadmap: ExamRoadmapData | null;
  recentTests: RecentTestRow[];
  /** When Today's focus already surfaces SRS, skip the duplicate card. */
  srsInFocus?: boolean;
}) {
  const showExplore = hasClinicalStudyTools(examSlug);
  const showRecent = recentTests.length > 0;
  const showWeak = weakTopics.length > 0;
  const showSpacedReview = spacedReview.dueCount > 0 && !srsInFocus;

  return (
    <>
      <div className={cn(dbUi.sectionDivider, dbUi.panelSection)}>
        <DashboardContinueRow examSlug={examSlug} />
      </div>

      {roadmap ? (
        <div className={cn(dbUi.sectionDivider, dbUi.panelSection)}>
          <DashboardRoadmapPreview examSlug={examSlug} roadmap={roadmap} />
        </div>
      ) : null}

      {showSpacedReview ? (
        <div className={cn(dbUi.sectionDivider, dbUi.panelSection)}>
          <DashboardSpacedReview examSlug={examSlug} spacedReview={spacedReview} />
        </div>
      ) : null}

      {showWeak ? (
        <div className={cn(dbUi.sectionDivider, dbUi.panelSection)}>
          <DashboardWeakTopics examSlug={examSlug} weakTopics={weakTopics} />
        </div>
      ) : null}

      {showExplore ? (
        <div className={cn(dbUi.sectionDivider, dbUi.panelSection)}>
          <DashboardExploreRow examSlug={examSlug} />
        </div>
      ) : null}

      {showRecent ? (
        <div className={cn(dbUi.sectionDivider, dbUi.panelSection)}>
          <DashboardRecentActivity examSlug={examSlug} recentTests={recentTests} />
        </div>
      ) : null}
    </>
  );
}
