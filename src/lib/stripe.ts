import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import {
  TRIAL_DAYS,
  trialEndsAtFromNow,
  usesIntroTrialPricing,
  type BillingInterval,
} from "@/lib/billing-config";

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

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

type CheckoutBaseParams = {
  customerEmail: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
  /** trial = add card during/after free trial; subscribe = bill immediately */
  plan?: "trial" | "subscribe";
  interval?: BillingInterval;
  stripeCustomerId?: string | null;
  stripeCouponId?: string | null;
  /** Unix timestamp — sync Stripe trial end with app-native trial (card collected now, charge later). */
  trialEndUnix?: number;
};

function getPriceId(interval: BillingInterval = "monthly"): string {
  const priceId =
    interval === "yearly"
      ? process.env.STRIPE_PRICE_ID_YEARLY ?? process.env.STRIPE_PRICE_ID
      : process.env.STRIPE_PRICE_ID;
  if (!priceId) throw new Error("STRIPE_PRICE_ID is required");
  return priceId;
}

function buildSubscriptionSessionParams(params: CheckoutBaseParams) {
  const isTrialPlan = params.plan === "trial";
  const introPriceId = process.env.STRIPE_TRIAL_INTRO_PRICE_ID;
  const useIntro = isTrialPlan && usesIntroTrialPricing() && introPriceId;

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    { price: getPriceId(params.interval ?? "monthly"), quantity: 1 },
  ];

  if (useIntro) {
    lineItems.unshift({ price: introPriceId, quantity: 1 });
  }

  const subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData = {
    metadata: { userId: params.userId },
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
      fullAccess: "true",
    },
    automatic_payment_methods: {
      enabled: true,
    },
    ...(isTrialPlan && !useIntro
      ? { payment_method_collection: "always" as const }
      : {}),
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

/** Hosted Stripe Checkout (redirect) — supports wallets + cards. */
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
}) {
  if (!stripe) throw new Error("Stripe is not configured");

  return stripe.billingPortal.sessions.create({
    customer: params.stripeCustomerId,
    return_url: params.returnUrl,
  });
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

export async function applySubscriptionFromStripe(
  userId: string,
  stripeSub: Stripe.Subscription,
  stripeCustomerId?: string
) {
  const isPaid = stripeSub.status === "active" || stripeSub.status === "trialing";

  await prisma.subscription.update({
    where: { userId },
    data: {
      ...(stripeCustomerId ? { stripeCustomerId } : {}),
      stripeSubscriptionId: stripeSub.id,
      status: stripeSub.status === "canceled" ? "canceled" : stripeSub.status,
      currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
      ...(stripeSub.trial_end
        ? { trialEndsAt: new Date(stripeSub.trial_end * 1000) }
        : {}),
      ...(isPaid ? { gracePeriodEndsAt: null } : {}),
      ...(stripeSub.status === "canceled" ? { canceledAt: new Date() } : {}),
    },
  });
}
