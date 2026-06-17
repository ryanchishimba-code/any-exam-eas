import type { BankItem } from "@/lib/question-bank";
import {
  QUESTION_BANK_SAMPLE_MAX_PULL,
  sampleQuestionBankItemsForField,
} from "@/lib/question-bank-db";
import { serveQaPassedBankItems } from "@/lib/exam-prep/serve-qa-passed";

export type TimedExamFilterFn = (item: BankItem) => boolean;

function itemDedupeKey(item: BankItem): string {
  return item.id ?? `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`;
}

/** Pool size passed to finalize — modest headroom for dedupe/spread slice. */
function resolveTimedExamPoolTarget(limit: number): number {
  return Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(limit + 16, Math.ceil(limit * 1.35))
  );
}

/** First DB pull size from expected gate pass rate (~50% for gated clinical banks). */
function resolveTimedExamPullSize(limit: number, poolTarget: number): number {
  return Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(Math.ceil(poolTarget / 0.5), limit + 32, 48)
  );
}

/**
 * Pull and vet enough bank rows for a timed/full exam session.
 * Uses a small number of DB round-trips, memoized runtime gates, and curated-first sampling.
 */
export async function gatherTimedExamBankItems(params: {
  fieldId: string;
  limit: number;
  stateCode?: string;
  filterFn: TimedExamFilterFn;
  initialSampleCount: number;
}): Promise<BankItem[]> {
  const { fieldId, limit, stateCode, filterFn } = params;
  const seen = new Set<string>();
  const vetted: BankItem[] = [];
  const gateCache = new Map<string, boolean>();

  const passFilter = (item: BankItem): boolean => {
    const cacheKey = item.id ?? itemDedupeKey(item);
    const cached = gateCache.get(cacheKey);
    if (cached !== undefined) return cached;
    const ok = filterFn(item);
    gateCache.set(cacheKey, ok);
    return ok;
  };

  const poolTarget = resolveTimedExamPoolTarget(limit);
  let pullSize = Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(params.initialSampleCount, resolveTimedExamPullSize(limit, poolTarget))
  );
  const maxRounds = 3;

  for (let round = 0; round < maxRounds; round++) {
    if (vetted.length >= poolTarget) break;

    const batch = await sampleQuestionBankItemsForField({
      fieldId,
      count: pullSize,
      stateCode,
      skipEnsure: round > 0,
    });

    for (const item of batch) {
      const key = itemDedupeKey(item);
      if (seen.has(key)) continue;
      seen.add(key);
      if (passFilter(item)) vetted.push(item);
    }

    if (vetted.length >= limit) break;

    pullSize = Math.min(
      QUESTION_BANK_SAMPLE_MAX_PULL,
      Math.ceil(pullSize * 1.25)
    );
  }

  if (vetted.length <= limit) {
    return serveQaPassedBankItems(vetted, vetted.length);
  }

  return serveQaPassedBankItems(vetted, poolTarget);
}
