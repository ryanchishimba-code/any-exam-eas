import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserAccess } from "@/lib/access-control";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { DashboardClient } from "@/components/DashboardClient";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout";
import { ExamSelectorCards } from "@/components/dashboard/ExamSelectorCards";
import { QuickStatsCards } from "@/components/dashboard/QuickStatsCards";
import { getDashboardQuickStats } from "@/lib/dashboard/stats";

export const metadata = {
  title: "Dashboard — Any Exam Easy",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");

  await requirePremiumPage("/dashboard");
  const access = await getUserAccess(session.user.id);
  const hasPremiumAccess = access.hasPremiumAccess;

  let quickStats = {
    questionsAnswered: 0,
    accuracyPercent: null as number | null,
    streakDays: 0,
    weakAreas: [] as { topic: string; weight: number }[],
  };
  try {
    quickStats = await getDashboardQuickStats(session.user.id);
  } catch {
    /* Drizzle unavailable — dashboard still renders */
  }

  return (
    <DashboardPageLayout userName={session.user.name} hasPremiumAccess={hasPremiumAccess}>
      {!hasPremiumAccess && <SubscriptionBanner access={access.subscription} />}
      <div className="mt-8 space-y-8">
        <QuickStatsCards stats={quickStats} />
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Choose your exam</h2>
          <p className="mt-1 text-sm text-slate-600">
            NCLEX, USMLE, NAPLEX, and Top 500 — one adaptive engine.
          </p>
          <div className="mt-4">
            <ExamSelectorCards />
          </div>
        </section>
        <StudentDashboard />
      </div>
      {!hasPremiumAccess && <DashboardClient access={access.subscription} compact />}
    </DashboardPageLayout>
  );
}
