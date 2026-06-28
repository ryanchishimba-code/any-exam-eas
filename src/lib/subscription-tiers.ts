import type { BillingInterval } from "@/lib/billing-config";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { drugsDeckFeatureLine } from "@/lib/marketing/bank-stats";

/** Subscription tier — Basic or Pro. */
export type SubscriptionTier = "basic" | "pro";

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = ["basic", "pro"];

/** Monthly anchor prices before multi-month savings. */
export const TIER_MONTHLY_USD: Record<SubscriptionTier, number> = {
  basic: Number(process.env.BASIC_MONTHLY_PRICE_USD ?? "27.99"),
  pro: Number(process.env.PRO_MONTHLY_PRICE_USD ?? "34.99"),
};

/** Fixed annual totals (marketing-optimized; effective ~17% savings vs monthly). */
export const TIER_ANNUAL_USD: Record<SubscriptionTier, number> = {
  basic: Number(process.env.BASIC_YEARLY_PRICE_USD ?? "279"),
  pro: Number(process.env.PRO_YEARLY_PRICE_USD ?? "349"),
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
  "50-question practice mocks on every exam",
  "Proprietary Roadmap tools",
  "Normal Lab Values + Clinical Calculators",
  drugsDeckFeatureLine(),
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

/**
 * Canonical Pro upgrade story — the single source of truth for "what Pro
 * unlocks" copy used by the comparison component, landing pages, and in-app
 * upsells. Keep this aligned with PRO_ONLY_FEATURES (the pricing checklist) and
 * the runtime SubscriptionFeature gates in subscription-features.ts.
 *
 * `icon` is a stable key mapped to a lucide icon at the component layer so this
 * module stays free of UI dependencies.
 */
export type ProFeatureHighlight = {
  icon:
    | "analytics"
    | "srs"
    | "mock"
    | "deepdive"
    | "notes"
    | "explanations"
    | "priority";
  title: string;
  blurb: string;
};

export const PRO_FEATURE_HIGHLIGHTS: readonly ProFeatureHighlight[] = [
  {
    icon: "analytics",
    title: "Advanced analytics & weak-area targeting",
    blurb: "See exactly where you're losing points, then drill the topics that move your score most.",
  },
  {
    icon: "srs",
    title: "Spaced Repetition System",
    blurb: "Lock in what you learn with reviews timed to the moment you're about to forget.",
  },
  {
    icon: "mock",
    title: "Unlimited full-length mock exams",
    blurb: "Rehearse the real thing as many times as you want, under true exam-day conditions.",
  },
  {
    icon: "deepdive",
    title: "Full Deep Dive Modules",
    blurb: "Go beyond the answer with rich teaching woven into every question.",
  },
  {
    icon: "notes",
    title: "Exportable notes & progress reports",
    blurb: "Take your notes and performance data anywhere — study your way.",
  },
  {
    icon: "explanations",
    title: "Enhanced detailed explanations",
    blurb: "Deeper, clearer rationales that explain the why, not just the what.",
  },
  {
    icon: "priority",
    title: "Priority updates & early access",
    blurb: "Get the newest questions and features first, every cycle.",
  },
] as const;

/** Emotional headline reused across upgrade surfaces. */
export const PRO_UPGRADE_HEADLINE = "Unlock your highest score potential";

/** Trial study limits — shown in marketing copy. */
export const TRIAL_STUDY_LIMITS = [
  `${TRIAL_LIFETIME_QUESTIONS} total questions during your ${TRIAL_DAYS}-day trial`,
  "One 50-question mock exam · concise explanations during trial",
  "Upgrade anytime for unlimited questions and rich Pro explanations",
] as const;

export const TIER_DEFINITIONS: Record<SubscriptionTier, TierDefinition> = {
  basic: {
    id: "basic",
    name: "Basic",
    tagline: "Everything you need to prepare — all 6 exams, one plan",
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
