import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { changeSubscriptionPlan, getSubscriptionBillingDetails, stripe } from "@/lib/stripe";
import { getBillingPlanTier, parseBillingInterval, intervalTotalUsd, formatPlanUsd } from "@/lib/billing-plans";
import { requireStripePriceId } from "@/lib/stripe-prices";
import { isStripeConfigured } from "@/lib/payments";
import { requireSessionGuard } from "@/lib/session-guard";
import type { BillingInterval } from "@/lib/billing-config";

export const runtime = "nodejs";

function formatEffectiveDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** POST /api/stripe/change-plan — switch billing interval during trial or active subscription. */
export async function POST(req: Request) {
  const guard = await requireSessionGuard(req);
  if (!guard.ok) return guard.response;

  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const interval = parseBillingInterval(body?.interval) as BillingInterval;

  try {
    requireStripePriceId(interval);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Price not configured";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  const sub = await prisma.subscription.findUnique({
    where: { userId: guard.userId },
  });

  if (!sub?.stripeSubscriptionId) {
    return NextResponse.json(
      {
        error:
          "Add a payment method first to start your trial, then you can change plans here.",
      },
      { status: 400 }
    );
  }

  if (sub.status !== "trialing" && sub.status !== "active") {
    return NextResponse.json(
      { error: "Start or renew a subscription before changing plans." },
      { status: 400 }
    );
  }

  const billing = await getSubscriptionBillingDetails(sub.stripeSubscriptionId);
  const currentInterval = parseBillingInterval(sub.planInterval);

  if (billing?.pendingPlanInterval === interval) {
    const when = billing.currentPeriodEnd
      ? formatEffectiveDate(billing.currentPeriodEnd)
      : "the end of your current period";
    return NextResponse.json({
      ok: true,
      interval,
      effective: "period_end",
      effectiveAt: billing.currentPeriodEnd?.toISOString() ?? null,
      message: `Your switch to ${getBillingPlanTier(interval).label} is already scheduled for ${when}. No charge until then.`,
    });
  }

  if (!billing?.pendingPlanInterval && currentInterval === interval) {
    return NextResponse.json({
      ok: true,
      message: "You are already on this billing plan.",
      interval,
    });
  }

  try {
    const result = await changeSubscriptionPlan({
      stripeSubscriptionId: sub.stripeSubscriptionId,
      interval,
      userId: guard.userId,
    });

    const tier = getBillingPlanTier(interval);

    if (result.effective === "immediate") {
      return NextResponse.json({
        ok: true,
        interval,
        effective: result.effective,
        message: `Plan updated to ${tier.label}. No charge now — recurring billing starts at ${formatPlanUsd(intervalTotalUsd(interval))} when your trial ends. You can switch again anytime before then.`,
      });
    }

    const when = result.effectiveAt
      ? formatEffectiveDate(result.effectiveAt)
      : "the end of your current period";

    return NextResponse.json({
      ok: true,
      interval,
      effective: result.effective,
      effectiveAt: result.effectiveAt?.toISOString() ?? null,
      message: `${tier.label} scheduled for ${when}. No charge until the switch — your saved payment method will be billed ${formatPlanUsd(intervalTotalUsd(interval))} only when the new plan starts.`,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not update plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
