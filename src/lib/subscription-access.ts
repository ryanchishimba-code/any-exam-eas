import type { Subscription } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { TRIAL_DAYS } from "@/lib/billing-config";

export type SubscriptionAccessStatus =
  | "active"
  | "trialing"
  | "trial_expired"
  | "inactive"
  | "none";

export type SubscriptionAccess = {
  hasAccess: boolean;
  status: SubscriptionAccessStatus;
  trialEndsAt: Date | null;
  daysRemaining: number | null;
  canStartCheckout: boolean;
  /** App-native trial without Stripe subscription — prompt to add payment before trial ends. */
  needsPaymentMethod: boolean;
};

const PREMIUM_STRIPE_STATUSES = new Set(["active", "trialing"]);

function daysUntil(date: Date): number {
  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

/** Mark local app trial as expired when past trialEndsAt. */
export async function expireTrialIfNeeded(
  subscription: Subscription | null
): Promise<Subscription | null> {
  if (!subscription) return null;
  if (subscription.status !== "trialing" || !subscription.trialEndsAt) {
    return subscription;
  }
  if (subscription.trialEndsAt > new Date()) {
    return subscription;
  }

  await prisma.subscription.updateMany({
    where: {
      id: subscription.id,
      status: "trialing",
      trialEndsAt: { lte: new Date() },
    },
    data: { status: "trial_expired" },
  });

  return prisma.subscription.findUnique({ where: { id: subscription.id } });
}

export function evaluateSubscriptionAccess(
  subscription: Subscription | null
): SubscriptionAccess {
  if (!subscription) {
    return {
      hasAccess: false,
      status: "none",
      trialEndsAt: null,
      daysRemaining: null,
      canStartCheckout: true,
      needsPaymentMethod: false,
    };
  }

  const needsPaymentMethod =
    subscription.status === "trialing" && !subscription.stripeSubscriptionId;

  const trialEndsAt = subscription.trialEndsAt
    ? new Date(subscription.trialEndsAt)
    : null;

  if (subscription.status === "active") {
    return {
      hasAccess: true,
      status: "active",
      trialEndsAt,
      daysRemaining: null,
      canStartCheckout: false,
      needsPaymentMethod: false,
    };
  }

  if (subscription.status === "trialing") {
    if (trialEndsAt && trialEndsAt <= new Date()) {
      return {
        hasAccess: false,
        status: "trial_expired",
        trialEndsAt,
        daysRemaining: 0,
        canStartCheckout: true,
        needsPaymentMethod: false,
      };
    }
    const daysRemaining = trialEndsAt ? daysUntil(trialEndsAt) : TRIAL_DAYS;
    return {
      hasAccess: true,
      status: "trialing",
      trialEndsAt,
      daysRemaining,
      canStartCheckout: true,
      needsPaymentMethod,
    };
  }

  if (subscription.status === "trial_expired") {
    return {
      hasAccess: false,
      status: "trial_expired",
      trialEndsAt,
      daysRemaining: 0,
      canStartCheckout: true,
      needsPaymentMethod: false,
    };
  }

  if (subscription.status === "past_due") {
    return {
      hasAccess: false,
      status: "inactive",
      trialEndsAt,
      daysRemaining: null,
      canStartCheckout: true,
      needsPaymentMethod: false,
    };
  }

  if (PREMIUM_STRIPE_STATUSES.has(subscription.status)) {
    return {
      hasAccess: true,
      status: subscription.status === "trialing" ? "trialing" : "active",
      trialEndsAt,
      daysRemaining: trialEndsAt ? daysUntil(trialEndsAt) : null,
      canStartCheckout: false,
      needsPaymentMethod: false,
    };
  }

  return {
    hasAccess: false,
    status: "inactive",
    trialEndsAt,
    daysRemaining: null,
    canStartCheckout: true,
    needsPaymentMethod: false,
  };
}

export async function getSubscriptionAccess(
  userId: string
): Promise<SubscriptionAccess> {
  let subscription = await prisma.subscription.findUnique({
    where: { userId },
  });
  subscription = await expireTrialIfNeeded(subscription);
  return evaluateSubscriptionAccess(subscription);
}

export async function requirePremiumAccess(userId: string): Promise<SubscriptionAccess> {
  const access = await getSubscriptionAccess(userId);
  return access;
}
