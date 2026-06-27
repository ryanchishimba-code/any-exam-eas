import type { BankItem } from "@/lib/question-bank";
import type { ExamQuestion } from "@/lib/ai";
import { isVignetteRich, validateClinicalVignette } from "@/lib/engine/prompts/vignette";
import { auditUsmleQaEditor } from "./usmle-qa-editor";
import { bankItemToUsmleExam } from "./usmle-bank-bridge";
import { isUsmleFieldId, USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES } from "./usmle/steps";
import { nptePtBankItemIsServeReady } from "./npte-pt/clinical-gate";
import { serveQaPassedBankItems } from "./serve-qa-passed";
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
function usmleItemPassesBasicMcqGate(item: BankItem): boolean {
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

function usmleItemPassesStructuralGate(item: BankItem, fieldId: string): boolean {
  const normalized = normalizeUsmleBankItemFields(item);
  const itemType = normalized.itemType ?? "mcq";

  if (fieldId === "usmle-step-3" && USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES.has(itemType)) {
    return usmleItemPassesBasicMcqGate(normalized);
  }

  if (fieldId === "usmle-step-1") {
    return usmleItemPassesBasicMcqGate(normalized);
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
    return usmleItemPassesStructuralGate(item, fieldId);
  }

  if (!usmleItemPassesStructuralGate(item, fieldId)) return false;

  const normalized = normalizeUsmleBankItemFields(item);
  const report = auditUsmleQaEditor(normalized, {
    fieldId,
    source: item.source,
    itemId: normalized.id,
    difficulty: normalized.difficulty ?? null,
  });

  return report.examReady;
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
