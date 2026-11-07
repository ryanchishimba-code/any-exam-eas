import { prisma } from "@/lib/prisma";
import { isEmailConfigured } from "@/lib/email/config";
import {
  marketingUnsubscribeHeaders,
  marketingUnsubscribePageUrl,
} from "@/lib/email/marketing-preference";
import { lifecycleExamFromSlug } from "@/lib/email/lifecycle-exam";
import { sendWelcomeTrialEmail } from "@/lib/email/trial-lifecycle-emails";
import { isInternalTestEmail } from "@/lib/test-accounts";

export type WelcomeEmailJobResult = {
  sent: number;
  skipped: number;
  errors: string[];
};

/** Sends welcomes whose earliest time has passed. Older rows with a null earliest time are left alone. */
export async function runDueWelcomeEmails(now = new Date()): Promise<WelcomeEmailJobResult> {
  const result: WelcomeEmailJobResult = { sent: 0, skipped: 0, errors: [] };
  if (!isEmailConfigured()) {
    result.errors.push("email_not_configured");
    return result;
  }

  const due = await prisma.subscription.findMany({
    where: {
      status: "trialing",
      welcomeEmailSentAt: null,
      welcomeEmailEarliestAt: { lte: now },
      user: { accountStatus: "active" },
    },
    include: {
      user: {
        select: {
          email: true,
          name: true,
          examPreference: { select: { examSlug: true } },
          preferences: { select: { marketingOptOutAt: true } },
        },
      },
    },
  });

  for (const sub of due) {
    if (isInternalTestEmail(sub.user.email) || sub.user.preferences?.marketingOptOutAt) {
      await prisma.subscription.update({
        where: { userId: sub.userId },
        data: { welcomeEmailSentAt: now },
      });
      result.skipped += 1;
      continue;
    }

    const exam = lifecycleExamFromSlug(sub.user.examPreference?.examSlug);
    let unsubscribeUrl = "";
    let headers: Record<string, string> | undefined;
    try {
      unsubscribeUrl = marketingUnsubscribePageUrl(sub.userId);
      headers = marketingUnsubscribeHeaders(sub.userId);
    } catch (error) {
      result.errors.push(
        `${sub.userId}: ${error instanceof Error ? error.message : "unsubscribe link"}`
      );
      continue;
    }

    const sent = await sendWelcomeTrialEmail({
      to: sub.user.email,
      name: sub.user.name,
      examName: exam.name,
      startCta: exam.startCta,
      startUrl: exam.startUrl,
      unsubscribeUrl,
      headers,
    });
    if (!sent.ok) {
      result.errors.push(`${sub.userId}: ${sent.reason ?? "send_failed"}`);
      continue;
    }
    await prisma.subscription.update({
      where: { userId: sub.userId },
      data: { welcomeEmailSentAt: now },
    });
    result.sent += 1;
  }

  return result;
}
