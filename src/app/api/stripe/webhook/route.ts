import { NextResponse } from "next/server";
import {
  stripe,
  resolveUserIdFromStripeSubscription,
  applySubscriptionFromStripe,
} from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

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

        await prisma.subscription.update({
          where: { userId },
          data: {
            stripeCustomerId: String(session.customer),
            stripeSubscriptionId: String(session.subscription ?? ""),
            status: stripeSub?.status ?? "active",
            ...(stripeSub?.trial_end
              ? { trialEndsAt: new Date(stripeSub.trial_end * 1000) }
              : {}),
            ...(stripeSub?.current_period_end
              ? { currentPeriodEnd: new Date(stripeSub.current_period_end * 1000) }
              : {}),
          },
        });
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
            data: { status: "past_due" },
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
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
