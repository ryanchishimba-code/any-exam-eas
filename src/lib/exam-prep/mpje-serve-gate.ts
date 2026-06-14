import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import { serveQaPassedBankItems } from "@/lib/exam-prep/serve-qa-passed";

/** DB-backed rows only — blocks bulk/runtime fillers without a persisted id. */
export function mpjeBankItemIsServeReady(item: BankItem): boolean {
  if (!item.id?.trim()) return false;
  return auditBankItem(item, "mpje").ok;
}

type PrepareMpjeItemsParams = {
  items: BankItem[];
  limit: number;
};

/** Items are pre-filtered to qaPassed=true in the DB sample. */
export function prepareMpjeItemsForSession({
  items,
  limit,
}: PrepareMpjeItemsParams): BankItem[] {
  const vetted = items.filter(mpjeBankItemIsServeReady);
  return serveQaPassedBankItems(vetted, limit);
}
