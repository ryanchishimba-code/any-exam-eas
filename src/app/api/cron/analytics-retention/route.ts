import { NextResponse } from "next/server";
import { purgeOldAnalyticsEvents } from "@/lib/analytics-retention";
import { isCronAuthorized } from "@/lib/cron-auth";

export const maxDuration = 300;
export const runtime = "nodejs";

/** Weekly — purge raw analytics events older than ANALYTICS_RETENTION_DAYS (default 90). */
export async function GET(req: Request) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await purgeOldAnalyticsEvents();
  return NextResponse.json({ ok: true, ...result });
}
