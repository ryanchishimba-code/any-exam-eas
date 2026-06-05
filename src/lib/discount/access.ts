/**
 * Discount codes affect price only — never subscription feature tier.
 * Premium access is determined solely by Stripe status (active/trialing) + account status.
 */

export const FULL_SUBSCRIPTION_FEATURES = [
  "question_bank",
  "practice_exams",
  "adaptive_learning",
  "analytics",
  "ai_generation",
  "flashcards",
  "exam_hubs",
] as const;

export type SubscriptionFeature = (typeof FULL_SUBSCRIPTION_FEATURES)[number];

/** All features enabled for discounted and standard subscribers alike. */
export function featuresForSubscriber(_usedDiscount?: boolean): SubscriptionFeature[] {
  return [...FULL_SUBSCRIPTION_FEATURES];
}

export const FULL_ACCESS_COPY =
  "Full benefits included — same exams, AI engine, analytics, and practice tools as standard pricing.";

export const FULL_BENEFITS_HEADLINE = "Full benefits included";
