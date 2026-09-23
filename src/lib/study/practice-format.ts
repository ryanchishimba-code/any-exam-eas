import {
  classifyQuestionFormat,
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

export type PracticeFormatValidation = {
  ok: boolean;
  message?: string;
  maxAvailable?: number;
};

export function validatePracticeFormatSession(params: {
  format: PracticeFormatMode;
  questionCount: number;
  formats: FormatCounts | null | undefined;
  bankStyle?: QuestionBankStyle;
  ngnLabel?: string;
}): PracticeFormatValidation {
  const { format, questionCount, formats, bankStyle, ngnLabel = "NGN" } = params;
  if (format === "all" || format === "mcq") return { ok: true };

  const noun = format === "case" ? "case" : ngnLabel;
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
      message: `No published ${noun} items in this bank.`,
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
