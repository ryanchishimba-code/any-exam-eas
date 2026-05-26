import { prisma } from "@/lib/prisma";
import { getBillingMetrics } from "@/lib/analytics/billing-metrics";

export type PortalOverview = {
  totalUsers: number;
  activeSubscribers: number;
  activeTrials: number;
  openFeedback: number;
  activeToday: number;
  recentSignups: number;
  studyToolUsage: { tool: string; count: number }[];
  avgQuizScore: number | null;
};

export async function getPortalOverview(): Promise<PortalOverview> {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const weekAgo = new Date(todayStart);
  weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);

  const [billing, openFeedback, activeToday, recentSignups] = await Promise.all([
    getBillingMetrics(weekAgo, new Date()),
    prisma.userFeedback.count({ where: { status: "open" } }),
    prisma.user.count({
      where: { lastActiveAt: { gte: todayStart }, accountStatus: "active" },
    }),
    prisma.user.count({
      where: { createdAt: { gte: weekAgo }, accountStatus: "active" },
    }),
  ]);

  return {
    totalUsers: billing.totalRegistered,
    activeSubscribers: billing.activeSubscribers,
    activeTrials: billing.activeTrials,
    openFeedback,
    activeToday,
    recentSignups,
    studyToolUsage: billing.studyToolUsage,
    avgQuizScore: billing.avgQuizScore,
  };
}
