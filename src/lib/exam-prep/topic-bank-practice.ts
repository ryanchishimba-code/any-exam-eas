import {
  dedupeBankItemsById,
  QUESTION_BANK_SAMPLE_MAX_PULL,
  sampleQuestionBankItems,
  sampleQuestionBankItemsForField,
} from "@/lib/question-bank-db";
import type { BankItem } from "@/lib/question-bank";
import { isMpjeField } from "@/lib/mpje/config";
import { isPracticeFieldId } from "@/lib/subjects/field-ids";
import { filterBankItemsForSessionPool } from "@/lib/exam-prep/prepare-bank-session";
import { filterItemsForNclexBlueprintTopics } from "@/lib/exam-prep/nclex/topic-blueprint-match";

/** Single-subject question bank sessions (not mixed-field / not timed full exams). */
export function supportsTopicBankPractice(fieldId: string): boolean {
  return isPracticeFieldId(fieldId) || isMpjeField(fieldId);
}

/** DB pull size — large enough to survive runtime gates without template-stem collapse. */
export function resolveTopicBankSampleCount(limit: number): number {
  return Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, Math.max(limit * 6, 80));
}

const TOPIC_GATHER_MAX_ROUNDS = 2;

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
  /** NCLEX: granular blueprint slugs for topic-faithful practice. */
  blueprintTopics?: string[];
}): Promise<BankItem[]> {
  const poolTarget = resolveTopicBankSampleCount(params.sessionLimit);
  const minVetted = Math.min(poolTarget, params.sessionLimit + 40);
  const blueprintTopics = params.blueprintTopics?.filter(Boolean);

  const seen = new Set<string>();
  const merged: BankItem[] = [];

  const mergeVetted = (vetted: BankItem[]) => {
    for (const item of vetted) {
      const key = item.id ?? `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
  };

  if (blueprintTopics?.length) {
    for (let round = 0; round < TOPIC_GATHER_MAX_ROUNDS; round++) {
      const pull = await sampleQuestionBankItems({
        fieldId: params.fieldId,
        subjectId: params.subjectId,
        count: poolTarget,
        poolMultiplier: 2,
        taskCategory: params.taskCategory,
        stateCode: params.stateCode,
        blueprintTopics,
      });

      const vetted = filterBankItemsForSessionPool({
        fieldId: params.fieldId,
        items: pull,
      });

      mergeVetted(filterItemsForNclexBlueprintTopics(vetted, blueprintTopics, { contentMatch: true }));

      if (merged.length >= minVetted) break;
      if (merged.length >= params.sessionLimit) break;
    }

    if (merged.length >= params.sessionLimit) {
      return dedupeBankItemsById(merged).slice(0, poolTarget);
    }

    // Blueprint tags may be sparse — widen to subject pool; preset/post-filter narrows downstream.
    for (let round = 0; round < TOPIC_GATHER_MAX_ROUNDS; round++) {
      const pull = await sampleQuestionBankItems({
        fieldId: params.fieldId,
        subjectId: params.subjectId,
        count: poolTarget,
        poolMultiplier: 3,
        taskCategory: params.taskCategory,
        stateCode: params.stateCode,
      });

      const vetted = filterBankItemsForSessionPool({
        fieldId: params.fieldId,
        items: pull,
      });

      mergeVetted(vetted);

      if (merged.length >= minVetted) break;
      if (merged.length >= params.sessionLimit) break;
    }

    if (params.fieldId === "nursing") {
      const fieldPull = await sampleQuestionBankItemsForField({
        fieldId: params.fieldId,
        count: poolTarget,
      });
      const fieldVetted = filterBankItemsForSessionPool({
        fieldId: params.fieldId,
        items: fieldPull,
      });
      mergeVetted(fieldVetted);
    }

    return dedupeBankItemsById(merged).slice(0, poolTarget);
  }

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

    mergeVetted(vetted);

    if (merged.length >= minVetted) break;
    if (merged.length >= params.sessionLimit) break;
  }

  return dedupeBankItemsById(merged).slice(0, poolTarget);
}
