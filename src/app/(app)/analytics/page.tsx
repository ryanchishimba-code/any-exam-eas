import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { PremiumGate } from "@/components/PremiumGate";
import { ProUpgradeGate } from "@/components/ProUpgradeGate";
import { StudentAnalyticsDashboard } from "@/components/analytics/StudentAnalyticsDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { getUserExamPreference, resolveExamFieldId } from "@/lib/edtech/exam-preference";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getLearningProfileSnapshot } from "@/lib/learning/profile-service";
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";
import { studyUi } from "@/lib/study/study-ui";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Analytics — Any Exam Easy",
  description: "Track readiness, weak topics, and accuracy trends across your board exam.",
};

function AnalyticsSkeleton() {
  return (
    <div className={studyUi.page}>
      <Skeleton className="h-12 w-64 rounded-xl" />
      <Skeleton className="mt-6 h-80 w-full rounded-[28px]" />
    </div>
  );
}

async function AnalyticsPageInner() {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.analytics)}`);
  }

  await requirePremiumPage(ROUTES.analytics);

  const pref = await getUserExamPreference(session.user.id);
  if (!pref) redirect(ROUTES.selectExam);

  const examSlug = pref.examSlug;
  const examName = EXAM_CATALOG[examSlug].shortName;
  const fieldId = resolveExamFieldId(examSlug);

  const [dashboard, profile] = await Promise.all([
    getStudentDashboardData(session.user.id, [fieldId]),
    getLearningProfileSnapshot(session.user.id),
  ]);

  return (
    <PremiumGate callbackPath={ROUTES.analytics}>
      <ProUpgradeGate feature="advanced_analytics" callbackPath={ROUTES.pricing}>
        <StudentAnalyticsDashboard
          examSlug={examSlug}
          examName={examName}
          initialData={{ dashboard, profile }}
        />
      </ProUpgradeGate>
    </PremiumGate>
  );
}

export default async function AnalyticsPage() {
  return (
    <div className={studyUi.page}>
      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsPageInner />
      </Suspense>
    </div>
  );
}
