import {
  clampQuestionBankCount,
  parseQuestionBankStyle,
  type QuestionBankPace,
  type QuestionBankStyle,
} from "@/lib/exam/modes";
import type { StudyMode } from "@/lib/questions/types";
import {
  parsePracticeFormat,
  type PracticeFormatMode,
} from "@/lib/study/practice-format";
import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";

export { MIXED_SUBJECT_ID };

/** Fixed question-bank wheel choices — not used by timed/mock exams. */
export const QUESTION_BANK_WHEEL_PRESETS = [25, 50, 75] as const;

/** USMLE uses exam-block sizes closer to real Step blocks. */
export const USMLE_QUESTION_BANK_WHEEL_PRESETS = [40, 50, 80] as const;

export type QuestionBankWheelPreset =
  | (typeof QUESTION_BANK_WHEEL_PRESETS)[number]
  | (typeof USMLE_QUESTION_BANK_WHEEL_PRESETS)[number];

export function questionBankWheelPresetsForField(fieldId: string): readonly number[] {
  if (fieldId.startsWith("usmle")) return USMLE_QUESTION_BANK_WHEEL_PRESETS;
  return QUESTION_BANK_WHEEL_PRESETS;
}

/**
 * Short closed-loop retest sizes (miss → Deep Dive → retest).
 * Allowed even when the launcher wheel only shows 25 / 50 / 75.
 */
export const QUESTION_BANK_RETEST_COUNTS = [5, 10, 25] as const;

export type QuestionBankRetestCount = (typeof QUESTION_BANK_RETEST_COUNTS)[number];

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
        : value === 40
          ? "Exam-style block"
          : value <= 50
            ? "Standard block"
            : "Long block",
  };
}

/** Scroll-wheel options — 25 / 50 / 75 (or USMLE 40 / 50 / 80). */
export function questionBankCountOptions(fieldId?: string): QuestionBankCountOption[] {
  const presets = fieldId
    ? questionBankWheelPresetsForField(fieldId)
    : QUESTION_BANK_WHEEL_PRESETS;
  return presets.map((value) => ({
    value,
    ...describeCountOption(value),
  }));
}

/** Limit wheel choices to presets the selected topic can fill. */
export function questionBankCountOptionsForAvailable(
  maxAvailable: number | null,
  fieldId?: string
): QuestionBankCountOption[] {
  const base = questionBankCountOptions(fieldId);
  if (maxAvailable == null) return base;

  const capped = Math.max(0, Math.floor(maxAvailable));
  const minPreset = base[0]?.value ?? 25;
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

export function isQuestionBankWheelCount(
  value: number,
  fieldId?: string
): value is QuestionBankWheelPreset {
  const presets = fieldId
    ? questionBankWheelPresetsForField(fieldId)
    : QUESTION_BANK_WHEEL_PRESETS;
  return (presets as readonly number[]).includes(value);
}

export function isRetestSessionCount(value: number): value is QuestionBankRetestCount {
  return (QUESTION_BANK_RETEST_COUNTS as readonly number[]).includes(value);
}

/** Resolve a bank session size — preserves short retest counts when the pool can fill them. */
export function resolveQuestionBankSessionCount(
  requested: number,
  maxAvailable?: number | null,
  fieldId?: string
): number {
  const clamped = clampQuestionBankCount(requested);
  if (isRetestSessionCount(clamped)) {
    if (maxAvailable == null || maxAvailable >= clamped) return clamped;
  }
  const options = questionBankCountOptionsForAvailable(maxAvailable ?? null, fieldId);
  const resolved = resolveWheelCountValue(
    requested,
    options.length > 0 ? options : questionBankCountOptions(fieldId)
  );
  return resolved;
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
  /** Offer a one-tap switch to Mixed topics when the selected topic cannot fill a session. */
  suggestMixed?: boolean;
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

  if (!subjectId && bankStyle !== "today" && bankStyle !== "daily_set") {
    return { ok: false, message: "Choose a topic before starting." };
  }

  if (bankStyle === "today" || bankStyle === "daily_set") {
    return { ok: true };
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
  const mixedPool =
    subjectCounts && Object.keys(subjectCounts).length > 0
      ? availableQuestionCount(MIXED_SUBJECT_ID, subjectCounts)
      : null;
  const canSuggestMixed =
    !isMixedSubjectId(subjectId) &&
    mixedPool != null &&
    mixedPool >= QUESTION_BANK_WHEEL_PRESETS[0];

  if (maxAvailable === null) {
    if (isRetestSessionCount(count) || isQuestionBankWheelCount(count)) {
      return { ok: true };
    }
    return { ok: false, message: "Choose 25, 50, or 75 questions for this session." };
  }

  if (maxAvailable <= 0) {
    return {
      ok: false,
      message: isMixedSubjectId(subjectId)
        ? "No serve-ready questions in this exam bank yet."
        : canSuggestMixed
          ? "No serve-ready questions for this topic yet. Try Mixed topics for a full session."
          : "No serve-ready questions for this topic yet.",
      maxAvailable: 0,
      suggestMixed: canSuggestMixed,
    };
  }

  // Closed-loop retests (5 / 10 / 25) — allow when the topic pool can fill them.
  if (isRetestSessionCount(count) && maxAvailable >= count) {
    return { ok: true, maxAvailable };
  }

  const options = questionBankCountOptionsForAvailable(maxAvailable);
  if (options.length === 0) {
    return {
      ok: false,
      message: isMixedSubjectId(subjectId)
        ? "Not enough serve-ready questions in this exam bank for a 25-question session."
        : canSuggestMixed
          ? `This topic has ${maxAvailable.toLocaleString()} serve-ready question${maxAvailable === 1 ? "" : "s"} — need 25 to start. Try Mixed topics instead.`
          : "This topic needs at least 25 serve-ready questions. Try another topic.",
      maxAvailable,
      suggestMixed: canSuggestMixed,
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
  format?: PracticeFormatMode;
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

export function isRemediationUrlStyle(
  style: string | null | undefined
): style is "weak_areas" | "review_incorrect" {
  return style === "weak_areas" || style === "review_incorrect";
}

/** Remediation deep links and the daily set must not be replaced by a remembered chip. */
export function isLockedBankLaunchStyle(
  style: string | null | undefined
): style is "weak_areas" | "review_incorrect" | "daily_set" {
  return isRemediationUrlStyle(style) || style === "daily_set";
}

/**
 * Browser location wins when it still has a remediation deep link.
 * useSearchParams can be a remembered Adaptive value for one hydrate frame.
 */
export function preferredQuestionBankStyleParam(
  hookStyle: string | null | undefined,
  browserStyle: string | null | undefined
): string | null {
  if (isLockedBankLaunchStyle(browserStyle)) return browserStyle;
  return hookStyle ?? browserStyle ?? null;
}

/**
 * Restore question-bank style and format from the URL, then from the last setup.
 * `style=weak_areas` and `style=review_incorrect` always win over a remembered
 * style (Adaptive, Standard, or anything else). Those links also clear a
 * remembered NGN/case format, which only launches as Standard.
 * Other styles keep the existing rule: a deliberate format stays in place and
 * the format snap can still move them to Standard.
 * Subject scope is not decided here — a `subjectId` on the URL stays with the caller.
 */
export function resolveQuestionBankStyleAndFormat(params: {
  styleParam: string | null | undefined;
  formatParam: string | null | undefined;
  persistedStyle?: string | null;
  persistedFormat?: string | null;
}): { style: QuestionBankStyle | null; format: PracticeFormatMode | null } {
  if (isLockedBankLaunchStyle(params.styleParam)) {
    return { style: params.styleParam, format: "all" };
  }

  const style = params.styleParam
    ? parseQuestionBankStyle(params.styleParam)
    : params.persistedStyle
      ? parseQuestionBankStyle(params.persistedStyle)
      : null;

  const format = params.formatParam
    ? parsePracticeFormat(params.formatParam)
    : params.persistedFormat
      ? parsePracticeFormat(params.persistedFormat)
      : null;

  return { style, format };
}

/**
 * Style written back to the address bar.
 * An explicit chip/format change wins. Otherwise a remediation deep link still
 * on the URL is kept, so the default Adaptive state cannot overwrite it.
 */
export function stylePreservedForPracticeUrl(params: {
  stateStyle: QuestionBankStyle;
  overrideStyle?: QuestionBankStyle;
  browserStyle?: string | null;
}): QuestionBankStyle {
  if (params.overrideStyle) return params.overrideStyle;
  if (
    isLockedBankLaunchStyle(params.browserStyle) &&
    params.stateStyle !== params.browserStyle
  ) {
    return params.browserStyle;
  }
  return params.stateStyle;
}

/** Autostart waits until state matches a remediation style still requested by the URL. */
export function bankStyleHonorsLaunchStyle(
  bankStyle: QuestionBankStyle,
  launchStyle: string | null | undefined
): boolean {
  if (!isLockedBankLaunchStyle(launchStyle)) return true;
  return bankStyle === launchStyle;
}

/**
 * Study mode written onto the launched session and its receipt.
 * Review incorrect is its own mode. It used to share Adaptive, so the receipt
 * MODE chip said Adaptive while the title said Review incorrect.
 * Weak areas stays weak_area, which the receipt shows as Weak Area.
 */
export function studyModeForQuestionBankLaunch(params: {
  isTimedExam: boolean;
  bankStyle: QuestionBankStyle;
  pace: QuestionBankPace;
}): StudyMode {
  if (params.isTimedExam) return "timed";
  if (params.bankStyle === "weak_areas") return "weak_area";
  if (params.bankStyle === "review_incorrect") return "review_incorrect";
  if (params.bankStyle === "adaptive") return "adaptive";
  if (params.pace === "timed") return "timed";
  return "practice";
}

/**
 * NGN and case sets replace the selection style on launch.
 * Weak areas does not: that deep link must build a weak-area set (2+ attempts,
 * miss rate at least 40%), not a format-limited Standard set.
 */
export function deliberateFormatForLaunch(
  style: QuestionBankStyle,
  format: PracticeFormatMode
): "ngn" | "case" | null {
  // Remediation deep links build their own set. A lagging NGN/case format must
  // not turn them into a Standard format fetch.
  if (style === "weak_areas" || style === "review_incorrect" || style === "daily_set") return null;
  if (format === "ngn" || format === "case") return format;
  return null;
}
