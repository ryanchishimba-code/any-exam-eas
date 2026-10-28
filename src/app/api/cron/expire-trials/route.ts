import { NextResponse } from "next/server";
import { expireElapsedAppTrials } from "@/lib/billing/expire-app-trials";
import { isCronAuthorized } from "@/lib/cron-auth";
import { DbUnavailableError, isTransientDbError } from "@/lib/db-resilience";
import { warmNeonCompute } from "@/lib/neon-warmup";

export const maxDuration = 60;
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Daily — expire card-free app trials whose trialEndsAt is already past. */
export async function GET(req: Request) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await warmNeonCompute("cron.expire-trials");
    const result = await expireElapsedAppTrials();
    return NextResponse.json({ ok: true, expired: result.expired });
  } catch (error) {
    if (error instanceof DbUnavailableError || isTransientDbError(error)) {
      console.warn(
        "[cron/expire-trials] database unavailable:",
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
