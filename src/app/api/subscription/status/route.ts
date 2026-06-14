import { NextResponse } from "next/server";
import { getUserAccess } from "@/lib/access-control";
import { cacheGetOrSet, cacheKey, CACHE_TTL } from "@/lib/cache";
import { MONTHLY_PRICE_USD, YEARLY_PRICE_USD, TRIAL_DAYS } from "@/lib/billing-config";
import { formatPlanUsd } from "@/lib/billing-plans";
import { prisma } from "@/lib/prisma";
import { getSubscriptionBillingDetails } from "@/lib/stripe";
import { isStripeConfigured } from "@/lib/payments";
import { requireSessionGuard } from "@/lib/session-guard";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const guard = await requireSessionGuard(req);
  if (!guard.ok) return guard.response;

  const access = await cacheGetOrSet(
    cacheKey(["subscription-status", guard.userId]),
    CACHE_TTL.subscriptionStatus,
    () => getUserAccess(guard.userId)
  );

  const sub = await prisma.subscription.findUnique({
    where: { userId: guard.userId },
    select: {
      status: true,
      plan: true,
      planInterval: true,
      trialEndsAt: true,
      stripeSubscriptionId: true,
    },
  });

  const subscription = access.subscription;

  const user = await prisma.user.findUnique({
    where: { id: guard.userId },
    select: { email: true },
  });

  const subFull = await prisma.subscription.findUnique({
    where: { userId: guard.userId },
  });

  const { getReactivationInfo } = await import("@/lib/reactivation");
  const reactivationInfo =
    user?.email && !access.hasPremiumAccess
      ? await getReactivationInfo({
          email: user.email,
          subscription: subFull,
          access: subscription,
        })
      : null;

  let pendingPlanInterval: string | null = null;
  let currentPeriodEnd: string | null = null;
  let nextRecurringAt: string | null = null;
  let nextRecurringUsd: number | null = null;
  let nextRecurringInterval: string | null = null;

  if (sub?.stripeSubscriptionId && isStripeConfigured()) {
    const billing = await getSubscriptionBillingDetails(sub.stripeSubscriptionId);
    if (billing) {
      pendingPlanInterval = billing.pendingPlanInterval;
      currentPeriodEnd = billing.currentPeriodEnd.toISOString();
      nextRecurringAt = billing.nextRecurringAt?.toISOString() ?? null;
      nextRecurringUsd = billing.nextRecurringUsd;
      nextRecurringInterval = billing.nextRecurringInterval;
    }
  }

  return NextResponse.json({
    hasAccess: access.hasPremiumAccess,
    role: access.role,
    accountStatus: access.accountStatus,
    emailVerified: access.emailVerified,
    blockReason: access.blockReason,
    status: subscription.status,
    daysRemaining: subscription.daysRemaining,
    needsPaymentMethod: subscription.needsPaymentMethod,
    canStartCheckout: subscription.canStartCheckout,
    plan: sub?.plan ?? null,
    planInterval: sub?.planInterval ?? "monthly",
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
    monthlyPriceUsd: MONTHLY_PRICE_USD,
    yearlyPriceUsd: YEARLY_PRICE_USD,
    reactivation: reactivationInfo?.available
      ? {
          method: reactivationInfo.method,
          checkoutPath: reactivationInfo.checkoutPath,
          settingsPath: reactivationInfo.settingsPath,
          message: reactivationInfo.message,
          checkoutPlan: reactivationInfo.checkoutPlan,
          trialAvailable: reactivationInfo.trialAvailable,
        }
      : null,
  });
}
