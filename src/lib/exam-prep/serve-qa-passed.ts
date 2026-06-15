import type { BankItem } from "@/lib/question-bank";
import { selectSpreadBankItems } from "@/lib/questions/spread-session-order";

/** Pass through rows already filtered by qaPassed in the DB — dedupe and spread before limiting. */
export function serveQaPassedBankItems(items: BankItem[], limit: number): BankItem[] {
  return selectSpreadBankItems(items, limit);
}
