import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { requireAppPage } from "@/lib/require-premium-page";
import { getStudyUsageSnapshot } from "@/lib/study/usage-limits";
import { resolveDashboardUpgradeContext } from "@/lib/dashboard/upgrade-banner";
import type { UserAccess } from "@/lib/access-control";
import { DashboardPageContent } from "@/components/app/DashboardPageContent";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference, resolveExamFieldId } from "@/lib/edtech/exam-preference";
import { getUserEdtechMetadata, getExamTestDate } from "@/lib/edtech/user-metadata";
import { getExamScopedStats } from "@/lib/edtech/stats";
import { getExamRoadmapData } from "@/lib/learning/exam-roadmap";
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Dashboard — Any Exam Easy",
  description: "Your personalized NCLEX, USMLE, NAPLEX, and PANCE study dashboard.",
};

/** Neon cold starts + parallel dashboard queries can exceed the default 10s on Vercel. */
export const maxDuration = 60;

function DashboardSkeleton() {
  return (
    <div className="dashboard-ui mx-auto w-full min-w-0 max-w-5xl space-y-5 pb-10">
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-36 w-full rounded-2xl" />
      <Skeleton className="h-48 w-full rounded-2xl" />
    </div>
  );
}

async function DashboardContent({
  userId,
  userName,
  access,
}: {
  userId: string;
  userName?: string | null;
  access: UserAccess;
}) {
  const pref = await getUserExamPreference(userId);
  if (!pref) redirect(ROUTES.selectExam);

  const examSlug = pref.examSlug;
  const fieldId = resolveExamFieldId(examSlug);

  const [stats, dashboard, roadmap, metadata, usage] = await Promise.all([
    getExamScopedStats(userId, examSlug),
    getStudentDashboardData(userId),
    getExamRoadmapData(userId, examSlug),
    getUserEdtechMetadata(userId),
    getStudyUsageSnapshot(access),
  ]);

  const testDate = getExamTestDate(metadata, examSlug);

  const weakTopics = dashboard.weakTopics
    .filter((t) => t.fieldId === fieldId)
    .slice(0, 6);

  return (
    <DashboardPageContent
      examSlug={examSlug}
      stats={stats}
      headline={{
        readinessScore: dashboard.headline.readinessScore,
        motivationalMessage: dashboard.headline.motivationalMessage,
        trendDelta: dashboard.headline.trendDelta,
      }}
      weakTopics={weakTopics}
      spacedReview={dashboard.spacedReview}
      roadmap={roadmap}
      recentTests={dashboard.recentTests}
      userName={userName}
      testDate={testDate}
      hasPremiumAccess={access.hasPremiumAccess}
      upgrade={resolveDashboardUpgradeContext(access, usage)}
    />
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.dashboard)}`);
  }

  const access = await requireAppPage(ROUTES.dashboard);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent userId={session.user.id} userName={session.user.name} access={access} />
    </Suspense>
  );
}
