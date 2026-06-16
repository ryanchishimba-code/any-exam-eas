import { isIntervalPriceConfigured, isProFullyConfigured } from "@/lib/stripe-prices";

/** Payment methods enabled in Stripe Checkout (card includes Apple Pay / Google Pay wallets). */
export const CHECKOUT_PAYMENT_METHOD_TYPES = ["card", "link"] as const;

/** Supported payment rails surfaced in Stripe Checkout (enable in Stripe Dashboard). */
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
