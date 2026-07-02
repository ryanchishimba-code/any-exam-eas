/**
 * Multi-tier bank gather — escalates quality gates until the pool can fill an exam.
 */
import type { BankItem } from "@/lib/question-bank";
import {
  dedupeBankItemsById,
  QUESTION_BANK_SAMPLE_MAX_PULL,
  sampleQuestionBankItemsForField,
} from "@/lib/question-bank-db";
import { timedExamGatherLadderForField } from "@/lib/exam-prep/exam-fill-gates";
import type { TimedExamFilterFn } from "@/lib/questions/timed-exam-sampling";
import {
  resolveProgressivePoolLimit,
  resolveProgressivePullSize,
} from "@/lib/exam-prep/progressive-exam-relaxation";

function itemDedupeKey(item: BankItem): string {
  return item.id ?? `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`;
}

function appendTierMatches(
  selected: BankItem[],
  selectedIds: Set<string>,
  candidates: BankItem[],
  filterFn: TimedExamFilterFn,
  target: number,
  excludeIds?: Set<string>
): void {
  for (const item of candidates) {
    if (dedupeBankItemsById(selected).length >= target) break;
    const key = itemDedupeKey(item);
    if (selectedIds.has(key)) continue;
    if (excludeIds?.size && item.id && excludeIds.has(item.id)) continue;
    if (!filterFn(item)) continue;
    selectedIds.add(key);
    selected.push(item);
  }
}

export type GatherProgressiveBankPoolParams = {
  fieldId: string;
  /** Minimum unique items required in the export pool. */
  limit: number;
  /** Highest gather-gate tier index to use (inclusive). */
  maxTierIndex: number;
  initialSampleCount?: number;
  /** DB sampling rounds per gate tier (default 2; live exams use 1). */
  maxRoundsPerTier?: number;
  stateCode?: string;
  excludeQuestionIds?: Set<string>;
  prepareItem?: (item: BankItem) => BankItem;
};

/**
 * Pull bank rows with progressive gate relaxation until `limit` unique items
 * are available (or the bank is exhausted at the allowed tier ceiling).
 */
export async function gatherProgressiveBankPool(
  params: GatherProgressiveBankPoolParams
): Promise<BankItem[]> {
  const { fieldId, limit, stateCode, excludeQuestionIds, prepareItem } = params;
  const maxRoundsPerTier = Math.max(1, params.maxRoundsPerTier ?? 2);
  const ladder = timedExamGatherLadderForField(fieldId);
  const maxTierIndex = Math.min(
    Math.max(0, params.maxTierIndex),
    ladder.length - 1
  );

  const poolTarget = resolveProgressivePoolLimit(limit);
  const exportTarget = Math.max(limit, poolTarget);
  const tiers = ladder.slice(0, maxTierIndex + 1);

  const seen = new Set<string>();
  const candidates: BankItem[] = [];
  const selected: BankItem[] = [];
  const selectedIds = new Set<string>();
  const gateCache = new Map<string, boolean>();

  const passFilter = (item: BankItem, tierId: string, filterFn: TimedExamFilterFn): boolean => {
    const cacheKey = `${tierId}:${item.id ?? itemDedupeKey(item)}`;
    const cached = gateCache.get(cacheKey);
    if (cached !== undefined) return cached;
    const prepared = prepareItem ? prepareItem(item) : item;
    const ok = filterFn(prepared);
    gateCache.set(cacheKey, ok);
    return ok;
  };

  const countSelected = () => dedupeBankItemsById(selected).length;

  let pullSize = Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(params.initialSampleCount ?? 0, resolveProgressivePullSize(limit, poolTarget))
  );

  for (const tier of tiers) {
    appendTierMatches(
      selected,
      selectedIds,
      candidates,
      (item) => passFilter(item, tier.id, tier.filter),
      exportTarget,
      excludeQuestionIds
    );
    if (countSelected() >= limit) break;

    for (let round = 0; round < maxRoundsPerTier && countSelected() < limit; round++) {
      const batch = await sampleQuestionBankItemsForField({
        fieldId,
        count: pullSize,
        stateCode,
        skipEnsure: round > 0 || candidates.length > 0,
      });

      for (const item of batch) {
        const key = itemDedupeKey(item);
        if (seen.has(key)) continue;
        seen.add(key);
        candidates.push(item);
      }

      appendTierMatches(
        selected,
        selectedIds,
        candidates,
        (item) => passFilter(item, tier.id, tier.filter),
        exportTarget,
        excludeQuestionIds
      );

      if (countSelected() >= limit) break;
      pullSize = Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, Math.ceil(pullSize * 1.25));
    }
  }

  const deduped = dedupeBankItemsById(selected);
  const preparedOut = prepareItem ? deduped.map(prepareItem) : deduped;
  return preparedOut.slice(0, Math.min(exportTarget, preparedOut.length));
}
