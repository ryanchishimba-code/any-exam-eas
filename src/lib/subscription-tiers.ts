import type { BillingInterval } from "@/lib/billing-config";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { drugsDeckFeatureLine } from "@/lib/marketing/bank-stats";

/** Single paid subscription tier — Pro only. */
export type SubscriptionTier = "pro";

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = ["pro"];

/** Monthly anchor price before multi-month savings. */
export const TIER_MONTHLY_USD: Record<SubscriptionTier, number> = {
  pro: Number(process.env.PRO_MONTHLY_PRICE_USD ?? process.env.MONTHLY_PRICE_USD ?? "34.99"),
};

/** Fixed annual totals (marketing-optimized; effective ~17% savings vs monthly). */
export const TIER_ANNUAL_USD: Record<SubscriptionTier, number> = {
  pro: Number(process.env.PRO_YEARLY_PRICE_USD ?? process.env.YEARLY_PRICE_USD ?? "349.99"),
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
  "Unlimited questions & rich goat-mode rationales",
  "AI Tutor",
  "Unlimited full-length mock exams",
  "Advanced analytics & weak-area targeting",
  "Spaced Repetition System",
  "Full Deep Dive Modules",
  "Proprietary Roadmaps",
  "Top 509 Drugs deck & Anatomy Explorer",
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
    | "tutor";
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
    icon: "tutor",
    title: "AI Tutor",
    blurb: "Get instant help on tough concepts without leaving your study flow.",
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
    title: "Rich goat-mode explanations",
    blurb: "Deeper, clearer rationales that explain the why, not just the what.",
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
  "Full Pro access — all 6 banks, mocks, AI Tutor, analytics & more",
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
