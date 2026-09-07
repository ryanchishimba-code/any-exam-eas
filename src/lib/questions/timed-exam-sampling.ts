import type { BankItem } from "@/lib/question-bank";
import { dedupeBankItemsById } from "@/lib/question-bank-db";
import { gatherProgressiveBankPool } from "@/lib/exam-prep/gather-progressive-bank-pool";
import { timedExamGatherLadderForField } from "@/lib/exam-prep/exam-fill-gates";
import { gatherUsmleTimedExamBankItems } from "@/lib/exam-prep/usmle/progressive-exam-fill";
import { isUsmleFieldId } from "@/lib/exam-prep/usmle/steps";
import { resolveProgressivePoolLimit } from "@/lib/exam-prep/progressive-exam-relaxation";

export type TimedExamFilterFn = (item: BankItem) => boolean;

/** @deprecated Use resolveProgressivePoolLimit from progressive-exam-relaxation. */
function resolveTimedExamPoolTarget(limit: number): number {
  return resolveProgressivePoolLimit(limit);
}

/**
 * Pull and vet enough bank rows for a timed/full exam session.
 * Falls back to a slightly lower QA bar when the strict pool cannot fill the exam.
 */
export async function gatherTimedExamBankItems(params: {
  fieldId: string;
  limit: number;
  stateCode?: string;
  filterFn: TimedExamFilterFn;
  relaxedFilterFn?: TimedExamFilterFn;
  initialSampleCount: number;
  maxRoundsPerTier?: number;
}): Promise<BankItem[]> {
  if (isUsmleFieldId(params.fieldId)) {
    return gatherUsmleTimedExamBankItems({
      fieldId: params.fieldId,
      limit: params.limit,
      initialSampleCount: params.initialSampleCount,
      stateCode: params.stateCode,
      maxRoundsPerTier: params.maxRoundsPerTier,
    });
  }

  const { fieldId, limit, relaxedFilterFn } = params;
  const ladder = timedExamGatherLadderForField(fieldId);
  // Always escalate through the field ladder so timed exams can fill.
  // Optional relaxedFilterFn only caps how far we relax (legacy callers).
  const maxTierIndex = relaxedFilterFn
    ? Math.min(ladder.length - 1, Math.max(1, ladder.length - 2))
    : Math.max(0, ladder.length - 1);

  const gathered = await gatherProgressiveBankPool({
    fieldId,
    limit,
    maxTierIndex,
    initialSampleCount: params.initialSampleCount,
    stateCode: params.stateCode,
    maxRoundsPerTier: params.maxRoundsPerTier ?? 2,
  });

  const poolTarget = resolveTimedExamPoolTarget(limit);
  const exportSize = Math.max(limit, poolTarget);

  // Keep the progressive pool intact for session finalize — clinical similarity
  // dedupe belongs in finalize, not here (it was underfilling 49/50 exams).
  return dedupeBankItemsById(gathered).slice(0, exportSize);
}
