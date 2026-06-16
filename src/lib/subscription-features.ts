import type { SubscriptionTier } from "@/lib/subscription-tiers";

/** Feature keys for tier-based access control. */
export type SubscriptionFeature =
  | "question_bank"
  | "practice_exams"
  | "roadmap_tools"
  | "lab_values"
  | "clinical_calculators"
  | "drug_database"
  | "deep_dive_modules"
  | "advanced_analytics"
  | "spaced_repetition"
  | "priority_updates"
  | "unlimited_mock_exams"
  | "exportable_notes"
  | "enhanced_explanations"
  | "flashcards";

const BASIC_FEATURES = new Set<SubscriptionFeature>([
  "question_bank",
  "practice_exams",
  "roadmap_tools",
  "lab_values",
  "clinical_calculators",
  "drug_database",
]);

const PRO_FEATURES = new Set<SubscriptionFeature>([
  ...BASIC_FEATURES,
  "deep_dive_modules",
  "advanced_analytics",
  "spaced_repetition",
  "priority_updates",
  "unlimited_mock_exams",
  "exportable_notes",
  "enhanced_explanations",
  "flashcards",
]);

/** Whether a tier includes a specific feature. Staff/comp access should pass tier="pro". */
export function tierHasFeature(tier: SubscriptionTier, feature: SubscriptionFeature): boolean {
  if (tier === "pro") return PRO_FEATURES.has(feature);
  return BASIC_FEATURES.has(feature);
}

export type UserSubscriptionContext = {
  tier: SubscriptionTier;
  planDuration: import("@/lib/billing-config").BillingInterval;
  hasAccess: boolean;
};

/** Check feature access for a subscribed user. Returns false when hasAccess is false. */
export function hasFeatureAccess(
  ctx: UserSubscriptionContext,
  feature: SubscriptionFeature
): boolean {
  if (!ctx.hasAccess) return false;
  return tierHasFeature(ctx.tier, feature);
}

/** Resolve tier from stored planTier string (defaults to pro for legacy rows). */
export function resolveStoredTier(planTier: string | null | undefined): SubscriptionTier {
  if (planTier === "basic" || planTier === "pro") return planTier;
  return "pro";
}
