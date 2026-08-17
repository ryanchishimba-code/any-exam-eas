import { NextResponse } from "next/server";
import {
  buildNightlyTrafficReport,
  defaultReportDateKey,
  nightlyTrafficReportRecipients,
} from "@/lib/analytics/nightly-traffic-report";
import { sendNightlyTrafficReportEmail } from "@/lib/email/nightly-traffic-report-email";
import { DbUnavailableError, isTransientDbError } from "@/lib/db-resilience";
import { warmNeonCompute } from "@/lib/neon-warmup";

export const maxDuration = 120;
export const runtime = "nodejs";

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;

  const cronHeader = req.headers.get("x-vercel-cron");
  return cronHeader === "1" && Boolean(process.env.VERCEL);
}

/**
 * Daily — email yesterday's (UTC) traffic digest after analytics rollup.
 * Recipients: NIGHTLY_TRAFFIC_REPORT_TO (comma-separated) or ryanchishimba@gmail.com.
 */
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await warmNeonCompute("cron.nightly-traffic-report");

    const url = new URL(req.url);
    const dateParam = url.searchParams.get("date");
    const dateKey =
      dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)
        ? dateParam
        : defaultReportDateKey();

    const recipients = nightlyTrafficReportRecipients();
    if (recipients.length === 0) {
      return NextResponse.json(
        { ok: false, error: "no_recipients" },
        { status: 500 }
      );
    }

    const report = await buildNightlyTrafficReport(dateKey);
    const delivery = await sendNightlyTrafficReportEmail(report, recipients);

    return NextResponse.json({
      ok: delivery.failed === 0,
      date: dateKey,
      recipients,
      metrics: {
        uniqueVisitors: report.uniqueVisitors,
        pageViews: report.pageViews,
        newSignups: report.newSignups,
        newTrials: report.newTrials,
      },
      ...delivery,
    });
  } catch (error) {
    if (error instanceof DbUnavailableError || isTransientDbError(error)) {
      console.warn(
        "[cron/nightly-traffic-report] database unavailable:",
        error instanceof Error ? error.message : error
      );
      return NextResponse.json(
        { ok: false, error: "database_unavailable", retryable: true },
        { status: 503, headers: { "Retry-After": "60" } }
      );
    }
    throw error;
  }
}
