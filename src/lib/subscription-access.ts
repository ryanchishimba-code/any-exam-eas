import type { Subscription } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { TRIAL_DAYS, type BillingInterval } from "@/lib/billing-config";
import { parseBillingInterval } from "@/lib/billing-plans";
import { resolveStoredTier, type SubscriptionFeature, tierHasFeature } from "@/lib/subscription-features";
import { oneTimeAccessActive } from "@/lib/billing/one-time-purchase";
import type { SubscriptionTier } from "@/lib/subscription-tiers";

export type SubscriptionAccessStatus =
  | "active"
  | "trialing"
  | "trial_expired"
  | "inactive"
  | "none"
  | "past_due"
  | "canceled";

export type SubscriptionAccess = {
  hasAccess: boolean;
  /** Restricted post-trial tier — dashboard + limited questions. */
  hasFreeAccess: boolean;
  status: SubscriptionAccessStatus;
  tier: SubscriptionTier;
  planDuration: BillingInterval;
  trialEndsAt: Date | null;
  daysRemaining: number | null;
  canStartCheckout: boolean;
  /** Checkout incomplete — payment method not yet on file via Stripe. */
  needsPaymentMethod: boolean;
};

const PREMIUM_STRIPE_STATUSES = new Set(["active", "trialing"]);

function daysUntil(date: Date): number {
  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

/** Treat expired trials as expired on read — avoid write-on-read during page loads. */
export function normalizeSubscriptionForRead(
  subscription: Subscription | null
): Subscription | null {
  if (!subscription) return null;
  if (
    subscription.status === "trialing" &&
    subscription.trialEndsAt &&
    subscription.trialEndsAt <= new Date()
  ) {
    return { ...subscription, status: "trial_expired" };
  }
  // A lapsed pay-once window has no Stripe event to flip it, so expire on read.
  if (
    subscription.purchaseType === "one_time" &&
    subscription.status === "active" &&
    !oneTimeAccessActive(subscription)
  ) {
    return { ...subscription, status: "inactive" };
  }
  return subscription;
}

/** Mark local app trial as expired when past trialEndsAt (cron/webhook/login paths). */
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

/**
 * Paid access that should win over a complimentary window.
 * A stored Stripe id is not enough: canceled and past-due rows keep the id
 * without granting premium, and the pass resumes for any days still left.
 */
export function hasLivePaidEntitlement(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  const stripeId = Boolean(subscription.stripeSubscriptionId?.trim());
  const premiumStatus =
    subscription.status === "active" || subscription.status === "trialing";
  if (stripeId && premiumStatus) return true;
  return oneTimeAccessActive(subscription);
}

function subscriptionMeta(subscription: Subscription | null): {
  tier: SubscriptionTier;
  planDuration: BillingInterval;
} {
  return {
    tier: resolveStoredTier(subscription?.planTier),
    planDuration: parseBillingInterval(subscription?.planInterval),
  };
}

export function evaluateSubscriptionAccess(
  subscription: Subscription | null
): SubscriptionAccess {
  const meta = subscriptionMeta(subscription);

  if (!subscription) {
    return {
      hasAccess: false,
      hasFreeAccess: false,
      status: "none",
      ...meta,
      trialEndsAt: null,
      daysRemaining: null,
      canStartCheckout: true,
      needsPaymentMethod: false,
    };
  }

  const trialEndsAt = subscription.trialEndsAt
    ? new Date(subscription.trialEndsAt)
    : null;

  const hasStripeSubscription = Boolean(subscription.stripeSubscriptionId?.trim());
  const compUntil = subscription.compAccessUntil
    ? new Date(subscription.compAccessUntil)
    : null;
  const compAccessValid = Boolean(compUntil && compUntil > new Date());
  const compLapsed = Boolean(compUntil && compUntil <= new Date());
  const oneTimeValid = oneTimeAccessActive(subscription);
  const livePaid = hasLivePaidEntitlement(subscription);

  // A pass or admin grant unlocks Pro with no card. A live Stripe subscription
  // or pay-once window is the only entitlement while it is actually premium:
  // leftover pass days stay on the row and resume after that paid window ends.
  // A canceled, deleted, or past-due Stripe id must not hide a future pass.
  if (compAccessValid && compUntil && !livePaid) {
    return {
      hasAccess: true,
      hasFreeAccess: false,
      status: "active",
      ...meta,
      trialEndsAt,
      daysRemaining: daysUntil(compUntil),
      canStartCheckout: false,
      needsPaymentMethod: false,
    };
  }

  if (subscription.status === "active") {
    // Durable "active" must be backed by a Stripe subscription, a paid pay-once
    // window, or a valid comp grant. Prevents orphan/test-mode rows from
    // unlocking premium after trial.
    if (!hasStripeSubscription && !compAccessValid && !oneTimeValid) {
      return {
        hasAccess: false,
        hasFreeAccess: false,
        status: "inactive",
        ...meta,
        trialEndsAt,
        daysRemaining: compLapsed ? 0 : null,
        canStartCheckout: true,
        // A lapsed pass never collected a card. Incomplete checkout is a different state.
        needsPaymentMethod: !compLapsed,
      };
    }
    return {
      hasAccess: true,
      hasFreeAccess: false,
      status: "active",
      ...meta,
      trialEndsAt,
      // Pay-once access lapses on a known date, so surface the countdown.
      daysRemaining: oneTimeValid
        ? daysUntil(new Date(subscription.accessEndsAt!))
        : null,
      // Nothing renews a pay-once window — let them buy more time before it ends.
      canStartCheckout: oneTimeValid,
      needsPaymentMethod: false,
    };
  }

  if (subscription.status === "trialing") {
    if (trialEndsAt && trialEndsAt <= new Date()) {
      return {
        hasAccess: false,
        hasFreeAccess: true,
        status: "trial_expired",
        ...meta,
        trialEndsAt,
        daysRemaining: 0,
        canStartCheckout: true,
        needsPaymentMethod: false,
      };
    }
    const daysRemaining = trialEndsAt ? daysUntil(trialEndsAt) : TRIAL_DAYS;
    return {
      hasAccess: true,
      hasFreeAccess: false,
      status: "trialing",
      ...meta,
      trialEndsAt,
      daysRemaining,
      canStartCheckout: false,
      needsPaymentMethod: false,
    };
  }

  if (subscription.status === "inactive") {
    return {
      hasAccess: false,
      hasFreeAccess: false,
      status: "inactive",
      ...meta,
      trialEndsAt,
      daysRemaining: compLapsed ? 0 : null,
      canStartCheckout: true,
      needsPaymentMethod: compLapsed ? false : !subscription.stripeSubscriptionId,
    };
  }

  if (subscription.status === "trial_expired") {
    return {
      hasAccess: false,
      hasFreeAccess: true,
      status: "trial_expired",
      ...meta,
      trialEndsAt,
      daysRemaining: 0,
      canStartCheckout: true,
      needsPaymentMethod: false,
    };
  }

  if (subscription.status === "past_due") {
    return {
      hasAccess: false,
      hasFreeAccess: false,
      status: "past_due",
      ...meta,
      trialEndsAt,
      daysRemaining: null,
      canStartCheckout: false,
      needsPaymentMethod: false,
    };
  }

  if (subscription.status === "canceled") {
    return {
      hasAccess: false,
      hasFreeAccess: false,
      status: "canceled",
      ...meta,
      trialEndsAt,
      daysRemaining: null,
      canStartCheckout: true,
      needsPaymentMethod: false,
    };
  }

  if (PREMIUM_STRIPE_STATUSES.has(subscription.status)) {
    return {
      hasAccess: true,
      hasFreeAccess: false,
      status: subscription.status === "trialing" ? "trialing" : "active",
      ...meta,
      trialEndsAt,
      daysRemaining: trialEndsAt ? daysUntil(trialEndsAt) : null,
      canStartCheckout: false,
      needsPaymentMethod: false,
    };
  }

  return {
    hasAccess: false,
    hasFreeAccess: false,
    status: "inactive",
    ...meta,
    trialEndsAt,
    daysRemaining: null,
    canStartCheckout: true,
    needsPaymentMethod: false,
  };
}

/**
 * Complimentary Pro window: access is on, nothing renews, and checkout is not required.
 * Pay-once access keeps canStartCheckout true, so it does not match.
 */
export function isComplimentaryAccessWindow(
  access: Pick<SubscriptionAccess, "hasAccess" | "status" | "daysRemaining" | "canStartCheckout">
): boolean {
  return (
    access.hasAccess &&
    access.status === "active" &&
    access.daysRemaining != null &&
    access.canStartCheckout === false
  );
}

/**
 * A pass with no live Stripe subscription may start paid Checkout.
 * The pass date is kept; it is not added onto the paid period.
 */
export function compPassCanStartPaidCheckout(
  access: Pick<SubscriptionAccess, "hasAccess" | "status" | "daysRemaining" | "canStartCheckout">,
  stripeSubscriptionId: string | null | undefined
): boolean {
  return isComplimentaryAccessWindow(access) && !stripeSubscriptionId?.trim();
}

/** Feature gate for subscription tier (staff/comp should bypass upstream). */
export function subscriptionHasFeature(
  access: SubscriptionAccess,
  feature: SubscriptionFeature
): boolean {
  if (!access.hasAccess) return false;
  return tierHasFeature(access.tier, feature);
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
