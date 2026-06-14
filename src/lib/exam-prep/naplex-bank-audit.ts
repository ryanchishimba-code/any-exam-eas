/**
 * Editorial audit for NAPLEX (pharmacy field) bank items — board-style stems,
 * drug-specific rationales, and weak template detection.
 */
import type { BankItem } from "@/lib/question-bank";
import { hasInvalidControlledSubstanceStem } from "@/lib/exam-prep/naplex-controlled-substances";

export type NaplexAuditIssue = {
  code: string;
  message: string;
  severity: "error" | "warn";
};

export type NaplexAuditReport = {
  ok: boolean;
  issues: NaplexAuditIssue[];
};

const WEAK_CORRECT_PATTERNS = [
  /^Monitor for interaction between/i,
  /^Counsel on adherence/i,
  /^Recognize serious adverse effect linked to/i,
  /^Verify indication, dose, and legal/i,
  /^Verify indication, quantity, patient identity, and DEA requirements/i,
  /before dispensing controlled medications related to/i,
  /^Select therapy class appropriate for/i,
  /mechanism relevant to/i,
  /^No receptor interaction/i,
  /^.+\s+—\s+.+\s+targeting\s/i,
];

const WEAK_OPTION_PATTERNS = [
  /^Ignore the new prescription/i,
  /^Discontinue all chronic/i,
  /^Share medication with family/i,
  /^Skip monitoring labs in all patients/i,
  /^Mild taste change that never requires action/i,
  /^Beneficial effect requiring no monitoring/i,
  /^Unlimited refills without documentation/i,
  /^Bypass inventory controls/i,
  /^Therapy with no evidence/i,
  /^Avoid all monitoring parameters/i,
  /— non-selective histamine blockade/i,
  /— direct thrombin inhibition unrelated/i,
  /— dopamine reuptake inhibition in the CNS/i,
  /^[A-Za-z/\s]+ — [A-Za-z/ ]+ targeting /i,
];

const LEAD_IN_PATTERN =
  /(?:^Which\b|^What\b|^How\b|^Place\b|^Order\b|^Match\b|^Using\b|^Based\b|^Best\b|^Most\b|^Urgent\b|^Calculate\b|^Select\b|^Identify\b|^Determine\b|^Recommend\b|^The pharmacist|^A pharmacist|^A prescriber|^Estimated\b|^Calculated\b|^Total\b|^Bolus\b|^Equivalent\b|^Required\b|^Approximate\b|^Initial\b|^Stock\b|^Infusion rate|^Round to|must verify|is most likely|is primarily determined|primary pharmacokinetic|most appropriate|most essential|best explains|best describes|best indicates|best action|best choice|best next|best pharmacist|best empiric|best OTC|best lipid|best recommendation|next step|step-up|add-on|which of the following|select all|calculate|what is|what should|how many|how should|how much|at what rate|priority|should the pharmacist|is the priority|applies before|standard applies|before dispensing|before release|before the patient leaves|mechanism of action|pharmacist'?s priority|FIRST professional)/i;

const CLINICAL_DATA_PATTERN =
  /\d+\s*(?:mg\/dL|mEq\/L|mm Hg|\/min|× 10|g\/dL|mIU\/mL|°C|°F|U\/L|mm|%|mg\/kg|mL\/hr|mg|mEq|mL|kg|tablets|units)|\b(?:BP|LDL|A1[cC]|FEV|TSH|PHQ|SCr|Cr|K\+|EF|GFR)\b/i;

const AGE_PATTERN = /\b\d{1,3}[- ]year[- ]old\b|\b\d{1,3}\s*y\/o\b|\bAge\s+\d{1,3}\b/i;

const NAPLEX_PREFIX = /^NAPLEX\s+\d+:\s*/i;

export function resolveNaplexVignette(item: BankItem): string {
  const vignette = item.vignette?.trim() || item.scenario?.trim() || "";
  if (vignette) return vignette;
  const q = item.question?.trim() ?? "";
  if (q.includes("\n\n")) {
    const head = q.split("\n\n")[0]?.trim() ?? "";
    if (head.length >= 40) return head;
  }
  return "";
}

export function resolveNaplexStem(item: BankItem): string {
  const vignette = resolveNaplexVignette(item);
  const q = item.question?.trim() ?? "";
  if (vignette && q.startsWith(vignette)) {
    return q.slice(vignette.length).replace(/^\s*\n+\s*/, "").trim();
  }
  if (q.includes("\n\n")) {
    const parts = q.split("\n\n");
    if (parts.length >= 2 && (parts[0]?.length ?? 0) >= 40) {
      return parts.slice(1).join("\n\n").trim();
    }
  }
  return q;
}

export function auditNaplexBankItem(item: BankItem): NaplexAuditReport {
  const issues: NaplexAuditIssue[] = [];
  const push = (severity: NaplexAuditIssue["severity"], code: string, message: string) =>
    issues.push({ severity, code, message });

  const vignette = resolveNaplexVignette(item);
  const stem = resolveNaplexStem(item);
  const blob = `${vignette}\n${stem}`;

  if (NAPLEX_PREFIX.test(item.question)) {
    push("error", "naplex_numbered_prefix", 'Question still uses legacy "NAPLEX N:" prefix — rewrite as a clinical stem.');
  }

  if (WEAK_CORRECT_PATTERNS.some((re) => re.test(item.correctAnswer))) {
    push(
      "error",
      "weak_naplex_correct",
      "Correct answer uses a generic NAPLEX template phrase instead of a drug-specific clinical action."
    );
  }

  const weakOptionCount = item.options.filter((o) =>
    WEAK_OPTION_PATTERNS.some((re) => re.test(o))
  ).length;
  if (weakOptionCount >= 2) {
    push(
      "error",
      "weak_naplex_options",
      "Two or more distractors use generic unsafe pharmacy template phrases."
    );
  }

  const nonMcqFormat = new Set([
    "select_all",
    "sata",
    "ordered_response",
    "constructed_response",
    "drag_drop",
    "k_type",
    "exhibit",
  ]);
  const itemType = item.itemType ?? "mcq";

  if (
    !LEAD_IN_PATTERN.test(stem) &&
    itemType !== "constructed_response" &&
    !(stem.length >= 80 && /\?\s*$/.test(stem))
  ) {
    push(
      "error",
      "naplex_stem_lead_in",
      "Stem should use NAPLEX-style lead-in (most appropriate, calculate, select all, etc.)."
    );
  }

  if ((item.explanation?.trim().length ?? 0) < (itemType === "constructed_response" ? 40 : 100)) {
    push(
      "error",
      "naplex_explanation_short",
      "Explanation should be at least 100 characters with drug-specific rationale."
    );
  }

  if (hasInvalidControlledSubstanceStem(blob) || hasInvalidControlledSubstanceStem(item.correctAnswer)) {
    push(
      "error",
      "naplex_controlled_substance_mismatch",
      "Stem treats a non-controlled drug (e.g. metformin) as a DEA controlled substance."
    );
  }

  if (!AGE_PATTERN.test(blob) && !CLINICAL_DATA_PATTERN.test(blob)) {
    if (!nonMcqFormat.has(itemType) && vignette.length > 0) {
      push(
        "warn",
        "naplex_missing_clinical_data",
        "Clinical stem lacks patient age and numeric labs, vitals, or doses."
      );
    }
  }

  if (
    item.options.length === 4 &&
    item.correctAnswer &&
    !item.options.includes(item.correctAnswer) &&
    !item.correctAnswer.includes("|||")
  ) {
    push("error", "correct_not_in_options", "correctAnswer must match one option exactly.");
  }

  const errors = issues.filter((i) => i.severity === "error");
  return { ok: errors.length === 0, issues };
}

export type NaplexAuditItemReport = NaplexAuditReport & { itemId?: string };

export function summarizeNaplexAudit(results: NaplexAuditItemReport[]): {
  total: number;
  pass: number;
  fail: number;
  bySeverity: Record<string, number>;
  byCode: Record<string, number>;
} {
  let pass = 0;
  let fail = 0;
  const bySeverity: Record<string, number> = {};
  const byCode: Record<string, number> = {};

  for (const result of results) {
    if (result.ok) pass++;
    else fail++;

    for (const issue of result.issues) {
      bySeverity[issue.severity] = (bySeverity[issue.severity] ?? 0) + 1;
      byCode[issue.code] = (byCode[issue.code] ?? 0) + 1;
    }
  }

  return { total: results.length, pass, fail, bySeverity, byCode };
}
