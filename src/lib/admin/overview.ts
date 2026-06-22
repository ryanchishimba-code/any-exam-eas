import { getConversionsDashboard } from "@/lib/analytics/conversions";
import { CONVERSION_EVENTS } from "@/lib/analytics/conversion-types";
import type { ConversionsDashboardData } from "@/lib/analytics/conversion-types";
import { getPortalOverview, type PortalOverview } from "@/lib/internal/overview";

export type AdminDashboardData = {
  overview: PortalOverview;
  conversions: ConversionsDashboardData;
  /** Set when one or more data sources failed; the dashboard still renders with zeros. */
  fetchError?: string;
};

function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

/** Zero-value fallback so the dashboard renders even when the DB is unreachable. */
function emptyPortalOverview(): PortalOverview {
  return {
    totalUsers: 0,
    activeSubscribers: 0,
    activeTrials: 0,
    openFeedback: 0,
    activeToday: 0,
    recentSignups: 0,
    studyToolUsage: [],
    avgQuizScore: null,
    traffic: {
      pageViewsToday: 0,
      uniqueVisitorsToday: 0,
      pageViews7d: 0,
      uniqueVisitors7d: 0,
      signups7d: 0,
      viewsToSignupRate: null,
      topPages7d: [],
      trend7d: [],
    },
  };
}

function emptyConversions(from: string, to: string): ConversionsDashboardData {
  const zeroTotals = Object.fromEntries(
    Object.values(CONVERSION_EVENTS).map((name) => [name, 0])
  ) as ConversionsDashboardData["totals"];
  return {
    range: { from, to },
    totals: zeroTotals,
    eventsByDay: [],
    dailyTotals: [],
    ctaBreakdown: [],
    planBreakdown: [],
    recent: [],
  };
}

/**
 * Server-side bundle for the admin overview page (Neon Postgres).
 *
 * Each data source is fetched independently and falls back to an empty
 * result on error — the dashboard will still render with zeros rather than
 * crashing.  The Next.js error.tsx boundary is the last-resort fallback for
 * any truly unexpected error.
 *
 * Security: called only inside AdminStaffGate which re-queries the DB for
 * the current session role — this function itself does not re-check auth
 * because the gate handles that before the page is rendered.
 *
 * Extending: add additional parallel fetches inside the Promise.allSettled
 * call and expose them on AdminDashboardData.
 */
export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const from = daysAgo(7);
  const to = daysAgo(0);

  const [overviewResult, conversionsResult] = await Promise.allSettled([
    getPortalOverview(),
    getConversionsDashboard(from, to),
  ]);

  const errors: string[] = [];

  const overview =
    overviewResult.status === "fulfilled"
      ? overviewResult.value
      : (errors.push(`overview: ${(overviewResult.reason as Error)?.message ?? "unknown"}`),
        emptyPortalOverview());

  const conversions =
    conversionsResult.status === "fulfilled"
      ? conversionsResult.value
      : (errors.push(`conversions: ${(conversionsResult.reason as Error)?.message ?? "unknown"}`),
        emptyConversions(from, to));

  // Log server-side only — never expose DB errors to the client response.
  if (errors.length > 0) {
    console.error("[getAdminDashboardData] partial failure:", errors.join("; "));
  }

  return {
    overview,
    conversions,
    fetchError: errors.length > 0 ? "Some data sources failed to load." : undefined,
  };
}
