import type { BankItem } from "@/lib/question-bank";
import {
  naplexItemPassesRelaxedExamGate,
  naplexItemPassesStructuralTimedGate,
} from "./naplex-serve-gate";
import {
  nclexItemPassesRelaxedExamGate,
  nclexItemPassesStructuralTimedGate,
} from "./nclex-serve-gate";
import {
  nptePtItemPassesRelaxedExamGate,
  nptePtItemPassesStructuralTimedGate,
} from "./npte-pt-serve-gate";
import {
  usmleBankItemIsExamFillReady,
  usmleBankItemPassesStructuralGate,
} from "./usmle-clinical-gate";

export type TimedExamGatePair = {
  strict: (item: BankItem) => boolean;
  relaxed?: (item: BankItem) => boolean;
};

/**
 * Timed/full exam bank gathering gates.
 * Primary (strict): structural-only — DB rows are already qaPassed.
 * Fallback (relaxed): lower editorial bar when the structural pool cannot fill the exam.
 */
export function timedExamGatePairForField(fieldId: string): TimedExamGatePair {
  if (fieldId === "nursing") {
    return {
      strict: nclexItemPassesStructuralTimedGate,
      relaxed: nclexItemPassesRelaxedExamGate,
    };
  }
  if (fieldId === "pharmacy") {
    return {
      strict: naplexItemPassesStructuralTimedGate,
      relaxed: naplexItemPassesRelaxedExamGate,
    };
  }
  if (fieldId === "npte-pt") {
    return {
      strict: nptePtItemPassesStructuralTimedGate,
      relaxed: nptePtItemPassesRelaxedExamGate,
    };
  }
  if (
    fieldId.startsWith("usmle") ||
    fieldId === "pance" ||
    fieldId === "aanp-fnp"
  ) {
    return {
      strict: (item) => usmleBankItemPassesStructuralGate(item, fieldId),
      relaxed: (item) => usmleBankItemIsExamFillReady(item, fieldId),
    };
  }
  return { strict: () => true };
}
