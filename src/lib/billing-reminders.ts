import { prisma } from "@/lib/prisma";
import { intervalTotalUsd, parseBillingInterval } from "@/lib/billing-plans";
import { resolveStoredTier } from "@/lib/subscription-features";
import {
  sendAnnualRenewalReminderEmail,
  sendNextBillingReminderEmail,
} from "@/lib/email/billing-emails";
import { sendTrialEndingUpgradeEmail } from "@/lib/email/trial-lifecycle-emails";
import { getSubscriptionBillingDetails } from "@/lib/stripe";
import { isStripeConfigured } from "@/lib/payments";

const REMINDER_MIN_HOURS = 23;
const REMINDER_MAX_HOURS = 25;
const ANNUAL_REMINDER_MIN_DAYS = 29;
const ANNUAL_REMINDER_MAX_DAYS = 31;

export type BillingReminderRunResult = {
  trialRemindersSent: number;
  billingRemindersSent: number;
  annualRenewalRemindersSent: number;
  errors: string[];
};

/** True when `target` is ~24 hours from now (hourly cron window). */
export function isWithin24HourReminderWindow(target: Date, now = new Date()): boolean {
  const hoursUntil = (target.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntil >= REMINDER_MIN_HOURS && hoursUntil <= REMINDER_MAX_HOURS;
}

/** True when `target` is about 30 days from now (daily/hourly cron window for annual plans). */
export function isWithinAnnualRenewalReminderWindow(target: Date, now = new Date()): boolean {
  const daysUntil = (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return daysUntil >= ANNUAL_REMINDER_MIN_DAYS && daysUntil <= ANNUAL_REMINDER_MAX_DAYS;
}

export async function runBillingReminderEmails(
  now = new Date()
): Promise<BillingReminderRunResult> {
  const result: BillingReminderRunResult = {
    trialRemindersSent: 0,
    billingRemindersSent: 0,
    annualRenewalRemindersSent: 0,
    errors: [],
  };

  const trialCandidates = await prisma.subscription.findMany({
    where: {
      status: "trialing",
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
    const tier = resolveStoredTier(sub.planTier);
    let amountUsd = intervalTotalUsd(tier, interval);
    // A stored Stripe id is not a live trial. Only Stripe status `trialing`
    // gets the legacy "payment method at checkout" sentence.
    let legacyStripeTrial = false;

    if (sub.stripeSubscriptionId && isStripeConfigured()) {
      try {
        const billing = await getSubscriptionBillingDetails(sub.stripeSubscriptionId);
        if (billing?.onTrial === true) legacyStripeTrial = true;
        if (billing?.nextRecurringInterval) {
          interval = parseBillingInterval(billing.nextRecurringInterval);
        }
        if (billing?.nextRecurringUsd) amountUsd = billing.nextRecurringUsd;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        result.errors.push(`trial Stripe lookup ${sub.userId}: ${message}`);
      }
    }

    const sent = await sendTrialEndingUpgradeEmail({
      to: sub.user.email,
      name: sub.user.name,
      trialEndsAt,
      legacyStripeTrial,
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
    const due24h = isWithin24HourReminderWindow(periodEnd, now);
    const dueAnnual =
      parseBillingInterval(sub.planInterval) === "yearly" &&
      isWithinAnnualRenewalReminderWindow(periodEnd, now);
    if (!due24h && !dueAnnual) continue;

    const already24h =
      sub.billingReminderForPeriodEnd &&
      sub.billingReminderForPeriodEnd.getTime() === periodEnd.getTime();
    const alreadyAnnual =
      sub.annualRenewalReminderForPeriodEnd &&
      sub.annualRenewalReminderForPeriodEnd.getTime() === periodEnd.getTime();
    if ((due24h ? already24h : true) && (dueAnnual ? alreadyAnnual : true)) continue;

    let interval = parseBillingInterval(sub.planInterval);
    const tier = resolveStoredTier(sub.planTier);
    let amountUsd = intervalTotalUsd(tier, interval);
    let chargeAt = periodEnd;

    if (sub.stripeSubscriptionId && isStripeConfigured()) {
      try {
        const billing = await getSubscriptionBillingDetails(sub.stripeSubscriptionId);
        if (billing) {
          interval = parseBillingInterval(billing.nextRecurringInterval);
          amountUsd = billing.nextRecurringUsd;
          if (billing.nextRecurringAt) chargeAt = billing.nextRecurringAt;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        result.errors.push(`billing Stripe lookup ${sub.userId}: ${message}`);
      }
    }

    if (due24h && !already24h) {
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

    if (dueAnnual && !alreadyAnnual && interval === "yearly") {
      const sent = await sendAnnualRenewalReminderEmail({
        to: sub.user.email,
        name: sub.user.name,
        chargeAt,
        planInterval: interval,
        amountUsd,
      });

      if (sent.ok) {
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { annualRenewalReminderForPeriodEnd: periodEnd },
        });
        result.annualRenewalRemindersSent += 1;
      } else {
        result.errors.push(`annual renewal reminder ${sub.userId}: ${sent.reason ?? "failed"}`);
      }
    }
  }

  return result;
}
