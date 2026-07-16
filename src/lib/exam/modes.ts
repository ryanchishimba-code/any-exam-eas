import { ROUTES, fullExamHref } from "@/lib/routes";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import type { ExamSessionMode } from "./exam-lengths";
export type ExamModeId = "timed" | "bank";

export type ExamModeDefinition = {
  id: ExamModeId;
  label: string;
  description: string;
  href: string;
  studyMode: "timed" | "practice";
  param: string;
  sessionMode: ExamSessionMode;
};

export const EXAM_MODES: ExamModeDefinition[] = [
  {
    id: "timed",
    label: "Timed Exam",
    description: "Full simulated exam with mixed questions",
    href: ROUTES.fullExam,
    studyMode: "timed",
    param: "timed",
    sessionMode: "timed",
  },
  {
    id: "bank",
    label: "Question Bank",
    description: "Custom practice — pick a topic, set question count, timed or untimed",
    href: ROUTES.questionBank,
    studyMode: "practice",
    param: "bank",
    sessionMode: "bank",
  },
];

export function getExamMode(id: ExamModeId): ExamModeDefinition | undefined {
  return EXAM_MODES.find((m) => m.id === id);
}

export function examModeHref(mode: ExamModeDefinition, fieldId: string): string {
  if (mode.id === "bank") {
    return `${ROUTES.questionBank}?field=${encodeURIComponent(fieldId)}`;
  }
  const slug = examSlugFromFieldId(fieldId);
  if (slug) return fullExamHref(slug);
  return ROUTES.fullExam;
}

/** Flexible question bank session bounds. */
export const QUESTION_BANK_MIN_COUNT = 5;
export const QUESTION_BANK_MAX_COUNT = 100;

/** Quick-pick counts for question bank sessions. */
export const QUESTION_BANK_COUNT_PRESETS = [10, 25, 50, 75, 100] as const;

/** @deprecated Use QUESTION_BANK_COUNT_PRESETS */
export const QUESTION_BANK_COUNT_OPTIONS = QUESTION_BANK_COUNT_PRESETS;

export function clampQuestionBankCount(value: number): number {
  if (!Number.isFinite(value)) return 25;
  return Math.min(
    QUESTION_BANK_MAX_COUNT,
    Math.max(QUESTION_BANK_MIN_COUNT, Math.round(value))
  );
}

export type QuestionBankPace = "timed" | "untimed";

/** How questions are chosen in question bank mode. */
export type QuestionBankStyle =
  | "standard"
  | "adaptive"
  | "weak_areas"
  | "review_incorrect";

export function parseQuestionBankPace(value: string | null | undefined): QuestionBankPace {
  return value === "timed" ? "timed" : "untimed";
}

export function parseQuestionBankStyle(value: string | null | undefined): QuestionBankStyle {
  if (
    value === "adaptive" ||
    value === "weak_areas" ||
    value === "review_incorrect"
  ) {
    return value;
  }
  return "standard";
}
