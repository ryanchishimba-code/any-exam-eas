import type { BankItem } from "@/lib/question-bank";
import { isUsmleFieldId } from "@/lib/exam-prep/usmle/steps";
import { normalizeFieldId } from "@/lib/subjects/field-ids";

type ScopedBankRow = {
  fieldId?: string | null;
  stepLevel?: string | null;
};

/** Whether a DB row belongs in the requested practice field (incl. USMLE step rules). */
export function bankRowMatchesPracticeField(row: ScopedBankRow, fieldId: string): boolean {
  const target = normalizeFieldId(fieldId);
  const itemField = row.fieldId ? normalizeFieldId(row.fieldId) : target;

  if (itemField !== target) {
    if (target === "usmle-step-3" && itemField === "usmle-step-2") {
      return row.stepLevel === "step3";
    }
    return false;
  }

  if (target === "usmle-step-2" && row.stepLevel === "step3") {
    return false;
  }

  return true;
}

/** Drop bank rows that leaked across exam fields before mapping to client payloads. */
export function filterBankRowsForPracticeField<T extends ScopedBankRow>(
  rows: T[],
  fieldId: string
): T[] {
  return rows.filter((row) => bankRowMatchesPracticeField(row, fieldId));
}

function stepLevelOf(item: BankItem): string | null {
  const direct = (item as BankItem & { stepLevel?: string }).stepLevel;
  if (typeof direct === "string" && direct.trim()) return direct;
  return typeof item.ngnPayload?.stepLevel === "string" ? item.ngnPayload.stepLevel : null;
}

/** Best-effort filter when only BankItem payloads are available (post-enrich). */
export function filterBankItemsForPracticeField(items: BankItem[], fieldId: string): BankItem[] {
  if (!isUsmleFieldId(fieldId)) return items;
  const target = normalizeFieldId(fieldId);
  return items.filter((item) => {
    const stepLevel = stepLevelOf(item);
    if (item.fieldId) {
      return bankRowMatchesPracticeField({ fieldId: item.fieldId, stepLevel }, fieldId);
    }
    if (target === "usmle-step-2" && stepLevel === "step3") return false;
    if (target === "usmle-step-3" && stepLevel && stepLevel !== "step3") return false;
    return true;
  });
}
