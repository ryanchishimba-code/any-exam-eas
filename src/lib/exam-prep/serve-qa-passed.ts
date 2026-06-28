import type { BankItem } from "@/lib/question-bank";
import { selectDiverseSessionBankItems } from "@/lib/exam-prep/diverse-session-selection";

/** Pass through QA-vetted rows with clinical-case dedupe, domain mix, and anti-cluster order. */
export function serveQaPassedBankItems(items: BankItem[], limit: number): BankItem[] {
  return selectDiverseSessionBankItems(items, limit, { requestedCount: limit });
}
