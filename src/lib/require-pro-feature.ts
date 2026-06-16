import { redirect } from "next/navigation";
import { userHasFeature, type UserAccess } from "@/lib/access-control";
import { requirePremiumPage } from "@/lib/require-premium-page";
import type { SubscriptionFeature } from "@/lib/subscription-features";

/** Human-readable labels for upgrade prompts. */
export const PRO_FEATURE_LABELS: Record<SubscriptionFeature, string> = {
  question_bank: "Question banks",
  practice_exams: "Practice exams",
  roadmap_tools: "Exam Roadmaps",
  lab_values: "Lab values",
  clinical_calculators: "Clinical calculators",
  drug_database: "Drug database",
  deep_dive_modules: "Deep Dive modules",
  advanced_analytics: "Advanced analytics",
  spaced_repetition: "Spaced repetition",
  priority_updates: "Priority updates",
  unlimited_mock_exams: "Unlimited mock exams",
  exportable_notes: "Exportable notes",
  enhanced_explanations: "Enhanced explanations",
  flashcards: "Flashcards",
};

export function proUpgradeHref(feature: SubscriptionFeature): string {
  return `/pricing?upgrade=pro&feature=${encodeURIComponent(feature)}`;
}

/** Premium access + Pro-tier feature — redirects Basic users to pricing upgrade. */
export async function requireProFeaturePage(
  feature: SubscriptionFeature,
  callbackPath: string
): Promise<UserAccess> {
  const access = await requirePremiumPage(callbackPath);
  if (!userHasFeature(access, feature)) {
    redirect(proUpgradeHref(feature));
  }
  return access;
}
