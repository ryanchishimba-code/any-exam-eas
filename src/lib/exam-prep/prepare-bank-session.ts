import type { ExamQuestion } from "@/lib/ai";
import type { BankItem } from "@/lib/question-bank";
import { bankItemToRawQuestion } from "./ngn-bank-bridge";
import { bankItemToNaplexRaw } from "./naplex-bank-bridge";
import { bankItemToUsmleRaw, isUsmleField } from "./usmle-bank-bridge";
import { filterNclexItemsForSession, prepareNclexItemsForSession } from "./nclex-serve-gate";
import {
  naplexBankItemIsServeReady,
  prepareNaplexBankItem,
  prepareNaplexItemsForSession,
} from "./naplex-serve-gate";
import {
  prepareUsmleItemsForSession,
  usmleBankItemIsServeReady,
} from "./usmle-clinical-gate";
import { serveQaPassedBankItems } from "./serve-qa-passed";

const CLINICAL_FIELD_IDS = new Set(["pance"]);

function isClinicalVignetteField(fieldId: string): boolean {
  return isUsmleField(fieldId) || CLINICAL_FIELD_IDS.has(fieldId);
}

/** Runtime re-audit — never trust stale qaPassed flags from the DB alone. */
export function filterBankItemsForServe(fieldId: string, items: BankItem[]): BankItem[] {
  if (fieldId === "nursing") {
    return filterNclexItemsForSession(items);
  }
  if (fieldId === "pharmacy") {
    return items
      .map((item) => prepareNaplexBankItem(item))
      .filter((item) => naplexBankItemIsServeReady(item, { source: item.source ?? null }));
  }
  if (isClinicalVignetteField(fieldId)) {
    return items.filter((item) => usmleBankItemIsServeReady(item, fieldId));
  }
  return items;
}

/** Filter, spread, and cap bank rows before mapping to client-facing questions. */
export function prepareBankItemsForSession(params: {
  fieldId: string;
  field: string;
  items: BankItem[];
  limit: number;
}): BankItem[] {
  const { fieldId, field, items, limit } = params;

  if (fieldId === "nursing") {
    return prepareNclexItemsForSession({ items, field, limit });
  }
  if (fieldId === "pharmacy") {
    return prepareNaplexItemsForSession({ items, fieldId, field, limit });
  }
  if (isClinicalVignetteField(fieldId)) {
    return prepareUsmleItemsForSession({ items, fieldId, field, limit });
  }

  return serveQaPassedBankItems(filterBankItemsForServe(fieldId, items), limit);
}

/** Map a vetted bank row to the API raw-question shape for the given field. */
export function bankItemToSessionRaw(
  fieldId: string,
  field: string,
  subjectId: string,
  item: BankItem,
  index: number
): ExamQuestion {
  if (fieldId === "nursing") {
    return bankItemToRawQuestion(item, index, { field, subjectId });
  }
  if (fieldId === "pharmacy") {
    return bankItemToNaplexRaw(item, index, { field, subjectId });
  }
  if (isClinicalVignetteField(fieldId) || isUsmleField(fieldId)) {
    return bankItemToUsmleRaw(item, index, { field: fieldId, subjectId });
  }
  return bankItemToRawQuestion(item, index, { field, subjectId });
}
