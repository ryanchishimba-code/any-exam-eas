import type { BankItem } from "@/lib/question-bank";
import {
  QUESTION_BANK_SAMPLE_MAX_PULL,
  sampleQuestionBankItemsForField,
} from "@/lib/question-bank-db";
import { assessDifficultyMix, resolveDifficultyBand } from "@/lib/questions/session-quality";
import { serveQaPassedBankItems } from "@/lib/exam-prep/serve-qa-passed";

export type TimedExamFilterFn = (item: BankItem) => boolean;

function itemDedupeKey(item: BankItem): string {
  return item.id ?? `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`;
}

function sessionNeedsDifficultyVariety(limit: number): boolean {
  return limit >= 6;
}

function poolHasDifficultyVariety(items: BankItem[]): boolean {
  if (items.length < 3) return true;
  return assessDifficultyMix(items, resolveDifficultyBand).isVaried;
}

function resolveTimedExamPoolTarget(limit: number, initialSampleCount: number): number {
  return Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(initialSampleCount, limit + 60, limit * 2)
  );
}

/**
 * Pull and vet enough bank rows for a timed/full exam session.
 * Runtime gates (NCLEX best-tier, USMLE clinical, etc.) often reject most of a single sample.
 */
export async function gatherTimedExamBankItems(params: {
  fieldId: string;
  limit: number;
  stateCode?: string;
  filterFn: TimedExamFilterFn;
  initialSampleCount: number;
}): Promise<BankItem[]> {
  const { fieldId, limit, stateCode, filterFn, initialSampleCount } = params;
  const seen = new Set<string>();
  const vetted: BankItem[] = [];
  let pullSize = Math.max(initialSampleCount, limit + 40);
  const maxRounds = 8;
  const poolTarget = resolveTimedExamPoolTarget(limit, initialSampleCount);
  const needsVariety = sessionNeedsDifficultyVariety(limit);

  for (let round = 0; round < maxRounds; round++) {
    const needMoreItems = vetted.length < limit;
    const needDifficultyHeadroom =
      needsVariety && vetted.length < poolTarget && !poolHasDifficultyVariety(vetted);
    if (!needMoreItems && !needDifficultyHeadroom) break;

    const batch = await sampleQuestionBankItemsForField({
      fieldId,
      count: Math.min(pullSize, QUESTION_BANK_SAMPLE_MAX_PULL),
      stateCode,
    });

    for (const item of batch) {
      const key = itemDedupeKey(item);
      if (seen.has(key)) continue;
      seen.add(key);
      if (filterFn(item)) vetted.push(item);
    }

    if (vetted.length >= limit && (!needsVariety || poolHasDifficultyVariety(vetted))) {
      if (vetted.length >= Math.min(poolTarget, limit + 30)) break;
    }

    pullSize = Math.min(
      QUESTION_BANK_SAMPLE_MAX_PULL,
      pullSize + Math.max(limit, Math.ceil(limit * 0.75))
    );
  }

  if (vetted.length <= limit) {
    return serveQaPassedBankItems(vetted, vetted.length);
  }

  // Keep a spread-balanced superset so finalize can pick a difficulty-mixed slice.
  return serveQaPassedBankItems(vetted, Math.min(vetted.length, poolTarget));
}
