import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  convertTrialSubscriptionToPaid,
  createCheckoutSession,
  createEmbeddedCheckoutSession,
  isUsableStripeSubscriptionId,
} from "@/lib/stripe";
import { getSubscriptionAccess } from "@/lib/subscription-access";
import { isStripeConfigured } from "@/lib/payments";
import { hasConsumedTrial } from "@/lib/trial-eligibility";
import { parseBillingInterval } from "@/lib/billing-plans";
import { requireSessionGuard } from "@/lib/session-guard";
import { requireStripePriceId } from "@/lib/stripe-prices";
import { parseSubscriptionTier } from "@/lib/subscription-tiers";
import { ROUTES } from "@/lib/routes";

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
  const sub = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const body = await req.json().catch(() => ({}));
  const embedded = body?.embedded === true;
  const reactivating = body?.reactivate === true;
  let plan = body?.plan === "trial" ? ("trial" as const) : ("subscribe" as const);
  const tier = parseSubscriptionTier(body?.tier ?? sub?.planTier);
  const interval = parseBillingInterval(body?.interval ?? sub?.planInterval);

  if (access.hasAccess && access.status === "active") {
    return NextResponse.json(
      { error: "You already have an active subscription. Change your plan in Settings." },
      { status: 400 }
    );
  }

  if (access.status === "past_due") {
    return NextResponse.json(
      {
        error:
          "Your last payment failed. Update your payment method in Settings to reactivate your account.",
      },
      { status: 400 }
    );
  }

  // Already on a Stripe trial — allow paid upgrade (convert), block starting another trial.
  if (
    access.status === "trialing" &&
    isUsableStripeSubscriptionId(sub?.stripeSubscriptionId) &&
    plan === "trial" &&
    !reactivating
  ) {
    return NextResponse.json(
      {
        error:
          "Your trial is already active. Choose Upgrade to Pro to start paid billing now.",
        code: "TRIAL_ALREADY_ACTIVE",
      },
      { status: 400 }
    );
  }

  if (session.user.email && (reactivating || plan === "trial")) {
    if (await hasConsumedTrial(session.user.email)) {
      plan = "subscribe";
    }
  }

  try {
    requireStripePriceId(tier, interval);
    const { stripe: stripeClient } = await import("@/lib/stripe");
    if (stripeClient) {
      const { assertStripePriceMatchesConfig } = await import("@/lib/stripe-prices");
      await assertStripePriceMatchesConfig(stripeClient, tier, interval);
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Billing price not configured";
    console.error("[stripe/checkout] price config failed", {
      tier,
      interval,
      message,
    });
    return NextResponse.json({ error: message }, { status: 503 });
  }

  if (plan === "trial" && session.user.email && !reactivating) {
    if (await hasConsumedTrial(session.user.email)) {
      return NextResponse.json(
        { error: "This email has already used a free trial. Subscribe at the standard rate instead." },
        { status: 400 }
      );
    }
  }

  let stripeCouponId: string | null = null;
  let promoCode: string | null = null;
  let promoValidation = null;
  if (typeof body?.promoCode === "string" && body.promoCode.trim()) {
    const { validateDiscount } = await import("@/lib/discount");
    const promo = await validateDiscount({
      code: body.promoCode.trim(),
      plan,
      interval,
      userId: session.user.id,
    });
    promoValidation = promo;
    if (promo.valid) {
      promoCode = promo.code;
      if (promo.stripeCouponId) {
        stripeCouponId = promo.stripeCouponId;
      }
    }
  }

  // First-time Pro monthly: 20% off the first paid invoice (skipped when a promo coupon is already applied).
  if (!stripeCouponId) {
    const {
      shouldApplyFirstMonthDiscount,
      resolveFirstMonthCouponId,
    } = await import("@/lib/billing/first-month-discount");
    if (shouldApplyFirstMonthDiscount({ interval, sub })) {
      try {
        const { stripe: stripeClient } = await import("@/lib/stripe");
        if (stripeClient) {
          stripeCouponId = await resolveFirstMonthCouponId(stripeClient);
        }
      } catch (e) {
        console.warn(
          "[stripe/checkout] first-month coupon unavailable",
          e instanceof Error ? e.message : e
        );
      }
    }
  }

  // Mid-trial upgrade with Stripe sub + card on file: end trial now and start billing.
  if (
    plan === "subscribe" &&
    access.status === "trialing" &&
    isUsableStripeSubscriptionId(sub?.stripeSubscriptionId)
  ) {
    try {
      const converted = await convertTrialSubscriptionToPaid({
        stripeSubscriptionId: sub!.stripeSubscriptionId!,
        userId: session.user.id,
        tier,
        interval,
        stripeCouponId,
        promoCode,
      });
      return NextResponse.json({
        upgraded: true,
        status: converted.status,
        redirectTo: `${ROUTES.dashboard}?checkout=success`,
        promo: promoValidation,
        tier,
        interval,
      });
    } catch (e) {
      if (e instanceof Error && (e.name === "NoPaymentMethodError" || e.message === "NO_PAYMENT_METHOD")) {
        // Fall through to Checkout Session to collect a payment method.
        console.info("[stripe/checkout] trial convert needs payment method — opening checkout");
      } else {
        const message = e instanceof Error ? e.message : "Could not upgrade trial";
        console.error("[stripe/checkout] trial convert failed", { message });
        return NextResponse.json({ error: message }, { status: 500 });
      }
    }
  }

  const baseParams = {
    customerEmail: session.user.email,
    userId: session.user.id,
    stripeCustomerId: sub?.stripeCustomerId,
    plan,
    tier,
    interval,
    stripeCouponId,
    promoCode,
    successUrl: embedded
      ? `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`
      : `${origin}${ROUTES.dashboard}?checkout=success`,
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
        tier,
        interval,
      });
    }

    const checkout = await createCheckoutSession(baseParams);
    return NextResponse.json({
      url: checkout.url,
      promo: promoValidation,
      tier,
      interval,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
