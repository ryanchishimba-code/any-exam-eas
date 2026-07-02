/**
 * Shared timed/full-exam assembly — mirrors /api/questions?mode=timed&scope=field.
 */
import type { BankItem } from "@/lib/question-bank";
import { prepareBoardBankItem } from "@/lib/exam-prep/board-serve-registry";
import { timedExamGatePairForField, timedExamGatherLadderForField } from "@/lib/exam-prep/exam-fill-gates";
import { timedExamPrepareItemForField } from "./exam-compose-config";
import { gatherProgressiveBankPool } from "@/lib/exam-prep/gather-progressive-bank-pool";
import { EXACT_FILL_COMPOSE_TIER } from "@/lib/exam-prep/progressive-compose";
import {
  fillExamItemsToCount,
  resolveComposePoolLimit,
  resolveProgressivePoolLimit,
} from "@/lib/exam-prep/progressive-exam-relaxation";
import { gatherTimedExamBankItems } from "@/lib/questions/timed-exam-sampling";
import {
  composeBlueprintTimedExamSession,
  fieldSupportsBlueprintTimedExam,
} from "./compose-timed-exam-session";
import { tryLoadTimedPresetSession } from "@/lib/exam-prep/try-timed-preset-exam";
import {
  gatherSprintTimedExamPool,
  isSprintTimedExamLimit,
} from "@/lib/exam-prep/gather-sprint-timed-pool";

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

/** Load bank items for a timed mock using the same path as the questions API. */
export async function assembleTimedExamSessionItems(
  params: AssembleTimedExamSessionParams
): Promise<AssembleTimedExamSessionResult | null> {
  const { fieldId, limit, focusAreas, sampleCount } = params;

  if (!focusAreas?.length && !isSprintTimedExamLimit(limit)) {
    const preset = await tryLoadTimedPresetSession({
      fieldId,
      limit,
      seed: (Date.now() ^ 0x51ed270b) >>> 0,
    });
    if (preset) {
      return {
        items: preset.items,
        source: "preset",
        presetExamNumber: preset.examNumber,
      };
    }
  }

  if (isSprintTimedExamLimit(limit) && !focusAreas?.length) {
    const sprintItems = await gatherSprintTimedExamPool({
      fieldId,
      limit,
      prepareItem: (item) => prepareTimedExamItem(fieldId, item),
    });
    if (sprintItems.length >= limit) {
      return { items: sprintItems.slice(0, limit), source: "gather" };
    }
  }

  if (!focusAreas?.length) {
    const poolLimit = resolveProgressivePoolLimit(limit);
    const ladder = timedExamGatherLadderForField(fieldId);
    const gathered = await gatherProgressiveBankPool({
      fieldId,
      limit: poolLimit,
      maxTierIndex: Math.min(2, ladder.length - 1),
      initialSampleCount: Math.min(sampleCount, poolLimit),
      prepareItem: (item) => prepareTimedExamItem(fieldId, item),
    });

    if (gathered.length >= limit) {
      const seed = (Date.now() ^ 0x51ed270b) >>> 0;
      const filled = fillExamItemsToCount(
        gathered.slice(0, limit),
        gathered,
        limit,
        EXACT_FILL_COMPOSE_TIER,
        seed
      );
      if (filled.length >= limit) {
        return { items: filled.slice(0, limit), source: "gather", tierId: EXACT_FILL_COMPOSE_TIER.id };
      }
    }
  }

  if (fieldSupportsBlueprintTimedExam(fieldId) && !isSprintTimedExamLimit(limit)) {
    const composed = await composeBlueprintTimedExamSession({
      fieldId,
      numQuestions: limit,
      focusAreas,
    });
    if (composed?.items.length && composed.items.length >= limit) {
      return { items: composed.items, source: "blueprint", tierId: composed.tierId };
    }

    const ladder = timedExamGatherLadderForField(fieldId);
    const poolLimit = resolveComposePoolLimit(limit);
    const gathered = await gatherProgressiveBankPool({
      fieldId,
      limit: poolLimit,
      maxTierIndex: ladder.length - 1,
      initialSampleCount: sampleCount,
      prepareItem: (item) => prepareTimedExamItem(fieldId, item),
    });

    if (gathered.length >= limit) {
      const seed = (Date.now() ^ 0x51ed270b) >>> 0;
      const filled = fillExamItemsToCount(
        gathered.slice(0, limit),
        gathered,
        limit,
        EXACT_FILL_COMPOSE_TIER,
        seed
      );
      if (filled.length >= limit) {
        return { items: filled.slice(0, limit), source: "gather", tierId: EXACT_FILL_COMPOSE_TIER.id };
      }
    }

    return null;
  }

  const gates = timedExamGatePairForField(fieldId);
  const items = (
    await gatherTimedExamBankItems({
      fieldId,
      limit,
      filterFn: gates.strict,
      relaxedFilterFn: gates.relaxed,
      initialSampleCount: sampleCount,
    })
  ).map((item) => prepareTimedExamItem(fieldId, item));

  if (!items.length) return null;

  if (items.length >= limit) {
    const seed = (Date.now() ^ 0x51ed270b) >>> 0;
    const filled = fillExamItemsToCount(
      items.slice(0, limit),
      items,
      limit,
      EXACT_FILL_COMPOSE_TIER,
      seed
    );
    if (filled.length >= limit) {
      return { items: filled.slice(0, limit), source: "gather" };
    }
  }

  return null;
}
