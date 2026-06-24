import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { requirePremiumPage } from "@/lib/require-premium-page";
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

function DashboardSkeleton() {
  return (
    <div className="w-full space-y-4">
      <Skeleton className="h-20 w-full rounded-[18px]" />
      <Skeleton className="h-[28rem] w-full rounded-[28px]" />
    </div>
  );
}

async function DashboardContent({
  userId,
  userName,
}: {
  userId: string;
  userName?: string | null;
}) {
  const pref = await getUserExamPreference(userId);
  if (!pref) redirect(ROUTES.selectExam);

  const examSlug = pref.examSlug;
  const fieldId = resolveExamFieldId(examSlug);

  const [stats, dashboard, roadmap, metadata] = await Promise.all([
    getExamScopedStats(userId, examSlug),
    getStudentDashboardData(userId),
    getExamRoadmapData(userId, examSlug),
    getUserEdtechMetadata(userId),
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
    />
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.dashboard)}`);
  }

  await requirePremiumPage(ROUTES.dashboard);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent userId={session.user.id} userName={session.user.name} />
    </Suspense>
  );
}
