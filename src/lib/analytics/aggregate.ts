import { prisma } from "@/lib/prisma";
import { getBillingMetrics } from "@/lib/analytics/billing-metrics";
import { estimateMrr } from "@/lib/billing-config";

function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/** Roll up yesterday's events into AnalyticsDailySummary (cron-safe). */
export async function rollupDailySummaries(forDate?: string): Promise<number> {
  const date = forDate ?? dayKey(daysAgo(1));
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(`${date}T23:59:59.999Z`);

  const [
    dau,
    registrations,
    logins,
    generations,
    failedGenerations,
  ] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["userId"],
      where: {
        createdAt: { gte: start, lte: end },
        userId: { not: null },
      },
    }),
    prisma.analyticsEvent.count({
      where: { eventType: "USER_REGISTERED", createdAt: { gte: start, lte: end } },
    }),
    prisma.analyticsEvent.count({
      where: { eventType: "USER_LOGIN", createdAt: { gte: start, lte: end } },
    }),
    prisma.analyticsEvent.count({
      where: { eventType: "QUESTION_GENERATED", createdAt: { gte: start, lte: end } },
    }),
    prisma.analyticsEvent.count({
      where: {
        eventType: "QUESTION_GENERATION_FAILED",
        createdAt: { gte: start, lte: end },
      },
    }),
  ]);

  const metrics: { key: string; value: number; dimensions?: string }[] = [
    { key: "dau", value: dau.length },
    { key: "registrations", value: registrations },
    { key: "logins", value: logins },
    { key: "generations", value: generations },
    { key: "failed_generations", value: failedGenerations },
  ];

  for (const m of metrics) {
    await prisma.analyticsDailySummary.upsert({
      where: {
        date_metricKey_dimensions: {
          date,
          metricKey: m.key,
          dimensions: m.dimensions ?? "",
        },
      },
      create: {
        date,
        metricKey: m.key,
        metricValue: m.value,
        dimensions: m.dimensions ?? "",
      },
      update: { metricValue: m.value },
    });
  }

  return metrics.length;
}

export type PlatformOverview = {
  totalUsers: number;
  activeToday: number;
  activeMonth: number;
  generationsToday: number;
  generationsMonth: number;
  trialsActive: number;
  paidActive: number;
  signupsToday: number;
  dailyTrend: { date: string; dau: number; generations: number }[];
  subjectPopularity: { field: string; count: number }[];
  difficultyDistribution: { difficulty: string; count: number }[];
  billing: {
    activeSubscribers: number;
    activeTrials: number;
    trialExpired: number;
    pastDue: number;
    churnedLast30d: number;
    estimatedMrr: number;
    avgQuizScore: number | null;
    examCompletions: number;
  };
};

export async function getPlatformOverview(days = 14): Promise<PlatformOverview> {
  const since = daysAgo(days);
  const todayStart = daysAgo(0);
  const monthStart = daysAgo(30);

  const [
    totalUsers,
    activeToday,
    activeMonth,
    generationsToday,
    generationsMonth,
    trialsActive,
    paidActive,
    signupsToday,
    dailySummaries,
    subjectGroups,
    difficultyGroups,
    billing,
  ] = await Promise.all([
    prisma.user.count({ where: { accountStatus: "active" } }),
    prisma.user.count({
      where: { lastActiveAt: { gte: todayStart }, accountStatus: "active" },
    }),
    prisma.user.count({
      where: { lastActiveAt: { gte: monthStart }, accountStatus: "active" },
    }),
    prisma.generationHistory.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.generationHistory.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.subscription.count({ where: { status: "trialing" } }),
    prisma.subscription.count({
      where: { status: { in: ["active", "trialing"] }, stripeSubscriptionId: { not: null } },
    }),
    prisma.analyticsEvent.count({
      where: { eventType: "USER_REGISTERED", createdAt: { gte: todayStart } },
    }),
    prisma.analyticsDailySummary.findMany({
      where: { date: { gte: dayKey(since) } },
      orderBy: { date: "asc" },
    }),
    prisma.generationHistory.groupBy({
      by: ["field"],
      where: { createdAt: { gte: monthStart }, status: "success" },
      _count: { field: true },
      orderBy: { _count: { field: "desc" } },
      take: 10,
    }),
    prisma.generationHistory.groupBy({
      by: ["difficulty"],
      where: { createdAt: { gte: monthStart } },
      _count: { difficulty: true },
    }),
    getBillingMetrics(monthStart, new Date()),
  ]);

  const byDate = new Map<string, { dau: number; generations: number }>();
  for (const row of dailySummaries) {
    if (!byDate.has(row.date)) byDate.set(row.date, { dau: 0, generations: 0 });
    const entry = byDate.get(row.date)!;
    if (row.metricKey === "dau") entry.dau = row.metricValue;
    if (row.metricKey === "generations") entry.generations = row.metricValue;
  }

  const dailyTrend = Array.from(byDate.entries())
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalUsers,
    activeToday,
    activeMonth,
    generationsToday,
    generationsMonth,
    trialsActive,
    paidActive,
    signupsToday,
    dailyTrend,
    subjectPopularity: subjectGroups.map((g) => ({
      field: g.field,
      count: g._count.field,
    })),
    difficultyDistribution: difficultyGroups.map((g) => ({
      difficulty: g.difficulty,
      count: g._count.difficulty,
    })),
    billing: {
      activeSubscribers: billing.activeSubscribers,
      activeTrials: billing.activeTrials,
      trialExpired: billing.trialExpired,
      pastDue: billing.pastDue,
      churnedLast30d: billing.churnedLast30d,
      estimatedMrr: estimateMrr(billing.activeSubscribers, billing.activeTrials),
      avgQuizScore: billing.avgQuizScore,
      examCompletions: billing.examCompletions,
    },
  };
}
