import type { BankItem } from "@/lib/question-bank";
import { isVignetteRich, validateClinicalVignette } from "@/lib/engine/prompts/vignette";
import type { ExamQuestion } from "@/lib/ai";
import { bankItemToUsmleExam } from "./usmle-bank-bridge";
import { auditUsmleQaEditor } from "./usmle-qa-editor";
import { isUsmleCuratedItem } from "@/lib/question-bank/usmle-curated";
import { isPanceCuratedItem } from "@/lib/question-bank/pance-curated";
import { isAanpFnpCuratedItem } from "@/lib/question-bank/aanp-fnp-curated";
import { serveQaPassedBankItems } from "./serve-qa-passed";

/** Split stored USMLE bank text into vignette + lead-in stem. */
export function splitUsmleBankItem(item: BankItem): { vignette?: string; stem: string } {
  const explicit = item.vignette?.trim() || item.scenario?.trim();
  const q = item.question.trim();

  if (explicit) {
    if (q.startsWith(explicit)) {
      const stem = q.slice(explicit.length).replace(/^\s*\n+\s*/, "").trim();
      return { vignette: explicit, stem: stem || q };
    }
    return { vignette: explicit, stem: q };
  }

  const parts = q.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2 && parts[0]!.length >= 60) {
    return { vignette: parts[0], stem: parts.slice(1).join("\n\n") };
  }

  return { stem: q };
}

/** Normalize bank rows so vignette and stem are stored in separate fields. */
export function normalizeUsmleBankItemFields(item: BankItem): BankItem {
  const { vignette, stem } = splitUsmleBankItem(item);
  if (!vignette) return item;
  return { ...item, vignette, question: stem };
}

/** True when the item has a vignette rich enough for clinical judgment. */
export function usmleBankItemHasClinicalScenario(item: BankItem): boolean {
  const { vignette, stem } = splitUsmleBankItem(item);
  if (!vignette || stem.length < 12) return false;
  return isVignetteRich(vignette);
}

export function usmleExamQuestionHasClinicalScenario(question: ExamQuestion): boolean {
  return validateClinicalVignette(question).length === 0;
}

/** Curated seeds pass clinical gate; bulk-polished items must score exam-ready (≥8/10). */
export function usmleBankItemIsServeReady(item: BankItem, fieldId: string): boolean {
  const normalized = normalizeUsmleBankItemFields(item);
  if (!usmleBankItemHasClinicalScenario(normalized)) return false;

  const exam = bankItemToUsmleExam(normalized, 0);
  if (!usmleExamQuestionHasClinicalScenario(exam)) return false;

  if (isUsmleCuratedItem(normalized) || isPanceCuratedItem(normalized) || isAanpFnpCuratedItem(normalized)) {
    return true;
  }

  const report = auditUsmleQaEditor(normalized, {
    fieldId,
    source: "polished",
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
