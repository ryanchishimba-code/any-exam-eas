import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createCheckoutSession,
  createEmbeddedCheckoutSession,
} from "@/lib/stripe";
import { getSubscriptionAccess } from "@/lib/subscription-access";
import { isStripeConfigured } from "@/lib/payments";
import { hasConsumedTrial } from "@/lib/trial-eligibility";
import { requireSessionGuard } from "@/lib/session-guard";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const guard = await requireSessionGuard(req);
  if (!guard.ok) return guard.response;

  const session = guard.session;
  if (!session.user.email) {
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
  const plan = body?.plan === "trial" ? ("trial" as const) : ("subscribe" as const);
  const interval =
    body?.interval === "yearly" ? ("yearly" as const) : ("monthly" as const);

  if (plan === "trial" && session.user.email) {
    if (await hasConsumedTrial(session.user.email)) {
      return NextResponse.json(
        { error: "This email has already used a free trial. Subscribe at the monthly rate instead." },
        { status: 400 }
      );
    }
  }

  let stripeCouponId: string | null = null;
  let promoValidation = null;
  if (typeof body?.promoCode === "string" && body.promoCode.trim()) {
    const { validateDiscount } = await import("@/lib/discount");
    const promo = await validateDiscount({
      code: body.promoCode.trim(),
      plan,
      userId: session.user.id,
    });
    promoValidation = promo;
    if (promo.valid && promo.stripeCouponId) {
      stripeCouponId = promo.stripeCouponId;
    }
  }

  let trialEndUnix: number | undefined;
  if (
    plan === "trial" &&
    sub?.trialEndsAt &&
    sub.trialEndsAt.getTime() > Date.now()
  ) {
    trialEndUnix = Math.floor(sub.trialEndsAt.getTime() / 1000);
  }

  const baseParams = {
    customerEmail: session.user.email,
    userId: session.user.id,
    stripeCustomerId: sub?.stripeCustomerId,
    plan,
    interval,
    stripeCouponId,
    trialEndUnix,
    successUrl: embedded
      ? `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`
      : `${origin}/study-hub?checkout=success`,
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
      return NextResponse.json({
        clientSecret: checkout.client_secret,
        promo: promoValidation,
        fullAccessIncluded: true,
      });
    }

    const checkout = await createCheckoutSession(baseParams);
    return NextResponse.json({
      url: checkout.url,
      promo: promoValidation,
      fullAccessIncluded: true,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
