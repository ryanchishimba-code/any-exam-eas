import { NextResponse } from "next/server";
import { rollupDailySummaries } from "@/lib/analytics/aggregate";
import { isCronAuthorized } from "@/lib/cron-auth";

export const maxDuration = 120;
export const runtime = "nodejs";

/** Daily — roll up yesterday's AnalyticsEvent rows into AnalyticsDailySummary. */
export async function GET(req: Request) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const count = await rollupDailySummaries();
  return NextResponse.json({ ok: true, metricsWritten: count });
}
