import type { ExamSlug } from "@/types/edtech";
import { EXAM_CATALOG } from "@/lib/edtech/exams";

export function trialUpgradeKeepFeatures(examSlug: ExamSlug): string[] {
  const board = EXAM_CATALOG[examSlug].shortName;
  const features = [
    `Full ${board} question bank and explanations`,
    "Adaptive full-length mocks",
    "Analytics, readiness, and weak-area targeting",
  ];
  if (examSlug === "nclex") {
    features.push("Quick Bites video drills");
  }
  return features;
}
