import { isIntervalPriceConfigured, isProFullyConfigured } from "@/lib/stripe-prices";

/**
 * Checkout Sessions omit `payment_method_types` so Stripe Dashboard dynamic
 * payment methods apply. Apple Pay and Google Pay ride on `card` and only
 * appear when the domain is verified and the shopper's device supports them.
 */

/** Supported payment rails surfaced in marketing / checkout trust UI. */
export const PAYMENT_METHODS = [
  {
    id: "card",
    label: "Credit & debit cards",
    description: "Visa, Mastercard, American Express, Discover, and more",
  },
  {
    id: "apple_pay",
    label: "Apple Pay",
    description: "Pay with Face ID or Touch ID on Apple devices",
  },
  {
    id: "google_pay",
    label: "Google Pay",
    description: "Fast checkout on Android and Chrome",
  },
  {
    id: "link",
    label: "Link",
    description: "Save your details for faster repeat checkout",
  },
] as const;

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
      isIntervalPriceConfigured("pro", "monthly")
  );
}

export function isStripeFullyConfigured(): boolean {
  if (!isStripeConfigured()) return false;
  return isProFullyConfigured();
}
