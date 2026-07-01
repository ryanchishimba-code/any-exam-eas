import type { BankItem } from "@/lib/question-bank";
import { dedupeBankItemsById } from "@/lib/question-bank-db";
import { serveQaPassedBankItems } from "@/lib/exam-prep/serve-qa-passed";
import { gatherProgressiveBankPool } from "@/lib/exam-prep/gather-progressive-bank-pool";
import { timedExamGatherLadderForField } from "@/lib/exam-prep/exam-fill-gates";
import { gatherUsmleTimedExamBankItems } from "@/lib/exam-prep/usmle/progressive-exam-fill";
import { isUsmleFieldId } from "@/lib/exam-prep/usmle/steps";
import { LONG_SESSION_CLINICAL_DEDUPE_MAX } from "@/lib/questions/spread-session-order";
import {
  resolveProgressivePoolLimit,
  resolveProgressivePullSize,
} from "@/lib/exam-prep/progressive-exam-relaxation";

export type TimedExamFilterFn = (item: BankItem) => boolean;

/** @deprecated Use resolveProgressivePoolLimit from progressive-exam-relaxation. */
function resolveTimedExamPoolTarget(limit: number): number {
  return resolveProgressivePoolLimit(limit);
}

/** @deprecated Use resolveProgressivePullSize from progressive-exam-relaxation. */
function resolveTimedExamPullSize(limit: number, poolTarget: number): number {
  return resolveProgressivePullSize(limit, poolTarget);
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
}): Promise<BankItem[]> {
  if (isUsmleFieldId(params.fieldId)) {
    return gatherUsmleTimedExamBankItems({
      fieldId: params.fieldId,
      limit: params.limit,
      initialSampleCount: params.initialSampleCount,
      stateCode: params.stateCode,
    });
  }

  const { fieldId, limit, relaxedFilterFn } = params;
  const ladder = timedExamGatherLadderForField(fieldId);
  const maxTierIndex = relaxedFilterFn
    ? Math.min(ladder.length - 1, Math.max(1, ladder.length - 2))
    : 0;

  const gathered = await gatherProgressiveBankPool({
    fieldId,
    limit,
    maxTierIndex,
    initialSampleCount: params.initialSampleCount,
    stateCode: params.stateCode,
  });

  const longExam = limit >= LONG_SESSION_CLINICAL_DEDUPE_MAX;
  const poolTarget = resolveTimedExamPoolTarget(limit);

  if (longExam) {
    return dedupeBankItemsById(gathered).slice(0, Math.max(limit, poolTarget));
  }

  const exportSize = Math.min(gathered.length, poolTarget);
  return serveQaPassedBankItems(gathered, exportSize);
}
