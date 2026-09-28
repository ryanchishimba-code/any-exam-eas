import { DashboardUpgradeBanner, type DashboardUpgradeProps } from "@/components/dashboard/DashboardUpgradeBanner";
import { DashboardExamCountdown } from "@/components/dashboard/DashboardExamCountdown";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
  DashboardGraphicHero,
  weakTopicPracticeHref,
  type DashboardWeakFocus,
} from "@/components/dashboard/DashboardGraphicHero";
import { DashboardWeakTopicChips } from "@/components/dashboard/DashboardWeakTopicChips";
import { DashboardViewSections } from "@/components/app/DashboardViewSections";
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
import { ReadinessDashboardCard } from "@/components/readiness/ReadinessDashboardCard";
import type { TodaySetPreviewView } from "@/components/dashboard/DashboardTodayBlock";

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
  hasStudyAccess = true,
  practiceFieldId,
  masteryRollup = null,
  masteryMapTiles = null,
  examDayPlan = null,
  tourSeen = true,
  accountAttemptCount = null,
  todaySet = null,
  deferTodayMix = false,
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
  /** Trial or paid. The readiness invite uses this before its own fetch returns. */
  hasStudyAccess?: boolean;
  /** Canonical bank field (USMLE step-aware). */
  practiceFieldId?: string;
  masteryRollup?: MasteryRollup | null;
  masteryMapTiles?: DomainMapTile[] | null;
  examDayPlan?: ExamDayPlan | null;
  /** Server read of tours.firstLogin.v1. Unknown metadata fails closed. */
  tourSeen?: boolean;
  /** Account-wide attempts. Null fails closed so existing students are not surprised. */
  accountAttemptCount?: number | null;
  todaySet?: TodaySetPreviewView | null;
  /** Mix line loads after the shell, from the served preview, so back navigation is not blocked on it. */
  deferTodayMix?: boolean;
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

      <ReadinessDashboardCard
        examSlug={examSlug}
        examName={exam.shortName}
        hasStudyAccess={hasStudyAccess}
      />

      {upgrade ? <DashboardUpgradeBanner {...upgrade} /> : null}

      {examDayPlan ? (
        <DashboardTodayBlock
          plan={examDayPlan}
          studyLocked={studyLocked}
          todaySet={deferTodayMix ? undefined : todaySet}
          deferMix={deferTodayMix}
        />
      ) : null}

      <RemediationPanel
        examName={exam.name}
        fieldId={fieldId}
        summary={roadmap?.openRemediation}
        studyLocked={studyLocked}
      />

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
        masteryMapTiles={masteryMapTiles}
        eyebrow={examDayPlan ? "Practice snapshot" : "Today's focus"}
        bandLabel={examDayPlan ? "Practice" : undefined}
        showPrimaryAction={!examDayPlan}
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
