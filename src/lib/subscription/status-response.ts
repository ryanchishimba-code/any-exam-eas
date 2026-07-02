import type { UserAccess } from "@/lib/access-control";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { formatPlanUsd } from "@/lib/billing-plans";
import { TIER_ANNUAL_USD, TIER_MONTHLY_USD } from "@/lib/subscription-tiers";
import { resolveStoredTier } from "@/lib/subscription-features";
import { prisma } from "@/lib/prisma";
import { getSubscriptionBillingDetails } from "@/lib/stripe";
import { isStripeConfigured } from "@/lib/payments";
import { getReactivationInfo } from "@/lib/reactivation";

function reactivationPayload(
  info: Awaited<ReturnType<typeof getReactivationInfo>>
) {
  if (!info.available) return null;
  return {
    method: info.method,
    checkoutPath: info.checkoutPath,
    settingsPath: info.settingsPath,
    message: info.message,
    checkoutPlan: info.checkoutPlan,
    trialAvailable: info.trialAvailable,
  };
}

/** Nav / chrome — no Stripe, no duplicate Prisma reads. */
export async function buildLiteSubscriptionStatus(
  userId: string,
  access: UserAccess
) {
  const subscription = access.subscription;
  let reactivation = null;

  if (!access.hasPremiumAccess) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (user?.email) {
      const info = await getReactivationInfo({
        email: user.email,
        subscription: null,
        access: subscription,
      });
      reactivation = reactivationPayload(info);
    }
  }

  return {
    hasAccess: access.hasPremiumAccess,
    hasAppAccess: access.hasAppAccess,
    hasStudyAccess: access.hasStudyAccess,
    hasFreeTierAccess: access.hasFreeTierAccess,
    role: access.role,
    accountStatus: access.accountStatus,
    emailVerified: access.emailVerified,
    blockReason: access.blockReason,
    status: subscription.status,
    tier: subscription.tier,
    planDuration: subscription.planDuration,
    daysRemaining: subscription.daysRemaining,
    needsPaymentMethod: subscription.needsPaymentMethod,
    canStartCheckout: subscription.canStartCheckout,
    trialEndsAt: subscription.trialEndsAt?.toISOString() ?? null,
    trialDays: TRIAL_DAYS,
    reactivation,
  };
}

/** Settings / billing — full payload including Stripe billing details. */
export async function buildFullSubscriptionStatus(
  userId: string,
  access: UserAccess
) {
  const subscription = access.subscription;

  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: {
      status: true,
      plan: true,
      planTier: true,
      planInterval: true,
      trialEndsAt: true,
      stripeSubscriptionId: true,
    },
  });

  const [user, subFull] = await Promise.all([
    !access.hasPremiumAccess
      ? prisma.user.findUnique({
          where: { id: userId },
          select: { email: true },
        })
      : Promise.resolve(null),
    !access.hasPremiumAccess
      ? prisma.subscription.findUnique({ where: { userId } })
      : Promise.resolve(null),
  ]);

  const reactivationInfo =
    user?.email && !access.hasPremiumAccess
      ? await getReactivationInfo({
          email: user.email,
          subscription: subFull,
          access: subscription,
        })
      : null;

  let pendingPlanInterval: string | null = null;
  let pendingPlanTier: string | null = null;
  let currentPeriodEnd: string | null = null;
  let nextRecurringAt: string | null = null;
  let nextRecurringUsd: number | null = null;
  let nextRecurringInterval: string | null = null;

  if (sub?.stripeSubscriptionId && isStripeConfigured()) {
    const billing = await getSubscriptionBillingDetails(sub.stripeSubscriptionId);
    if (billing) {
      pendingPlanInterval = billing.pendingPlanInterval;
      pendingPlanTier = billing.pendingPlanTier;
      currentPeriodEnd = billing.currentPeriodEnd.toISOString();
      nextRecurringAt = billing.nextRecurringAt?.toISOString() ?? null;
      nextRecurringUsd = billing.nextRecurringUsd;
      nextRecurringInterval = billing.nextRecurringInterval;
    }
  }

  const planTier = resolveStoredTier(sub?.planTier);

  return {
    hasAccess: access.hasPremiumAccess,
    hasAppAccess: access.hasAppAccess,
    hasStudyAccess: access.hasStudyAccess,
    hasFreeTierAccess: access.hasFreeTierAccess,
    role: access.role,
    accountStatus: access.accountStatus,
    emailVerified: access.emailVerified,
    blockReason: access.blockReason,
    status: subscription.status,
    tier: planTier,
    planDuration: subscription.planDuration,
    daysRemaining: subscription.daysRemaining,
    needsPaymentMethod: subscription.needsPaymentMethod,
    canStartCheckout: subscription.canStartCheckout,
    plan: sub?.plan ?? null,
    planTier,
    planInterval: sub?.planInterval ?? "yearly",
    pendingPlanTier,
    pendingPlanInterval,
    currentPeriodEnd,
    nextRecurringAt,
    nextRecurringUsd,
    nextRecurringInterval,
    nextRecurringLabel:
      nextRecurringUsd != null && nextRecurringInterval
        ? formatPlanUsd(nextRecurringUsd)
        : null,
    hasStripeSubscription: Boolean(sub?.stripeSubscriptionId),
    trialEndsAt:
      sub?.trialEndsAt?.toISOString() ?? subscription.trialEndsAt?.toISOString() ?? null,
    trialDays: TRIAL_DAYS,
    monthlyPriceUsd: TIER_MONTHLY_USD.pro,
    proMonthlyPriceUsd: TIER_MONTHLY_USD.pro,
    yearlyPriceUsd: TIER_ANNUAL_USD.pro,
    reactivation: reactivationInfo ? reactivationPayload(reactivationInfo) : null,
  };
}
