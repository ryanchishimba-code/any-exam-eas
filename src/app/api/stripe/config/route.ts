import { NextResponse } from "next/server";
import { MONTHLY_PRICE_USD, TRIAL_DAYS } from "@/lib/billing-config";
import { isStripeConfigured, PAYMENT_METHODS } from "@/lib/payments";

export const runtime = "nodejs";

/** Public Stripe config for client-side Embedded Checkout (no secrets). */
export async function GET() {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  const configured = isStripeConfigured();

  const missing: string[] = [];
  if (!process.env.STRIPE_SECRET_KEY?.trim()) missing.push("STRIPE_SECRET_KEY");
  if (!publishableKey.trim()) missing.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  if (!process.env.STRIPE_PRICE_ID?.trim()) missing.push("STRIPE_PRICE_ID");

  return NextResponse.json({
    configured,
    publishableKey: publishableKey || null,
    monthlyPriceUsd: MONTHLY_PRICE_USD,
    trialDays: TRIAL_DAYS,
    paymentMethods: PAYMENT_METHODS,
    ...(process.env.NODE_ENV === "development" ? { missing } : {}),
  });
}
