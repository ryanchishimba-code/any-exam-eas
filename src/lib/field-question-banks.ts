/**
 * @deprecated Use health-sciences-question-bank.ts — kept for imports.
 * Re-exports flattened banks for backward compatibility.
 */
import type { BankItem } from "./question-bank";
import { HEALTH_QUESTION_BANK } from "./health-sciences-question-bank";

function flattenField(fieldId: string): BankItem[] {
  const subjects = HEALTH_QUESTION_BANK[fieldId];
  if (!subjects) return [];
  return Object.values(subjects).flat();
}

export const FIELD_QUESTION_BANKS: Record<string, BankItem[]> = {
  "usmle-step-1": flattenField("usmle-step-1"),
  "usmle-step-2": flattenField("usmle-step-2"),
  nursing: flattenField("nursing"),
  pharmacy: flattenField("pharmacy"),
};
