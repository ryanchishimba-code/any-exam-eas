import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import {
  TRIAL_DAYS,
  usesIntroTrialPricing,
  type BillingInterval,
} from "@/lib/billing-config";
import { parseBillingInterval, intervalTotalUsd } from "@/lib/billing-plans";
import { CHECKOUT_PAYMENT_METHOD_TYPES } from "@/lib/payments";
import { intervalFromPriceId, requireStripePriceId } from "@/lib/stripe-prices";
import { parseSubscriptionTier, type SubscriptionTier } from "@/lib/subscription-tiers";

export {
  TRIAL_DAYS,
  TRIAL_INTRO_PRICE_USD,
  GRACE_PERIOD_DAYS,
  MONTHLY_PRICE_USD,
  YEARLY_PRICE_USD,
  gracePeriodEnd,
  estimateMrr,
  trialEndsAtFromNow,
  usesIntroTrialPricing,
  type BillingInterval,
} from "@/lib/billing-config";

export {
  getStripePriceId,
  isIntervalPriceConfigured,
  requireStripePriceId,
  getStripePriceSetupStatus,
  getMissingStripePriceEnvKeys,
  STRIPE_PRICE_ENV_KEYS,
} from "@/lib/stripe-prices";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

type CheckoutBaseParams = {
  customerEmail: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
  /** trial = collect payment method; charge after free trial unless legacy intro price is set */
  plan?: "trial" | "subscribe";
  tier?: SubscriptionTier;
  interval?: BillingInterval;
  stripeCustomerId?: string | null;
  stripeCouponId?: string | null;
  /** @deprecated App DB trial end sync — Stripe sets trial via trial_period_days at checkout. */
  trialEndUnix?: number;
};

function buildSubscriptionSessionParams(params: CheckoutBaseParams) {
  const isTrialPlan = params.plan === "trial";
  const tier = parseSubscriptionTier(params.tier);
  const interval = params.interval ?? "yearly";
  const introPriceId = process.env.STRIPE_TRIAL_INTRO_PRICE_ID;
  const useIntro = isTrialPlan && usesIntroTrialPricing() && introPriceId;

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    { price: requireStripePriceId(tier, interval), quantity: 1 },
  ];

  if (useIntro) {
    lineItems.unshift({ price: introPriceId, quantity: 1 });
  }

  const subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData = {
    metadata: {
      userId: params.userId,
      plan: params.plan ?? "subscribe",
      tier,
      interval,
    },
  };

  if (params.trialEndUnix) {
    subscriptionData.trial_end = params.trialEndUnix;
  } else if (isTrialPlan) {
    subscriptionData.trial_period_days = TRIAL_DAYS;
  }

  return {
    mode: "subscription" as const,
    customer: params.stripeCustomerId ?? undefined,
    customer_email: params.stripeCustomerId ? undefined : params.customerEmail,
    ...(params.stripeCouponId
      ? { discounts: [{ coupon: params.stripeCouponId }] }
      : {}),
    line_items: lineItems,
    subscription_data: subscriptionData,
    metadata: {
      userId: params.userId,
      plan: params.plan ?? "subscribe",
      tier,
      interval,
    },
    ...(isTrialPlan || params.plan === "subscribe"
      ? { payment_method_collection: "always" as const }
      : {}),
    payment_method_types: [...CHECKOUT_PAYMENT_METHOD_TYPES],
    payment_method_options: {
      card: {
        request_three_d_secure: "automatic" as const,
      },
    },
    billing_address_collection: "auto" as const,
    customer_update: params.stripeCustomerId
      ? ({ address: "auto" as const, name: "auto" as const })
      : undefined,
    saved_payment_method_options: {
      payment_method_save: "enabled" as const,
      payment_method_remove: "disabled" as const,
    },
  };
}

/** Hosted Stripe Checkout (redirect) — dynamic payment methods from Dashboard. */
export async function createCheckoutSession(params: CheckoutBaseParams) {
  if (!stripe) {
    throw new Error("Stripe is not configured. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID.");
  }

  return stripe.checkout.sessions.create({
    ...buildSubscriptionSessionParams(params),
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });
}

/** Embedded Checkout — stay on-site; same payment methods as hosted. */
export async function createEmbeddedCheckoutSession(params: CheckoutBaseParams) {
  if (!stripe) {
    throw new Error("Stripe is not configured. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID.");
  }

  return stripe.checkout.sessions.create({
    ...buildSubscriptionSessionParams(params),
    ui_mode: "embedded",
    return_url: params.successUrl,
  });
}

export async function retrieveCheckoutSession(sessionId: string) {
  if (!stripe) throw new Error("Stripe is not configured");
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription", "customer"],
  });
}

export async function createBillingPortalSession(params: {
  stripeCustomerId: string;
  returnUrl: string;
  /** Open directly to payment-method update for recurring billing. */
  intent?: "manage" | "payment_method";
}) {
  if (!stripe) throw new Error("Stripe is not configured");

  const session: Stripe.BillingPortal.SessionCreateParams = {
    customer: params.stripeCustomerId,
    return_url: params.returnUrl,
  };

  if (params.intent === "payment_method") {
    session.flow_data = { type: "payment_method_update" };
  }

  return stripe.billingPortal.sessions.create(session);
}

/** Resolve app user from Stripe subscription metadata or stored IDs. */
export async function resolveUserIdFromStripeSubscription(
  sub: Stripe.Subscription
): Promise<string | null> {
  if (sub.metadata?.userId) return sub.metadata.userId;

  const bySubId = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: sub.id },
    select: { userId: true },
  });
  if (bySubId) return bySubId.userId;

  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
  if (customerId) {
    const byCustomer = await prisma.subscription.findFirst({
      where: { stripeCustomerId: customerId },
      select: { userId: true },
    });
    if (byCustomer) return byCustomer.userId;
  }

  return null;
}

function subscriptionItemPriceId(sub: Stripe.Subscription): string | null {
  const price = sub.items.data[0]?.price;
  if (!price) return null;
  return typeof price === "string" ? price : price.id;
}

function resolvePlanFromStripe(sub: Stripe.Subscription): {
  tier: SubscriptionTier;
  interval: BillingInterval;
} {
  const pendingTier = parseSubscriptionTier(sub.metadata?.pendingTier);
  const pendingInterval = sub.metadata?.pendingInterval?.trim();
  const priceId = subscriptionItemPriceId(sub);
  const metaTier = parseSubscriptionTier(sub.metadata?.tier);
  const metaInterval = parseBillingInterval(sub.metadata?.interval);

  if (priceId) {
    const fromPrice = intervalFromPriceId(priceId);
    if (fromPrice) {
      if (pendingInterval) {
        const pending = parseBillingInterval(pendingInterval);
        if (
          priceId === requireStripePriceId(pendingTier, pending) ||
          priceId === requireStripePriceId(fromPrice.tier, pending)
        ) {
          return { tier: pendingTier, interval: pending };
        }
      }
      return fromPrice;
    }
  }

  return { tier: metaTier, interval: metaInterval };
}

/** @deprecated Use resolvePlanFromStripe */
function resolvePlanIntervalFromStripe(sub: Stripe.Subscription): BillingInterval {
  return resolvePlanFromStripe(sub).interval;
}

export type PlanChangeResult = {
  effective: "immediate" | "period_end";
  effectiveAt: Date | null;
  tier: SubscriptionTier;
  interval: BillingInterval;
};

/** Read pending plan change and next recurring charge from Stripe. */
export async function getSubscriptionBillingDetails(stripeSubscriptionId: string) {
  if (!stripe) return null;

  const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
  const pendingRaw = sub.metadata?.pendingInterval?.trim();
  const pendingTierRaw = sub.metadata?.pendingTier?.trim();
  const pendingPlanInterval = pendingRaw ? parseBillingInterval(pendingRaw) : null;
  const pendingPlanTier = pendingTierRaw ? parseSubscriptionTier(pendingTierRaw) : null;
  const current = resolvePlanFromStripe(sub);
  const onTrial = sub.status === "trialing";

  const nextRecurringInterval = pendingPlanInterval ?? current.interval;
  const nextRecurringTier = pendingPlanTier ?? current.tier;
  const nextRecurringAt = onTrial
    ? sub.trial_end
      ? new Date(sub.trial_end * 1000)
      : null
    : new Date(sub.current_period_end * 1000);

  return {
    planTier: current.tier,
    planInterval: current.interval,
    pendingPlanTier,
    pendingPlanInterval,
    currentPeriodEnd: new Date(sub.current_period_end * 1000),
    status: sub.status,
    onTrial,
    nextRecurringTier,
    nextRecurringInterval,
    nextRecurringAt,
    nextRecurringUsd: intervalTotalUsd(nextRecurringTier, nextRecurringInterval),
  };
}

export async function changeSubscriptionPlan(params: {
  stripeSubscriptionId: string;
  tier: SubscriptionTier;
  interval: BillingInterval;
  userId: string;
}): Promise<PlanChangeResult> {
  if (!stripe) throw new Error("Stripe is not configured");

  const sub = await stripe.subscriptions.retrieve(params.stripeSubscriptionId);
  const item = sub.items.data[0];
  if (!item?.id) throw new Error("Subscription has no billable items");

  const currentPriceId = subscriptionItemPriceId(sub);
  if (!currentPriceId) throw new Error("Subscription has no price");

  const newPriceId = requireStripePriceId(params.tier, params.interval);
  const onTrial = sub.status === "trialing";
  const isLegacyBasicUpgrade = parseSubscriptionTier(sub.metadata?.tier) === "basic";

  if (onTrial || isLegacyBasicUpgrade) {
    const updated = await stripe.subscriptions.update(params.stripeSubscriptionId, {
      items: [{ id: item.id, price: newPriceId }],
      proration_behavior: onTrial ? "none" : "create_prorations",
      metadata: {
        ...sub.metadata,
        userId: params.userId,
        tier: params.tier,
        interval: params.interval,
        pendingTier: "",
        pendingInterval: "",
      },
    });

    await prisma.subscription.update({
      where: { userId: params.userId },
      data: {
        planTier: params.tier,
        planInterval: params.interval,
        ...(updated.current_period_end
          ? { currentPeriodEnd: new Date(updated.current_period_end * 1000) }
          : {}),
      },
    });

    return {
      effective: "immediate",
      effectiveAt: null,
      tier: params.tier,
      interval: params.interval,
    };
  }

  const effectiveAt = new Date(sub.current_period_end * 1000);
  const existingScheduleId =
    typeof sub.schedule === "string" ? sub.schedule : sub.schedule?.id;

  let scheduleId = existingScheduleId;
  if (!scheduleId) {
    const created = await stripe.subscriptionSchedules.create({
      from_subscription: params.stripeSubscriptionId,
    });
    scheduleId = created.id;
  }

  let phase1Start = sub.current_period_start;
  let phase1End = sub.current_period_end;

  if (existingScheduleId) {
    const existing = await stripe.subscriptionSchedules.retrieve(scheduleId);
    const now = Math.floor(Date.now() / 1000);
    const currentPhase = existing.phases.find(
      (phase) =>
        phase.start_date <= now && (phase.end_date == null || phase.end_date > now)
    );
    if (currentPhase) {
      phase1Start = currentPhase.start_date;
      phase1End = currentPhase.end_date ?? sub.current_period_end;
    }
  }

  await stripe.subscriptionSchedules.update(scheduleId, {
    end_behavior: "release",
    phases: [
      {
        items: [{ price: currentPriceId, quantity: 1 }],
        start_date: phase1Start,
        end_date: phase1End,
        proration_behavior: "none",
        collection_method: "charge_automatically",
      },
      {
        items: [{ price: newPriceId, quantity: 1 }],
        proration_behavior: "none",
        collection_method: "charge_automatically",
      },
    ],
  });

  await stripe.subscriptions.update(params.stripeSubscriptionId, {
    metadata: {
      ...sub.metadata,
      userId: params.userId,
      pendingTier: params.tier,
      pendingInterval: params.interval,
    },
  });

  return {
    effective: "period_end",
    effectiveAt,
    tier: params.tier,
    interval: params.interval,
  };
}

export async function applySubscriptionFromStripe(
  userId: string,
  stripeSub: Stripe.Subscription,
  stripeCustomerId?: string
) {
  const isPaid = stripeSub.status === "active" || stripeSub.status === "trialing";
  const pendingInterval = stripeSub.metadata?.pendingInterval?.trim();
  const pendingTier = stripeSub.metadata?.pendingTier?.trim();
  const priceId = subscriptionItemPriceId(stripeSub);
  let { tier: planTier, interval: planInterval } = resolvePlanFromStripe(stripeSub);

  if (pendingInterval && pendingTier && priceId) {
    const nextTier = parseSubscriptionTier(pendingTier);
    const nextInterval = parseBillingInterval(pendingInterval);
    if (priceId === requireStripePriceId(nextTier, nextInterval)) {
      planTier = nextTier;
      planInterval = nextInterval;
      if (stripe) {
        await stripe.subscriptions.update(stripeSub.id, {
          metadata: {
            ...stripeSub.metadata,
            tier: pendingTier,
            interval: pendingInterval,
            pendingTier: "",
            pendingInterval: "",
          },
        });
      }
    }
  }

  const signupPlan = stripeSub.metadata?.plan === "trial" ? "trial" : "subscribe";

  await prisma.subscription.update({
    where: { userId },
    data: {
      ...(stripeCustomerId ? { stripeCustomerId } : {}),
      stripeSubscriptionId: stripeSub.id,
      status: stripeSub.status === "canceled" ? "canceled" : stripeSub.status,
      plan: signupPlan,
      planTier,
      planInterval,
      currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
      ...(stripeSub.trial_end
        ? { trialEndsAt: new Date(stripeSub.trial_end * 1000) }
        : {}),
      ...(isPaid ? { gracePeriodEndsAt: null, canceledAt: null } : {}),
      ...(stripeSub.status === "canceled" ? { canceledAt: new Date() } : {}),
    },
  });
}
