/**
 * Detect bank items that need structured rationale enrichment.
 */
import { cleanOptionText } from "@/lib/question-format";
import { listWrongBankOptions } from "./validate-rationale";

const GENERIC_PHRASES = [
  "does not apply",
  "is incorrect",
  "not the best answer",
  "not appropriate here",
  "plausible but not the priority",
  "eliminate when it contradicts",
];

const STRUCTURED_MARKERS = [
  "## Why this answer is correct",
  "## Why the other options are wrong",
  "## Key takeaway",
];

export type RationaleEnrichmentReason =
  | "already_structured"
  | "missing_explanation"
  | "too_short"
  | "missing_distractors"
  | "incomplete_distractors"
  | "generic_distractors"
  | "missing_key_takeaway"
  | "missing_expert_sections";

export function needsRationaleEnrichment(item: BankItem): {
  needs: boolean;
  reasons: RationaleEnrichmentReason[];
} {
  const reasons: RationaleEnrichmentReason[] = [];
  const explanation = item.explanation?.trim() ?? "";

  if (item.expertRationale) {
    return { needs: false, reasons: ["already_structured"] };
  }

  if (STRUCTURED_MARKERS.every((m) => explanation.includes(m))) {
    if (explanation.includes("## Clinical pearl")) {
      return { needs: false, reasons: ["already_structured"] };
    }
  }

  if (explanation.length < 120) reasons.push("missing_explanation");
  else if (explanation.length < 200) reasons.push("too_short");

  const options = item.options ?? [];
  const wrongOptions = listWrongBankOptions(options, item.correctAnswer);

  const distractor = item.distractorRationale ?? {};
  const distractorKeys = Object.keys(distractor);

  if (wrongOptions.length > 0 && distractorKeys.length === 0) {
    if (!/Why other options are incorrect/i.test(explanation)) {
      reasons.push("missing_distractors");
    }
  }

  if (wrongOptions.length > 0 && distractorKeys.length > 0) {
    const covered = wrongOptions.filter((o) =>
      distractorKeys.some(
        (k) => cleanOptionText(k).toLowerCase() === cleanOptionText(o).toLowerCase()
      )
    );
    if (covered.length < wrongOptions.length) reasons.push("incomplete_distractors");

    const genericCount = Object.values(distractor).filter((v) => {
      const lower = String(v).toLowerCase();
      return GENERIC_PHRASES.some((p) => lower.includes(p)) && lower.length < 90;
    }).length;
    if (genericCount >= Math.max(1, Math.floor(wrongOptions.length / 2))) {
      reasons.push("generic_distractors");
    }
  }

  if (
    explanation.includes("does not reflect the highest-priority, safest nursing action")
  ) {
    reasons.push("generic_distractors");
  }

  if (
    !/key takeaway/i.test(explanation) &&
    !/memory hook/i.test(explanation) &&
    reasons.length > 0
  ) {
    reasons.push("missing_key_takeaway");
  }

  if (!explanation.includes("## Clinical pearl")) {
    reasons.push("missing_expert_sections");
  }

  const needs =
    reasons.length > 0 &&
    !reasons.every((r) => r === "missing_key_takeaway") &&
    !reasons.includes("already_structured");

  return { needs, reasons };
}
