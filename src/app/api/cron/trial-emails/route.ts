import { NextResponse } from "next/server";
import { runTrialLifecycleEmails } from "@/lib/billing/trial-lifecycle-mail";
import { isCronAuthorized } from "@/lib/cron-auth";
import { DbUnavailableError, isTransientDbError } from "@/lib/db-resilience";
import { warmNeonCompute } from "@/lib/neon-warmup";

export const maxDuration = 60;
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Hourly. Sends the 1-day trial reminder and the trial-ended note.
 * `?dryRun=1` lists recipients and does not send or write the send log.
 */
export async function GET(req: Request) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dryRun = new URL(req.url).searchParams.get("dryRun") === "1";

  try {
    await warmNeonCompute(dryRun ? "cron.trial-emails.dry-run" : "cron.trial-emails");
    const result = await runTrialLifecycleEmails(new Date(), { dryRun });
    return NextResponse.json({
      ok: result.errors.length === 0,
      ...result,
    });
  } catch (error) {
    if (error instanceof DbUnavailableError || isTransientDbError(error)) {
      console.warn(
        "[cron/trial-emails] database unavailable:",
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
