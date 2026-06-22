import { prisma } from "@/lib/prisma";
import { getFeedbackTrends } from "@/lib/feedback/service";
import { aggregatePageViewEvents } from "./web-traffic";
import { EVENT_TYPES } from "./types";

function parseRange(fromParam?: string | null, toParam?: string | null, days = 30) {
  const to = toParam ? new Date(`${toParam}T23:59:59.999Z`) : new Date();
  const from = fromParam
    ? new Date(`${fromParam}T00:00:00.000Z`)
    : (() => {
        const d = new Date(to);
        d.setUTCDate(d.getUTCDate() - days);
        d.setUTCHours(0, 0, 0, 0);
        return d;
      })();
  return { from, to, fromKey: from.toISOString().slice(0, 10), toKey: to.toISOString().slice(0, 10) };
}

export type AnalyticsDashboardData = {
  range: { from: string; to: string };
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
  totalSessions: number;
  avgSessionDurationSec: number;
  totalPageViews: number;
  uniqueVisitors: number;
  authenticatedPageViews: number;
  anonymousPageViews: number;
  bounceRate: number;
  topPages: { path: string; views: number; avgDurationSec: number }[];
  pageViewsByDay: { date: string; views: number; visitors: number }[];
  topReferrers: { source: string; views: number }[];
  focusAreas: { area: string; interactions: number }[];
  deviceBreakdown: { deviceType: string; count: number }[];
  userGrowth: { date: string; signups: number; cumulative: number }[];
  feedbackTrends: { date: string; count: number; avgRating: number }[];
  feedbackSummary: { total: number; open: number; avgRating: number };
  pageTime: { path: string; totalSeconds: number; views: number }[];
};

export async function getAnalyticsDashboard(
  fromParam?: string | null,
  toParam?: string | null
): Promise<AnalyticsDashboardData> {
  const { from, to, fromKey, toKey } = parseRange(fromParam, toParam, 30);

  const [
    totalUsers,
    activeUsers,
    newUsersInRange,
    sessions,
    pageViewEvents,
    deviceGroups,
    signupEvents,
    allUsersBeforeRange,
    feedbackTrends,
    feedbackAgg,
    generationGroups,
  ] = await Promise.all([
    prisma.user.count({ where: { accountStatus: "active" } }),
    prisma.user.count({
      where: { lastActiveAt: { gte: from, lte: to }, accountStatus: "active" },
    }),
    prisma.user.count({
      where: { createdAt: { gte: from, lte: to }, accountStatus: "active" },
    }),
    prisma.userSession.findMany({
      where: { startedAt: { gte: from, lte: to } },
      select: { startedAt: true, lastSeenAt: true, endedAt: true },
    }),
    prisma.analyticsEvent.findMany({
      where: {
        eventType: EVENT_TYPES.PAGE_VIEW,
        createdAt: { gte: from, lte: to },
      },
      select: { metadata: true, sessionId: true, userId: true, ipHash: true, createdAt: true },
    }),
    prisma.deviceHistory.groupBy({
      by: ["deviceType"],
      where: { lastSeenAt: { gte: from, lte: to } },
      _count: { deviceType: true },
    }),
    prisma.analyticsEvent.findMany({
      where: {
        eventType: EVENT_TYPES.USER_REGISTERED,
        createdAt: { gte: from, lte: to },
      },
      select: { createdAt: true },
    }),
    prisma.user.count({
      where: { createdAt: { lt: from }, accountStatus: "active" },
    }),
    getFeedbackTrends(from, to),
    prisma.userFeedback.aggregate({
      where: { createdAt: { gte: from, lte: to } },
      _count: { _all: true },
      _avg: { rating: true },
    }),
    prisma.generationHistory.groupBy({
      by: ["field"],
      where: { createdAt: { gte: from, lte: to }, status: "success" },
      _count: { field: true },
      orderBy: { _count: { field: "desc" } },
      take: 8,
    }),
  ]);

  const openFeedback = await prisma.userFeedback.count({
    where: { status: "open", createdAt: { gte: from, lte: to } },
  });

  const sessionDurations = sessions.map((s) => {
    const end = s.endedAt ?? s.lastSeenAt;
    return Math.max(0, (end.getTime() - s.startedAt.getTime()) / 1000);
  });
  const avgSessionDurationSec =
    sessionDurations.length > 0
      ? Math.round(
          sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
        )
      : 0;

  const webTraffic = aggregatePageViewEvents(pageViewEvents, from, to);

  const signupsByDay = new Map<string, number>();
  for (const e of signupEvents) {
    const d = e.createdAt.toISOString().slice(0, 10);
    signupsByDay.set(d, (signupsByDay.get(d) ?? 0) + 1);
  }

  let cumulative = allUsersBeforeRange;
  const userGrowth: { date: string; signups: number; cumulative: number }[] = [];
  const cursor = new Date(from);
  cursor.setUTCHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setUTCHours(0, 0, 0, 0);
  while (cursor <= end) {
    const key = cursor.toISOString().slice(0, 10);
    const signups = signupsByDay.get(key) ?? 0;
    cumulative += signups;
    userGrowth.push({ date: key, signups, cumulative });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const returningUsers = Math.max(0, activeUsers - newUsersInRange);

  return {
    range: { from: fromKey, to: toKey },
    totalUsers,
    activeUsers,
    newUsers: newUsersInRange,
    returningUsers,
    totalSessions: sessions.length,
    avgSessionDurationSec,
    totalPageViews: webTraffic.totalPageViews,
    uniqueVisitors: webTraffic.uniqueVisitors,
    authenticatedPageViews: webTraffic.authenticatedPageViews,
    anonymousPageViews: webTraffic.anonymousPageViews,
    bounceRate: webTraffic.bounceRate,
    topPages: webTraffic.topPages,
    pageViewsByDay: webTraffic.pageViewsByDay,
    topReferrers: webTraffic.topReferrers,
    focusAreas: generationGroups.map((g) => ({
      area: g.field,
      interactions: g._count.field,
    })),
    deviceBreakdown: deviceGroups.map((d) => ({
      deviceType: d.deviceType ?? "unknown",
      count: d._count.deviceType,
    })),
    userGrowth,
    feedbackTrends,
    feedbackSummary: {
      total: feedbackAgg._count._all,
      open: openFeedback,
      avgRating: Math.round((feedbackAgg._avg.rating ?? 0) * 10) / 10,
    },
    pageTime: webTraffic.pageTime,
  };
}

export function dashboardToCsv(data: AnalyticsDashboardData): string {
  const lines: string[] = [
    "section,key,value",
    "summary,total_users," + data.totalUsers,
    "summary,active_users," + data.activeUsers,
    "summary,new_users," + data.newUsers,
    "summary,returning_users," + data.returningUsers,
    "summary,total_sessions," + data.totalSessions,
    "summary,avg_session_duration_sec," + data.avgSessionDurationSec,
    "summary,bounce_rate_pct," + data.bounceRate,
    "summary,total_page_views," + data.totalPageViews,
    "summary,unique_visitors," + data.uniqueVisitors,
    "summary,authenticated_page_views," + data.authenticatedPageViews,
    "summary,anonymous_page_views," + data.anonymousPageViews,
    "summary,feedback_total," + data.feedbackSummary.total,
    "summary,feedback_open," + data.feedbackSummary.open,
    "summary,feedback_avg_rating," + data.feedbackSummary.avgRating,
  ];

  for (const p of data.topPages) {
    lines.push(`top_pages,${escapeCsv(p.path)},${p.views}`);
  }
  for (const r of data.topReferrers) {
    lines.push(`top_referrers,${escapeCsv(r.source)},${r.views}`);
  }
  for (const d of data.deviceBreakdown) {
    lines.push(`devices,${escapeCsv(d.deviceType)},${d.count}`);
  }
  for (const g of data.userGrowth) {
    lines.push(`user_growth,${g.date},${g.signups}`);
  }
  for (const f of data.feedbackTrends) {
    lines.push(`feedback,${f.date},${f.count}`);
  }

  return lines.join("\n");
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
