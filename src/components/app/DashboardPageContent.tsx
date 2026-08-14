import { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Lock } from "lucide-react";
import { DashboardUpgradeBanner, type DashboardUpgradeProps } from "@/components/dashboard/DashboardUpgradeBanner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardReadinessHome } from "@/components/dashboard/DashboardReadinessHome";
import { DashboardTodayFocus } from "@/components/dashboard/DashboardTodayFocus";
import { DashboardTryForFreeBanner } from "@/components/dashboard/DashboardTryForFreeBanner";
import { DashboardViewSections } from "@/components/app/DashboardViewSections";
import { Skeleton } from "@/components/ui/skeleton";
import { postTrialCheckoutHref } from "@/lib/dashboard/upgrade-banner";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { buildPracticeReadinessSummary } from "@/lib/learning/honest-readiness";
import { dbUi } from "@/lib/study/dashboard-ui";
import { ROUTES } from "@/lib/routes";
import type { ExamRoadmapData } from "@/lib/learning/exam-roadmap";
import type { RecentTestRow, SpacedReviewSummary, WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug, StudyHubQuickStats } from "@/types/edtech";
import { displayFirstName } from "@/lib/display-name";
import { cn } from "@/lib/utils";

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
}) {
  const exam = EXAM_CATALOG[examSlug];
  const firstName = displayFirstName(userName);
  const showRecent = recentTests.length > 0;
  const isNewUser = stats.questionsAnswered === 0 && !showRecent;
  const studyLocked = !hasPremiumAccess;
  const readinessSummary = roadmap ? buildPracticeReadinessSummary(roadmap) : null;
  const categoriesLabel =
    examSlug === "nclex" ? "Client Needs (practice scores)" : "Blueprint domains (practice scores)";

  return (
    <div className={dbUi.page}>
      <DashboardHeader
        examName={exam.name}
        userName={userName}
        streakDays={stats.streakDays}
      />

      <Suspense fallback={null}>
        <DashboardTryForFreeBanner />
      </Suspense>

      <DashboardExamCountdown examSlug={examSlug} examName={exam.name} testDate={testDate} />

      {upgrade ? <DashboardUpgradeBanner {...upgrade} /> : null}

      {readinessSummary ? (
        <DashboardReadinessHome
          examSlug={examSlug}
          summary={readinessSummary}
          categoriesLabel={categoriesLabel}
        />
      ) : null}

      {isNewUser ? (
        <section className={cn(dbUi.surface, "p-4 sm:p-5")}>
          <p className={dbUi.eyebrow}>Get started</p>
          <h2 className="mt-1 text-lg font-semibold text-[var(--color-ink)]">
            Welcome to {exam.name} prep{firstName ? `, ${firstName}` : ""}.
          </h2>
          <p className={cn(dbUi.subtitle, "mt-1.5 max-w-xl")}>
            {studyLocked
              ? "Subscribe to unlock the question bank and study tools."
              : "Take your first practice set — we'll track readiness and review here."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {studyLocked ? (
              <Link href={postTrialCheckoutHref()} className={dbUi.primaryBtn}>
                <Lock className="h-3.5 w-3.5" aria-hidden />
                Subscribe to continue studying
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            ) : (
              <Link href={ROUTES.questionBank} className={dbUi.primaryBtn}>
                Start practicing
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            )}
          </div>
        </section>
      ) : (
        <DashboardTodayFocus
          examSlug={examSlug}
          examName={exam.name}
          readinessScore={
            readinessSummary?.overallScore ?? headline.readinessScore
          }
          motivationalMessage={
            readinessSummary
              ? `${readinessSummary.bandLabel} — ${readinessSummary.reason}`
              : headline.motivationalMessage
          }
          dueCount={spacedReview.dueCount}
          topWeakTopic={weakTopics[0]?.name ?? null}
          hasRecent={showRecent}
          studyLocked={studyLocked}
          practiceBandLabel={readinessSummary?.bandLabel}
        />
      )}

      <DashboardViewSections
        examSlug={examSlug}
        weakTopics={weakTopics}
        spacedReview={spacedReview}
        roadmap={roadmap}
        recentTests={recentTests}
        srsInFocus={!isNewUser && spacedReview.dueCount > 0}
        hideRoadmapPreview={Boolean(readinessSummary)}
      />
    </div>
  );
}
