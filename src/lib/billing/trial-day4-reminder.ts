import { prisma } from "@/lib/prisma";
import { isEmailConfigured } from "@/lib/email/config";
import { isInternalTestEmail } from "@/lib/test-accounts";
import { sendTrialDay4ReminderEmail } from "@/lib/email/trial-lifecycle-emails";
import { isTrialDay4ReminderWindow } from "@/lib/trial/trial-status";

export const TRIAL_DAY4_REMINDER_FLAG = "ENABLE_TRIAL_DAY4_REMINDER_EMAIL";

export function isTrialDay4ReminderEnabled(): boolean {
  return process.env[TRIAL_DAY4_REMINDER_FLAG] === "true";
}

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
 * Day-4 trial nudge (48–72h before trial end). OFF unless ENABLE_TRIAL_DAY4_REMINDER_EMAIL=true.
 * Dedupes via UserPreference.metadata.trialReminders.day4ForEndsAt.
 */
export async function runTrialDay4ReminderEmails(
  now = new Date()
): Promise<TrialDay4ReminderRunResult> {
  const result: TrialDay4ReminderRunResult = { sent: 0, skipped: 0, errors: [] };
  if (!isTrialDay4ReminderEnabled()) {
    result.skipped += 1;
    return result;
  }
  if (!isEmailConfigured()) {
    result.errors.push("email_not_configured");
    return result;
  }

  const candidates = await prisma.subscription.findMany({
    where: { status: "trialing", trialEndsAt: { not: null } },
    include: {
      user: {
        select: {
          email: true,
          name: true,
          preferences: { select: { metadata: true } },
        },
      },
    },
  });

  for (const sub of candidates) {
    const trialEndsAt = sub.trialEndsAt!;
    if (!isTrialDay4ReminderWindow(trialEndsAt, now)) continue;
    if (isInternalTestEmail(sub.user.email)) {
      result.skipped += 1;
      continue;
    }

    const endsKey = trialEndsAt.toISOString();
    const meta = parseMetadata(sub.user.preferences?.metadata);
    if (meta.trialReminders?.day4ForEndsAt === endsKey) continue;

    const sent = await sendTrialDay4ReminderEmail({
      to: sub.user.email,
      name: sub.user.name,
      trialEndsAt,
    });

    if (!sent.ok) {
      result.errors.push(`${sub.userId}: ${sent.reason ?? "send_failed"}`);
      continue;
    }

    const nextMeta = {
      ...meta,
      trialReminders: { ...meta.trialReminders, day4ForEndsAt: endsKey },
    };
    await prisma.userPreference.upsert({
      where: { userId: sub.userId },
      create: {
        userId: sub.userId,
        metadata: JSON.stringify(nextMeta),
        updatedAt: new Date(),
      },
      update: { metadata: JSON.stringify(nextMeta), updatedAt: new Date() },
    });
    result.sent += 1;
  }

  return result;
}
