import {
  BILLING_INTERVAL_SAVINGS,
  INTERVAL_MONTHS,
  type BillingInterval,
} from "@/lib/billing-config";
import { intervalTotalUsd } from "@/lib/billing-plans";
import type { SubscriptionTier } from "@/lib/subscription-tiers";

/** Env var for each Stripe Price object (Pro × interval). */
export const STRIPE_PRICE_ENV_KEYS: Record<
  SubscriptionTier,
  Record<BillingInterval, string>
> = {
  pro: {
    monthly: "STRIPE_PRO_PRICE_ID_MONTHLY",
    quarterly: "STRIPE_PRO_PRICE_ID_QUARTERLY",
    semiannual: "STRIPE_PRO_PRICE_ID_SEMIANNUAL",
    yearly: "STRIPE_PRO_PRICE_ID_YEARLY",
  },
};

/** Legacy env var fallback (pre-tier migration — maps to Pro). */
const LEGACY_STRIPE_PRICE_ENV_KEYS: Record<BillingInterval, string> = {
  monthly: "STRIPE_PRICE_ID",
  quarterly: "STRIPE_PRICE_ID_QUARTERLY",
  semiannual: "STRIPE_PRICE_ID_SEMIANNUAL",
  yearly: "STRIPE_PRICE_ID_YEARLY",
};

/** Legacy Basic price env keys — still recognized for existing subscriptions. */
const LEGACY_BASIC_STRIPE_PRICE_ENV_KEYS: Record<BillingInterval, string> = {
  monthly: "STRIPE_BASIC_PRICE_ID_MONTHLY",
  quarterly: "STRIPE_BASIC_PRICE_ID_QUARTERLY",
  semiannual: "STRIPE_BASIC_PRICE_ID_SEMIANNUAL",
  yearly: "STRIPE_BASIC_PRICE_ID_YEARLY",
};

/** Expected charge in USD — must match Stripe Price unit_amount / 100. */
export function expectedIntervalUsd(tier: SubscriptionTier, interval: BillingInterval): number {
  return intervalTotalUsd(tier, interval);
}

export function expectedIntervalCents(tier: SubscriptionTier, interval: BillingInterval): number {
  return Math.round(expectedIntervalUsd(tier, interval) * 100);
}

/** Ensure configured Stripe Price unit_amount matches tier-derived totals. */
export async function assertStripePriceMatchesConfig(
  stripe: import("stripe").default,
  tier: SubscriptionTier,
  interval: BillingInterval
): Promise<void> {
  const priceId = requireStripePriceId(tier, interval);
  const price = await stripe.prices.retrieve(priceId);
  const expectedCents = expectedIntervalCents(tier, interval);
  const actualCents = price.unit_amount ?? 0;

  if (actualCents !== expectedCents) {
    const envKey = STRIPE_PRICE_ENV_KEYS[tier][interval];
    throw new Error(
      `${envKey} (${priceId}) charges $${(actualCents / 100).toFixed(2)} but config expects $${(expectedCents / 100).toFixed(2)} for ${tier}/${interval}. Run \`npm run stripe:sync-prices\` and redeploy.`
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

export function getStripePriceId(
  tier: SubscriptionTier,
  interval: BillingInterval
): string | undefined {
  const key = STRIPE_PRICE_ENV_KEYS[tier][interval];
  const value = process.env[key]?.trim();
  if (value?.startsWith("price_")) return value;

  const legacyKey = LEGACY_STRIPE_PRICE_ENV_KEYS[interval];
  const legacy = process.env[legacyKey]?.trim();
  if (legacy?.startsWith("price_")) return legacy;

  return undefined;
}

export function isIntervalPriceConfigured(
  tier: SubscriptionTier,
  interval: BillingInterval
): boolean {
  return Boolean(getStripePriceId(tier, interval));
}

/** Required price ID for checkout — throws with actionable message if missing. */
export function intervalFromPriceId(priceId: string): {
  tier: SubscriptionTier;
  interval: BillingInterval;
} | null {
  for (const interval of Object.keys(STRIPE_PRICE_ENV_KEYS.pro) as BillingInterval[]) {
    if (getStripePriceId("pro", interval) === priceId) {
      return { tier: "pro", interval };
    }
  }
  for (const interval of Object.keys(LEGACY_BASIC_STRIPE_PRICE_ENV_KEYS) as BillingInterval[]) {
    const legacyBasic = process.env[LEGACY_BASIC_STRIPE_PRICE_ENV_KEYS[interval]]?.trim();
    if (legacyBasic === priceId) {
      return { tier: "pro", interval };
    }
  }
  return null;
}

export function requireStripePriceId(
  tier: SubscriptionTier,
  interval: BillingInterval
): string {
  const priceId = getStripePriceId(tier, interval);
  if (priceId?.startsWith("price_")) return priceId;

  const envKey = STRIPE_PRICE_ENV_KEYS[tier][interval];
  const savings = BILLING_INTERVAL_SAVINGS[interval];
  const amount = expectedIntervalUsd(tier, interval);
  const suffix =
    savings > 0
      ? ` ($${amount.toFixed(2)} every ${INTERVAL_MONTHS[interval]} mo, save ${savings}%)`
      : ` ($${amount.toFixed(2)}/mo)`;

  throw new Error(
    `${envKey} is not set${suffix}. Run \`npm run stripe:setup\` or create the Price in Stripe Dashboard.`
  );
}

export type StripePriceSetupStatus = {
  tier: SubscriptionTier;
  interval: BillingInterval;
  envKey: string;
  configured: boolean;
  priceId: string | null;
  expectedUsd: number;
  savingsPercent: number;
};

export function getStripePriceSetupStatus(): StripePriceSetupStatus[] {
  const intervals = Object.keys(STRIPE_PRICE_ENV_KEYS.pro) as BillingInterval[];
  return intervals.map((interval) => ({
    tier: "pro" as const,
    interval,
    envKey: STRIPE_PRICE_ENV_KEYS.pro[interval],
    configured: isIntervalPriceConfigured("pro", interval),
    priceId: getStripePriceId("pro", interval) ?? null,
    expectedUsd: expectedIntervalUsd("pro", interval),
    savingsPercent: BILLING_INTERVAL_SAVINGS[interval],
  }));
}

export function getMissingStripePriceEnvKeys(): string[] {
  return getStripePriceSetupStatus()
    .filter((s) => !s.configured)
    .map((s) => s.envKey);
}

/** True when all Pro interval prices are configured. */
export function areAllTierPricesConfigured(): boolean {
  return getMissingStripePriceEnvKeys().length === 0;
}

/** True when Pro tier has all intervals (minimum for checkout). */
export function isProFullyConfigured(): boolean {
  const intervals = Object.keys(STRIPE_PRICE_ENV_KEYS.pro) as BillingInterval[];
  return intervals.every((i) => isIntervalPriceConfigured("pro", i));
}

/** @deprecated Basic tier removed — alias for isProFullyConfigured. */
export function isBasicFullyConfigured(): boolean {
  return isProFullyConfigured();
}
