"use client";

import { DashboardContinueRow } from "@/components/dashboard/DashboardContinueRow";
import { DashboardExploreRow } from "@/components/dashboard/DashboardExploreRow";
import { DashboardRoadmapPreview } from "@/components/dashboard/DashboardRoadmapPreview";
import { DashboardRecentActivity } from "@/components/dashboard/DashboardRecentActivity";
import { DashboardSpacedReview } from "@/components/dashboard/DashboardSpacedReview";
import { DashboardWeakTopics } from "@/components/dashboard/DashboardWeakTopics";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import type { ExamRoadmapData } from "@/lib/learning/exam-roadmap";
import type { RecentTestRow, SpacedReviewSummary, WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";

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
      <DashboardContinueRow examSlug={examSlug} />

      {roadmap ? <DashboardRoadmapPreview examSlug={examSlug} roadmap={roadmap} /> : null}

      {showSpacedReview ? (
        <DashboardSpacedReview examSlug={examSlug} spacedReview={spacedReview} />
      ) : null}

      {showWeak ? <DashboardWeakTopics examSlug={examSlug} weakTopics={weakTopics} /> : null}

      {showExplore ? <DashboardExploreRow examSlug={examSlug} /> : null}

      {showRecent ? (
        <DashboardRecentActivity examSlug={examSlug} recentTests={recentTests} />
      ) : null}
    </>
  );
}
