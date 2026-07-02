import {
  dedupeBankItemsById,
  QUESTION_BANK_SAMPLE_MAX_PULL,
  sampleQuestionBankItems,
} from "@/lib/question-bank-db";
import type { BankItem } from "@/lib/question-bank";
import { isMpjeField } from "@/lib/mpje/config";
import { isPracticeFieldId } from "@/lib/subjects/field-ids";
import { filterBankItemsForSessionPool } from "@/lib/exam-prep/prepare-bank-session";

/** Single-subject question bank sessions (not mixed-field / not timed full exams). */
export function supportsTopicBankPractice(fieldId: string): boolean {
  return isPracticeFieldId(fieldId) || isMpjeField(fieldId);
}

/** DB pull size — large enough to survive runtime gates without template-stem collapse. */
export function resolveTopicBankSampleCount(limit: number): number {
  return Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, Math.max(limit * 6, 80));
}

const TOPIC_GATHER_MAX_ROUNDS = 4;

/**
 * Pull and vet enough single-topic rows for an exact-count session.
 * Re-samples when serve gates thin the first pull.
 */
export async function gatherTopicBankSessionPool(params: {
  fieldId: string;
  subjectId: string;
  sessionLimit: number;
  taskCategory?: string | null;
  stateCode?: string;
}): Promise<BankItem[]> {
  const poolTarget = resolveTopicBankSampleCount(params.sessionLimit);
  const minVetted = Math.min(poolTarget, params.sessionLimit + 40);

  const seen = new Set<string>();
  const merged: BankItem[] = [];

  for (let round = 0; round < TOPIC_GATHER_MAX_ROUNDS; round++) {
    const pull = await sampleQuestionBankItems({
      fieldId: params.fieldId,
      subjectId: params.subjectId,
      count: poolTarget,
      poolMultiplier: 2,
      taskCategory: params.taskCategory,
      stateCode: params.stateCode,
    });

    const vetted = filterBankItemsForSessionPool({
      fieldId: params.fieldId,
      items: pull,
    });

    for (const item of vetted) {
      const key = item.id ?? `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }

    if (merged.length >= minVetted) break;
    if (merged.length >= params.sessionLimit) break;
  }

  return dedupeBankItemsById(merged).slice(0, poolTarget);
}
