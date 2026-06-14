import { prisma } from "@/lib/prisma";
import { intervalTotalUsd, parseBillingInterval } from "@/lib/billing-plans";
import {
  sendNextBillingReminderEmail,
  sendTrialEndingReminderEmail,
} from "@/lib/email/billing-emails";
import { getSubscriptionBillingDetails } from "@/lib/stripe";
import { isStripeConfigured } from "@/lib/payments";

const REMINDER_MIN_HOURS = 23;
const REMINDER_MAX_HOURS = 25;

export type BillingReminderRunResult = {
  trialRemindersSent: number;
  billingRemindersSent: number;
  errors: string[];
};

/** True when `target` is ~24 hours from now (hourly cron window). */
export function isWithin24HourReminderWindow(target: Date, now = new Date()): boolean {
  const hoursUntil = (target.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntil >= REMINDER_MIN_HOURS && hoursUntil <= REMINDER_MAX_HOURS;
}

export async function runBillingReminderEmails(
  now = new Date()
): Promise<BillingReminderRunResult> {
  const result: BillingReminderRunResult = {
    trialRemindersSent: 0,
    billingRemindersSent: 0,
    errors: [],
  };

  const trialCandidates = await prisma.subscription.findMany({
    where: {
      status: "trialing",
      stripeSubscriptionId: { not: null },
      trialEndsAt: { not: null },
    },
    include: {
      user: { select: { email: true, name: true } },
    },
  });

  for (const sub of trialCandidates) {
    const trialEndsAt = sub.trialEndsAt!;
    if (!isWithin24HourReminderWindow(trialEndsAt, now)) continue;
    if (
      sub.trialReminderForEndsAt &&
      sub.trialReminderForEndsAt.getTime() === trialEndsAt.getTime()
    ) {
      continue;
    }

    let interval = parseBillingInterval(sub.planInterval);
    let amountUsd = intervalTotalUsd(interval);

    if (sub.stripeSubscriptionId && isStripeConfigured()) {
      const billing = await getSubscriptionBillingDetails(sub.stripeSubscriptionId);
      if (billing?.nextRecurringInterval) {
        interval = parseBillingInterval(billing.nextRecurringInterval);
      }
      if (billing?.nextRecurringUsd) amountUsd = billing.nextRecurringUsd;
    }

    const sent = await sendTrialEndingReminderEmail({
      to: sub.user.email,
      name: sub.user.name,
      trialEndsAt,
      planInterval: interval,
      amountUsd,
    });

    if (sent.ok) {
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { trialReminderForEndsAt: trialEndsAt },
      });
      result.trialRemindersSent += 1;
    } else {
      result.errors.push(`trial reminder ${sub.userId}: ${sent.reason ?? "failed"}`);
    }
  }

  const billingCandidates = await prisma.subscription.findMany({
    where: {
      status: "active",
      stripeSubscriptionId: { not: null },
      currentPeriodEnd: { not: null },
    },
    include: {
      user: { select: { email: true, name: true } },
    },
  });

  for (const sub of billingCandidates) {
    const periodEnd = sub.currentPeriodEnd!;
    if (!isWithin24HourReminderWindow(periodEnd, now)) continue;
    if (
      sub.billingReminderForPeriodEnd &&
      sub.billingReminderForPeriodEnd.getTime() === periodEnd.getTime()
    ) {
      continue;
    }

    let interval = parseBillingInterval(sub.planInterval);
    let amountUsd = intervalTotalUsd(interval);
    let chargeAt = periodEnd;

    if (sub.stripeSubscriptionId && isStripeConfigured()) {
      const billing = await getSubscriptionBillingDetails(sub.stripeSubscriptionId);
      if (billing) {
        interval = parseBillingInterval(billing.nextRecurringInterval);
        amountUsd = billing.nextRecurringUsd;
        if (billing.nextRecurringAt) chargeAt = billing.nextRecurringAt;
      }
    }

    const sent = await sendNextBillingReminderEmail({
      to: sub.user.email,
      name: sub.user.name,
      chargeAt,
      planInterval: interval,
      amountUsd,
    });

    if (sent.ok) {
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { billingReminderForPeriodEnd: periodEnd },
      });
      result.billingRemindersSent += 1;
    } else {
      result.errors.push(`billing reminder ${sub.userId}: ${sent.reason ?? "failed"}`);
    }
  }

  return result;
}
