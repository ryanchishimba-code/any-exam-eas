import type { BankItem } from "@/lib/question-bank";
import { passesNaplexServeGate } from "./naplex-quality-gate";
import { prepareNaplexBankItem } from "./naplex-answer-align";
import { serveQaPassedBankItems } from "./serve-qa-passed";

export { normalizeNaplexBankItemFields } from "./naplex-bank-normalize";
export { prepareNaplexBankItem } from "./naplex-answer-align";

/** Runtime audit helper — QA gate sets qaPassed; serve path trusts that flag. */
export function naplexBankItemIsServeReady(
  item: BankItem,
  opts?: { source?: string | null }
): boolean {
  return passesNaplexServeGate(item, { ...opts, bestOnly: true });
}

type PrepareNaplexItemsParams = {
  items: BankItem[];
  fieldId: string;
  field: string;
  limit: number;
};

/** Items are pre-filtered to qaPassed=true in the DB sample. */
export function naplexItemPassesTimedExamGate(item: BankItem): boolean {
  const prepared = prepareNaplexBankItem(item);
  return naplexBankItemIsServeReady(prepared, { source: prepared.source ?? null });
}

/** Items are pre-filtered to qaPassed=true in the DB sample. */
export function prepareNaplexItemsForSession({
  items,
  limit,
}: PrepareNaplexItemsParams): BankItem[] {
  const vetted = items
    .map((item) => prepareNaplexBankItem(item))
    .filter((item) => naplexBankItemIsServeReady(item, { source: item.source ?? null }));
  return serveQaPassedBankItems(vetted, limit);
}
