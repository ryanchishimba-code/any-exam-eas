import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { DashboardView } from "@/components/app/DashboardView";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { getExamScopedStats } from "@/lib/edtech/stats";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Dashboard — Any Exam Easy",
  description: "Your personalized NCLEX, USMLE, NAPLEX, and MPJE study dashboard.",
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 w-full rounded-3xl" />
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-52 w-full rounded-2xl" />
        ))}
      </div>
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

  const [stats, meta] = await Promise.all([
    getExamScopedStats(userId, pref.examSlug),
    getUserEdtechMetadata(userId),
  ]);

  return (
    <DashboardView
      examSlug={pref.examSlug}
      stats={stats}
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
