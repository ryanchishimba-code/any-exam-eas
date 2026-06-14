import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { DashboardView } from "@/components/app/DashboardView";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference, resolveExamFieldId } from "@/lib/edtech/exam-preference";
import { getExamScopedStats } from "@/lib/edtech/stats";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Dashboard — Any Exam Easy",
  description: "Your personalized NCLEX, USMLE, NAPLEX, and MPJE study dashboard.",
};

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
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

  const [stats, meta, dashboard] = await Promise.all([
    getExamScopedStats(userId, examSlug),
    getUserEdtechMetadata(userId),
    getStudentDashboardData(userId),
  ]);

  const weakTopics = dashboard.weakTopics
    .filter((t) => t.fieldId === fieldId)
    .slice(0, 6);

  return (
    <DashboardView
      examSlug={examSlug}
      stats={stats}
      headline={{
        readinessScore: dashboard.headline.readinessScore,
        motivationalMessage: dashboard.headline.motivationalMessage,
        trendDelta: dashboard.headline.trendDelta,
      }}
      weakTopics={weakTopics}
      recentTests={dashboard.recentTests}
      userName={userName}
      mpjeStateCode={meta.mpjeStateCode}
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
