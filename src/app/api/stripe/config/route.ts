import { NextResponse } from "next/server";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { TIER_MONTHLY_USD } from "@/lib/subscription-tiers";
import { isStripeConfigured, isStripeFullyConfigured, PAYMENT_METHODS } from "@/lib/payments";
import { getStripePriceSetupStatus } from "@/lib/stripe-prices";

export const runtime = "nodejs";

/** Public Stripe config for client-side Embedded Checkout (no secrets). */
export async function GET() {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  const configured = isStripeConfigured();
  const allIntervalsConfigured = isStripeFullyConfigured();
  const priceStatus = getStripePriceSetupStatus();

  const missing: string[] = [];
  if (!process.env.STRIPE_SECRET_KEY?.trim()) missing.push("STRIPE_SECRET_KEY");
  if (!publishableKey.trim()) missing.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  for (const p of priceStatus) {
    if (!p.configured) missing.push(p.envKey);
  }

  return NextResponse.json({
    configured,
    allIntervalsConfigured,
    publishableKey: publishableKey || null,
    monthlyPriceUsd: TIER_MONTHLY_USD.pro,
    proMonthlyPriceUsd: TIER_MONTHLY_USD.pro,
    trialDays: TRIAL_DAYS,
    paymentMethods: PAYMENT_METHODS,
    prices: priceStatus.map(({ tier, interval, configured: ok, expectedUsd, savingsPercent }) => ({
      tier,
      interval,
      configured: ok,
      expectedUsd,
      savingsPercent,
    })),
    ...(process.env.NODE_ENV === "development" ? { missing } : {}),
  });
}
