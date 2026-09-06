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
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";
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

  const [dashboard, profile] = await Promise.all([
    getStudentDashboardData(userId, [fieldId]),
    getLearningProfileSnapshot(userId),
  ]);

  return (
    <ProUpgradeGate feature="advanced_analytics" callbackPath={ROUTES.pricing}>
      <StudentAnalyticsDashboard
        examSlug={examSlug}
        examName={examName}
        initialData={{ dashboard, profile }}
      />
    </ProUpgradeGate>
  );
}

export default async function AnalyticsPage() {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.analytics)}`);
  }

  await requirePremiumPage(ROUTES.analytics);
  const pref = await getUserExamPreference(session.user.id);
  if (!pref) redirect(ROUTES.selectExam);

  return (
    <div className={studyUi.page}>
      <Suspense fallback={<AnalyticsSkeleton />} key={pref.examSlug}>
        <AnalyticsContent userId={session.user.id} examSlug={pref.examSlug} />
      </Suspense>
    </div>
  );
}
