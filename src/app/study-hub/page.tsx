import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserAccess } from "@/lib/access-control";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";
import { DashboardClient } from "@/components/DashboardClient";
import { StudyHubDashboard } from "@/components/edtech/StudyHubDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { getExamScopedStats } from "@/lib/edtech/stats";
import { STUDY_HUB_PATH } from "@/lib/study-hub/config";

export const metadata = {
  title: "Study Hub — Any Exam Easy",
  description: "Personalized NCLEX, USMLE, NAPLEX, and MPJE prep — topics, question bank, and analytics.",
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-4 w-full max-w-lg" />
      <div className="flex gap-3">
        <Skeleton className="h-16 w-28 rounded-xl" />
        <Skeleton className="h-16 w-28 rounded-xl" />
        <Skeleton className="h-16 w-28 rounded-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-44 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

async function StudyHubContent({
  userId,
  userName,
}: {
  userId: string;
  userName?: string | null;
}) {
  const pref = await getUserExamPreference(userId);
  if (!pref) redirect("/onboarding/exam-select");

  const stats = await getExamScopedStats(userId, pref.examSlug);

  return (
    <StudyHubDashboard examSlug={pref.examSlug} stats={stats} userName={userName} />
  );
}

export default async function StudyHubPage() {
  const session = await auth();
  if (!session?.user?.id) redirect(`/auth/login?callbackUrl=${STUDY_HUB_PATH}`);

  await requirePremiumPage(STUDY_HUB_PATH);
  const access = await getUserAccess(session.user.id);
  const hasPremiumAccess = access.hasPremiumAccess;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-[var(--page-top)]">
        {!hasPremiumAccess && <SubscriptionBanner access={access.subscription} />}
        <Suspense fallback={<DashboardSkeleton />}>
          <StudyHubContent userId={session.user.id} userName={session.user.name} />
        </Suspense>
        {!hasPremiumAccess && <DashboardClient access={access.subscription} compact />}
      </div>
    </div>
  );
}
