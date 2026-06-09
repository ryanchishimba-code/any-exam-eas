/**
 * Unified editorial QA for all question bank fields.
 * NCLEX (nursing) adds clinical vignette rules on top of shared checks.
 */
import type { BankItem } from "@/lib/question-bank";
import { hasOrphanDeicticStem } from "@/lib/engine/prompts/vignette";
import {
  auditNclexBankItem,
  resolveNclexStem,
  resolveNclexVignette,
  type NclexAuditIssue,
} from "./nclex-bank-audit";

export type BankAuditIssue = NclexAuditIssue;

export type BankAuditReport = {
  ok: boolean;
  issues: BankAuditIssue[];
};

const PRIORITY_STEM =
  /address first|assessed first|see first|highest priority|which assessment finding should the nurse address first/i;

const RESPIRATORY_DISTRESS =
  /SpO₂?\s*(?:8[0-9]|7[0-9])%|speaking in short phrases|use of accessory muscles|accessory muscle|RR\s*(?:3[0-9]|[4-9]\d)/i;

const GENERIC_WEAK_OPTION =
  /^(?:Document the finding and recheck|Delegate reassessment to UAP|Reassure the client that the finding is expected)/i;

function resolveVignette(item: BankItem, fieldId: string): string {
  if (fieldId === "nursing") return resolveNclexVignette(item);
  return item.vignette?.trim() || item.scenario?.trim() || "";
}

function resolveStem(item: BankItem, fieldId: string): string {
  if (fieldId === "nursing") return resolveNclexStem(item);
  const vignette = resolveVignette(item, fieldId);
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

function auditSharedBankItem(item: BankItem, fieldId: string): BankAuditReport {
  const issues: BankAuditIssue[] = [];
  const push = (severity: BankAuditIssue["severity"], code: string, message: string) =>
    issues.push({ severity, code, message });

  const vignette = resolveVignette(item, fieldId);
  const stem = resolveStem(item, fieldId);
  const blob = `${vignette}\n${stem}\n${item.question}`;

  if (!item.question?.trim() || item.question.trim().length < 12) {
    push("error", "empty_question", "Question stem is missing or too short.");
  }

  if (!item.explanation?.trim() || item.explanation.trim().length < 20) {
    push("error", "empty_explanation", "Explanation is missing or too short.");
  }

  if (item.options.length !== 4) {
    push("error", "invalid_option_count", "MCQ items must have exactly four options.");
  }

  const uniqueOptions = new Set(item.options.map((o) => o.trim().toLowerCase()));
  if (uniqueOptions.size < item.options.length) {
    push("error", "duplicate_options", "Two or more answer options are identical.");
  }

  if (item.options.length === 4 && !item.options.includes(item.correctAnswer)) {
    push("error", "correct_not_in_options", "correctAnswer must match one option exactly.");
  }

  if (
    hasOrphanDeicticStem({
      id: 0,
      type: "multiple_choice",
      question: stem,
      vignette,
      correctAnswer: "",
      explanation: "",
    })
  ) {
    push("error", "orphan_deictic_stem", 'Stem references "these findings" without a preceding vignette.');
  }

  if (vignette && stem && stem.includes(vignette.slice(0, Math.min(60, vignette.length)))) {
    push("warn", "duplicate_vignette_in_stem", "Question stem repeats vignette text already shown above.");
  }

  if (PRIORITY_STEM.test(stem) && RESPIRATORY_DISTRESS.test(vignette || blob)) {
    const ca = item.correctAnswer;
    if (/reassess bp|blood pressure/i.test(ca)) {
      push(
        "error",
        "priority_hypoxemia_mismatch",
        "Priority question with hypoxemia/work of breathing but correct answer targets BP instead of airway/oxygen."
      );
    } else if (GENERIC_WEAK_OPTION.test(ca.trim())) {
      push("error", "generic_weak_correct", "Correct answer is a generic non-action option (document/delegate/reassure).");
    }
  } else if (GENERIC_WEAK_OPTION.test(item.correctAnswer.trim())) {
    push("error", "generic_weak_correct", "Correct answer is a generic non-action option (document/delegate/reassure).");
  }

  if (item.options.filter((o) => GENERIC_WEAK_OPTION.test(o.trim())).length >= 3) {
    push("warn", "generic_weak_options", "Three or more options are generic non-clinical distractors.");
  }

  if (fieldId.startsWith("usmle") && stem.length < 40 && !vignette) {
    push("warn", "usmle_short_stem", "USMLE item lacks a clinical vignette.");
  }

  const errors = issues.filter((i) => i.severity === "error");
  return { ok: errors.length === 0, issues };
}

function mergeReports(a: BankAuditReport, b: BankAuditReport): BankAuditReport {
  const issues = [...a.issues];
  const codes = new Set(a.issues.map((i) => i.code));
  for (const issue of b.issues) {
    if (!codes.has(issue.code)) issues.push(issue);
  }
  const errors = issues.filter((i) => i.severity === "error");
  return { ok: errors.length === 0, issues };
}

/** Audit one bank item; errors fail QA, warnings do not. */
export function auditBankItem(item: BankItem, fieldId: string): BankAuditReport {
  const shared = auditSharedBankItem(item, fieldId);
  if (fieldId === "nursing") {
    return mergeReports(shared, auditNclexBankItem(item));
  }
  return shared;
}

export function summarizeBankAudit(
  results: Array<{ ok: boolean; issues: BankAuditIssue[]; fieldId?: string }>
) {
  let pass = 0;
  let fail = 0;
  const bySeverity: Record<string, number> = {};
  const byCode: Record<string, number> = {};
  const byField: Record<string, { total: number; pass: number; fail: number }> = {};

  for (const result of results) {
    if (result.ok) pass++;
    else fail++;

    const fid = result.fieldId ?? "unknown";
    if (!byField[fid]) byField[fid] = { total: 0, pass: 0, fail: 0 };
    byField[fid].total++;
    if (result.ok) byField[fid].pass++;
    else byField[fid].fail++;

    for (const issue of result.issues) {
      bySeverity[issue.severity] = (bySeverity[issue.severity] ?? 0) + 1;
      byCode[issue.code] = (byCode[issue.code] ?? 0) + 1;
    }
  }

  return { total: results.length, pass, fail, bySeverity, byCode, byField };
}
