import type { BankItem } from "@/lib/question-bank";
import { passesNaplexServeGate } from "./naplex-quality-gate";
import { serveQaPassedBankItems } from "./serve-qa-passed";

export { normalizeNaplexBankItemFields } from "./naplex-bank-normalize";

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
export function prepareNaplexItemsForSession({
  items,
  limit,
}: PrepareNaplexItemsParams): BankItem[] {
  return serveQaPassedBankItems(items, limit);
}
