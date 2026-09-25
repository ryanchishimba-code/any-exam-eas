import { getExamBlueprint } from "@/lib/engine/blueprints";
import { ineligibleServedIds } from "@/lib/exam-prep/student-eligibility";
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
    count: Math.max(params.need * 12, params.need + 40),
    excludeIds: [...params.excludeIds, ...params.used],
    extraWhere: readinessEligibilityWhere(),
  });
  const eligibleById = new Map<string, BankItem>();
  for (const item of pool) {
    if (!item.id || params.used.has(item.id)) continue;
    const candidate = {
      ...item,
      fieldId: params.fieldId,
      qaPassed: item.qaPassed ?? true,
      active: item.active ?? true,
    };
    if (!readinessItemIsEligible(candidate)) continue;
    eligibleById.set(item.id, candidate);
  }
  const playableIds = new Set<string>();
  for (const item of filterBankItemsForServe(params.fieldId, [...eligibleById.values()])) {
    if (!item.id || !eligibleById.has(item.id)) continue;
    if (!toPlayableQuestion(params.fieldId, item)) continue;
    playableIds.add(item.id);
  }
  const picked: AssembledReadinessItem[] = [];
  for (const item of selectReadinessItems(
    [...eligibleById.values()].filter((row) => row.id && playableIds.has(row.id)),
    params.need
  )) {
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
 * Eligibility is `readinessItemIsEligible` only: standard single-answer MCQs that
 * pass the QA gate and `assessStudentEligibility`. The sample also drops ids from
 * `ineligibleServedIds` (`STUDENT_ELIGIBLE_SQL`). A short area stays short. The
 * second pass may repeat a recent clean item. It does not relax the rule.
 */
export async function assembleReadinessItems(params: {
  fieldId: string;
  excludeIds?: string[];
}): Promise<AssembledReadinessItem[]> {
  const blueprint = getExamBlueprint(params.fieldId);
  if (!blueprint) return [];

  const blocked = await ineligibleServedIds(params.fieldId);
  const excludeIds = [...(params.excludeIds ?? []), ...blocked];
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
        // Repeat a recent clean item if the area is short. Do not bring back
        // a row STUDENT_ELIGIBLE_SQL already suppressed.
        excludeIds: blocked,
      });
      picked.push(...relaxed);
    }
  }

  return shuffle(picked);
}
