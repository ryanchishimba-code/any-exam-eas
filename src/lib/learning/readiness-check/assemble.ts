import { getExamBlueprint } from "@/lib/engine/blueprints";
import { filterBankItemsForServe } from "@/lib/exam-prep/prepare-bank-session";
import { allocateReadinessAreaCounts } from "@/lib/learning/readiness-check/scoring";
import { toPlayableQuestion } from "@/lib/learning/readiness-check/present";
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
  });
  const picked: AssembledReadinessItem[] = [];
  for (const item of filterBankItemsForServe(params.fieldId, pool)) {
    if (picked.length >= params.need) break;
    if (!item.id || params.used.has(item.id)) continue;
    if (!toPlayableQuestion(params.fieldId, item)) continue;
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
 * Prefers items that were not on the latest completed check. Falls back per area
 * when that would leave the area short.
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
