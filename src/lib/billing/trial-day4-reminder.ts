import { prisma } from "@/lib/prisma";
import { isEmailConfigured } from "@/lib/email/config";
import {
  marketingUnsubscribeHeaders,
  marketingUnsubscribePageUrl,
} from "@/lib/email/marketing-preference";
import { isInternalTestEmail } from "@/lib/test-accounts";
import { sendTrialDay4ReminderEmail } from "@/lib/email/trial-lifecycle-emails";
import { isTrialDay4ReminderWindow } from "@/lib/trial/trial-status";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import { firstTenQuestionsHref } from "@/lib/study/first-ten-href";

type Metadata = {
  trialReminders?: { day4ForEndsAt?: string };
};

function parseMetadata(raw: string | null | undefined): Metadata {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Metadata;
  } catch {
    return {};
  }
}

export type TrialDay4ReminderRunResult = {
  sent: number;
  skipped: number;
  errors: string[];
};

/**
 * About 2–3 days before trial end (48–72 hours left). Sends one board-specific
 * note only when the person has not answered a question and still has an exam.
 */
export async function runTrialDay4ReminderEmails(
  now = new Date()
): Promise<TrialDay4ReminderRunResult> {
  const result: TrialDay4ReminderRunResult = { sent: 0, skipped: 0, errors: [] };
  if (!isEmailConfigured()) {
    result.errors.push("email_not_configured");
    return result;
  }

  const windowStart = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const windowEnd = new Date(now.getTime() + 72 * 60 * 60 * 1000);
  const candidates = await prisma.subscription.findMany({
    where: {
      status: "trialing",
      trialEndsAt: { gt: windowStart, lte: windowEnd },
    },
    include: {
      user: {
        select: {
          email: true,
          name: true,
          accountStatus: true,
          examPreference: { select: { examSlug: true } },
          preferences: { select: { metadata: true, marketingOptOutAt: true } },
          _count: { select: { questionAttempts: true } },
        },
      },
    },
  });

  for (const sub of candidates) {
    const trialEndsAt = sub.trialEndsAt!;
    if (!isTrialDay4ReminderWindow(trialEndsAt, now)) continue;
    if (sub.user.accountStatus !== "active" || isInternalTestEmail(sub.user.email)) {
      result.skipped += 1;
      continue;
    }

    const endsKey = trialEndsAt.toISOString();
    const meta = parseMetadata(sub.user.preferences?.metadata);
    if (meta.trialReminders?.day4ForEndsAt === endsKey) continue;

    const examSlug = sub.user.examPreference?.examSlug;
    const studied = sub.user._count.questionAttempts > 0;
    const suppressed = sub.user.preferences?.marketingOptOutAt != null;
    const examName = examSlug && isExamSlug(examSlug) ? EXAM_CATALOG[examSlug].shortName : null;
    const startUrl = examSlug ? firstTenQuestionsHref(examSlug) : null;

    if (studied || suppressed || !examName || !startUrl) {
      if (studied || suppressed) {
        await rememberDay4(sub.userId, meta, endsKey);
      }
      result.skipped += 1;
      continue;
    }

    let unsubscribeUrl: string | undefined;
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

    const sent = await sendTrialDay4ReminderEmail({
      to: sub.user.email,
      name: sub.user.name,
      examName,
      startUrl,
      unsubscribeUrl,
      headers,
    });

    if (!sent.ok) {
      result.errors.push(`${sub.userId}: ${sent.reason ?? "send_failed"}`);
      continue;
    }

    await rememberDay4(sub.userId, meta, endsKey);
    result.sent += 1;
  }

  return result;
}

async function rememberDay4(userId: string, meta: Metadata, endsKey: string): Promise<void> {
  const nextMeta = {
    ...meta,
    trialReminders: { ...meta.trialReminders, day4ForEndsAt: endsKey },
  };
  await prisma.userPreference.upsert({
    where: { userId },
    create: {
      userId,
      metadata: JSON.stringify(nextMeta),
    },
    update: { metadata: JSON.stringify(nextMeta) },
  });
}
