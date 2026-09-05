import dynamic from "next/dynamic";
import { DashboardUpgradeBanner, type DashboardUpgradeProps } from "@/components/dashboard/DashboardUpgradeBanner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
  DashboardGraphicHero,
  weakTopicPracticeHref,
  type DashboardWeakFocus,
} from "@/components/dashboard/DashboardGraphicHero";
import { DashboardWeakTopicChips } from "@/components/dashboard/DashboardWeakTopicChips";
import { DashboardViewSections } from "@/components/app/DashboardViewSections";
import { Skeleton } from "@/components/ui/skeleton";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { buildPracticeReadinessSummary } from "@/lib/learning/honest-readiness";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { ExamRoadmapData } from "@/lib/learning/exam-roadmap";
import type { RecentTestRow, SpacedReviewSummary, WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug, StudyHubQuickStats } from "@/types/edtech";

const DashboardExamCountdown = dynamic(
  () =>
    import("@/components/dashboard/DashboardExamCountdown").then((m) => m.DashboardExamCountdown),
  { loading: () => <Skeleton className="h-12 w-full rounded-2xl" /> }
);

export type DashboardHeadline = {
  readinessScore: number;
  motivationalMessage: string;
  trendDelta: number | null;
};

function topWeakFocus(
  examSlug: ExamSlug,
  weakTopics: WeakTopicRow[],
  practiceFieldId?: string
): DashboardWeakFocus | null {
  const topic = weakTopics[0];
  if (!topic) return null;
  const slug = topic.id.replace(/^(tag|subject):/, "");
  return {
    name: topic.name,
    href:
      topic.studyLinks?.practiceHref ??
      weakTopicPracticeHref(examSlug, slug, practiceFieldId),
  };
}

export function DashboardPageContent({
  examSlug,
  stats,
  headline,
  weakTopics,
  spacedReview,
  roadmap,
  recentTests,
  userName,
  testDate = null,
  upgrade,
  hasPremiumAccess = true,
  practiceFieldId,
}: {
  examSlug: ExamSlug;
  stats: StudyHubQuickStats;
  headline: DashboardHeadline;
  weakTopics: WeakTopicRow[];
  spacedReview: SpacedReviewSummary;
  roadmap: ExamRoadmapData | null;
  recentTests: RecentTestRow[];
  userName?: string | null;
  testDate?: string | null;
  upgrade?: DashboardUpgradeProps | null;
  hasPremiumAccess?: boolean;
  /** Canonical bank field (USMLE step-aware). */
  practiceFieldId?: string;
}) {
  const exam = EXAM_CATALOG[examSlug];
  const showRecent = recentTests.length > 0;
  const isNewUser = stats.questionsAnswered === 0 && !showRecent;
  const studyLocked = !hasPremiumAccess;
  const readinessSummary = roadmap ? buildPracticeReadinessSummary(roadmap) : null;
  const categoriesLabel = examSlug === "nclex" ? "Client Needs" : "Blueprint domains";
  const fieldId = practiceFieldId ?? exam.fieldId;

  return (
    <div className={dbUi.page}>
      <DashboardHeader
        examName={exam.name}
        userName={userName}
        streakDays={stats.streakDays}
        dueCount={spacedReview.dueCount}
        questionsAnswered={stats.questionsAnswered}
      />

      <DashboardExamCountdown examSlug={examSlug} examName={exam.name} testDate={testDate} />

      {upgrade ? <DashboardUpgradeBanner {...upgrade} /> : null}

      <DashboardGraphicHero
        examSlug={examSlug}
        examName={exam.name}
        readinessScore={readinessSummary?.overallScore ?? headline.readinessScore}
        readinessSummary={readinessSummary}
        categoriesLabel={categoriesLabel}
        dueCount={spacedReview.dueCount}
        topWeakTopic={topWeakFocus(examSlug, weakTopics, fieldId)}
        hasRecent={showRecent}
        studyLocked={studyLocked}
        practiceFieldId={fieldId}
      />

      {!isNewUser ? (
        <DashboardWeakTopicChips
          examSlug={examSlug}
          weakTopics={weakTopics}
          practiceFieldId={fieldId}
        />
      ) : null}

      <DashboardViewSections
        examSlug={examSlug}
        weakTopics={weakTopics}
        spacedReview={spacedReview}
        roadmap={roadmap}
        recentTests={recentTests}
        srsInFocus={!isNewUser && spacedReview.dueCount > 0}
        hideRoadmapPreview={Boolean(readinessSummary)}
        practiceFieldId={fieldId}
      />
    </div>
  );
}
