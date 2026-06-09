/**
 * QA gate for hand-crafted NCLEX-NGN seed batches (not bulk-generated bank).
 */
import type { EnrichedBankItem } from "./seed-helpers";
import { auditNclexBankItem } from "./nclex-bank-audit";
import type { BankItem } from "@/lib/question-bank";

export type NclexSeedQualityIssue = {
  itemIndex: number;
  subjectId?: string;
  code: string;
  message: string;
};

export type NclexSeedQualityReport = {
  ok: boolean;
  itemCount: number;
  issues: NclexSeedQualityIssue[];
};

const LEAD_IN_PATTERN =
  /(?:most likely|most appropriate|best|priority|first|select|complete|which of the following|what is the nurse)/i;

function toBankItem(item: EnrichedBankItem): BankItem {
  return {
    subjectId: item.subjectId,
    vignette: item.vignette,
    scenario: item.vignette,
    question: item.question,
    options: item.options as BankItem["options"],
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    itemType: item.itemType,
    tags: item.tags,
  };
}

export function assessNclexCuratedSeedItem(
  item: EnrichedBankItem,
  index: number
): NclexSeedQualityIssue[] {
  const issues: NclexSeedQualityIssue[] = [];
  const subjectId = item.subjectId;
  const push = (code: string, message: string) =>
    issues.push({ itemIndex: index, subjectId, code, message });

  const vignette = item.vignette?.trim() ?? "";
  const stem = item.question?.trim() ?? "";

  if (!vignette && !stem.includes("\n\n")) {
    push("vignette_missing", "Curated NCLEX item should include a clinical vignette.");
  }

  const stemOnly = stem.includes("\n\n") ? stem.split("\n\n").slice(-1)[0]!.trim() : stem;
  if (!stemOnly.endsWith("?") && item.itemType !== "ordered_response") {
    push("stem_question", "Lead-in should end with a question mark.");
  }

  if (!LEAD_IN_PATTERN.test(stemOnly)) {
    push("stem_lead_in", "Stem should use NCLEX-style lead-in (priority, most appropriate, etc.).");
  }

  const audit = auditNclexBankItem(toBankItem(item));
  for (const a of audit.issues.filter((x) => x.severity === "error")) {
    push(a.code, a.message);
  }

  if (item.explanation.trim().length < 80) {
    push("explanation_length", "Explanation should be at least 80 characters.");
  }

  const ngnTypes = new Set([
    "ngn_bowtie",
    "bow_tie",
    "matrix",
    "ngn_matrix",
    "select_all",
    "ordered_response",
    "unfolding_case",
    "case_study",
    "highlight",
  ]);
  if (
    !ngnTypes.has(item.itemType ?? "") &&
    item.options.length === 4 &&
    !item.options.includes(item.correctAnswer)
  ) {
    push("correct_not_in_options", "correctAnswer must match one option string.");
  }

  return issues;
}

export function assessNclexCuratedSeedBatch(items: EnrichedBankItem[]): NclexSeedQualityReport {
  const issues = items.flatMap((item, index) => assessNclexCuratedSeedItem(item, index));
  return { ok: issues.length === 0, itemCount: items.length, issues };
}

export function assertNclexCuratedSeedQuality(items: EnrichedBankItem[], batchName: string): void {
  const report = assessNclexCuratedSeedBatch(items);
  if (report.ok) return;

  const lines = report.issues.map(
    (i) => `[#${i.itemIndex}${i.subjectId ? ` ${i.subjectId}` : ""}] ${i.code}: ${i.message}`
  );
  throw new Error(
    `NCLEX curated seed QA failed for ${batchName} (${report.issues.length} issue(s)):\n${lines.join("\n")}`
  );
}
