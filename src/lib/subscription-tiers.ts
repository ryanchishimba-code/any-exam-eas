import type { BillingInterval } from "@/lib/billing-config";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { drugsDeckFeatureLine } from "@/lib/marketing/bank-stats";
import { PRO_MONTHLY_PRICE_USD, PRO_YEARLY_PRICE_USD } from "@/lib/pricing-defaults";

/** Single paid subscription tier — Pro only. */
export type SubscriptionTier = "pro";

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = ["pro"];

/** Monthly anchor price before multi-month savings. */
export const TIER_MONTHLY_USD: Record<SubscriptionTier, number> = {
  pro: PRO_MONTHLY_PRICE_USD,
};

/** Fixed annual totals (marketing-optimized; effective ~17% savings vs monthly). */
export const TIER_ANNUAL_USD: Record<SubscriptionTier, number> = {
  pro: PRO_YEARLY_PRICE_USD,
};

export type TierDefinition = {
  id: SubscriptionTier;
  name: string;
  tagline: string;
  recommended: boolean;
  monthlyUsd: number;
  features: readonly string[];
};

/** Everything included in Pro — one plan, all features. */
export const PRO_FEATURES = [
  "Full access to all 6 exam banks (USMLE, NCLEX, NAPLEX, PANCE, AANP FNP, NPTE-PT)",
  "Proprietary Blueprint Roadmaps",
  "Full Deep Dive Modules",
  "Unlimited full-length mock exams & Full Exam simulations",
  "Unlimited questions & rich goat-mode rationales",
  "Advanced analytics & weak-area targeting",
  "Spaced Repetition System",
  "Normal Lab Values + Clinical Calculators",
  "Exportable notes & progress reports",
  "Priority content updates",
] as const;

/** @deprecated Alias for marketing surfaces that referenced UNIVERSAL + PRO split. */
export const UNIVERSAL_FEATURES = PRO_FEATURES;

/** @deprecated Alias — all features are Pro now. */
export const PRO_ONLY_FEATURES = PRO_FEATURES;

export type ProFeatureHighlight = {
  icon:
    | "analytics"
    | "srs"
    | "mock"
    | "deepdive"
    | "notes"
    | "explanations"
    | "priority"
    | "roadmap";
  title: string;
  blurb: string;
};

export const PRO_FEATURE_HIGHLIGHTS: readonly ProFeatureHighlight[] = [
  {
    icon: "roadmap",
    title: "Blueprint Roadmaps",
    blurb: "Know what to study next — adaptive queues mapped to each licensing blueprint.",
  },
  {
    icon: "deepdive",
    title: "Full Deep Dive Modules",
    blurb: "Open structured review from every miss — go beyond the answer choice.",
  },
  {
    icon: "mock",
    title: "Full Exam simulations",
    blurb: "Rehearse board-day pacing with timed Full Exams and weak-area focus.",
  },
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
    icon: "explanations",
    title: "Rich goat-mode explanations",
    blurb: "Deeper, clearer rationales that explain the why, not just the what.",
  },
  {
    icon: "notes",
    title: "Exportable notes & progress reports",
    blurb: "Take your notes and performance data anywhere — study your way.",
  },
  {
    icon: "priority",
    title: "Priority updates & early access",
    blurb: "Get the newest questions and features first, every cycle.",
  },
] as const;

export const PRO_UPGRADE_HEADLINE = "One plan. Everything you need for all 6 boards.";

export const PRICING_VALUE_HEADLINE =
  "One Plan. Everything You Need for All 6 Boards.";

/** Trial study limits — shown in marketing copy. */
export const TRIAL_STUDY_LIMITS = [
  `${TRIAL_LIFETIME_QUESTIONS} practice questions during your ${TRIAL_DAYS}-day trial`,
  "Full Pro access — all 6 banks, Roadmaps, Deep Dives, Full Exams & analytics",
  "No payment required at signup · upgrade anytime for unlimited questions",
] as const;

export const TIER_DEFINITIONS: Record<SubscriptionTier, TierDefinition> = {
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "Everything you need for all 6 boards — one simple plan",
    recommended: true,
    monthlyUsd: TIER_MONTHLY_USD.pro,
    features: PRO_FEATURES,
  },
};

export function parseSubscriptionTier(_value?: unknown): SubscriptionTier {
  return "pro";
}

export function getTierDefinition(tier: SubscriptionTier = "pro"): TierDefinition {
  return TIER_DEFINITIONS[tier];
}

export function startingMonthlyUsd(): number {
  return TIER_MONTHLY_USD.pro;
}
