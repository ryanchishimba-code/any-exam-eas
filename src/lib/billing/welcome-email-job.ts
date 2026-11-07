import { prisma } from "@/lib/prisma";
import { appBaseUrl, isEmailConfigured } from "@/lib/email/config";
import {
  marketingUnsubscribeHeaders,
  marketingUnsubscribePageUrl,
} from "@/lib/email/marketing-preference";
import { sendWelcomeTrialEmail } from "@/lib/email/trial-lifecycle-emails";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import { firstTenQuestionsHref } from "@/lib/study/first-ten-href";
import { isInternalTestEmail } from "@/lib/test-accounts";

export type WelcomeEmailJobResult = {
  sent: number;
  skipped: number;
  errors: string[];
};

function startForExam(examSlug: string | null | undefined): { startCta: string; startUrl: string } {
  const href = examSlug ? firstTenQuestionsHref(examSlug) : null;
  const name = examSlug && isExamSlug(examSlug) ? EXAM_CATALOG[examSlug].shortName : null;
  if (href && name) {
    return {
      startCta: `Start with 10 ${name} questions`,
      startUrl: `${appBaseUrl()}${href}`,
    };
  }
  return {
    startCta: "Choose your exam, then start 10 questions",
    startUrl: `${appBaseUrl()}/select-exam`,
  };
}

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

    const start = startForExam(sub.user.examPreference?.examSlug);
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
      startCta: start.startCta,
      startUrl: start.startUrl,
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
