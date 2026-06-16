import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { changeSubscriptionPlan, getSubscriptionBillingDetails, stripe } from "@/lib/stripe";
import {
  getBillingPlanTier,
  parseBillingInterval,
  intervalTotalUsd,
  formatPlanUsd,
} from "@/lib/billing-plans";
import { requireStripePriceId } from "@/lib/stripe-prices";
import { isStripeConfigured } from "@/lib/payments";
import { requireSessionGuard } from "@/lib/session-guard";
import { parseSubscriptionTier, type SubscriptionTier } from "@/lib/subscription-tiers";
import type { BillingInterval } from "@/lib/billing-config";

export const runtime = "nodejs";

function formatEffectiveDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** POST /api/stripe/change-plan — switch tier or billing interval. */
export async function POST(req: Request) {
  const guard = await requireSessionGuard(req);
  if (!guard.ok) return guard.response;

  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const interval = parseBillingInterval(body?.interval) as BillingInterval;

  const sub = await prisma.subscription.findUnique({
    where: { userId: guard.userId },
  });

  const tier = parseSubscriptionTier(body?.tier ?? sub?.planTier);

  try {
    requireStripePriceId(tier, interval);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Price not configured";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  if (!sub?.stripeSubscriptionId) {
    await prisma.subscription.update({
      where: { userId: guard.userId },
      data: { planTier: tier, planInterval: interval },
    });
    return NextResponse.json({
      ok: true,
      tier,
      interval,
      message: "Plan preference saved. Complete checkout to start your trial — billing begins when the trial ends.",
    });
  }

  if (sub.status !== "trialing" && sub.status !== "active") {
    return NextResponse.json(
      { error: "Start or renew a subscription before changing plans." },
      { status: 400 }
    );
  }

  const billing = await getSubscriptionBillingDetails(sub.stripeSubscriptionId);
  const currentTier = parseSubscriptionTier(sub.planTier);
  const currentInterval = parseBillingInterval(sub.planInterval);

  if (
    billing?.pendingPlanInterval === interval &&
    (billing.pendingPlanTier ?? currentTier) === tier
  ) {
    const when = billing.currentPeriodEnd
      ? formatEffectiveDate(billing.currentPeriodEnd)
      : "the end of your current period";
    return NextResponse.json({
      ok: true,
      tier,
      interval,
      effective: "period_end",
      effectiveAt: billing.currentPeriodEnd?.toISOString() ?? null,
      message: `Your switch to ${getBillingPlanTier(tier, interval).label} is already scheduled for ${when}. No charge until then.`,
    });
  }

  if (
    !billing?.pendingPlanInterval &&
    !billing?.pendingPlanTier &&
    currentInterval === interval &&
    currentTier === tier
  ) {
    return NextResponse.json({
      ok: true,
      message: "You are already on this plan.",
      tier,
      interval,
    });
  }

  try {
    const result = await changeSubscriptionPlan({
      stripeSubscriptionId: sub.stripeSubscriptionId,
      tier,
      interval,
      userId: guard.userId,
    });

    const planTier = getBillingPlanTier(tier, interval);
    const charge = formatPlanUsd(intervalTotalUsd(tier, interval));

    if (result.effective === "immediate") {
      return NextResponse.json({
        ok: true,
        tier,
        interval,
        effective: result.effective,
        message: `Plan updated to ${planTier.label}. No charge now — recurring billing starts at ${charge} when your trial ends. You can switch again anytime before then.`,
      });
    }

    const when = result.effectiveAt
      ? formatEffectiveDate(result.effectiveAt)
      : "the end of your current period";

    return NextResponse.json({
      ok: true,
      tier,
      interval,
      effective: result.effective,
      effectiveAt: result.effectiveAt?.toISOString() ?? null,
      message: `${planTier.label} scheduled for ${when}. No charge until the switch — your saved payment method will be billed ${charge} only when the new plan starts.`,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not update plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
