/**
 * Runtime serve gate for NPTE-PT timed / full-exam sessions.
 */
import type { BankItem } from "@/lib/question-bank";
import {
  nptePtBankItemIsExamFillReady,
  nptePtBankItemIsServeReady,
  nptePtBankItemPassesStructuralGate,
} from "@/lib/exam-prep/npte-pt/clinical-gate";

export function nptePtItemPassesStructuralTimedGate(item: BankItem): boolean {
  return nptePtBankItemPassesStructuralGate(item);
}

export function nptePtItemPassesTimedExamGate(item: BankItem): boolean {
  return nptePtBankItemIsServeReady(item, item.source);
}

export function nptePtItemPassesRelaxedExamGate(item: BankItem): boolean {
  return nptePtBankItemIsExamFillReady(item, item.source);
}

export function filterNptePtTimedExamItems(items: BankItem[]): BankItem[] {
  return items.filter(nptePtItemPassesTimedExamGate);
}
