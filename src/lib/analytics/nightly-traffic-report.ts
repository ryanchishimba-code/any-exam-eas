/**
 * Nightly traffic digest — yesterday (UTC) visitors, trials, signups, sources.
 */

import { prisma } from "@/lib/prisma";
import { CONVERSION_EVENTS } from "@/lib/analytics/conversion-types";
import { EVENT_TYPES } from "@/lib/analytics/types";
import {
  aggregatePageViewEvents,
  type WebTrafficMetrics,
} from "@/lib/analytics/web-traffic";

export type NightlyTrafficReport = {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  anonymousPageViews: number;
  authenticatedPageViews: number;
  bounceRate: number;
  newSignups: number;
  newTrials: number;
  trialStartedEvents: number;
  logins: number;
  checkouts: number;
  activeTrialsNow: number;
  paidActiveNow: number;
  topPages: { path: string; views: number; avgDurationSec: number }[];
  topReferrers: { source: string; views: number }[];
  /** Prior-day unique visitors for simple MoM-style delta. */
  priorDayUniqueVisitors: number;
  priorDaySignups: number;
  priorDayTrials: number;
};

function utcDayBounds(dateKey: string): { start: Date; end: Date } {
  return {
    start: new Date(`${dateKey}T00:00:00.000Z`),
    end: new Date(`${dateKey}T23:59:59.999Z`),
  };
}

function dayKeyOffset(fromKey: string, days: number): string {
  const d = new Date(`${fromKey}T12:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Default: yesterday UTC (matches analytics-rollup). */
export function defaultReportDateKey(now = new Date()): string {
  const d = new Date(now);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

async function countConversions(
  eventName: string,
  start: Date,
  end: Date
): Promise<number> {
  return prisma.conversionEvent.count({
    where: { eventName, createdAt: { gte: start, lte: end } },
  });
}

async function countEvents(eventType: string, start: Date, end: Date): Promise<number> {
  return prisma.analyticsEvent.count({
    where: { eventType, createdAt: { gte: start, lte: end } },
  });
}

async function trafficForDay(dateKey: string): Promise<WebTrafficMetrics> {
  const { start, end } = utcDayBounds(dateKey);
  const events = await prisma.analyticsEvent.findMany({
    where: {
      eventType: EVENT_TYPES.PAGE_VIEW,
      createdAt: { gte: start, lte: end },
    },
    select: {
      metadata: true,
      sessionId: true,
      userId: true,
      ipHash: true,
      createdAt: true,
    },
  });
  return aggregatePageViewEvents(events, start, end);
}

export async function buildNightlyTrafficReport(
  dateKey = defaultReportDateKey()
): Promise<NightlyTrafficReport> {
  const priorKey = dayKeyOffset(dateKey, -1);
  const { start, end } = utcDayBounds(dateKey);
  const prior = utcDayBounds(priorKey);

  const [
    traffic,
    priorTraffic,
    newSignups,
    priorDaySignups,
    newTrials,
    priorDayTrials,
    trialStartedEvents,
    logins,
    checkouts,
    activeTrialsNow,
    paidActiveNow,
  ] = await Promise.all([
    trafficForDay(dateKey),
    trafficForDay(priorKey),
    prisma.user.count({
      where: { createdAt: { gte: start, lte: end } },
    }),
    prisma.user.count({
      where: { createdAt: { gte: prior.start, lte: prior.end } },
    }),
    prisma.subscription.count({
      where: {
        status: "trialing",
        createdAt: { gte: start, lte: end },
      },
    }),
    prisma.subscription.count({
      where: {
        status: "trialing",
        createdAt: { gte: prior.start, lte: prior.end },
      },
    }),
    countConversions(CONVERSION_EVENTS.TRIAL_STARTED, start, end),
    countEvents(EVENT_TYPES.USER_LOGIN, start, end),
    countEvents(EVENT_TYPES.BILLING_CHECKOUT, start, end),
    prisma.subscription.count({ where: { status: "trialing" } }),
    prisma.subscription.count({
      where: {
        status: { in: ["active", "trialing"] },
        stripeSubscriptionId: { not: null },
      },
    }),
  ]);

  return {
    date: dateKey,
    pageViews: traffic.totalPageViews,
    uniqueVisitors: traffic.uniqueVisitors,
    anonymousPageViews: traffic.anonymousPageViews,
    authenticatedPageViews: traffic.authenticatedPageViews,
    bounceRate: traffic.bounceRate,
    newSignups,
    newTrials,
    trialStartedEvents,
    logins,
    checkouts,
    activeTrialsNow,
    paidActiveNow,
    topPages: traffic.topPages.slice(0, 8),
    topReferrers: traffic.topReferrers.slice(0, 8),
    priorDayUniqueVisitors: priorTraffic.uniqueVisitors,
    priorDaySignups,
    priorDayTrials,
  };
}

export function deltaLabel(current: number, prior: number): string {
  if (prior === 0) return current === 0 ? "—" : "new";
  const pct = Math.round(((current - prior) / prior) * 100);
  if (pct === 0) return "flat";
  return pct > 0 ? `+${pct}%` : `${pct}%`;
}

/** Recipients — override with NIGHTLY_TRAFFIC_REPORT_TO (comma-separated). */
export function nightlyTrafficReportRecipients(): string[] {
  const raw =
    process.env.NIGHTLY_TRAFFIC_REPORT_TO?.trim() || "ryanchishimba@gmail.com";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.includes("@"));
}
