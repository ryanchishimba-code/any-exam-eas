import { NextResponse } from "next/server";
import {
  stripe,
  resolveUserIdFromStripeSubscription,
  applySubscriptionFromStripe,
} from "@/lib/stripe";
import { stripeUnixToDate, subscriptionCurrentPeriodEnd } from "@/lib/stripe-period";
import { prisma } from "@/lib/prisma";
import { parseBillingInterval } from "@/lib/billing-plans";
import { parseSubscriptionTier } from "@/lib/subscription-tiers";
import type Stripe from "stripe";
import { trackEvent } from "@/lib/analytics/events";
import { saveTypedConversion } from "@/lib/analytics/conversions";
import { CONVERSION_EVENTS } from "@/lib/analytics/conversion-types";
import { EVENT_TYPES } from "@/lib/analytics/types";
import { recordTrialUsed } from "@/lib/trial-eligibility";
import { sendPaymentFailedEmail } from "@/lib/email/billing-emails";
import { invalidateSubscriptionStatusCache } from "@/lib/cache";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook config" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId && session.customer) {
        let stripeSub: Stripe.Subscription | null = null;
        if (session.subscription) {
          stripeSub = await stripe.subscriptions.retrieve(String(session.subscription));
        }

        const periodEnd = stripeSub ? subscriptionCurrentPeriodEnd(stripeSub) : null;
        const trialEndsAt = stripeSub ? stripeUnixToDate(stripeSub.trial_end) : null;

        await prisma.subscription.update({
          where: { userId },
          data: {
            stripeCustomerId: String(session.customer),
            stripeSubscriptionId: String(session.subscription ?? ""),
            status: stripeSub?.status ?? "active",
            plan: session.metadata?.plan === "trial" ? "trial" : "subscribe",
            planTier: parseSubscriptionTier(session.metadata?.tier),
            planInterval: parseBillingInterval(session.metadata?.interval),
            ...(trialEndsAt ? { trialEndsAt } : {}),
            ...(periodEnd ? { currentPeriodEnd: periodEnd } : {}),
            canceledAt: null,
          },
        });

        if (session.metadata?.plan === "trial") {
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
          });
          if (user?.email) {
            await recordTrialUsed(user.email, userId);
          }
        }
        invalidateSubscriptionStatusCache(userId);
        trackEvent({
          userId,
          eventType: EVENT_TYPES.BILLING_CHECKOUT,
          category: "billing",
          metadata: { status: stripeSub?.status ?? "active" },
        });

        if (session.metadata?.plan === "trial" && stripeSub?.status === "trialing") {
          saveTypedConversion(
            CONVERSION_EVENTS.TRIAL_STARTED,
            {
              plan_type: "trial",
              tier: parseSubscriptionTier(session.metadata?.tier),
              interval: parseBillingInterval(session.metadata?.interval),
            },
            { userId }
          );
        }
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = await resolveUserIdFromStripeSubscription(sub);
      if (userId) {
        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
        await applySubscriptionFromStripe(userId, sub, customerId);
        invalidateSubscriptionStatusCache(userId);
        trackEvent({
          userId,
          eventType: EVENT_TYPES.BILLING_SUBSCRIPTION_UPDATED,
          category: "billing",
          metadata: { status: sub.status, event: event.type },
        });
      }
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id;
      if (subId) {
        const stripeSub = await stripe.subscriptions.retrieve(subId);
        const userId = await resolveUserIdFromStripeSubscription(stripeSub);
        if (userId) {
          await prisma.subscription.update({
            where: { userId },
            data: {
              status: "past_due",
              gracePeriodEndsAt: null,
            },
          });
          invalidateSubscriptionStatusCache(userId);

          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, name: true },
          });
          if (user?.email) {
            void sendPaymentFailedEmail({ to: user.email, name: user.name });
          }

          trackEvent({
            userId,
            eventType: EVENT_TYPES.BILLING_PAYMENT_FAILED,
            category: "billing",
          });
        }
      }
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const subId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id;
      if (subId) {
        const stripeSub = await stripe.subscriptions.retrieve(subId);
        const userId = await resolveUserIdFromStripeSubscription(stripeSub);
        if (userId) {
          const customerId =
            typeof stripeSub.customer === "string"
              ? stripeSub.customer
              : stripeSub.customer?.id;
          await applySubscriptionFromStripe(userId, stripeSub, customerId);
          invalidateSubscriptionStatusCache(userId);
        }
      }
      break;
    }
    case "customer.subscription.trial_will_end": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = await resolveUserIdFromStripeSubscription(sub);
      if (userId) {
        trackEvent({
          userId,
          eventType: EVENT_TYPES.BILLING_SUBSCRIPTION_UPDATED,
          category: "billing",
          metadata: { status: sub.status, event: event.type },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
