import { prisma } from "@/lib/prisma";

export type BillingMetrics = {
  totalRegistered: number;
  activeSubscribers: number;
  activeTrials: number;
  trialExpired: number;
  pastDue: number;
  trialToPaidConversions: number;
  churnedLast30d: number;
  studyToolUsage: { tool: string; count: number }[];
  avgQuizScore: number | null;
  examCompletions: number;
};

export async function getBillingMetrics(from: Date, to: Date): Promise<BillingMetrics> {
  const [
    totalRegistered,
    activeSubscribers,
    activeTrials,
    trialExpired,
    pastDue,
    conversions,
    churnedLast30d,
    generationByField,
    progressAgg,
    examCompletions,
  ] = await Promise.all([
    prisma.user.count({ where: { accountStatus: "active" } }),
    prisma.subscription.count({ where: { status: "active" } }),
    prisma.subscription.count({ where: { status: "trialing" } }),
    prisma.subscription.count({ where: { status: "trial_expired" } }),
    prisma.subscription.count({ where: { status: "past_due" } }),
    prisma.analyticsEvent.count({
      where: {
        eventType: "BILLING_CHECKOUT",
        createdAt: { gte: from, lte: to },
      },
    }),
    prisma.subscription.count({
      where: {
        status: { in: ["canceled", "trial_expired"] },
        updatedAt: { gte: from, lte: to },
      },
    }),
    prisma.generationHistory.groupBy({
      by: ["field"],
      where: { createdAt: { gte: from, lte: to }, status: "success" },
      _count: { field: true },
      orderBy: { _count: { field: "desc" } },
      take: 6,
    }),
    prisma.progressRecord.aggregate({
      where: { createdAt: { gte: from, lte: to }, score: { not: null } },
      _avg: { score: true },
      _count: { _all: true },
    }),
    prisma.progressRecord.count({
      where: {
        createdAt: { gte: from, lte: to },
        entityType: "exam",
        completed: true,
      },
    }),
  ]);

  return {
    totalRegistered,
    activeSubscribers,
    activeTrials,
    trialExpired,
    pastDue,
    trialToPaidConversions: conversions,
    churnedLast30d,
    studyToolUsage: generationByField.map((g) => ({
      tool: g.field,
      count: g._count.field,
    })),
    avgQuizScore: progressAgg._avg.score
      ? Math.round(progressAgg._avg.score * 10) / 10
      : null,
    examCompletions,
  };
}
