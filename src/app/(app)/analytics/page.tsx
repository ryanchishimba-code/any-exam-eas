import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { ProUpgradeGate } from "@/components/ProUpgradeGate";
import { StudentAnalyticsDashboard } from "@/components/analytics/StudentAnalyticsDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { getUserExamPreference, resolveExamFieldId } from "@/lib/edtech/exam-preference";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getLearningProfileSnapshot } from "@/lib/learning/profile-service";
import { getExamRoadmapData } from "@/lib/learning/exam-roadmap";
import { buildDashboardExamDayPlan } from "@/lib/learning/dashboard-exam-day-plan";
import { loadCoverageInventory } from "@/lib/learning/load-coverage-heatmap";
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";
import { ReadinessProofPanel } from "@/components/dashboard/ReadinessProofPanel";
import { studyUi } from "@/lib/study/study-ui";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

export const metadata = {
  title: "Analytics — Any Exam Easy",
  description: "Track readiness, weak topics, and accuracy trends across your board exam.",
};

export const maxDuration = 60;

function AnalyticsSkeleton() {
  return (
    <div className={studyUi.page} aria-busy="true" aria-label="Loading analytics">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-9 w-48 max-w-full rounded-xl" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="mt-4 h-80 w-full rounded-[28px]" />
    </div>
  );
}

async function AnalyticsContent({
  userId,
  examSlug,
}: {
  userId: string;
  examSlug: ExamSlug;
}) {
  const examName = EXAM_CATALOG[examSlug].shortName;
  const fieldId = resolveExamFieldId(examSlug);

  const [dashboard, profile, roadmap, inventory] = await Promise.all([
    getStudentDashboardData(userId, [fieldId]),
    getLearningProfileSnapshot(userId),
    getExamRoadmapData(userId, examSlug, {
      usmleFieldId: examSlug === "usmle" ? fieldId : undefined,
    }).catch(() => null),
    loadCoverageInventory(fieldId).catch(() => null),
  ]);

  const examDayPlan = buildDashboardExamDayPlan({
    examSlug,
    fieldId,
    testDate: null,
    totalAttempts: roadmap?.totalAttempts ?? dashboard.headline.totalAttempts,
    recentAccuracyPct: dashboard.headline.overallAccuracy ?? 0,
    openIncorrect: roadmap ? roadmap.openIncorrectCount : null,
    questionsToday: 0,
    roadmap,
    inventoryCategories: inventory?.categories ?? null,
    topicQuestionTotal: inventory?.topicQuestionTotal ?? null,
  });

  return (
    <ProUpgradeGate feature="advanced_analytics" callbackPath={ROUTES.pricing}>
      <div className="flex flex-col gap-4 sm:block sm:space-y-8">
        <div className="order-2 sm:order-none">
          <ReadinessProofPanel
            readiness={examDayPlan.readiness}
            domainsLabel={examDayPlan.coverage.domainsLabel}
            coverage={examDayPlan.coverage}
          />
        </div>
        <div className="order-1 sm:order-none">
          <StudentAnalyticsDashboard
            examSlug={examSlug}
            examName={examName}
            fieldId={fieldId}
            openRemediation={roadmap?.openRemediation ?? null}
            initialData={{ dashboard, profile }}
          />
        </div>
      </div>
    </ProUpgradeGate>
  );
}

export default async function AnalyticsPage() {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.analytics)}`);
  }

  // Independent — the preference read never consults the access result.
  const [, pref] = await Promise.all([
    requirePremiumPage(ROUTES.analytics),
    getUserExamPreference(session.user.id),
  ]);
  if (!pref) redirect(ROUTES.selectExam);

  return (
    <div className={studyUi.page}>
      <Suspense fallback={<AnalyticsSkeleton />} key={pref.examSlug}>
        <AnalyticsContent userId={session.user.id} examSlug={pref.examSlug} />
      </Suspense>
    </div>
  );
}
