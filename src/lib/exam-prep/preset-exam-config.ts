import type { ExamSlug } from "@/types/edtech";

/** Maximum curated preset exams per board (launcher + API cap). */
export const PRESET_EXAM_MAX = 100;

export function clampPresetExamNumber(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(PRESET_EXAM_MAX, Math.floor(value)));
}

/** Compose slug passed to exam-qa-engine for each public exam. */
export function resolvePresetComposeSlug(examSlug: ExamSlug): string {
  switch (examSlug) {
    case "usmle":
      return "usmle-step-2";
    case "nclex":
      return "nclex";
    case "naplex":
      return "naplex";
    case "pance":
      return "pance";
    case "aanp-fnp":
      return "aanp-fnp";
    case "npte-pt":
      return "npte-pt";
    default:
      return examSlug;
  }
}

/** Default question count for curated preset exams (bank-composed, not adaptive). */
export const PRESET_EXAM_QUESTION_COUNT: Record<ExamSlug, number> = {
  nclex: 80,
  usmle: 80,
  naplex: 85,
  pance: 100,
  "aanp-fnp": 135,
  "npte-pt": 80,
};

export const PRESET_EXAM_SLUGS: ExamSlug[] = [
  "nclex",
  "usmle",
  "naplex",
  "pance",
  "aanp-fnp",
  "npte-pt",
];

/** USMLE step stored on preset metadata rows. */
export function presetStepLevelForComposeSlug(composeSlug: string): string | undefined {
  if (composeSlug === "usmle-step-1") return "step1";
  if (composeSlug === "usmle-step-2") return "step2";
  if (composeSlug === "usmle-step-3") return "step3";
  return undefined;
}
