import { prisma } from "@/lib/prisma";
import { EVENT_TYPES } from "./types";

export type PageViewRow = {
  metadata: string | null;
  sessionId: string | null;
  userId: string | null;
  ipHash: string | null;
  createdAt: Date;
};

export type WebTrafficMetrics = {
  totalPageViews: number;
  uniqueVisitors: number;
  authenticatedPageViews: number;
  anonymousPageViews: number;
  bounceRate: number;
  topPages: { path: string; views: number; avgDurationSec: number }[];
  pageTime: { path: string; totalSeconds: number; views: number }[];
  pageViewsByDay: { date: string; views: number; visitors: number }[];
  topReferrers: { source: string; views: number }[];
};

export type WebTrafficSnapshot = {
  pageViewsToday: number;
  uniqueVisitorsToday: number;
  pageViews7d: number;
  uniqueVisitors7d: number;
  signups7d: number;
  viewsToSignupRate: number | null;
  topPages7d: { path: string; views: number }[];
  trend7d: { date: string; views: number; visitors: number }[];
};

function safeJsonMeta(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Normalize referrer URLs into readable traffic sources. */
export function normalizeReferrer(raw: unknown): string {
  const ref = String(raw ?? "").trim();
  if (!ref) return "Direct / none";
  try {
    const u = new URL(ref);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "anyexameasy.com" || host.endsWith(".anyexameasy.com")) return "Same site";
    if (host.includes("google.")) return "Google";
    if (host.includes("bing.")) return "Bing";
    if (host.includes("facebook.") || host === "l.facebook.com") return "Facebook";
    if (host.includes("instagram.")) return "Instagram";
    if (host.includes("linkedin.")) return "LinkedIn";
    if (host === "t.co" || host.includes("twitter.") || host.includes("x.com")) return "X / Twitter";
    return host;
  } catch {
    return ref.length > 60 ? `${ref.slice(0, 57)}…` : ref;
  }
}

export function visitorKey(ev: PageViewRow): string {
  if (ev.sessionId) return `s:${ev.sessionId}`;
  if (ev.userId) return `u:${ev.userId}`;
  if (ev.ipHash) return `ip:${ev.ipHash}`;
  return `e:${ev.createdAt.toISOString()}`;
}

export function aggregatePageViewEvents(
  events: PageViewRow[],
  from: Date,
  to: Date
): WebTrafficMetrics {
  const viewsBySession = new Map<string, number>();
  const visitorsByDay = new Map<string, Set<string>>();
  const viewsByDay = new Map<string, number>();
  const pageStats = new Map<string, { views: number; durationSum: number }>();
  const referrerStats = new Map<string, number>();
  let authenticatedPageViews = 0;
  let anonymousPageViews = 0;
  const allVisitors = new Set<string>();

  for (const ev of events) {
    const meta = safeJsonMeta(ev.metadata);
    const path = String(meta.path ?? "/unknown");
    const durationSec = Number(meta.durationSec ?? 0);
    const visitor = visitorKey(ev);

    allVisitors.add(visitor);

    if (ev.userId) authenticatedPageViews += 1;
    else anonymousPageViews += 1;

    const entry = pageStats.get(path) ?? { views: 0, durationSum: 0 };
    entry.views += 1;
    entry.durationSum += Number.isFinite(durationSec) ? durationSec : 0;
    pageStats.set(path, entry);

    viewsBySession.set(visitor, (viewsBySession.get(visitor) ?? 0) + 1);

    const day = ev.createdAt.toISOString().slice(0, 10);
    viewsByDay.set(day, (viewsByDay.get(day) ?? 0) + 1);
    const dayVisitors = visitorsByDay.get(day) ?? new Set<string>();
    dayVisitors.add(visitor);
    visitorsByDay.set(day, dayVisitors);

    const source = normalizeReferrer(meta.referrer);
    referrerStats.set(source, (referrerStats.get(source) ?? 0) + 1);
  }

  const bouncedSessions = Array.from(viewsBySession.values()).filter((c) => c <= 1).length;
  const bounceRate =
    viewsBySession.size > 0
      ? Math.round((bouncedSessions / viewsBySession.size) * 1000) / 10
      : 0;

  const topPages = Array.from(pageStats.entries())
    .map(([path, v]) => ({
      path,
      views: v.views,
      avgDurationSec: v.views ? Math.round(v.durationSum / v.views) : 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 12);

  const pageViewsByDay: WebTrafficMetrics["pageViewsByDay"] = [];
  const cursor = new Date(from);
  cursor.setUTCHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setUTCHours(0, 0, 0, 0);
  while (cursor <= end) {
    const key = cursor.toISOString().slice(0, 10);
    pageViewsByDay.push({
      date: key,
      views: viewsByDay.get(key) ?? 0,
      visitors: visitorsByDay.get(key)?.size ?? 0,
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const topReferrers = Array.from(referrerStats.entries())
    .map(([source, views]) => ({ source, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return {
    totalPageViews: events.length,
    uniqueVisitors: allVisitors.size,
    authenticatedPageViews,
    anonymousPageViews,
    bounceRate,
    topPages,
    pageTime: topPages.map((p) => ({
      path: p.path,
      totalSeconds: p.avgDurationSec * p.views,
      views: p.views,
    })),
    pageViewsByDay,
    topReferrers,
  };
}

async function fetchPageViews(from: Date, to: Date): Promise<PageViewRow[]> {
  return prisma.analyticsEvent.findMany({
    where: {
      eventType: EVENT_TYPES.PAGE_VIEW,
      createdAt: { gte: from, lte: to },
    },
    select: {
      metadata: true,
      sessionId: true,
      userId: true,
      ipHash: true,
      createdAt: true,
    },
  });
}

export async function getWebTrafficMetrics(from: Date, to: Date): Promise<WebTrafficMetrics> {
  const events = await fetchPageViews(from, to);
  return aggregatePageViewEvents(events, from, to);
}

export async function getWebTrafficSnapshot(): Promise<WebTrafficSnapshot> {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const weekAgo = new Date(todayStart);
  weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);
  const now = new Date();

  const [todayEvents, weekEvents, signups7d] = await Promise.all([
    fetchPageViews(todayStart, now),
    fetchPageViews(weekAgo, now),
    prisma.user.count({
      where: { createdAt: { gte: weekAgo }, accountStatus: "active" },
    }),
  ]);

  const today = aggregatePageViewEvents(todayEvents, todayStart, now);
  const week = aggregatePageViewEvents(weekEvents, weekAgo, now);

  const viewsToSignupRate =
    week.totalPageViews > 0
      ? Math.round((signups7d / week.totalPageViews) * 10000) / 100
      : null;

  return {
    pageViewsToday: today.totalPageViews,
    uniqueVisitorsToday: today.uniqueVisitors,
    pageViews7d: week.totalPageViews,
    uniqueVisitors7d: week.uniqueVisitors,
    signups7d,
    viewsToSignupRate,
    topPages7d: week.topPages.slice(0, 6),
    trend7d: week.pageViewsByDay,
  };
}
