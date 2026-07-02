/**
 * Shared timed/full-exam assembly — mirrors /api/questions?mode=timed&scope=field.
 *
 * Live path order (latency budget ~20s):
 * 1. Pre-composed preset exams (single DB read)
 * 2. Fast gather (1–2 pulls, any length)
 * 3. Light progressive gather (≤2 tiers, 1 round each)
 * 4. Blueprint compose last resort (exact-fill tier, capped pool)
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

export type AssembleTimedExamSessionParams = {
  fieldId: string;
  field: string;
  limit: number;
  focusAreas?: string[];
  sampleCount: number;
};

export type AssembleTimedExamSessionResult = {
  items: BankItem[];
  source: "preset" | "blueprint" | "gather";
  tierId?: string;
  presetExamNumber?: number;
};

function prepareTimedExamItem(fieldId: string, item: BankItem): BankItem {
  return timedExamPrepareItemForField(fieldId)?.(item) ?? prepareBoardBankItem(fieldId, item);
}

function fillGatheredItems(
  gathered: BankItem[],
  limit: number,
  tierId: string
): AssembleTimedExamSessionResult | null {
  if (gathered.length < limit) return null;
  const seed = (Date.now() ^ 0x51ed270b) >>> 0;
  const filled = fillExamItemsToCount(
    gathered.slice(0, limit),
    gathered,
    limit,
    EXACT_FILL_COMPOSE_TIER,
    seed
  );
  if (filled.length < limit) return null;
  return { items: filled.slice(0, limit), source: "gather", tierId };
}

/** Load bank items for a timed mock using the same path as the questions API. */
export async function assembleTimedExamSessionItems(
  params: AssembleTimedExamSessionParams
): Promise<AssembleTimedExamSessionResult | null> {
  const { fieldId, limit, focusAreas, sampleCount } = params;
  const prepare = (item: BankItem) => prepareTimedExamItem(fieldId, item);
  const seed = (Date.now() ^ 0x51ed270b) >>> 0;

  if (!focusAreas?.length) {
    const preset = await tryLoadTimedPresetSession({ fieldId, limit, seed });
    if (preset) {
      return {
        items: preset.items,
        source: "preset",
        presetExamNumber: preset.examNumber,
      };
    }
  }

  if (!focusAreas?.length) {
    const fastItems = await gatherSprintTimedExamPool({
      fieldId,
      limit,
      prepareItem: prepare,
    });
    if (fastItems.length >= limit) {
      return { items: fastItems.slice(0, limit), source: "gather" };
    }
  }

  if (!focusAreas?.length) {
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

    const filled = fillGatheredItems(gathered, limit, EXACT_FILL_COMPOSE_TIER.id);
    if (filled) return filled;
  }

  if (fieldSupportsBlueprintTimedExam(fieldId) && !focusAreas?.length) {
    const composed = await composeBlueprintTimedExamSession({
      fieldId,
      numQuestions: limit,
      focusAreas,
      liveFast: true,
    });
    if (composed?.items.length && composed.items.length >= limit) {
      return { items: composed.items, source: "blueprint", tierId: composed.tierId };
    }
  }

  const gates = timedExamGatePairForField(fieldId);
  const items = (
    await gatherTimedExamBankItems({
      fieldId,
      limit,
      filterFn: gates.strict,
      relaxedFilterFn: gates.relaxed,
      initialSampleCount: Math.min(sampleCount, resolveProgressivePullSize(limit, limit + 32)),
    })
  ).map(prepare);

  if (!items.length) return null;

  const filled = fillGatheredItems(items, limit, EXACT_FILL_COMPOSE_TIER.id);
  return filled;
}
