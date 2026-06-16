/**
 * Runtime serve gate for NPTE-PT timed / full-exam sessions.
 */
import type { BankItem } from "@/lib/question-bank";
import { nptePtBankItemIsServeReady } from "@/lib/exam-prep/npte-pt/clinical-gate";

export function nptePtItemPassesTimedExamGate(item: BankItem): boolean {
  return nptePtBankItemIsServeReady(item, item.source);
}

export function filterNptePtTimedExamItems(items: BankItem[]): BankItem[] {
  return items.filter(nptePtItemPassesTimedExamGate);
}
