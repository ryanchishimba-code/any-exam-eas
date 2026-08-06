/**
 * Quality gate for structured rationales before save or serve.
 */
import { parseSelectAllCorrectAnswers } from "@/lib/question-format";
import type { StructuredRationale } from "../prompts/rationale-generation";

export type RationaleQualityIssue =
  | "missing_why_correct"
  | "missing_key_takeaway"
  | "missing_wrong_option"
  | "extra_wrong_option"
  | "generic_correction"
  | "too_short"
  | "duplicate_takeaway";

export type RationaleQualityVerdict = {
  ok: boolean;
  score: number;
  issues: RationaleQualityIssue[];
};

const GENERIC_PHRASES = [
  "does not apply",
  "is incorrect",
  "not the best answer",
  "is wrong",
  "not appropriate here",
  "does not address",
];

function isGeneric(text: string): boolean {
  const lower = text.toLowerCase().trim();
  if (lower.length < 40) return true;
  return GENERIC_PHRASES.some((p) => lower.includes(p) && lower.length < 80);
}

/** Normalize option text for rationale coverage matching (quotes, trailing punct, space). */
export function normalizeRationaleOptionKey(o: string): string {
  return o
    .trim()
    .replace(/^["'`“”‘’]+|["'`“”‘’]+$/g, "")
    .replace(/[.?!]+$/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Wrong options for single-correct OR multi-correct (SATA / bowtie / ordered).
 * Uses parseSelectAllCorrectAnswers so comma-joined corrects are not treated as one blob.
 */
export function listWrongBankOptions(options: string[], correctAnswer: string): string[] {
  const correctKeys = new Set(
    parseSelectAllCorrectAnswers(options, correctAnswer).map(normalizeRationaleOptionKey)
  );
  return options.filter((o) => !correctKeys.has(normalizeRationaleOptionKey(o)));
}

/** Map model option text back onto a bank option when wording drifts slightly. */
export function matchRationaleOptionToBank(
  reported: string,
  bankOptions: string[]
): string | null {
  const key = normalizeRationaleOptionKey(reported);
  if (!key) return null;

  for (const option of bankOptions) {
    if (normalizeRationaleOptionKey(option) === key) return option;
  }

  let best: { option: string; score: number } | null = null;
  for (const option of bankOptions) {
    const optionKey = normalizeRationaleOptionKey(option);
    if (!optionKey) continue;
    let score = 0;
    if (optionKey.includes(key) || key.includes(optionKey)) {
      score = Math.min(optionKey.length, key.length) / Math.max(optionKey.length, key.length);
    }
    if (score > 0.72 && (!best || score > best.score)) {
      best = { option, score };
    }
  }
  return best?.option ?? null;
}

function remapWhyIncorrectOptions(
  rationale: StructuredRationale,
  options: string[]
): StructuredRationale {
  return {
    ...rationale,
    whyIncorrect: rationale.whyIncorrect.map((entry) => {
      const matched = matchRationaleOptionToBank(entry.option, options);
      return matched ? { ...entry, option: matched } : entry;
    }),
  };
}

/** Validate structured rationale against the question's option set. */
export function validateStructuredRationale(
  rationale: StructuredRationale,
  options: string[],
  correctAnswer: string
): RationaleQualityVerdict {
  const issues: RationaleQualityIssue[] = [];
  let score = 100;

  const aligned = remapWhyIncorrectOptions(rationale, options);

  if (!aligned.whyCorrect?.headline?.trim()) {
    issues.push("missing_why_correct");
    score -= 30;
  }
  if (!aligned.keyTakeaway?.trim()) {
    issues.push("missing_key_takeaway");
    score -= 20;
  }
  if ((aligned.whyCorrect?.conceptBreakdown?.length ?? 0) < 2) {
    issues.push("too_short");
    score -= 10;
  }

  const expectedWrong = listWrongBankOptions(options, correctAnswer);
  const expectedWrongKeys = new Set(expectedWrong.map(normalizeRationaleOptionKey));
  const covered = new Set(
    aligned.whyIncorrect.map((e) => normalizeRationaleOptionKey(e.option))
  );

  for (const wrong of expectedWrong) {
    if (!covered.has(normalizeRationaleOptionKey(wrong))) {
      issues.push("missing_wrong_option");
      score -= 15;
    }
  }
  for (const entry of aligned.whyIncorrect) {
    if (!expectedWrongKeys.has(normalizeRationaleOptionKey(entry.option))) {
      issues.push("extra_wrong_option");
      score -= 5;
    }
    if (isGeneric(entry.correction)) {
      issues.push("generic_correction");
      score -= 10;
    }
  }

  if (
    aligned.keyTakeaway.trim().toLowerCase() ===
    aligned.whyCorrect.headline.trim().toLowerCase()
  ) {
    issues.push("duplicate_takeaway");
    score -= 5;
  }

  return {
    ok:
      score >= 70 &&
      !issues.includes("missing_why_correct") &&
      !issues.includes("missing_wrong_option"),
    score: Math.max(0, score),
    issues: [...new Set(issues)],
  };
}
