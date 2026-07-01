import type { BankItem } from "@/lib/question-bank";
import { finalizeExamSessionItems } from "@/lib/exam-prep/finalize-exam-selection";

/** Pass through QA-vetted rows with cross-exam similarity guards before serve. */
export function serveQaPassedBankItems(
  items: BankItem[],
  limit: number,
  opts?: { seed?: number }
): BankItem[] {
  return finalizeExamSessionItems(items, limit, { requestedCount: limit, seed: opts?.seed });
}
