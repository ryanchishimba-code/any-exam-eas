import { getExamBlueprint } from "@/lib/engine/blueprints";
import { filterBankItemsForServe } from "@/lib/exam-prep/prepare-bank-session";
import {
  readinessEligibilityWhere,
  readinessItemIsEligible,
  selectReadinessItems,
} from "@/lib/learning/readiness-check/eligibility";
import { allocateReadinessAreaCounts } from "@/lib/learning/readiness-check/scoring";
import { toPlayableQuestion } from "@/lib/learning/readiness-check/present";
import type { BankItem } from "@/lib/question-bank";
import { sampleQuestionBankItemsForBlueprintArea } from "@/lib/question-bank-db";

export type AssembledReadinessItem = {
  questionBankItemId: string;
  areaId: string;
  areaLabel: string;
};

function shuffle<T>(rows: T[]): T[] {
  const copy = [...rows];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = current;
  }
  return copy;
}

async function fillArea(params: {
  fieldId: string;
  areaId: string;
  areaLabel: string;
  need: number;
  used: Set<string>;
  excludeIds: string[];
}): Promise<AssembledReadinessItem[]> {
  if (params.need <= 0) return [];
  const pool = await sampleQuestionBankItemsForBlueprintArea({
    fieldId: params.fieldId,
    blueprintAreaId: params.areaId,
    count: Math.max(params.need * 4, params.need + 8),
    excludeIds: [...params.excludeIds, ...params.used],
    extraWhere: readinessEligibilityWhere(),
  });
  const eligibleById = new Map<string, BankItem>();
  for (const item of pool) {
    if (!item.id || params.used.has(item.id)) continue;
    if (!readinessItemIsEligible(item)) continue;
    eligibleById.set(item.id, item);
  }
  const playable: BankItem[] = [];
  for (const item of filterBankItemsForServe(params.fieldId, [...eligibleById.values()])) {
    if (!item.id || !eligibleById.has(item.id)) continue;
    const source = eligibleById.get(item.id)!;
    if (!toPlayableQuestion(params.fieldId, item)) continue;
    playable.push({
      ...item,
      qualityScore: source.qualityScore,
      keepRecommendation: source.keepRecommendation,
    });
  }
  const picked: AssembledReadinessItem[] = [];
  for (const item of selectReadinessItems(playable, params.need)) {
    if (!item.id) continue;
    params.used.add(item.id);
    picked.push({
      questionBankItemId: item.id,
      areaId: params.areaId,
      areaLabel: params.areaLabel,
    });
  }
  return picked;
}

/**
 * Draw a fixed check from published bank items, spread across the board's blueprint.
 * Only items with no open quality flag are eligible. A short area stays short.
 * The second pass may repeat a recent item. It does not relax the quality rule.
 */
export async function assembleReadinessItems(params: {
  fieldId: string;
  excludeIds?: string[];
}): Promise<AssembledReadinessItem[]> {
  const blueprint = getExamBlueprint(params.fieldId);
  if (!blueprint) return [];

  const excludeIds = params.excludeIds ?? [];
  const used = new Set<string>();
  const picked: AssembledReadinessItem[] = [];

  for (const area of allocateReadinessAreaCounts(blueprint)) {
    if (area.count <= 0) continue;
    const fresh = await fillArea({
      fieldId: params.fieldId,
      areaId: area.id,
      areaLabel: area.label,
      need: area.count,
      used,
      excludeIds,
    });
    picked.push(...fresh);
    const short = area.count - fresh.length;
    if (short > 0) {
      const relaxed = await fillArea({
        fieldId: params.fieldId,
        areaId: area.id,
        areaLabel: area.label,
        need: short,
        used,
        excludeIds: [],
      });
      picked.push(...relaxed);
    }
  }

  return shuffle(picked);
}
