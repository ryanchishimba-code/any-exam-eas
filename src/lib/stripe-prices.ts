import {
  BILLING_INTERVAL_SAVINGS,
  INTERVAL_MONTHS,
  MONTHLY_PRICE_USD,
  type BillingInterval,
} from "@/lib/billing-config";
import { intervalTotalUsd } from "@/lib/billing-plans";

/** Env var for each Stripe Price object (recurring subscription). */
export const STRIPE_PRICE_ENV_KEYS: Record<BillingInterval, string> = {
  monthly: "STRIPE_PRICE_ID",
  quarterly: "STRIPE_PRICE_ID_QUARTERLY",
  semiannual: "STRIPE_PRICE_ID_SEMIANNUAL",
  yearly: "STRIPE_PRICE_ID_YEARLY",
};

/** Expected charge in USD — must match Stripe Price unit_amount / 100. */
export function expectedIntervalUsd(interval: BillingInterval): number {
  return intervalTotalUsd(interval);
}

export function expectedIntervalCents(interval: BillingInterval): number {
  return Math.round(expectedIntervalUsd(interval) * 100);
}

/** Ensure configured Stripe Price unit_amount matches MONTHLY_PRICE_USD-derived totals. */
export async function assertStripePriceMatchesConfig(
  stripe: import("stripe").default,
  interval: BillingInterval
): Promise<void> {
  const priceId = requireStripePriceId(interval);
  const price = await stripe.prices.retrieve(priceId);
  const expectedCents = expectedIntervalCents(interval);
  const actualCents = price.unit_amount ?? 0;

  if (actualCents !== expectedCents) {
    const envKey = STRIPE_PRICE_ENV_KEYS[interval];
    throw new Error(
      `${envKey} (${priceId}) charges $${(actualCents / 100).toFixed(2)} but MONTHLY_PRICE_USD=$${MONTHLY_PRICE_USD.toFixed(2)} expects $${(expectedCents / 100).toFixed(2)} for ${interval}. Run \`npm run stripe:sync-prices\` and redeploy.`
    );
  }
}

/** Stripe recurring shape for each billing interval. */
export function stripeRecurringForInterval(interval: BillingInterval): {
  interval: "month" | "year";
  interval_count: number;
} {
  const months = INTERVAL_MONTHS[interval];
  if (interval === "yearly") {
    return { interval: "year", interval_count: 1 };
  }
  return { interval: "month", interval_count: months };
}

export function getStripePriceId(interval: BillingInterval): string | undefined {
  const key = STRIPE_PRICE_ENV_KEYS[interval];
  const value = process.env[key]?.trim();
  return value || undefined;
}

export function isIntervalPriceConfigured(interval: BillingInterval): boolean {
  const id = getStripePriceId(interval);
  return Boolean(id?.startsWith("price_"));
}

/** Required price ID for checkout — throws with actionable message if missing. */
/** Map a Stripe Price ID back to a billing interval (when env vars match). */
export function intervalFromPriceId(priceId: string): BillingInterval | null {
  for (const interval of Object.keys(STRIPE_PRICE_ENV_KEYS) as BillingInterval[]) {
    if (getStripePriceId(interval) === priceId) return interval;
  }
  return null;
}

export function requireStripePriceId(interval: BillingInterval): string {
  const priceId = getStripePriceId(interval);
  if (priceId?.startsWith("price_")) return priceId;

  const envKey = STRIPE_PRICE_ENV_KEYS[interval];
  const savings = BILLING_INTERVAL_SAVINGS[interval];
  const amount = expectedIntervalUsd(interval);
  const suffix =
    savings > 0
      ? ` ($${amount.toFixed(2)} every ${INTERVAL_MONTHS[interval]} mo, save ${savings}%)`
      : ` ($${amount.toFixed(2)}/mo)`;

  throw new Error(
    `${envKey} is not set${suffix}. Run \`npm run stripe:setup\` or create the Price in Stripe Dashboard.`
  );
}

export type StripePriceSetupStatus = {
  interval: BillingInterval;
  envKey: string;
  configured: boolean;
  priceId: string | null;
  expectedUsd: number;
  savingsPercent: number;
};

export function getStripePriceSetupStatus(): StripePriceSetupStatus[] {
  return (Object.keys(STRIPE_PRICE_ENV_KEYS) as BillingInterval[]).map((interval) => ({
    interval,
    envKey: STRIPE_PRICE_ENV_KEYS[interval],
    configured: isIntervalPriceConfigured(interval),
    priceId: getStripePriceId(interval) ?? null,
    expectedUsd: expectedIntervalUsd(interval),
    savingsPercent: BILLING_INTERVAL_SAVINGS[interval],
  }));
}

export function getMissingStripePriceEnvKeys(): string[] {
  return getStripePriceSetupStatus()
    .filter((s) => !s.configured)
    .map((s) => s.envKey);
}
