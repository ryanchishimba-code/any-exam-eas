import { NextResponse } from "next/server";
import { MONTHLY_PRICE_USD, TRIAL_DAYS } from "@/lib/stripe";
import { isStripeConfigured, PAYMENT_METHODS } from "@/lib/payments";

export const runtime = "nodejs";

/** Public Stripe config for client-side Embedded Checkout (no secrets). */
export async function GET() {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

  return NextResponse.json({
    configured: isStripeConfigured(),
    publishableKey: publishableKey || null,
    monthlyPriceUsd: MONTHLY_PRICE_USD,
    trialDays: TRIAL_DAYS,
    paymentMethods: PAYMENT_METHODS,
  });
}
