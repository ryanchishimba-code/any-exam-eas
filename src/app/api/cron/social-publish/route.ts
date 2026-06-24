import { NextResponse } from "next/server";
import { runDueScheduledPosts } from "@/lib/social/publish";

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

/** Every few minutes — publish brand posts whose scheduled time has arrived. */
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await runDueScheduledPosts();
  return NextResponse.json({ ok: true, ...summary });
}
