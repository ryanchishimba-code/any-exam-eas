import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const TRIAL_DAYS = 7;
export const MONTHLY_PRICE_USD = 9;

export async function createCheckoutSession(params: {
  customerEmail: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  if (!stripe) {
    throw new Error("Stripe is not configured. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID.");
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    throw new Error("STRIPE_PRICE_ID is required");
  }

  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: params.customerEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: TRIAL_DAYS,
      metadata: { userId: params.userId },
    },
    metadata: { userId: params.userId },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
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
