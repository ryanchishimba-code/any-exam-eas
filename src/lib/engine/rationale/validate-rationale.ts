/**
 * Quality gate for structured rationales before save or serve.
 */
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
  return GENERIC_PHRASES.some(
    (p) => lower.includes(p) && lower.length < 80
  );
}

function normalizeOption(o: string): string {
  return o.trim().toLowerCase();
}

/** Validate structured rationale against the question's option set. */
export function validateStructuredRationale(
  rationale: StructuredRationale,
  options: string[],
  correctAnswer: string
): RationaleQualityVerdict {
  const issues: RationaleQualityIssue[] = [];
  let score = 100;

  if (!rationale.whyCorrect?.headline?.trim()) {
    issues.push("missing_why_correct");
    score -= 30;
  }
  if (!rationale.keyTakeaway?.trim()) {
    issues.push("missing_key_takeaway");
    score -= 20;
  }
  if ((rationale.whyCorrect?.conceptBreakdown?.length ?? 0) < 2) {
    issues.push("too_short");
    score -= 10;
  }

  const expectedWrong = new Set(
    options
      .filter((o) => normalizeOption(o) !== normalizeOption(correctAnswer))
      .map(normalizeOption)
  );
  const covered = new Set(
    rationale.whyIncorrect.map((e) => normalizeOption(e.option))
  );

  for (const wrong of expectedWrong) {
    if (!covered.has(wrong)) {
      issues.push("missing_wrong_option");
      score -= 15;
    }
  }
  for (const entry of rationale.whyIncorrect) {
    if (!expectedWrong.has(normalizeOption(entry.option))) {
      issues.push("extra_wrong_option");
      score -= 5;
    }
    if (isGeneric(entry.correction)) {
      issues.push("generic_correction");
      score -= 10;
    }
  }

  if (
    rationale.keyTakeaway.trim().toLowerCase() ===
    rationale.whyCorrect.headline.trim().toLowerCase()
  ) {
    issues.push("duplicate_takeaway");
    score -= 5;
  }

  return {
    ok: score >= 70 && !issues.includes("missing_why_correct") && !issues.includes("missing_wrong_option"),
    score: Math.max(0, score),
    issues: [...new Set(issues)],
  };
}
