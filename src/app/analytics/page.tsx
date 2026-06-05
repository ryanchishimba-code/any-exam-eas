import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { PerformanceAnalytics } from "@/components/analytics/PerformanceAnalytics";
import { listUserExamSessions } from "@/lib/exam-sessions/service";
import { getDashboardQuickStats } from "@/lib/dashboard/stats";

export const metadata = {
  title: "Analytics — Any Exam Easy",
};

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/analytics");

  await requirePremiumPage("/analytics");

  let stats = {
    questionsAnswered: 0,
    accuracyPercent: null as number | null,
    streakDays: 0,
    weakAreas: [] as { topic: string; weight: number }[],
  };
  let sessions: Awaited<ReturnType<typeof listUserExamSessions>> = [];

  try {
    [stats, sessions] = await Promise.all([
      getDashboardQuickStats(session.user.id),
      listUserExamSessions(session.user.id, undefined, 50),
    ]);
  } catch {
    /* fallback empty */
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-[var(--page-top)]">
        <h1 className="apple-display text-3xl">Performance analytics</h1>
        <p className="mt-2 text-slate-600">
          Accuracy trends, weak topics, and session history from Neon.
        </p>
        <PerformanceAnalytics stats={stats} sessions={sessions} />
      </div>
    </div>
  );
}
