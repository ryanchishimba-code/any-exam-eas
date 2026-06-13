import type { BankItem } from "@/lib/question-bank";
import { getFieldSubject } from "@/lib/field-subjects";
import { isVignetteRich, validateClinicalVignette } from "@/lib/engine/prompts/vignette";
import { polishUsmleBankItem } from "@/lib/engine/polish/usmle-polish";
import type { ExamQuestion } from "@/lib/ai";
import { bankItemToUsmleExam } from "./usmle-bank-bridge";
import { auditUsmleQaEditor } from "./usmle-qa-editor";
import { isUsmleCuratedItem } from "@/lib/question-bank/usmle-curated";

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

  if (isUsmleCuratedItem(normalized)) return true;

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

/**
 * Drop or repair items missing a clinical scenario before they reach the session player.
 * Weak items are re-polished once; still-invalid rows are excluded.
 */
export function prepareUsmleItemsForSession({
  items,
  fieldId,
  field,
  limit,
}: PrepareUsmleItemsParams): BankItem[] {
  const accepted: BankItem[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < items.length && accepted.length < limit; i++) {
    let item = normalizeUsmleBankItemFields(items[i]!);

    if (!usmleBankItemIsServeReady(item, fieldId)) {
      const subject = getFieldSubject(field, item.subjectId ?? "");
      const { item: polished } = polishUsmleBankItem(
        item,
        fieldId,
        item.subjectId ?? "internal-medicine",
        subject?.label ?? "USMLE",
        i + accepted.length
      );
      item = normalizeUsmleBankItemFields(polished);
    }

    if (!usmleBankItemIsServeReady(item, fieldId)) continue;

    const key = item.id ?? `${item.subjectId}:${item.question}`;
    if (seen.has(key)) continue;
    seen.add(key);
    accepted.push(item);
  }

  return accepted;
}
