import {
  clampQuestionBankCount,
  type QuestionBankPace,
  type QuestionBankStyle,
} from "@/lib/exam/modes";
import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";

export { MIXED_SUBJECT_ID };

/** Fixed question-bank wheel choices — not used by timed/mock exams. */
export const QUESTION_BANK_WHEEL_PRESETS = [25, 50, 75] as const;

export type QuestionBankWheelPreset = (typeof QUESTION_BANK_WHEEL_PRESETS)[number];

export const MIXED_SUBJECT_LABEL = "Mixed topics";

export type QuestionBankCountOption = {
  value: number;
  label: string;
  description: string;
};

function describeCountOption(value: number): Pick<QuestionBankCountOption, "label" | "description"> {
  return {
    label: `${value} questions`,
    description:
      value <= 25
        ? "Focused session"
        : value <= 50
          ? "Standard block"
          : "Long block",
  };
}

/** Scroll-wheel options — 25 / 50 / 75 for every board exam question bank. */
export function questionBankCountOptions(): QuestionBankCountOption[] {
  return QUESTION_BANK_WHEEL_PRESETS.map((value) => ({
    value,
    ...describeCountOption(value),
  }));
}

/** Limit wheel choices to presets the selected topic can fill (25 minimum). */
export function questionBankCountOptionsForAvailable(
  maxAvailable: number | null
): QuestionBankCountOption[] {
  const base = questionBankCountOptions();
  if (maxAvailable == null) return base;

  const capped = Math.max(0, Math.floor(maxAvailable));
  const minPreset = QUESTION_BANK_WHEEL_PRESETS[0];
  if (capped < minPreset) return [];

  return base.filter((option) => option.value <= capped);
}

/** Snap a requested count to the nearest wheel option (never above pool max). */
export function resolveWheelCountValue(
  questionCount: number,
  options: QuestionBankCountOption[]
): number {
  const clamped = clampQuestionBankCount(questionCount);
  if (options.some((o) => o.value === clamped)) return clamped;
  const atOrBelow = options.filter((o) => o.value <= clamped);
  if (atOrBelow.length > 0) return atOrBelow[atOrBelow.length - 1]!.value;
  return options[0]?.value ?? clamped;
}

export function isQuestionBankWheelCount(value: number): value is QuestionBankWheelPreset {
  return (QUESTION_BANK_WHEEL_PRESETS as readonly number[]).includes(value);
}

/** Resolve a bank session size to 25 / 50 / 75 (optionally capped by topic pool). */
export function resolveQuestionBankSessionCount(
  requested: number,
  maxAvailable?: number | null
): QuestionBankWheelPreset {
  const options = questionBankCountOptionsForAvailable(maxAvailable ?? null);
  const resolved = resolveWheelCountValue(
    requested,
    options.length > 0 ? options : questionBankCountOptions()
  );
  return resolved as QuestionBankWheelPreset;
}

export function isMixedSubjectId(subjectId: string): boolean {
  return subjectId === MIXED_SUBJECT_ID;
}

/** Serve-ready pool size for the current topic selection. */
export function availableQuestionCount(
  subjectId: string,
  subjectCounts: Record<string, number> | null | undefined
): number | null {
  if (!subjectCounts || Object.keys(subjectCounts).length === 0) return null;
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
  taskCategory?: string | null;
}): QuestionBankSessionValidation {
  const { subjectId, questionCount, subjectCounts, bankStyle, taskCategory } = params;

  if (!subjectId) {
    return { ok: false, message: "Choose a topic before starting." };
  }

  if (taskCategory && bankStyle !== "standard") {
    return {
      ok: false,
      message: "Task-area focus works with Standard selection only.",
    };
  }

  if (
    isMixedSubjectId(subjectId) &&
    bankStyle !== "standard" &&
    bankStyle !== "review_incorrect"
  ) {
    return {
      ok: false,
      message:
        "Mixed topics works with Standard or Review incorrect — pick a single topic for adaptive or weak-area drills.",
    };
  }

  const maxAvailable = availableQuestionCount(subjectId, subjectCounts);
  const count = clampQuestionBankCount(questionCount);

  if (maxAvailable === null) {
    if (!isQuestionBankWheelCount(count)) {
      return { ok: false, message: "Choose 25, 50, or 75 questions for this session." };
    }
    return { ok: true };
  }

  if (maxAvailable <= 0) {
    return {
      ok: false,
      message: isMixedSubjectId(subjectId)
        ? "No serve-ready questions in this exam bank yet."
        : "No serve-ready questions for this topic yet.",
      maxAvailable: 0,
    };
  }

  const options = questionBankCountOptionsForAvailable(maxAvailable);
  if (options.length === 0) {
    return {
      ok: false,
      message: isMixedSubjectId(subjectId)
        ? "Not enough serve-ready questions in this exam bank for a 25-question session."
        : "This topic needs at least 25 serve-ready questions. Try another topic.",
      maxAvailable,
    };
  }
  if (!options.some((o) => o.value === count)) {
    return {
      ok: false,
      message: `Choose ${options.map((o) => o.value).join(", ")} questions for this topic.`,
      maxAvailable,
    };
  }

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
  taskCategory?: string | null;
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
