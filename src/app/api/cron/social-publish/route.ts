import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cron-auth";
import { runDueScheduledPosts } from "@/lib/social/publish";

export const maxDuration = 120;
export const runtime = "nodejs";

/** Hourly — publish brand posts whose scheduled time has arrived. */
export async function GET(req: Request) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await runDueScheduledPosts();
  return NextResponse.json({ ok: true, ...summary });
}
