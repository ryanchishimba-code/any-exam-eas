import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { welcomeEmailSendAfter } from "@/lib/email/welcome-signup-email";

export type WelcomeEmailScheduleResult =
  | { ok: true; scheduled: true }
  | { ok: false; reason: "skipped" | "not_trialing" | "already_sent" };

/**
 * Record the welcome for about one hour from now. The hourly trial-email cron sends it.
 * Does not send during the signup request.
 */
export async function triggerWelcomeTrialEmail(
  userId: string
): Promise<WelcomeEmailScheduleResult> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    include: {
      user: { select: { accountStatus: true } },
    },
  });

  if (!sub || sub.status !== "trialing") {
    return { ok: false, reason: "not_trialing" };
  }

  if (sub.user.accountStatus !== "active") {
    return { ok: false, reason: "skipped" };
  }

  if (sub.welcomeEmailSentAt || sub.welcomeEmailEarliestAt) {
    return sub.welcomeEmailSentAt
      ? { ok: false, reason: "already_sent" }
      : { ok: true, scheduled: true };
  }

  await prisma.subscription.update({
    where: { userId },
    data: { welcomeEmailEarliestAt: welcomeEmailSendAfter() },
  });

  return { ok: true, scheduled: true };
}

/**
 * Keep the schedule write alive until the response finishes. A floating promise
 * was frozen when the signup function returned.
 */
export function scheduleWelcomeTrialEmail(userId: string): void {
  const task = async () => {
    try {
      const result = await triggerWelcomeTrialEmail(userId);
      if (!result.ok) {
        console.error("[trial-welcome] not scheduled:", result.reason, { userId });
      }
    } catch (err) {
      console.error(
        "[trial-welcome] schedule failed:",
        err instanceof Error ? err.message : err,
        { userId }
      );
    }
  };

  try {
    after(task);
  } catch {
    void task();
  }
}
