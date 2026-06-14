import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import {
  TRIAL_DAYS,
  usesIntroTrialPricing,
  type BillingInterval,
} from "@/lib/billing-config";
import { parseBillingInterval, intervalTotalUsd } from "@/lib/billing-plans";
import { intervalFromPriceId, requireStripePriceId } from "@/lib/stripe-prices";

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
  /** trial = collect payment method now; charge after free trial unless legacy intro price is set */
  plan?: "trial" | "subscribe";
  interval?: BillingInterval;
  stripeCustomerId?: string | null;
  stripeCouponId?: string | null;
  /** Unix timestamp — sync Stripe trial end with app-native trial (card collected now, charge later). */
  trialEndUnix?: number;
};

function buildSubscriptionSessionParams(params: CheckoutBaseParams) {
  const isTrialPlan = params.plan === "trial";
  const interval = params.interval ?? "monthly";
  const introPriceId = process.env.STRIPE_TRIAL_INTRO_PRICE_ID;
  const useIntro = isTrialPlan && usesIntroTrialPricing() && introPriceId;

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    { price: requireStripePriceId(interval), quantity: 1 },
  ];

  if (useIntro) {
    lineItems.unshift({ price: introPriceId, quantity: 1 });
  }

  const subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData = {
    metadata: {
      userId: params.userId,
      plan: params.plan ?? "subscribe",
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
      interval,
      fullAccess: "true",
    },
    ...(isTrialPlan ? { payment_method_collection: "always" as const } : {}),
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

function resolvePlanIntervalFromStripe(sub: Stripe.Subscription): BillingInterval {
  const pending = sub.metadata?.pendingInterval?.trim();
  const priceId = subscriptionItemPriceId(sub);

  if (pending) {
    const pendingInterval = parseBillingInterval(pending);
    if (priceId === requireStripePriceId(pendingInterval)) {
      return pendingInterval;
    }
    const current = sub.metadata?.interval;
    if (current) return parseBillingInterval(current);
  }

  if (priceId) {
    const fromPrice = intervalFromPriceId(priceId);
    if (fromPrice) return fromPrice;
  }

  return parseBillingInterval(sub.metadata?.interval);
}

export type PlanChangeResult = {
  effective: "immediate" | "period_end";
  effectiveAt: Date | null;
  interval: BillingInterval;
};

/** Read pending plan change and next recurring charge from Stripe. */
export async function getSubscriptionBillingDetails(stripeSubscriptionId: string) {
  if (!stripe) return null;

  const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
  const pendingRaw = sub.metadata?.pendingInterval?.trim();
  const pendingPlanInterval = pendingRaw ? parseBillingInterval(pendingRaw) : null;
  const currentPlanInterval = resolvePlanIntervalFromStripe(sub);
  const onTrial = sub.status === "trialing";

  const nextRecurringInterval = pendingPlanInterval ?? currentPlanInterval;
  const nextRecurringAt = onTrial
    ? sub.trial_end
      ? new Date(sub.trial_end * 1000)
      : null
    : new Date(sub.current_period_end * 1000);

  return {
    planInterval: currentPlanInterval,
    pendingPlanInterval,
    currentPeriodEnd: new Date(sub.current_period_end * 1000),
    status: sub.status,
    onTrial,
    nextRecurringInterval,
    nextRecurringAt,
    nextRecurringUsd: intervalTotalUsd(nextRecurringInterval),
  };
}

export async function changeSubscriptionPlan(params: {
  stripeSubscriptionId: string;
  interval: BillingInterval;
  userId: string;
}): Promise<PlanChangeResult> {
  if (!stripe) throw new Error("Stripe is not configured");

  const sub = await stripe.subscriptions.retrieve(params.stripeSubscriptionId);
  const item = sub.items.data[0];
  if (!item?.id) throw new Error("Subscription has no billable items");

  const currentPriceId = subscriptionItemPriceId(sub);
  if (!currentPriceId) throw new Error("Subscription has no price");

  const newPriceId = requireStripePriceId(params.interval);
  const onTrial = sub.status === "trialing";

  if (onTrial) {
    const updated = await stripe.subscriptions.update(params.stripeSubscriptionId, {
      items: [{ id: item.id, price: newPriceId }],
      proration_behavior: "none",
      metadata: {
        ...sub.metadata,
        userId: params.userId,
        interval: params.interval,
        pendingInterval: "",
      },
    });

    await prisma.subscription.update({
      where: { userId: params.userId },
      data: {
        planInterval: params.interval,
        ...(updated.current_period_end
          ? { currentPeriodEnd: new Date(updated.current_period_end * 1000) }
          : {}),
      },
    });

    return { effective: "immediate", effectiveAt: null, interval: params.interval };
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
      pendingInterval: params.interval,
    },
  });

  return { effective: "period_end", effectiveAt, interval: params.interval };
}

export async function applySubscriptionFromStripe(
  userId: string,
  stripeSub: Stripe.Subscription,
  stripeCustomerId?: string
) {
  const isPaid = stripeSub.status === "active" || stripeSub.status === "trialing";
  const pending = stripeSub.metadata?.pendingInterval?.trim();
  const priceId = subscriptionItemPriceId(stripeSub);
  let planInterval = resolvePlanIntervalFromStripe(stripeSub);

  if (pending && priceId === requireStripePriceId(parseBillingInterval(pending))) {
    planInterval = parseBillingInterval(pending);
    if (stripe) {
      await stripe.subscriptions.update(stripeSub.id, {
        metadata: {
          ...stripeSub.metadata,
          interval: pending,
          pendingInterval: "",
        },
      });
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
