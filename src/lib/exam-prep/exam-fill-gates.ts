import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import { nclexHasServeBlockIssues } from "@/lib/exam-prep/nclex-bank-audit";
import {
  naplexItemPassesRelaxedExamGate,
  naplexItemPassesStructuralTimedGate,
  naplexItemPassesTimedExamGate,
  prepareNaplexBankItem,
} from "./naplex-serve-gate";
import {
  nclexItemPassesBestExamGate,
  nclexItemPassesRelaxedExamGate,
  nclexItemPassesStructuralTimedGate,
} from "./nclex-serve-gate";
import {
  nptePtItemPassesRelaxedExamGate,
  nptePtItemPassesStructuralTimedGate,
  nptePtItemPassesTimedExamGate,
} from "./npte-pt-serve-gate";
import {
  usmleBankItemIsExamFillReady,
  usmleBankItemPassesBasicTimedGate,
  usmleBankItemPassesMinimalTimedGate,
  usmleBankItemPassesStructuralGate,
} from "./usmle-clinical-gate";

export type TimedExamGatePair = {
  strict: (item: BankItem) => boolean;
  relaxed?: (item: BankItem) => boolean;
};

export type GatherGateTier = {
  id: string;
  filter: (item: BankItem) => boolean;
};

function nclexItemPassesMinimalExamGate(item: BankItem): boolean {
  if (nclexHasServeBlockIssues(item)) return false;
  if ((item.options?.length ?? 0) < 4) return false;
  const answer = item.correctAnswer?.trim() ?? "";
  if (!answer) return false;
  if (!item.options.some((option) => option.trim() === answer)) return false;
  return Boolean(item.question?.trim());
}

function naplexItemPassesMinimalExamGate(item: BankItem): boolean {
  const prepared = prepareNaplexBankItem(item);
  if (!auditBankItem(prepared, "pharmacy").ok) return false;
  if ((prepared.options?.length ?? 0) < 4) return false;
  return Boolean(prepared.correctAnswer?.trim());
}

function nptePtItemPassesMinimalExamGate(item: BankItem): boolean {
  if ((item.options?.length ?? 0) < 4) return false;
  const answer = item.correctAnswer?.trim() ?? "";
  if (!answer) return false;
  return Boolean(item.question?.trim());
}

/**
 * Ordered gather-gate ladder for progressive bank pulls.
 * Each tier adds items that pass a lower editorial bar until the pool fills.
 */
export function timedExamGatherLadderForField(fieldId: string): GatherGateTier[] {
  if (fieldId === "nursing") {
    return [
      { id: "best", filter: nclexItemPassesBestExamGate },
      { id: "structural", filter: nclexItemPassesStructuralTimedGate },
      { id: "relaxed", filter: nclexItemPassesRelaxedExamGate },
      { id: "minimal", filter: nclexItemPassesMinimalExamGate },
    ];
  }
  if (fieldId === "pharmacy") {
    return [
      { id: "structural", filter: naplexItemPassesStructuralTimedGate },
      { id: "serve", filter: naplexItemPassesTimedExamGate },
      { id: "relaxed", filter: naplexItemPassesRelaxedExamGate },
      { id: "minimal", filter: naplexItemPassesMinimalExamGate },
    ];
  }
  if (fieldId === "npte-pt") {
    return [
      { id: "structural", filter: nptePtItemPassesStructuralTimedGate },
      { id: "serve", filter: nptePtItemPassesTimedExamGate },
      { id: "relaxed", filter: nptePtItemPassesRelaxedExamGate },
      { id: "minimal", filter: nptePtItemPassesMinimalExamGate },
    ];
  }
  if (fieldId.startsWith("usmle") || fieldId === "pance" || fieldId === "aanp-fnp") {
    return [
      {
        id: "structural",
        filter: (item) => usmleBankItemPassesStructuralGate(item, fieldId),
      },
      {
        id: "basic_mcq",
        filter: (item) => usmleBankItemPassesBasicTimedGate(item, fieldId),
      },
      { id: "minimal", filter: usmleBankItemPassesMinimalTimedGate },
    ];
  }
  return [{ id: "qa_passed", filter: () => true }];
}

/**
 * Timed/full exam bank gathering gates.
 * Primary (strict): structural-only — DB rows are already qaPassed.
 * Fallback (relaxed): lower editorial bar when the structural pool cannot fill the exam.
 */
export function timedExamGatePairForField(fieldId: string): TimedExamGatePair {
  if (fieldId === "nursing") {
    return {
      strict: nclexItemPassesBestExamGate,
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
