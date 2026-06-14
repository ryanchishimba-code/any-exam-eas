import { NextResponse } from "next/server";
import { runBillingReminderEmails } from "@/lib/billing-reminders";

export const maxDuration = 60;
export const runtime = "nodejs";

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;

  const cronHeader = req.headers.get("x-vercel-cron");
  return cronHeader === "1" && Boolean(process.env.VERCEL);
}

/** Hourly — sends trial-ending and pre-renewal emails ~24h before charge. */
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runBillingReminderEmails();

  return NextResponse.json({
    ok: result.errors.length === 0,
    ...result,
  });
}
