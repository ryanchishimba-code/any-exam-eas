import type { SubscriptionFeature } from "@/lib/subscription-features";

/** Human-readable labels for upgrade prompts — safe for client bundles. */
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
  ai_tutor: "AI Tutor",
  anatomy_explorer: "Anatomy Explorer",
};

export function proUpgradeHref(feature: SubscriptionFeature): string {
  return `/pricing?upgrade=pro&feature=${encodeURIComponent(feature)}`;
}
