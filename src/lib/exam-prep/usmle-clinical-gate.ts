import type { BankItem } from "@/lib/question-bank";
import type { ExamQuestion } from "@/lib/ai";
import { isVignetteRich, validateClinicalVignette } from "@/lib/engine/prompts/vignette";
import { auditUsmleQaEditor } from "./usmle-qa-editor";
import { bankItemToUsmleExam } from "./usmle-bank-bridge";
import { isUsmleFieldId, USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES } from "./usmle/steps";
import { nptePtBankItemIsExamFillReady, nptePtBankItemIsServeReady } from "./npte-pt/clinical-gate";
import { serveQaPassedBankItems } from "./serve-qa-passed";
import { selectUsmleSessionBankItems } from "./usmle/session-selection";
import { hasGenericPlaceholderOptions } from "@/lib/question-format";
import { BOARD_SERVE_MIN_EXPLANATION_CHARS } from "./board-serve-quality";

import { splitUsmleBankItem, normalizeUsmleBankItemFields } from "./usmle-bank-split";

export { normalizeUsmleBankItemFields, splitUsmleBankItem };

export function usmleBankItemHasClinicalScenario(item: BankItem): boolean {
  const { vignette, stem } = splitUsmleBankItem(item);
  if (!vignette || stem.length < 12) return false;
  return isVignetteRich(vignette);
}

export function usmleExamQuestionHasClinicalScenario(question: ExamQuestion): boolean {
  return validateClinicalVignette(question).length === 0;
}

/** Basic structural gate for items that do not use clinical vignettes. */
export function usmleBankItemPassesBasicTimedGate(item: BankItem, _fieldId?: string): boolean {
  if (!item.question?.trim() || item.question.trim().length < 12) return false;
  if (!item.correctAnswer?.trim()) return false;
  if ((item.options?.length ?? 0) < 4) return false;
  if (hasGenericPlaceholderOptions(item.options ?? [])) return false;
  if (
    !item.explanation?.trim() ||
    item.explanation.trim().length < BOARD_SERVE_MIN_EXPLANATION_CHARS
  )
    return false;
  return item.options.some((o) => o.trim() === item.correctAnswer.trim());
}

/** Last-resort timed gate — DB rows are qaPassed; only require answerable MCQ shape. */
export function usmleBankItemPassesMinimalTimedGate(item: BankItem): boolean {
  const normalized = normalizeUsmleBankItemFields(item);
  if (!normalized.question?.trim() || normalized.question.trim().length < 8) return false;
  if (!normalized.correctAnswer?.trim()) return false;
  if ((normalized.options?.length ?? 0) < 2) return false;
  if (!normalized.explanation?.trim() || normalized.explanation.trim().length < 16) return false;
  return true;
}

/** Structural checks only — trust qaPassed on timed pulls (skip editorial re-audit). */
export function usmleBankItemPassesStructuralGate(item: BankItem, fieldId: string): boolean {
  const normalized = normalizeUsmleBankItemFields(item);
  const itemType = normalized.itemType ?? "mcq";

  if (fieldId === "usmle-step-3" && USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES.has(itemType)) {
    return usmleBankItemPassesBasicTimedGate(normalized, fieldId);
  }

  if (fieldId === "usmle-step-1") {
    return usmleBankItemPassesBasicTimedGate(normalized, fieldId);
  }

  if (!usmleBankItemHasClinicalScenario(normalized)) return false;
  const exam = bankItemToUsmleExam(normalized, 0);
  return usmleExamQuestionHasClinicalScenario(exam);
}

/** Serve only editorial exam-ready items (≥8/10, no QA errors) after structural checks. */
export function usmleBankItemIsServeReady(item: BankItem, fieldId: string): boolean {
  if (fieldId === "npte-pt") {
    return nptePtBankItemIsServeReady(item, item.source);
  }

  if (!isUsmleFieldId(fieldId)) {
    return usmleBankItemPassesStructuralGate(item, fieldId);
  }

  if (!usmleBankItemPassesStructuralGate(item, fieldId)) return false;

  const normalized = normalizeUsmleBankItemFields(item);
  const report = auditUsmleQaEditor(normalized, {
    fieldId,
    source: item.source,
    itemId: normalized.id,
    difficulty: normalized.difficulty ?? null,
  });

  const itemType = normalized.itemType ?? "mcq";
  // Step 3 abstracts / drug ads / CCS / biostats / ethics use format stimuli, not classic
  // patient vignettes — hold a 7.0 editorial floor (no errors) instead of the vignette ≥8 bar.
  if (fieldId === "usmle-step-3" && USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES.has(itemType)) {
    return report.overallScore >= 7 && !report.issues.some((i) => i.severity === "error");
  }

  return report.examReady;
}

const USMLE_EXAM_FILL_MIN_SCORE = 7;

/** Lower editorial bar when strict serve-ready pool cannot fill a timed exam. */
export function usmleBankItemIsExamFillReady(item: BankItem, fieldId: string): boolean {
  if (fieldId === "npte-pt") {
    return nptePtBankItemIsExamFillReady(item, item.source);
  }

  if (!isUsmleFieldId(fieldId) && fieldId !== "pance" && fieldId !== "aanp-fnp") {
    return usmleBankItemIsServeReady(item, fieldId);
  }

  if (!usmleBankItemPassesStructuralGate(item, fieldId)) return false;

  const normalized = normalizeUsmleBankItemFields(item);
  const report = auditUsmleQaEditor(normalized, {
    fieldId,
    source: item.source,
    itemId: normalized.id,
    difficulty: normalized.difficulty ?? null,
  });

  return (
    report.overallScore >= USMLE_EXAM_FILL_MIN_SCORE &&
    !report.issues.some((i) => i.severity === "error")
  );
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
  const vetted = items.filter((item) => usmleBankItemIsServeReady(item, fieldId));
  if (isUsmleFieldId(fieldId)) {
    const stepLevel =
      fieldId === "usmle-step-1" ? "step1" : fieldId === "usmle-step-3" ? "step3" : "step2";
    return selectUsmleSessionBankItems(vetted, limit, { stepLevel });
  }
  return serveQaPassedBankItems(vetted, limit);
}
