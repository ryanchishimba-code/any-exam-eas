import {
  QUESTION_BANK_COUNT_PRESETS,
  clampQuestionBankCount,
  type QuestionBankPace,
  type QuestionBankStyle,
} from "@/lib/exam/modes";
import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links";

export { MIXED_SUBJECT_ID };

export const MIXED_SUBJECT_LABEL = "Mixed topics";

export type QuestionBankCountOption = {
  value: number;
  label: string;
  description: string;
};

/** Scroll-wheel options — same presets for every board exam. */
export function questionBankCountOptions(): QuestionBankCountOption[] {
  return QUESTION_BANK_COUNT_PRESETS.map((value) => ({
    value,
    label: `${value} questions`,
    description:
      value <= 10
        ? "Quick drill"
        : value <= 25
          ? "Focused session"
          : value <= 50
            ? "Standard block"
            : value <= 75
              ? "Long block"
              : "Maximum bank session",
  }));
}

export function isMixedSubjectId(subjectId: string): boolean {
  return subjectId === MIXED_SUBJECT_ID;
}

/** Serve-ready pool size for the current topic selection. */
export function availableQuestionCount(
  subjectId: string,
  subjectCounts: Record<string, number> | null | undefined
): number | null {
  if (!subjectCounts) return null;
  if (isMixedSubjectId(subjectId)) {
    return Object.values(subjectCounts).reduce((sum, n) => sum + n, 0);
  }
  return subjectCounts[subjectId] ?? 0;
}

export type QuestionBankSessionValidation = {
  ok: boolean;
  message?: string;
  maxAvailable?: number;
};

/** Pre-flight check before starting a bank session. */
export function validateQuestionBankSession(params: {
  subjectId: string;
  questionCount: number;
  subjectCounts: Record<string, number> | null | undefined;
  bankStyle: QuestionBankStyle;
}): QuestionBankSessionValidation {
  const { subjectId, questionCount, subjectCounts, bankStyle } = params;

  if (!subjectId) {
    return { ok: false, message: "Choose a topic before starting." };
  }

  if (isMixedSubjectId(subjectId) && bankStyle !== "standard") {
    return {
      ok: false,
      message: "Mixed topics works with Standard selection only — pick a single topic for adaptive or weak-area drills.",
    };
  }

  const maxAvailable = availableQuestionCount(subjectId, subjectCounts);
  if (maxAvailable === null) return { ok: true };

  if (maxAvailable <= 0) {
    return {
      ok: false,
      message: isMixedSubjectId(subjectId)
        ? "No serve-ready questions in this exam bank yet."
        : "No serve-ready questions for this topic yet.",
      maxAvailable: 0,
    };
  }

  const count = clampQuestionBankCount(questionCount);
  if (count > maxAvailable) {
    return {
      ok: false,
      message: `Only ${maxAvailable.toLocaleString()} question${maxAvailable === 1 ? "" : "s"} available for this selection.`,
      maxAvailable,
    };
  }

  return { ok: true, maxAvailable };
}

/** Rough session length for the preview bar (~90 sec per question timed, ~2 min untimed). */
export function estimateQuestionBankSessionMinutes(
  questionCount: number,
  pace: QuestionBankPace
): number {
  const count = clampQuestionBankCount(questionCount);
  const secondsPerQuestion = pace === "timed" ? 90 : 120;
  return Math.max(1, Math.ceil((count * secondsPerQuestion) / 60));
}

export type PersistedQuestionBankSetup = {
  subjectId?: string;
  count?: number;
  pace?: QuestionBankPace;
  style?: QuestionBankStyle;
};

const STORAGE_PREFIX = "qb-setup:";

export function questionBankSetupStorageKey(fieldId: string): string {
  return `${STORAGE_PREFIX}${fieldId}`;
}

export function readPersistedQuestionBankSetup(fieldId: string): PersistedQuestionBankSetup | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(questionBankSetupStorageKey(fieldId));
    if (!raw) return null;
    return JSON.parse(raw) as PersistedQuestionBankSetup;
  } catch {
    return null;
  }
}

export function writePersistedQuestionBankSetup(
  fieldId: string,
  setup: PersistedQuestionBankSetup
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(questionBankSetupStorageKey(fieldId), JSON.stringify(setup));
  } catch {
    // ignore quota / private mode
  }
}
