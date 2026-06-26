/**
 * Unified editorial QA for all question bank fields.
 * NCLEX (nursing) adds clinical vignette rules on top of shared checks.
 */
import type { BankItem } from "@/lib/question-bank";
import { hasDuplicateVignette } from "@/lib/engine/polish/usmle-polish";
import { hasOrphanDeicticStem } from "@/lib/engine/prompts/vignette";
import {
  auditNclexBankItem,
  resolveNclexStem,
  resolveNclexVignette,
  type NclexAuditIssue,
} from "./nclex-bank-audit";
import {
  auditNaplexBankItem,
  type NaplexAuditIssue,
} from "./naplex-bank-audit";
import { splitUsmleBankItem } from "./usmle-bank-split";
import { correctAnswerMatchesOption } from "./naplex-answer-align";
import {
  isNclexNgnItem,
  nclexNgnCorrectAnswerValid,
  resolveNclexNgnSelectableOptions,
} from "./nclex-ngn-audit";
import { hasGenericPlaceholderOptions } from "@/lib/question-format";
import { BOARD_SERVE_MIN_EXPLANATION_CHARS } from "./board-serve-quality";

export type BankAuditIssue = NclexAuditIssue | NaplexAuditIssue;

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

function isUsmleField(fieldId: string): boolean {
  return fieldId.startsWith("usmle");
}

function resolveVignette(item: BankItem, fieldId: string): string {
  if (fieldId === "nursing") return resolveNclexVignette(item);
  if (isUsmleField(fieldId)) return splitUsmleBankItem(item).vignette?.trim() ?? "";
  const explicit = item.vignette?.trim() || item.scenario?.trim() || "";
  if (explicit) return explicit;
  // Mirror resolveStem: a leading "\n\n"-separated block of >=40 chars is the
  // embedded vignette, so deictic stems ("these findings") aren't false-flagged
  // as orphans when the vignette lives inside the question column.
  const q = item.question?.trim() ?? "";
  if (q.includes("\n\n")) {
    const head = q.split("\n\n")[0]?.trim() ?? "";
    if (head.length >= 40) return head;
  }
  return "";
}

function resolveStem(item: BankItem, fieldId: string): string {
  if (fieldId === "nursing") return resolveNclexStem(item);
  if (isUsmleField(fieldId)) return splitUsmleBankItem(item).stem;
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

  const minStemLen = isUsmleField(fieldId) && vignette ? 8 : 12;
  if (!stem?.trim() || stem.trim().length < minStemLen) {
    push("error", "empty_question", "Question stem is missing or too short.");
  }

  if (
    !item.explanation?.trim() ||
    item.explanation.trim().length < BOARD_SERVE_MIN_EXPLANATION_CHARS
  ) {
    push("error", "empty_explanation", "Explanation is missing or too short.");
  }

  const itemType = item.itemType ?? "mcq";

  if (itemType === "k_type") {
    // K-type items use combined-response options (I only, I and II only, …).
    if (item.options.length < 4) {
      push("error", "invalid_option_count", "K-type items must have at least four options.");
    }
    if (!correctAnswerMatchesOption(item.options, item.correctAnswer, itemType)) {
      push("error", "correct_not_in_options", "correctAnswer must match one option exactly.");
    }
  } else if (itemType === "select_all" || itemType === "sata") {
    const options =
      fieldId === "nursing" && isNclexNgnItem(item)
        ? (resolveNclexNgnSelectableOptions(item) ?? item.options)
        : item.options;
    if (options.length < 4) {
      push("error", "invalid_option_count", "Select-all items must have at least four options.");
    }
    if (!correctAnswerMatchesOption(options, item.correctAnswer, itemType)) {
      if (!(fieldId === "nursing" && isNclexNgnItem(item) && nclexNgnCorrectAnswerValid(item))) {
        push("error", "correct_not_in_options", "Every select-all answer must match an option exactly.");
      }
    }
  } else if (itemType === "ordered_response") {
    const options =
      fieldId === "nursing" && isNclexNgnItem(item)
        ? (resolveNclexNgnSelectableOptions(item) ?? item.options)
        : item.options;
    if (options.length < 3) {
      push("error", "invalid_option_count", "Ordered-response items must have at least three steps.");
    }
    const optionSet = new Set(options.map((o) => o.trim()));
    const parts = (item.correctAnswer.includes("|||")
      ? item.correctAnswer.split("|||")
      : item.correctAnswer.split(",")
    )
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length < 2 || !parts.every((p) => optionSet.has(p))) {
      if (!(fieldId === "nursing" && isNclexNgnItem(item) && nclexNgnCorrectAnswerValid(item))) {
        push("error", "correct_not_in_options", "Ordered-response answer steps must match options exactly.");
      }
    }
  } else if (itemType === "constructed_response") {
    if (!item.correctAnswer?.trim()) {
      push("error", "empty_correct_answer", "Constructed-response items require a correct value.");
    }
  } else if (itemType === "drag_drop") {
    if (item.options.length < 4) {
      push("error", "invalid_option_count", "Drag-and-drop items must have at least four match targets.");
    }
    if (!item.correctAnswer?.trim()) {
      push("error", "empty_correct_answer", "Drag-and-drop items require mapped correct pairs.");
    }
  } else if (fieldId === "nursing" && isNclexNgnItem(item)) {
    if (item.correctAnswer && !nclexNgnCorrectAnswerValid(item)) {
      push("error", "ngn_answer_invalid", "NGN correctAnswer does not match the stored payload structure.");
    }
  } else {
    const mcqMaxOptions = isUsmleField(fieldId) ? 6 : 4;
    if (item.options.length < 4 || item.options.length > mcqMaxOptions) {
      push(
        "error",
        "invalid_option_count",
        isUsmleField(fieldId)
          ? "MCQ items must have 4–6 options."
          : "MCQ items must have exactly four options."
      );
    }
    if (
      item.options.length >= 4 &&
      item.options.length <= mcqMaxOptions &&
      !correctAnswerMatchesOption(item.options, item.correctAnswer, itemType)
    ) {
      push("error", "correct_not_in_options", "correctAnswer must match one option exactly.");
    }
  }

  const uniqueOptions = new Set(item.options.map((o) => o.trim().toLowerCase()));
  if (uniqueOptions.size < item.options.length) {
    push("error", "duplicate_options", "Two or more answer options are identical.");
  }

  if (
    item.options.length >= 4 &&
    hasGenericPlaceholderOptions(item.options) &&
    !(fieldId === "nursing" && isNclexNgnItem(item))
  ) {
    push(
      "error",
      "generic_placeholder_options",
      "Answer choices use placeholder labels instead of board-style distractors."
    );
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

  if (fieldId.startsWith("usmle") && hasDuplicateVignette(item.question)) {
    push("error", "duplicate_vignette_block", "Vignette paragraph is duplicated in the question stem.");
  }

  if (
    fieldId.startsWith("usmle") &&
    (/empiric therapy required|pending culture/i.test(item.correctAnswer) ||
      item.options.some((o) => /empiric therapy required|pending culture/i.test(o)))
  ) {
    push(
      "error",
      "diagnosis_management_mixed",
      "Diagnosis answer or option embeds management language (empiric therapy / pending culture)."
    );
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
  if (fieldId === "pharmacy") {
    return mergeReports(shared, auditNaplexBankItem(item));
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
