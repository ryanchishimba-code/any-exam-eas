import { NextResponse } from "next/server";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { TIER_MONTHLY_USD } from "@/lib/subscription-tiers";
import { isStripeConfigured, isStripeFullyConfigured, PAYMENT_METHODS } from "@/lib/payments";
import {
  areOneTimePricesConfigured,
  getMissingOneTimePriceEnvKeys,
  getStripePriceSetupStatus,
} from "@/lib/stripe-prices";
import { isPaymentModeChoiceEnabled } from "@/lib/billing-payment-mode";

export const runtime = "nodejs";

/** Public Stripe config for client-side Embedded Checkout (no secrets). */
export async function GET() {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  const configured = isStripeConfigured();
  const allIntervalsConfigured = isStripeFullyConfigured();
  const priceStatus = getStripePriceSetupStatus();

  // Pay-once needs both the operator opt-in and real one-time prices in Stripe.
  const oneTimePaymentsAvailable =
    isPaymentModeChoiceEnabled() && areOneTimePricesConfigured("pro");

  const missing: string[] = [];
  if (!process.env.STRIPE_SECRET_KEY?.trim()) missing.push("STRIPE_SECRET_KEY");
  if (!publishableKey.trim()) missing.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  for (const p of priceStatus) {
    if (!p.configured) missing.push(p.envKey);
  }
  if (isPaymentModeChoiceEnabled()) {
    missing.push(...getMissingOneTimePriceEnvKeys("pro"));
  }

  return NextResponse.json({
    configured,
    allIntervalsConfigured,
    oneTimePaymentsAvailable,
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
