import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import {
  GOOGLE_ADS_PURCHASE_EVENT,
  GOOGLE_ADS_TRIAL_EVENT,
  GOOGLE_ADS_TRIAL_SEND_TO,
  isStripeCheckoutSessionId,
  isStripeSubscriptionId,
  purchaseConversionFromCheckout,
  purchaseConversionFromSubscription,
  type PurchaseConversion,
} from "@/lib/analytics/google-ads";

async function alreadySent(userId: string, eventName: string, transactionId: string): Promise<boolean> {
  const existing = await prisma.conversionEvent.findFirst({
    where: { userId, eventName, source: "server", sessionId: transactionId },
    select: { id: true },
  });
  return Boolean(existing);
}

async function remember(userId: string, eventName: string, transactionId: string, sendTo: string): Promise<boolean> {
  if (await alreadySent(userId, eventName, transactionId)) return false;
  await prisma.conversionEvent.create({
    data: {
      userId,
      eventName,
      source: "server",
      sessionId: transactionId,
      properties: { send_to: sendTo },
    },
  });
  return true;
}

/**
 * Claim the free-trial Ads conversion once per user.
 * The subscription row must already be trialing with time left. Calling this
 * from a button click does not qualify.
 */
export async function claimGoogleAdsTrial(userId: string): Promise<{ fire: boolean; sendTo: string }> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: { status: true, trialEndsAt: true },
  });
  const live =
    sub?.status === "trialing" &&
    (!sub.trialEndsAt || sub.trialEndsAt.getTime() > Date.now());
  if (!live) return { fire: false, sendTo: GOOGLE_ADS_TRIAL_SEND_TO };
  const fire = await remember(userId, GOOGLE_ADS_TRIAL_EVENT, `trial:${userId}`, GOOGLE_ADS_TRIAL_SEND_TO);
  return { fire, sendTo: GOOGLE_ADS_TRIAL_SEND_TO };
}

function checkoutInput(checkout: Stripe.Checkout.Session) {
  const subscription = checkout.subscription;
  const subscriptionId = typeof subscription === "string" ? subscription : subscription?.id ?? null;
  const customer = checkout.customer;
  return {
    id: checkout.id,
    status: checkout.status,
    mode: checkout.mode,
    paymentStatus: checkout.payment_status,
    amountTotal: checkout.amount_total,
    plan: checkout.metadata?.plan ?? null,
    ownerUserId: checkout.metadata?.userId ?? null,
    subscriptionId,
    customerId: typeof customer === "string" ? customer : customer?.id ?? null,
  };
}

async function ownerMatchesCheckout(
  userId: string,
  checkout: ReturnType<typeof checkoutInput>
): Promise<boolean> {
  if (checkout.ownerUserId === userId) return true;
  if (!checkout.customerId && !checkout.subscriptionId) return false;
  const row = await prisma.subscription.findUnique({
    where: { userId },
    select: { stripeCustomerId: true, stripeSubscriptionId: true },
  });
  if (!row) return false;
  if (checkout.customerId && row.stripeCustomerId === checkout.customerId) return true;
  if (checkout.subscriptionId && row.stripeSubscriptionId === checkout.subscriptionId) return true;
  return false;
}

async function claimPurchase(userId: string, purchase: PurchaseConversion): Promise<PurchaseConversion | null> {
  const fire = await remember(userId, GOOGLE_ADS_PURCHASE_EVENT, purchase.transactionId, purchase.sendTo);
  return fire ? purchase : null;
}

/** Confirm a Checkout Session with Stripe, then dedupe by its subscription or session id. */
export async function claimGoogleAdsCheckout(
  userId: string,
  sessionId: string
): Promise<PurchaseConversion | null> {
  if (!stripe || !isStripeCheckoutSessionId(sessionId)) return null;
  const checkout = checkoutInput(
    await stripe.checkout.sessions.retrieve(sessionId, { expand: ["subscription"] })
  );
  if (!(await ownerMatchesCheckout(userId, checkout))) return null;
  const purchase = purchaseConversionFromCheckout({ ...checkout, ownerUserId: userId }, userId);
  if (!purchase) return null;
  return claimPurchase(userId, purchase);
}

/** Confirm an in-app upgrade by reading the Stripe subscription, then dedupe on its id. */
export async function claimGoogleAdsSubscription(
  userId: string,
  subscriptionId: string
): Promise<PurchaseConversion | null> {
  if (!stripe || !isStripeSubscriptionId(subscriptionId)) return null;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["latest_invoice"],
  });
  const invoice = subscription.latest_invoice;
  const amountPaid =
    invoice && typeof invoice === "object" && "amount_paid" in invoice ? invoice.amount_paid : null;
  const row = await prisma.subscription.findUnique({
    where: { userId },
    select: { stripeSubscriptionId: true },
  });
  const ownerUserId =
    subscription.metadata?.userId === userId || row?.stripeSubscriptionId === subscription.id
      ? userId
      : subscription.metadata?.userId ?? null;
  const purchase = purchaseConversionFromSubscription(
    {
      id: subscription.id,
      status: subscription.status,
      ownerUserId,
      amountPaid,
    },
    userId
  );
  if (!purchase) return null;
  return claimPurchase(userId, purchase);
}
