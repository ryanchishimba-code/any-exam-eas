import { NextResponse } from "next/server";
import {
  stripe,
  resolveUserIdFromStripeSubscription,
  applySubscriptionFromStripe,
} from "@/lib/stripe";
import { stripeUnixToDate, subscriptionCurrentPeriodEnd } from "@/lib/stripe-period";
import { stripeEventMatchesKeyMode } from "@/lib/stripe-livemode";
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
import {
  applyOneTimePurchase,
  revokeOneTimePurchase,
} from "@/lib/billing/one-time-purchase";

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

  const modeCheck = stripeEventMatchesKeyMode(event);
  if (!modeCheck.ok) {
    console.warn("[stripe/webhook] ignored event due to livemode mismatch", {
      type: event.type,
      id: event.id,
      livemode: event.livemode,
      reason: modeCheck.reason,
    });
    return NextResponse.json({ received: true, ignored: modeCheck.reason });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      // Pay-once purchase: there is no Stripe subscription to read, so grant a
      // fixed access window instead of the recurring path below.
      if (userId && session.mode === "payment") {
        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;

        if (session.payment_status !== "paid" || !paymentIntentId || !session.customer) {
          console.warn("[stripe/webhook] one-time checkout not payable", {
            userId,
            paymentStatus: session.payment_status,
            hasPaymentIntent: Boolean(paymentIntentId),
          });
          break;
        }

        const tier = parseSubscriptionTier(session.metadata?.tier);
        const interval = parseBillingInterval(session.metadata?.interval);
        const result = await applyOneTimePurchase({
          userId,
          tier,
          interval,
          stripeCustomerId: String(session.customer),
          stripePaymentIntentId: paymentIntentId,
        });

        if (!result.applied) {
          console.info("[stripe/webhook] one-time purchase already applied", {
            userId,
            paymentIntentId,
          });
          break;
        }

        invalidateSubscriptionStatusCache(userId);
        trackEvent({
          userId,
          eventType: EVENT_TYPES.BILLING_CHECKOUT,
          category: "billing",
          metadata: {
            purchaseType: "one_time",
            interval,
            accessEndsAt: result.accessEndsAt.toISOString(),
            livemode: event.livemode,
          },
        });

        const oneTimePromo = session.metadata?.promoCode?.trim();
        if (oneTimePromo) {
          void import("@/lib/promo").then((m) => m.redeemPromoCode(userId, oneTimePromo));
        }
        break;
      }

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;
      if (userId && session.customer && subscriptionId) {
        const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);

        // Only persist premium statuses that Stripe actually confirmed.
        if (stripeSub.status !== "active" && stripeSub.status !== "trialing") {
          console.warn("[stripe/webhook] checkout completed without premium status", {
            userId,
            status: stripeSub.status,
            subscriptionId,
          });
          break;
        }

        // Mid-trial upgrade via Checkout can create a new sub while an old trial sub
        // still exists — cancel the previous one so the customer isn't double-billed.
        const prior = await prisma.subscription.findUnique({
          where: { userId },
          select: { stripeSubscriptionId: true },
        });
        if (
          prior?.stripeSubscriptionId &&
          prior.stripeSubscriptionId !== subscriptionId &&
          prior.stripeSubscriptionId.startsWith("sub_") &&
          !prior.stripeSubscriptionId.includes("_seed_")
        ) {
          try {
            await stripe.subscriptions.cancel(prior.stripeSubscriptionId);
          } catch (err) {
            console.warn("[stripe/webhook] could not cancel prior subscription", {
              userId,
              priorId: prior.stripeSubscriptionId,
              err,
            });
          }
        }

        const periodEnd = subscriptionCurrentPeriodEnd(stripeSub);
        const trialEndsAt = stripeUnixToDate(stripeSub.trial_end);

        await prisma.subscription.update({
          where: { userId },
          data: {
            stripeCustomerId: String(session.customer),
            stripeSubscriptionId: subscriptionId,
            status: stripeSub.status,
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
          metadata: { status: stripeSub.status, livemode: event.livemode },
        });

        const promoCode =
          session.metadata?.promoCode?.trim() ||
          stripeSub.metadata?.promoCode?.trim();
        if (promoCode) {
          void import("@/lib/promo").then((m) => m.redeemPromoCode(userId, promoCode));
        }

        if (session.metadata?.plan === "trial" && stripeSub.status === "trialing") {
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
    // Pay-once purchases have no subscription to cancel, so a refund or a lost
    // dispute is the only signal that access should end.
    case "charge.refunded":
    case "charge.dispute.closed": {
      const charge =
        event.type === "charge.refunded"
          ? (event.data.object as Stripe.Charge)
          : ((event.data.object as Stripe.Dispute).charge as Stripe.Charge | string);
      const chargeObj =
        typeof charge === "string" ? await stripe.charges.retrieve(charge) : charge;

      if (event.type === "charge.dispute.closed") {
        const dispute = event.data.object as Stripe.Dispute;
        if (dispute.status !== "lost") break;
      } else if (!chargeObj.refunded) {
        // Partial refund — leave the access window alone.
        break;
      }

      const paymentIntentId =
        typeof chargeObj.payment_intent === "string"
          ? chargeObj.payment_intent
          : chargeObj.payment_intent?.id;
      if (!paymentIntentId) break;

      const revokedUserId = await revokeOneTimePurchase(paymentIntentId);
      if (revokedUserId) {
        invalidateSubscriptionStatusCache(revokedUserId);
        trackEvent({
          userId: revokedUserId,
          eventType: EVENT_TYPES.BILLING_SUBSCRIPTION_UPDATED,
          category: "billing",
          metadata: { purchaseType: "one_time", event: event.type, revoked: true },
        });
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
