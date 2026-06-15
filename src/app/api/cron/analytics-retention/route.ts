import { NextResponse } from "next/server";
import { purgeOldAnalyticsEvents } from "@/lib/analytics-retention";

export const maxDuration = 300;
export const runtime = "nodejs";

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;

  const cronHeader = req.headers.get("x-vercel-cron");
  return cronHeader === "1" && Boolean(process.env.VERCEL);
}

/** Weekly — purge raw analytics events older than ANALYTICS_RETENTION_DAYS (default 90). */
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await purgeOldAnalyticsEvents();
  return NextResponse.json({ ok: true, ...result });
}
