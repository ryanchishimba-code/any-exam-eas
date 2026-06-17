import type { BankItem } from "@/lib/question-bank";
import { selectSpreadBankItems } from "@/lib/questions/spread-session-order";

/** Pass through QA-vetted rows — dedupe and shuffle before limiting (no variability constraints). */
export function serveQaPassedBankItems(items: BankItem[], limit: number): BankItem[] {
  return selectSpreadBankItems(items, limit);
}
