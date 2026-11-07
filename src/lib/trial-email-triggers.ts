import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import type { EmailDeliveryResult } from "@/lib/email/config";
import { sendWelcomeTrialEmail } from "@/lib/email/trial-lifecycle-emails";

export type WelcomeEmailTriggerResult =
  | EmailDeliveryResult
  | { ok: false; reason: "skipped" | "not_trialing" | "already_sent" };

/** Send welcome email once when app-native trial starts. Safe to call fire-and-forget. */
export async function triggerWelcomeTrialEmail(
  userId: string
): Promise<WelcomeEmailTriggerResult> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    include: {
      user: { select: { email: true, name: true, accountStatus: true } },
    },
  });

  if (!sub || sub.status !== "trialing") {
    return { ok: false, reason: "not_trialing" };
  }

  if (sub.user.accountStatus !== "active") {
    return { ok: false, reason: "skipped" };
  }

  if (sub.welcomeEmailSentAt) {
    return { ok: false, reason: "already_sent" };
  }

  const result = await sendWelcomeTrialEmail({
    to: sub.user.email,
    name: sub.user.name,
  });

  if (result.ok) {
    await prisma.subscription.update({
      where: { userId },
      data: { welcomeEmailSentAt: new Date() },
    });
  }

  return result;
}

/**
 * Keep the welcome send alive until the response finishes. A floating promise
 * was frozen when the signup function returned, so the message never left.
 */
export function scheduleWelcomeTrialEmail(userId: string): void {
  const task = async () => {
    try {
      const result = await triggerWelcomeTrialEmail(userId);
      if (!result.ok) {
        console.error("[trial-welcome] not sent:", "reason" in result ? result.reason : "unknown", {
          userId,
        });
      }
    } catch (err) {
      console.error(
        "[trial-welcome] send failed:",
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
