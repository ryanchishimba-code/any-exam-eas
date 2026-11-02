import { Prisma } from "@prisma/client";
import { parseBillingInterval } from "@/lib/billing-plans";
import { isEmailConfigured } from "@/lib/email/config";
import {
  sendTrialEndedEmail,
  sendTrialEndingUpgradeEmail,
} from "@/lib/email/trial-lifecycle-emails";
import { prisma } from "@/lib/prisma";
import { isStripeConfigured } from "@/lib/payments";
import { getSubscriptionBillingDetails } from "@/lib/stripe";
import { isInternalTestEmail } from "@/lib/test-accounts";

export const TRIAL_EMAIL_KINDS = ["reminder_1d", "trial_ended"] as const;
export type TrialEmailKind = (typeof TRIAL_EMAIL_KINDS)[number];

/** How long after trial end we still send the ended note. The hourly job has slack if a run is missed. */
export const TRIAL_ENDED_LOOKBACK_MS = 48 * 60 * 60 * 1000;

export type TrialEmailRecipient = {
  userId: string;
  email: string;
  name: string | null;
  kind: TrialEmailKind;
  trialEndsAt: string;
};

export type TrialEmailPlan = {
  now: string;
  reminder: TrialEmailRecipient[];
  ended: TrialEmailRecipient[];
  skippedTestAccounts: number;
};

export function isTrialEndedEmailWindow(trialEndsAt: Date, now: Date): boolean {
  const elapsed = now.getTime() - trialEndsAt.getTime();
  return elapsed > 0 && elapsed <= TRIAL_ENDED_LOOKBACK_MS;
}

/** Same 23–25 hour window as the billing reminder cron. */
export function isTrialReminderWindow(trialEndsAt: Date, now: Date): boolean {
  const hoursUntil = (trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntil >= 23 && hoursUntil <= 25;
}

export function classifyTrialLifecycleEmail(
  input: {
    status: string;
    trialEndsAt: Date | null;
    stripeSubscriptionId: string | null;
    trialReminderForEndsAt: Date | null;
    email: string;
    accountStatus: string;
    reminderLogged: boolean;
    endedLogged: boolean;
  },
  now: Date
): TrialEmailKind | "skip_test" | "skip_inactive" | null {
  if (!input.trialEndsAt) return null;
  const reminderDue =
    input.status === "trialing" &&
    isTrialReminderWindow(input.trialEndsAt, now) &&
    !input.reminderLogged &&
    !(
      input.trialReminderForEndsAt &&
      input.trialReminderForEndsAt.getTime() === input.trialEndsAt.getTime()
    );
  const endedDue =
    !input.stripeSubscriptionId &&
    !input.endedLogged &&
    (input.status === "trial_expired" || input.status === "trialing") &&
    isTrialEndedEmailWindow(input.trialEndsAt, now);

  const due = reminderDue ? "reminder_1d" : endedDue ? "trial_ended" : null;
  if (!due) return null;
  if (isInternalTestEmail(input.email)) return "skip_test";
  if (input.accountStatus !== "active") return "skip_inactive";
  return due;
}

type SubscriptionRow = {
  id: string;
  userId: string;
  status: string;
  trialEndsAt: Date | null;
  stripeSubscriptionId: string | null;
  trialReminderForEndsAt: Date | null;
  planInterval: string | null;
  user: { email: string; name: string | null; accountStatus: string };
};

async function loadRows(now: Date): Promise<SubscriptionRow[]> {
  const reminderFrom = new Date(now.getTime() + 23 * 60 * 60 * 1000);
  const reminderTo = new Date(now.getTime() + 25 * 60 * 60 * 1000);
  const endedFrom = new Date(now.getTime() - TRIAL_ENDED_LOOKBACK_MS);
  const [reminderRows, endedRows] = await Promise.all([
    prisma.subscription.findMany({
      where: { status: "trialing", trialEndsAt: { gte: reminderFrom, lte: reminderTo } },
      select: rowSelect,
    }),
    prisma.subscription.findMany({
      where: {
        status: { in: ["trial_expired", "trialing"] },
        stripeSubscriptionId: null,
        trialEndsAt: { gt: endedFrom, lt: now },
      },
      select: rowSelect,
    }),
  ]);
  const byId = new Map<string, SubscriptionRow>();
  for (const row of [...reminderRows, ...endedRows]) byId.set(row.id, row);
  return [...byId.values()];
}

const rowSelect = {
  id: true,
  userId: true,
  status: true,
  trialEndsAt: true,
  stripeSubscriptionId: true,
  trialReminderForEndsAt: true,
  planInterval: true,
  user: { select: { email: true, name: true, accountStatus: true } },
} as const;

export async function planTrialLifecycleEmails(now = new Date()): Promise<TrialEmailPlan> {
  const rows = await loadRows(now);
  const logs =
    rows.length === 0
      ? []
      : await prisma.trialEmailSendLog.findMany({
          where: { userId: { in: rows.map((row) => row.userId) } },
          select: { userId: true, kind: true, trialEndsAt: true },
        });
  const logged = new Set(
    logs.map((log) => `${log.userId}:${log.kind}:${log.trialEndsAt.toISOString()}`)
  );

  const plan: TrialEmailPlan = {
    now: now.toISOString(),
    reminder: [],
    ended: [],
    skippedTestAccounts: 0,
  };

  for (const row of rows) {
    if (!row.trialEndsAt) continue;
    const endsKey = row.trialEndsAt.toISOString();
    const kind = classifyTrialLifecycleEmail(
      {
        status: row.status,
        trialEndsAt: row.trialEndsAt,
        stripeSubscriptionId: row.stripeSubscriptionId,
        trialReminderForEndsAt: row.trialReminderForEndsAt,
        email: row.user.email,
        accountStatus: row.user.accountStatus,
        reminderLogged: logged.has(`${row.userId}:reminder_1d:${endsKey}`),
        endedLogged: logged.has(`${row.userId}:trial_ended:${endsKey}`),
      },
      now
    );
    if (kind === "skip_test") {
      plan.skippedTestAccounts += 1;
      continue;
    }
    if (kind !== "reminder_1d" && kind !== "trial_ended") continue;
    const recipient: TrialEmailRecipient = {
      userId: row.userId,
      email: row.user.email,
      name: row.user.name,
      kind,
      trialEndsAt: endsKey,
    };
    if (kind === "reminder_1d") plan.reminder.push(recipient);
    else plan.ended.push(recipient);
  }

  return plan;
}

async function claimSend(userId: string, kind: TrialEmailKind, trialEndsAt: Date): Promise<boolean> {
  try {
    await prisma.trialEmailSendLog.create({
      data: { userId, kind, trialEndsAt },
    });
    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return false;
    }
    throw error;
  }
}

async function releaseSend(userId: string, kind: TrialEmailKind, trialEndsAt: Date): Promise<void> {
  await prisma.trialEmailSendLog.deleteMany({ where: { userId, kind, trialEndsAt } });
}

export type TrialLifecycleRunResult = TrialEmailPlan & {
  dryRun: boolean;
  remindersSent: number;
  endedSent: number;
  errors: string[];
};

export async function runTrialLifecycleEmails(
  now = new Date(),
  options?: { dryRun?: boolean }
): Promise<TrialLifecycleRunResult> {
  const plan = await planTrialLifecycleEmails(now);
  const result: TrialLifecycleRunResult = {
    ...plan,
    dryRun: Boolean(options?.dryRun),
    remindersSent: 0,
    endedSent: 0,
    errors: [],
  };
  if (options?.dryRun) return result;
  if (plan.reminder.length === 0 && plan.ended.length === 0) return result;
  if (!isEmailConfigured()) {
    result.errors.push("email_not_configured");
    return result;
  }

  const rows = await loadRows(now);
  const byUserEnd = new Map(rows.map((row) => [`${row.userId}:${row.trialEndsAt?.toISOString()}`, row]));

  for (const recipient of [...plan.reminder, ...plan.ended]) {
    const row = byUserEnd.get(`${recipient.userId}:${recipient.trialEndsAt}`);
    if (!row?.trialEndsAt) continue;
    const claimed = await claimSend(row.userId, recipient.kind, row.trialEndsAt);
    if (!claimed) continue;

    let sentOk = false;
    if (recipient.kind === "reminder_1d") {
      let legacyStripeTrial = false;
      let interval = parseBillingInterval(row.planInterval);
      let amountUsd: number | undefined;
      if (row.stripeSubscriptionId && isStripeConfigured()) {
        try {
          const billing = await getSubscriptionBillingDetails(row.stripeSubscriptionId);
          if (billing?.onTrial === true) legacyStripeTrial = true;
          if (billing?.nextRecurringInterval) interval = parseBillingInterval(billing.nextRecurringInterval);
          if (billing?.nextRecurringUsd) amountUsd = billing.nextRecurringUsd;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          result.errors.push(`trial Stripe lookup ${row.userId}: ${message}`);
        }
      }
      const sent = await sendTrialEndingUpgradeEmail({
        to: row.user.email,
        name: row.user.name,
        trialEndsAt: row.trialEndsAt,
        legacyStripeTrial,
        planInterval: interval,
        amountUsd,
      });
      sentOk = sent.ok;
      if (!sent.ok) result.errors.push(`reminder ${row.userId}: ${sent.reason ?? "send_failed"}`);
    } else {
      const sent = await sendTrialEndedEmail({
        to: row.user.email,
        name: row.user.name,
        trialEndsAt: row.trialEndsAt,
      });
      sentOk = sent.ok;
      if (!sent.ok) result.errors.push(`ended ${row.userId}: ${sent.reason ?? "send_failed"}`);
    }

    if (!sentOk) {
      await releaseSend(row.userId, recipient.kind, row.trialEndsAt);
      continue;
    }

    if (recipient.kind === "reminder_1d") {
      await prisma.subscription.update({
        where: { id: row.id },
        data: { trialReminderForEndsAt: row.trialEndsAt },
      });
      result.remindersSent += 1;
    } else {
      result.endedSent += 1;
    }
  }

  return result;
}
