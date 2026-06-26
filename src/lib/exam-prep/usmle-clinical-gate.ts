import type { BankItem } from "@/lib/question-bank";
import { isVignetteRich, validateClinicalVignette } from "@/lib/engine/prompts/vignette";
import type { ExamQuestion } from "@/lib/ai";
import { bankItemToUsmleExam } from "./usmle-bank-bridge";
import { auditUsmleQaEditor } from "./usmle-qa-editor";
import { isUsmleCuratedItem } from "@/lib/question-bank/usmle-curated";
import { isPanceCuratedItem } from "@/lib/question-bank/pance-curated";
import { isAanpFnpCuratedItem } from "@/lib/question-bank/aanp-fnp-curated";
import { isNptePtCuratedItem } from "@/lib/question-bank/npte-pt-curated";
import { nptePtBankItemIsServeReady } from "./npte-pt/clinical-gate";
import { serveQaPassedBankItems } from "./serve-qa-passed";
import {
  isUsmleFieldId,
  USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES,
  usmleServeMinQaScore,
} from "./usmle/steps";
import { hasGenericPlaceholderOptions } from "@/lib/question-format";
import { BOARD_SERVE_MIN_EXPLANATION_CHARS } from "./board-serve-quality";

export { normalizeUsmleBankItemFields, splitUsmleBankItem } from "./usmle-bank-split";

import { splitUsmleBankItem, normalizeUsmleBankItemFields } from "./usmle-bank-split";
export function usmleBankItemHasClinicalScenario(item: BankItem): boolean {
  const { vignette, stem } = splitUsmleBankItem(item);
  if (!vignette || stem.length < 12) return false;
  return isVignetteRich(vignette);
}

export function usmleExamQuestionHasClinicalScenario(question: ExamQuestion): boolean {
  return validateClinicalVignette(question).length === 0;
}

/** Basic structural gate for items that do not use clinical vignettes. */
function usmleItemPassesBasicMcqGate(item: BankItem): boolean {
  if (!item.question?.trim() || item.question.trim().length < 12) return false;
  if (!item.correctAnswer?.trim()) return false;
  if ((item.options?.length ?? 0) < 4) return false;
  if (hasGenericPlaceholderOptions(item.options ?? [])) return false;
  if (
    !item.explanation?.trim() ||
    item.explanation.trim().length < BOARD_SERVE_MIN_EXPLANATION_CHARS
  ) return false;
  return item.options.some((o) => o.trim() === item.correctAnswer.trim());
}

/** Returns true when the editorial QA report meets the field's board serve bar. */
function usmleQaReportPassesServeBar(
  report: ReturnType<typeof auditUsmleQaEditor>,
  fieldId: string
): boolean {
  const minScore = serveScoreThreshold(fieldId);
  if (minScore !== null) {
    return report.overallScore >= minScore && !report.issues.some((i) => i.severity === "error");
  }
  return report.examReady;
}

/** Curated seeds pass clinical gate; bulk-polished items must score exam-ready (≥8/10). */
export function usmleBankItemIsServeReady(item: BankItem, fieldId: string): boolean {
  if (fieldId === "npte-pt") {
    return nptePtBankItemIsServeReady(item, item.source);
  }

  const normalized = normalizeUsmleBankItemFields(item);
  const itemType = normalized.itemType ?? "mcq";

  if (fieldId === "usmle-step-3" && USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES.has(itemType)) {
    if (isUsmleCuratedItem(normalized)) return true;
    if (!usmleItemPassesBasicMcqGate(normalized)) return false;
    const report = auditUsmleQaEditor(normalized, {
      fieldId,
      source: "polished",
      itemId: normalized.id,
      difficulty: normalized.difficulty ?? null,
    });
    return usmleQaReportPassesServeBar(report, fieldId);
  }

  if (fieldId === "usmle-step-1") {
    if (isUsmleCuratedItem(normalized)) return true;
    if (!normalized.question?.trim() || normalized.question.trim().length < 12) return false;
    if (!usmleItemPassesBasicMcqGate(normalized)) return false;
    const report = auditUsmleQaEditor(normalized, {
      fieldId,
      source: "polished",
      itemId: normalized.id,
      difficulty: normalized.difficulty ?? null,
    });
    return usmleQaReportPassesServeBar(report, fieldId);
  }

  if (!usmleBankItemHasClinicalScenario(normalized)) return false;

  const exam = bankItemToUsmleExam(normalized, 0);
  if (!usmleExamQuestionHasClinicalScenario(exam)) return false;

  if (
    isUsmleCuratedItem(normalized) ||
    isPanceCuratedItem(normalized) ||
    isAanpFnpCuratedItem(normalized) ||
    isNptePtCuratedItem(normalized)
  ) {
    return true;
  }

  const report = auditUsmleQaEditor(normalized, {
    fieldId,
    source: "polished",
    itemId: normalized.id,
    difficulty: normalized.difficulty ?? null,
  });

  return usmleQaReportPassesServeBar(report, fieldId);
}

/** Per-field serve-score threshold; null means use the default examReady (≥8) bar. */
function serveScoreThreshold(fieldId: string): number | null {
  if (fieldId === "pance") {
    const raw = process.env.PANCE_SERVE_MIN_SCORE;
    const parsed = raw ? Number.parseFloat(raw) : NaN;
    return Number.isFinite(parsed) ? parsed : 7.5;
  }
  return usmleServeMinQaScore(fieldId);
}

type PrepareUsmleItemsParams = {
  items: BankItem[];
  fieldId: string;
  field: string;
  limit: number;
};

/** Defense-in-depth: DB qaPassed can be stale — re-audit before each session. */
export function prepareUsmleItemsForSession({
  items,
  fieldId,
  limit,
}: PrepareUsmleItemsParams): BankItem[] {
  return serveQaPassedBankItems(
    items.filter((item) => usmleBankItemIsServeReady(item, fieldId)),
    limit
  );
}
