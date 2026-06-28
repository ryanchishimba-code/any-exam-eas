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
  const base = Math.max(limit + 16, Math.ceil(limit * 1.35));
  const dedupeHeadroom = limit >= 100 ? Math.ceil(limit * 0.08) : 0;
  return Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    base + dedupeHeadroom
  );
}

/** First DB pull size from expected gate pass rate (~92% for qaPassed clinical banks). */
function resolveTimedExamPullSize(limit: number, poolTarget: number): number {
  return Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(Math.ceil(poolTarget / 0.92), limit + 16, 32)
  );
}

function appendUniqueVetted(
  vetted: BankItem[],
  candidates: BankItem[],
  filterFn: TimedExamFilterFn,
  included: Set<string>,
  poolTarget: number
): void {
  for (const item of candidates) {
    if (vetted.length >= poolTarget) break;
    const key = itemDedupeKey(item);
    if (included.has(key)) continue;
    if (!filterFn(item)) continue;
    included.add(key);
    vetted.push(item);
  }
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
  const { fieldId, limit, stateCode, filterFn, relaxedFilterFn } = params;
  const seen = new Set<string>();
  const candidates: BankItem[] = [];
  const included = new Set<string>();
  const vetted: BankItem[] = [];
  const gateCache = new Map<string, boolean>();

  const passFilter = (item: BankItem, fn: TimedExamFilterFn, label: "strict" | "relaxed"): boolean => {
    const cacheKey = `${label}:${item.id ?? itemDedupeKey(item)}`;
    const cached = gateCache.get(cacheKey);
    if (cached !== undefined) return cached;
    const ok = fn(item);
    gateCache.set(cacheKey, ok);
    return ok;
  };

  const poolTarget = resolveTimedExamPoolTarget(limit);
  let pullSize = Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(params.initialSampleCount, resolveTimedExamPullSize(limit, poolTarget))
  );
  const maxRounds = relaxedFilterFn ? 3 : 2;

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
      candidates.push(item);
    }

    appendUniqueVetted(
      vetted,
      candidates,
      (item) => passFilter(item, filterFn, "strict"),
      included,
      poolTarget
    );

    if (vetted.length >= poolTarget) break;

    pullSize = Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, Math.ceil(pullSize * 1.25));
  }

  if (vetted.length < limit && relaxedFilterFn) {
    appendUniqueVetted(
      vetted,
      candidates,
      (item) => passFilter(item, relaxedFilterFn, "relaxed"),
      included,
      poolTarget
    );

    if (vetted.length < limit) {
      let relaxedPull = Math.min(
        QUESTION_BANK_SAMPLE_MAX_PULL,
        Math.max(pullSize, resolveTimedExamPullSize(limit, poolTarget))
      );

      for (let round = 0; round < 2 && vetted.length < limit; round++) {
        const batch = await sampleQuestionBankItemsForField({
          fieldId,
          count: relaxedPull,
          stateCode,
          skipEnsure: true,
        });

        for (const item of batch) {
          const key = itemDedupeKey(item);
          if (seen.has(key)) continue;
          seen.add(key);
          candidates.push(item);
        }

        appendUniqueVetted(
          vetted,
          candidates,
          (item) => passFilter(item, relaxedFilterFn, "relaxed"),
          included,
          poolTarget
        );

        relaxedPull = Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, Math.ceil(relaxedPull * 1.25));
      }
    }
  }

  const exportSize = Math.min(vetted.length, poolTarget);
  return serveQaPassedBankItems(vetted, exportSize);
}
