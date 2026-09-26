import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
import {
  classifyQuestionFormat,
  emptyFormatCounts,
  type FormatCounts,
  type QuestionFormatBucket,
} from "@/lib/inventory/active-questions";
import type { QuestionBankStyle } from "@/lib/exam/modes";

/** Deliberate Qbank format. "all" keeps the existing topic session. */
export type PracticeFormatMode = "all" | QuestionFormatBucket;

export type DeliberatePracticeFormat = Exclude<PracticeFormatMode, "all" | "mcq">;

export const PRACTICE_FORMAT_TAG_PREFIX = "practice-format:";

/** Small sets a student can finish in one sitting. Same sizes as closed-loop retests. */
export const PRACTICE_FORMAT_COUNT_PRESETS = [5, 10, 25] as const;

export type PracticeFormatCountOption = {
  value: number;
  label: string;
  description: string;
};

export function parsePracticeFormat(value: string | null | undefined): PracticeFormatMode {
  const raw = value?.trim().toLowerCase();
  if (raw === "ngn" || raw === "case") return raw;
  return "all";
}

export function parseDeliberatePracticeFormat(
  value: string | null | undefined
): DeliberatePracticeFormat | null {
  const parsed = parsePracticeFormat(value);
  return parsed === "ngn" || parsed === "case" ? parsed : null;
}

/**
 * Noun used beside the inventory split.
 * Nursing / Client Needs says NGN. Every other board says NGN-style.
 */
export function ngnStyleLabel(
  categoryLabel: string | null | undefined,
  fieldId?: string | null
): string {
  if (categoryLabel === "Client Needs" || fieldId === "nursing") return "NGN";
  return "NGN-style";
}

export function practiceFormatTitle(
  format: PracticeFormatMode,
  ngnLabel = "NGN"
): string {
  if (format === "ngn") return ngnLabel;
  if (format === "case") return "Cases";
  return "All questions";
}

export function practiceFormatTag(format: DeliberatePracticeFormat): string {
  return `${PRACTICE_FORMAT_TAG_PREFIX}${format}`;
}

export function isPracticeFormatTag(tag: string): boolean {
  return tag.trim().toLowerCase().startsWith(PRACTICE_FORMAT_TAG_PREFIX);
}

export function stripPracticeFormatTags(tags: string[] | undefined): string[] {
  return (tags ?? []).filter((tag) => !isPracticeFormatTag(tag));
}

/** Tags written on QuestionAttempt. The format tag is analytics-only. */
export function tagsForStoredAttempt(
  tags: string[] | undefined,
  practiceFormat?: PracticeFormatMode | null
): string[] {
  const cleaned = stripPracticeFormatTags(tags);
  if (practiceFormat === "ngn" || practiceFormat === "case") {
    cleaned.push(practiceFormatTag(practiceFormat));
  }
  return cleaned;
}

export function tagsJsonIncludesPracticeFormat(
  tagsJson: string | null | undefined,
  format: DeliberatePracticeFormat
): boolean {
  if (!tagsJson) return false;
  return tagsJson.toLowerCase().includes(practiceFormatTag(format));
}

/** Drop anything inventory would not count in this bucket. hasCaseGroup stays false. */
export function retainItemsForPracticeFormat<T extends { itemType?: string | null }>(
  items: T[],
  format: DeliberatePracticeFormat
): T[] {
  return items.filter((item) => classifyQuestionFormat(item.itemType, false) === format);
}

export function practiceFormatPoolCount(
  format: PracticeFormatMode,
  formats: FormatCounts | null | undefined
): number | null {
  if (format === "all" || format === "mcq") return null;
  if (!formats) return null;
  return format === "ngn" ? formats.ngn : formats.case;
}

export function practiceFormatCountOptions(
  available: number | null
): PracticeFormatCountOption[] {
  if (available == null) return [];
  const pool = Math.max(0, Math.floor(available));
  if (pool <= 0) return [];

  const fitting = PRACTICE_FORMAT_COUNT_PRESETS.filter((value) => value <= pool);
  if (fitting.length > 0) {
    return fitting.map((value) => ({
      value,
      label: `${value} questions`,
      description: value <= 10 ? "Small deliberate set" : "Focused block",
    }));
  }

  const noun = pool === 1 ? "question" : "questions";
  return [
    {
      value: pool,
      label: `${pool} ${noun}`,
      description: "Entire published pool",
    },
  ];
}

/** A single bank topic. Mixed scope is its own pool, not a missing topic. */
export function isDeliberateFormatTopic(subjectId: string | null | undefined): boolean {
  const id = subjectId?.trim() ?? "";
  return id.length > 0 && id !== MIXED_SUBJECT_ID;
}

/** Mixed topics, or a subject id that has not been chosen yet. */
export function isMixedPracticeSubject(subjectId: string | null | undefined): boolean {
  const id = subjectId?.trim() ?? "";
  return id.length === 0 || id === MIXED_SUBJECT_ID;
}

/** Mixed or one topic. A blank id still cannot start a set. */
export function isPracticeFormatSubject(subjectId: string | null | undefined): boolean {
  return (subjectId?.trim() ?? "").length > 0;
}

/**
 * Format split for the pool a session will actually draw from.
 * Mixed uses the field inventory. A topic uses that topic's split from the
 * same inventory rows. Without a topic map, the field split is the fallback.
 */
export function practiceFormatScopeCounts(params: {
  subjectId: string | null | undefined;
  formats: FormatCounts | null | undefined;
  topicFormats?: Record<string, FormatCounts> | null;
}): FormatCounts | null {
  if (!params.formats) return null;
  if (isMixedPracticeSubject(params.subjectId)) return params.formats;
  const id = params.subjectId!.trim();
  if (!params.topicFormats) return params.formats;
  return params.topicFormats[id] ?? emptyFormatCounts();
}

function publishedFormatNoun(
  format: DeliberatePracticeFormat,
  ngnLabel: string
): string {
  return format === "case" ? "case studies" : `${ngnLabel} items`;
}

/**
 * Honest empty state when the selected format has nothing to serve.
 * A topic with none, while the board still has some, points at Mixed topics.
 * A board with none points at standard practice.
 */
export function practiceFormatEmptyGuidance(params: {
  format: DeliberatePracticeFormat;
  subjectId?: string | null;
  scopeCount: number;
  boardCount: number;
  ngnLabel?: string;
}): PracticeFormatEmptyGuidance | null {
  if (params.scopeCount > 0) return null;
  const ngnLabel = params.ngnLabel?.trim() || "NGN";
  const noun = publishedFormatNoun(params.format, ngnLabel);
  const mixed = isMixedPracticeSubject(params.subjectId);
  if (!mixed && params.boardCount > 0) {
    const pool = params.boardCount.toLocaleString("en-US");
    return {
      title: `No ${noun} in this topic`,
      detail: `Mixed topics includes ${pool} published ${noun} from across the bank.`,
      action: "mixed",
      actionLabel: "Practice mixed topics",
    };
  }
  return {
    title: `No ${noun} yet`,
    detail: "Standard practice is ready now, using the questions this board has published.",
    action: "all",
    actionLabel: "Practice all questions",
  };
}

/**
 * Question-bank query for one format.
 * Mixed sends subjectId=__mixed__ so the API samples the field. It does not
 * send scope=field — question-bank mode rejects that parameter.
 */
export function buildDeliberateFormatQuestionQuery(params: {
  fieldId: string;
  subjectId: string | null | undefined;
  format: DeliberatePracticeFormat;
  limit: number;
}): URLSearchParams | null {
  if (!isPracticeFormatSubject(params.subjectId)) return null;
  return new URLSearchParams({
    field: params.fieldId,
    subjectId: params.subjectId!.trim(),
    limit: String(params.limit),
    mode: "bank",
    format: params.format,
    meta: "0",
  });
}

export type PracticeFormatValidation = {
  ok: boolean;
  message?: string;
  maxAvailable?: number;
  /** The selected format has no student-eligible items in this scope. */
  emptyPool?: boolean;
};

export type PracticeFormatEmptyAction = "all" | "mixed";

export type PracticeFormatEmptyGuidance = {
  title: string;
  detail: string;
  action: PracticeFormatEmptyAction;
  actionLabel: string;
};

export function validatePracticeFormatSession(params: {
  format: PracticeFormatMode;
  questionCount: number;
  formats: FormatCounts | null | undefined;
  bankStyle?: QuestionBankStyle;
  ngnLabel?: string;
  /** When set, mixed or blank topics are blocked before Start. Omit only for count-only checks. */
  subjectId?: string | null;
}): PracticeFormatValidation {
  const { format, questionCount, formats, bankStyle, ngnLabel = "NGN", subjectId } = params;
  if (format === "all" || format === "mcq") return { ok: true };

  const noun = format === "case" ? "case" : ngnLabel;
  if (subjectId !== undefined && !isPracticeFormatSubject(subjectId)) {
    return {
      ok: false,
      message: `Pick one topic for this ${noun} set.`,
    };
  }

  if (bankStyle && bankStyle !== "standard") {
    return {
      ok: false,
      message: `${noun} sets use Standard selection. Switch back to All questions for other styles.`,
    };
  }

  if (!formats) {
    return {
      ok: false,
      message: "Format counts are unavailable, so this set cannot start yet.",
    };
  }

  const maxAvailable = format === "ngn" ? formats.ngn : formats.case;
  if (maxAvailable <= 0) {
    return {
      ok: false,
      emptyPool: true,
      message: `No published ${noun} items in this pool.`,
      maxAvailable: 0,
    };
  }

  const options = practiceFormatCountOptions(maxAvailable);
  if (!options.some((option) => option.value === questionCount)) {
    return {
      ok: false,
      message: `Choose ${options.map((option) => option.value).join(", ")} questions for this ${noun} set.`,
      maxAvailable,
    };
  }

  return { ok: true, maxAvailable };
}

export type FormatPracticeBucketStats = {
  attempts: number;
  accuracy: number | null;
};

export type FormatPracticeStats = Record<DeliberatePracticeFormat, FormatPracticeBucketStats>;

export function emptyFormatPracticeStats(): FormatPracticeStats {
  return {
    ngn: { attempts: 0, accuracy: null },
    case: { attempts: 0, accuracy: null },
  };
}

export function formatPracticeStatsFromRows(
  rows: { bucket: string | null; attempts: number; correct: number }[]
): FormatPracticeStats {
  const stats = emptyFormatPracticeStats();
  for (const row of rows) {
    if (row.bucket !== "ngn" && row.bucket !== "case") continue;
    const attempts = Number.isFinite(row.attempts) ? row.attempts : 0;
    const correct = Number.isFinite(row.correct) ? row.correct : 0;
    stats[row.bucket] = {
      attempts,
      accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : null,
    };
  }
  return stats;
}
