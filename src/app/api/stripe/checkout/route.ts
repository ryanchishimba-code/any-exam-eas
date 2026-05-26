import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  createCheckoutSession,
  createEmbeddedCheckoutSession,
} from "@/lib/stripe";
import { getSubscriptionAccess } from "@/lib/subscription-access";
import { isStripeConfigured } from "@/lib/payments";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Payments are not configured yet. Add Stripe keys in environment variables.",
      },
      { status: 503 }
    );
  }

  const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const access = await getSubscriptionAccess(session.user.id);

  if (access.hasAccess && access.status === "active") {
    return NextResponse.json(
      { error: "You already have an active subscription." },
      { status: 400 }
    );
  }

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const body = await req.json().catch(() => ({}));
  const embedded = body?.embedded === true;

  const baseParams = {
    customerEmail: session.user.email,
    userId: session.user.id,
    stripeCustomerId: sub?.stripeCustomerId,
    includeTrial: false,
    successUrl: embedded
      ? `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`
      : `${origin}/dashboard?checkout=success`,
    cancelUrl: embedded ? `${origin}/checkout?cancelled=1` : `${origin}/pricing?checkout=cancelled`,
  };

  try {
    if (embedded) {
      const checkout = await createEmbeddedCheckoutSession(baseParams);
      if (!checkout.client_secret) {
        return NextResponse.json(
          { error: "Could not start embedded checkout." },
          { status: 500 }
        );
      }
      return NextResponse.json({ clientSecret: checkout.client_secret });
    }

    const checkout = await createCheckoutSession(baseParams);
    return NextResponse.json({ url: checkout.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
