import { NextResponse } from "next/server";
import { runTrialDay4ReminderEmails } from "@/lib/billing/trial-day4-reminder";
import { runTrialLifecycleEmails } from "@/lib/billing/trial-lifecycle-mail";
import { runDueWelcomeEmails } from "@/lib/billing/welcome-email-job";
import { isCronAuthorized } from "@/lib/cron-auth";
import { DbUnavailableError, isTransientDbError } from "@/lib/db-resilience";
import { warmNeonCompute } from "@/lib/neon-warmup";

export const maxDuration = 60;
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Hourly. Owns trial mail: the delayed welcome, the mid-trial nudge,
 * the 1-day reminder, and the trial-ended note.
 * `?dryRun=1` lists ending and ended recipients and does not send.
 */
export async function GET(req: Request) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dryRun = new URL(req.url).searchParams.get("dryRun") === "1";

  try {
    await warmNeonCompute(dryRun ? "cron.trial-emails.dry-run" : "cron.trial-emails");
    const now = new Date();
    const result = await runTrialLifecycleEmails(now, { dryRun });
    const welcome = dryRun ? null : await runDueWelcomeEmails(now);
    const midTrial = dryRun ? null : await runTrialDay4ReminderEmails(now);
    const errors = [
      ...result.errors,
      ...(welcome?.errors ?? []),
      ...(midTrial?.errors ?? []),
    ];
    return NextResponse.json({
      ok: errors.length === 0,
      ...result,
      errors,
      welcome,
      midTrial,
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
