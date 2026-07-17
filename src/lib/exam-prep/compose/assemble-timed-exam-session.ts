/**
 * Shared timed/full-exam assembly — mirrors /api/questions?mode=timed&scope=field.
 *
 * Live path order (latency budget ~20s):
 * 1. Fast gather (1–2 pulls, any length) — skipped when focusAreas set
 * 2. Pre-composed preset exams (single DB read) — skipped when focusAreas set
 * 3. Light progressive gather (≤2 tiers, 1 round each) — skipped when focusAreas set
 * 4. Blueprint compose (supports focusAreas + excludeQuestionIds)
 * 5. Legacy gate pair
 */
import type { BankItem } from "@/lib/question-bank";
import { prepareBoardBankItem } from "@/lib/exam-prep/board-serve-registry";
import { timedExamGatePairForField, timedExamGatherLadderForField } from "@/lib/exam-prep/exam-fill-gates";
import { timedExamPrepareItemForField } from "./exam-compose-config";
import { gatherProgressiveBankPool } from "@/lib/exam-prep/gather-progressive-bank-pool";
import { EXACT_FILL_COMPOSE_TIER } from "@/lib/exam-prep/progressive-compose";
import {
  fillExamItemsToCount,
  resolveProgressivePoolLimit,
  resolveProgressivePullSize,
} from "@/lib/exam-prep/progressive-exam-relaxation";
import { gatherTimedExamBankItems } from "@/lib/questions/timed-exam-sampling";
import {
  composeBlueprintTimedExamSession,
  fieldSupportsBlueprintTimedExam,
} from "./compose-timed-exam-session";
import { tryLoadTimedPresetSession } from "@/lib/exam-prep/try-timed-preset-exam";
import { gatherSprintTimedExamPool } from "@/lib/exam-prep/gather-sprint-timed-pool";
import { isUsmleFieldId } from "@/lib/exam-prep/usmle/steps";
import { filterBankItemsForPracticeField } from "@/lib/edtech/exam-item-scope";
import { preferUnseenBankItems, preferPremiumBankItems } from "@/lib/full-exam/smart-exam-selection";
import { selectWithNgnFormatMix } from "@/lib/full-exam/ngn-format-mix";

/** USMLE presets are step-scoped; skip the heavy preset join when it cannot match. */
function skipTimedPresetForField(fieldId: string): boolean {
  return isUsmleFieldId(fieldId);
}

export type AssembleTimedExamSessionParams = {
  fieldId: string;
  field: string;
  limit: number;
  focusAreas?: string[];
  sampleCount: number;
  /** Prefer excluding these ids (top-up allowed if pool is thin). */
  excludeQuestionIds?: Set<string>;
  /** Bias toward expert rationales + NGN (Focus / weak-area launches). */
  preferPremiumPool?: boolean;
};

export type AssembleTimedExamSessionResult = {
  items: BankItem[];
  source: "preset" | "blueprint" | "gather";
  tierId?: string;
  presetExamNumber?: number;
  excludeSeenApplied?: boolean;
};

function prepareTimedExamItem(fieldId: string, item: BankItem): BankItem {
  return timedExamPrepareItemForField(fieldId)?.(item) ?? prepareBoardBankItem(fieldId, item);
}

function fillGatheredItems(
  gathered: BankItem[],
  limit: number,
  tierId: string,
  fieldId: string,
  excludeQuestionIds?: Set<string>
): AssembleTimedExamSessionResult | null {
  if (gathered.length < limit) return null;
  const seed = (Date.now() ^ 0x51ed270b) >>> 0;
  const preferred = preferUnseenBankItems(gathered, excludeQuestionIds, gathered.length);
  const filled = fillExamItemsToCount(
    preferred.items.slice(0, limit),
    preferred.items,
    limit,
    EXACT_FILL_COMPOSE_TIER,
    seed
  );
  if (filled.length < limit) return null;
  const ranked = preferUnseenBankItems(filled, excludeQuestionIds, filled.length);
  const mixed = selectWithNgnFormatMix(ranked.items, limit, fieldId, seed);
  return {
    items: mixed.slice(0, limit),
    source: "gather",
    tierId,
    excludeSeenApplied: ranked.excludeSeenApplied,
  };
}

function scopeAssemblyResult(
  fieldId: string,
  limit: number,
  result: AssembleTimedExamSessionResult | null,
  excludeQuestionIds?: Set<string>,
  preferPremiumPool = false
): AssembleTimedExamSessionResult | null {
  if (!result) return null;
  let items = filterBankItemsForPracticeField(result.items, fieldId);
  if (preferPremiumPool) {
    items = preferPremiumBankItems(items);
  }
  const preferred = preferUnseenBankItems(items, excludeQuestionIds, items.length);
  items = selectWithNgnFormatMix(preferred.items, limit, fieldId);
  if (items.length < limit) return null;
  return {
    ...result,
    items: items.slice(0, limit),
    excludeSeenApplied: preferred.excludeSeenApplied || result.excludeSeenApplied,
  };
}

/** Load bank items for a timed mock using the same path as the questions API. */
export async function assembleTimedExamSessionItems(
  params: AssembleTimedExamSessionParams
): Promise<AssembleTimedExamSessionResult | null> {
  const {
    fieldId,
    limit,
    focusAreas,
    sampleCount,
    excludeQuestionIds,
    preferPremiumPool = Boolean(focusAreas?.length),
  } = params;
  const prepare = (item: BankItem) => prepareTimedExamItem(fieldId, item);
  const seed = (Date.now() ^ 0x51ed270b) >>> 0;
  const hasFocus = Boolean(focusAreas?.length);
  const scope = (
    result: AssembleTimedExamSessionResult | null
  ): AssembleTimedExamSessionResult | null =>
    scopeAssemblyResult(fieldId, limit, result, excludeQuestionIds, preferPremiumPool);

  if (!hasFocus) {
    // NCLEX: oversample so blueprint NGN quotas can fill from the fast pool.
    const sprintTarget =
      fieldId === "nursing"
        ? Math.max(Math.ceil(limit * 2.2), limit + 48)
        : Math.max(limit, excludeQuestionIds?.size ? limit + 40 : limit);
    const fastItems = await gatherSprintTimedExamPool({
      fieldId,
      limit: sprintTarget,
      prepareItem: prepare,
    });
    if (fastItems.length >= limit) {
      return scope({
        items: fastItems.slice(0, Math.max(limit, fastItems.length)),
        source: "gather",
      });
    }
  }

  if (!hasFocus && !skipTimedPresetForField(fieldId)) {
    const preset = await tryLoadTimedPresetSession({ fieldId, limit, seed });
    if (preset) {
      return scope({
        items: preset.items,
        source: "preset",
        presetExamNumber: preset.examNumber,
      });
    }
  }

  if (!hasFocus) {
    const poolLimit = resolveProgressivePoolLimit(limit);
    const ladder = timedExamGatherLadderForField(fieldId);
    const gathered = await gatherProgressiveBankPool({
      fieldId,
      limit: poolLimit,
      maxTierIndex: Math.min(2, ladder.length - 1),
      maxRoundsPerTier: 1,
      initialSampleCount: Math.min(
        sampleCount,
        resolveProgressivePullSize(limit, poolLimit)
      ),
      prepareItem: prepare,
    });

    const filled = fillGatheredItems(
      gathered,
      limit,
      EXACT_FILL_COMPOSE_TIER.id,
      fieldId,
      excludeQuestionIds
    );
    if (filled) return scope(filled);
  }

  // Focused or blueprint-balanced compose — also used for weak-area launches.
  if (fieldSupportsBlueprintTimedExam(fieldId) && (hasFocus || limit <= 100)) {
    const composed = await composeBlueprintTimedExamSession({
      fieldId,
      numQuestions: limit,
      focusAreas,
      excludeQuestionIds,
      liveFast: true,
    });
    if (composed?.items.length && composed.items.length >= limit) {
      return scope({
        items: composed.items,
        source: "blueprint",
        tierId: composed.tierId,
      });
    }
  }

  // Focus + longer exams: still try blueprint even above 100.
  if (hasFocus && fieldSupportsBlueprintTimedExam(fieldId) && limit > 100) {
    const composed = await composeBlueprintTimedExamSession({
      fieldId,
      numQuestions: limit,
      focusAreas,
      excludeQuestionIds,
      liveFast: true,
    });
    if (composed?.items.length && composed.items.length >= limit) {
      return scope({
        items: composed.items,
        source: "blueprint",
        tierId: composed.tierId,
      });
    }
  }

  const gates = timedExamGatePairForField(fieldId);
  const items = (
    await gatherTimedExamBankItems({
      fieldId,
      limit: Math.max(limit, excludeQuestionIds?.size ? limit + 48 : limit),
      filterFn: gates.strict,
      relaxedFilterFn: gates.relaxed,
      initialSampleCount: Math.min(sampleCount, resolveProgressivePullSize(limit, limit + 32)),
      maxRoundsPerTier: 1,
    })
  ).map(prepare);

  if (!items.length) return null;

  const filled = fillGatheredItems(
    items,
    limit,
    EXACT_FILL_COMPOSE_TIER.id,
    fieldId,
    excludeQuestionIds
  );
  return scope(filled);
}
