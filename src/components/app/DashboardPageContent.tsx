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
import { DashboardTodayBlock } from "@/components/dashboard/DashboardTodayBlock";
import { RemediationPanel } from "@/components/dashboard/RemediationPanel";
import { buildPracticeReadinessSummary } from "@/lib/learning/honest-readiness";
import type { ExamDayPlan } from "@/lib/learning/exam-day-plan";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { ExamRoadmapData } from "@/lib/learning/exam-roadmap";
import type { RecentTestRow, SpacedReviewSummary, WeakTopicRow } from "@/lib/learning/student-dashboard";
import { filterStudentFacingWeakTopics } from "@/lib/learning/concept-labels";
import { MasteryReadinessStrip } from "@/components/dashboard/MasteryReadinessStrip";
import { NaplexMasteryPanel } from "@/components/dashboard/NaplexMasteryPanel";
import { UsmleExamPathPanel } from "@/components/dashboard/UsmleExamPathPanel";
import type { MasteryRollup } from "@/lib/engine/mastery/types";
import type { DomainMapTile } from "@/components/dashboard/DomainMap";
import type { ExamSlug, StudyHubQuickStats } from "@/types/edtech";
import { isTodayEngineNaplexEnabled, isTodayEngineUsmleEnabled } from "@/lib/engine/mastery/feature-flag";
import { FirstLoginTour } from "@/components/onboarding/FirstLoginTour";

const DashboardExamCountdown = dynamic(
  () =>
    import("@/components/dashboard/DashboardExamCountdown").then((m) => m.DashboardExamCountdown),
  { loading: () => <Skeleton className="h-36 w-full rounded-3xl" /> }
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
  const topic = filterStudentFacingWeakTopics(weakTopics)[0];
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
  masteryRollup = null,
  masteryMapTiles = null,
  examDayPlan = null,
  tourSeen = true,
  accountAttemptCount = null,
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
  masteryRollup?: MasteryRollup | null;
  masteryMapTiles?: DomainMapTile[] | null;
  examDayPlan?: ExamDayPlan | null;
  /** Server read of tours.firstLogin.v1. Unknown metadata fails closed. */
  tourSeen?: boolean;
  /** Account-wide attempts. Null fails closed so existing students are not surprised. */
  accountAttemptCount?: number | null;
}) {
  const exam = EXAM_CATALOG[examSlug];
  const showRecent = recentTests.length > 0;
  const boardAttempts = examDayPlan?.totalAttempts ?? 0;
  const isNewUser = boardAttempts === 0 && !showRecent;
  const studyLocked = !hasPremiumAccess;
  const readinessSummary = roadmap ? buildPracticeReadinessSummary(roadmap) : null;
  const categoriesLabel =
    examSlug === "nclex"
      ? "Your NCLEX domains"
      : examSlug === "naplex"
        ? "Your NAPLEX domains"
        : examSlug === "usmle"
          ? "Your organ systems"
          : "Your blueprint";
  const categoriesHint =
    examSlug === "nclex"
      ? "Official Client Needs · ranked by need · tap to practice"
      : examSlug === "naplex"
        ? "NABP 2025 Content Outline · Domain 3 is 40% · tap Today"
        : examSlug === "usmle"
          ? "NBME organ systems · ranked by need · tap Today"
          : "Official exam blueprint · ranked by need · tap to practice";
  const fieldId = practiceFieldId ?? exam.fieldId;
  const showNaplexPanel = examSlug === "naplex" && isTodayEngineNaplexEnabled();
  const showUsmlePath = examSlug === "usmle" && isTodayEngineUsmleEnabled();

  return (
    <div className={dbUi.page}>
      <DashboardHeader
        examName={exam.name}
        userName={userName}
        streakDays={stats.streakDays}
        dueCount={spacedReview.dueCount}
        boardAttempts={boardAttempts}
      />

      <DashboardExamCountdown examSlug={examSlug} examName={exam.name} testDate={testDate} />

      {upgrade ? <DashboardUpgradeBanner {...upgrade} /> : null}

      {examDayPlan ? (
        <DashboardTodayBlock plan={examDayPlan} studyLocked={studyLocked} />
      ) : null}

      <RemediationPanel
        examName={exam.name}
        fieldId={fieldId}
        summary={roadmap?.openRemediation}
        studyLocked={studyLocked}
        showWhenEmpty={boardAttempts > 0}
      />

      <DashboardGraphicHero
        examSlug={examSlug}
        examName={exam.name}
        readinessScore={readinessSummary?.overallScore ?? headline.readinessScore}
        readinessSummary={readinessSummary}
        categoriesLabel={categoriesLabel}
        categoriesHint={categoriesHint}
        dueCount={spacedReview.dueCount}
        topWeakTopic={topWeakFocus(examSlug, weakTopics, fieldId)}
        hasRecent={showRecent}
        studyLocked={studyLocked}
        practiceFieldId={fieldId}
        masteryMapTiles={masteryMapTiles}
        eyebrow={examDayPlan ? "Practice snapshot" : "Today's focus"}
        bandLabel={examDayPlan ? "Practice" : undefined}
        disclosure={
          examDayPlan
            ? {
                summary: examDayPlan.readiness.visible
                  ? `Why ${examDayPlan.readiness.label}?`
                  : "Why is the proof hidden?",
                lines: [
                  examDayPlan.readiness.sampleDetail,
                  examDayPlan.readiness.visible && examDayPlan.readiness.score != null
                    ? `${examDayPlan.readiness.coveragePct}% coverage × ${examDayPlan.readiness.recentAccuracyPct}% recent accuracy × ${examDayPlan.readiness.remediationPct}% remediation completion = ${examDayPlan.readiness.score}.`
                    : `${examDayPlan.readiness.coveragePct}% coverage × ${examDayPlan.readiness.recentAccuracyPct}% recent accuracy × ${examDayPlan.readiness.remediationPct}% remediation completion.`,
                  examDayPlan.readiness.formula,
                  ...examDayPlan.readiness.criteria
                    .filter((row) => row.id !== "exam_sim")
                    .map((row) => `${row.label}: ${row.valueLabel}.`),
                ],
                disclaimer: examDayPlan.readiness.disclaimer,
              }
            : null
        }
      />

      {masteryRollup ? (
        <MasteryReadinessStrip rollup={masteryRollup} />
      ) : null}

      {showNaplexPanel ? <NaplexMasteryPanel /> : null}
      {showUsmlePath ? <UsmleExamPathPanel practiceFieldId={fieldId} /> : null}

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
        recentTests={recentTests}
        srsInFocus={!isNewUser && spacedReview.dueCount > 0}
        practiceFieldId={fieldId}
      />
      <FirstLoginTour
        boardName={exam.shortName}
        seen={tourSeen}
        attemptCount={accountAttemptCount}
      />
    </div>
  );
}
