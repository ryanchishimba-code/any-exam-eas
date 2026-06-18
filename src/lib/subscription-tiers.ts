import type { BillingInterval } from "@/lib/billing-config";

/** Subscription tier — Basic or Pro. */
export type SubscriptionTier = "basic" | "pro";

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = ["basic", "pro"];

/** Monthly anchor prices before multi-month savings. */
export const TIER_MONTHLY_USD: Record<SubscriptionTier, number> = {
  basic: Number(process.env.BASIC_MONTHLY_PRICE_USD ?? "27.99"),
  pro: Number(process.env.PRO_MONTHLY_PRICE_USD ?? "38.99"),
};

/** Fixed annual totals (marketing-optimized; effective ~20% savings vs monthly). */
export const TIER_ANNUAL_USD: Record<SubscriptionTier, number> = {
  basic: Number(process.env.BASIC_YEARLY_PRICE_USD ?? "269"),
  pro: Number(process.env.PRO_YEARLY_PRICE_USD ?? "375"),
};

export type TierDefinition = {
  id: SubscriptionTier;
  name: string;
  tagline: string;
  recommended: boolean;
  monthlyUsd: number;
  features: readonly string[];
  proOnly?: boolean;
};

/** Universal features included on both tiers. */
export const UNIVERSAL_FEATURES = [
  "Full access to all 6 exams (USMLE, NCLEX, NAPLEX, PANCE, AANP FNP, NPTE-PT)",
  "Unlimited question bank & timed practice",
  "Proprietary Roadmap tools",
  "Normal Lab Values + Clinical Calculators",
  "Top 503 Drugs database",
] as const;

/** Pro-only features. */
export const PRO_ONLY_FEATURES = [
  "Full Deep Dive Modules (integrated with questions)",
  "Advanced performance analytics & weak area targeting",
  "Spaced Repetition System",
  "Priority content updates",
  "Unlimited full-length mock exams",
  "Adaptive & weak-area question selection",
  "Exportable notes & progress reports",
  "Enhanced detailed explanations",
] as const;

/** Trial study limits — shown in marketing copy. */
export const TRIAL_STUDY_LIMITS = [
  "25 questions per day during free trial",
  "150 total trial questions — enough to evaluate the platform",
  "Short timed drills only · unlimited questions unlock when you subscribe",
] as const;

export const TIER_DEFINITIONS: Record<SubscriptionTier, TierDefinition> = {
  basic: {
    id: "basic",
    name: "Basic",
    tagline: "Everything you need to pass — all 6 exams, one plan",
    recommended: false,
    monthlyUsd: TIER_MONTHLY_USD.basic,
    features: UNIVERSAL_FEATURES,
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "Advanced analytics, Deep Dives & unlimited mock exams",
    recommended: true,
    monthlyUsd: TIER_MONTHLY_USD.pro,
    features: [...UNIVERSAL_FEATURES, ...PRO_ONLY_FEATURES],
    proOnly: true,
  },
};

export function parseSubscriptionTier(value: unknown): SubscriptionTier {
  if (value === "basic" || value === "pro") return value;
  return "pro";
}

export function getTierDefinition(tier: SubscriptionTier): TierDefinition {
  return TIER_DEFINITIONS[tier];
}

/** Lowest monthly anchor — used in marketing "from $X/mo" copy. */
export function startingMonthlyUsd(): number {
  return Math.min(TIER_MONTHLY_USD.basic, TIER_MONTHLY_USD.pro);
}
