/**
 * Ingest-time QA — mirrors runtime serve gates so qaPassed rows match what students see.
 * Used by seed sync, bulk top-up, and db:qa-gate alignment.
 */
import type { BankItem } from "@/lib/question-bank";
import { hasGenericPlaceholderOptions } from "@/lib/question-format";
import { auditBankItem } from "./bank-audit";
import { nclexBankItemIsServeReady } from "./nclex-serve-gate";
import {
  naplexBankItemIsServeReady,
  prepareNaplexBankItem,
} from "./naplex-serve-gate";
import { isUsmleField } from "./usmle-bank-bridge";
import { usmleBankItemIsServeReady } from "./usmle-clinical-gate";

const CLINICAL_FIELD_IDS = new Set(["pance"]);

/** True when a bank row meets the same bar enforced at serve time. */
export function bankItemPassesIngestGate(
  fieldId: string,
  item: BankItem,
  source?: string | null
): boolean {
  if (!auditBankItem(item, fieldId).ok) return false;

  const itemType = item.itemType ?? "mcq";
  if (
    (itemType === "mcq" || itemType === "select_all" || itemType === "sata") &&
    item.options.length >= 4 &&
    hasGenericPlaceholderOptions(item.options)
  ) {
    return false;
  }

  if (fieldId === "nursing") {
    return nclexBankItemIsServeReady(item);
  }

  if (fieldId === "pharmacy") {
    const prepared = prepareNaplexBankItem(item);
    return naplexBankItemIsServeReady(prepared, {
      source: source ?? prepared.source ?? null,
    });
  }

  if (isUsmleField(fieldId) || CLINICAL_FIELD_IDS.has(fieldId)) {
    return usmleBankItemIsServeReady(item, fieldId);
  }

  return true;
}

/** Filter a batch before DB insert or AI handoff. */
export function filterBankItemsForIngest(
  fieldId: string,
  items: BankItem[],
  source?: string | null
): BankItem[] {
  return items.filter((item) => bankItemPassesIngestGate(fieldId, item, source));
}
