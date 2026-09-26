import { getExamBlueprint } from "@/lib/engine/blueprints";
import { ineligibleServedIds, warmCompleteCaseGroups } from "@/lib/exam-prep/student-eligibility";
import { filterBankItemsForServe } from "@/lib/exam-prep/prepare-bank-session";
import {
  readinessEligibilityWhere,
  readinessItemIsEligible,
  selectReadinessItems,
} from "@/lib/learning/readiness-check/eligibility";
import {
  allocateReadinessAreaCounts,
  backfillShortAreaCounts,
} from "@/lib/learning/readiness-check/scoring";
import { toPlayableQuestion } from "@/lib/learning/readiness-check/present";
import { READINESS_CHECK_LENGTH } from "@/lib/learning/readiness-check/thresholds";
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
 * `ineligibleServedIds` (`STUDENT_ELIGIBLE_SQL`).
 *
 * A blueprint area with a slot and an empty exclusive pool stays empty. Its
 * missing questions are taken from areas that still have eligible items, so a
 * board with enough clean questions overall still fills `length`. The second
 * pass and the backfill may repeat a recent clean item from `excludeIds`.
 * They never repeat `hardExcludeIds` and they do not relax the rule.
 */
export async function assembleReadinessItems(params: {
  fieldId: string;
  /** Soft avoid list (the previous check). Dropped when an area is short. */
  excludeIds?: string[];
  /** Always excluded, including backfill. Use for items already on this check. */
  hardExcludeIds?: string[];
  length?: number;
}): Promise<AssembledReadinessItem[]> {
  const length = Math.max(0, params.length ?? READINESS_CHECK_LENGTH);
  const blueprint = getExamBlueprint(params.fieldId);
  if (!blueprint || length <= 0) return [];

  const [, blocked] = await Promise.all([
    warmCompleteCaseGroups(),
    ineligibleServedIds(params.fieldId),
  ]);
  const hard = [...new Set([...(params.hardExcludeIds ?? []), ...blocked])];
  const firstPassExclude = [...new Set([...(params.excludeIds ?? []), ...hard])];
  const used = new Set<string>(hard);
  const picked: AssembledReadinessItem[] = [];
  const slots = allocateReadinessAreaCounts(blueprint, length);
  const byArea = new Map(slots.map((area) => [area.id, area]));
  const filled = new Map<string, number>();

  for (const area of slots) {
    if (area.count <= 0) {
      filled.set(area.id, 0);
      continue;
    }
    const fresh = await fillArea({
      fieldId: params.fieldId,
      areaId: area.id,
      areaLabel: area.label,
      need: area.count,
      used,
      excludeIds: firstPassExclude,
    });
    picked.push(...fresh);
    let got = fresh.length;
    const short = area.count - got;
    if (short > 0) {
      const relaxed = await fillArea({
        fieldId: params.fieldId,
        areaId: area.id,
        areaLabel: area.label,
        need: short,
        used,
        excludeIds: hard,
      });
      picked.push(...relaxed);
      got += relaxed.length;
    }
    filled.set(area.id, got);
  }

  const exhausted = new Set<string>();
  for (const area of slots) {
    const got = filled.get(area.id) ?? 0;
    if (area.count > 0 && got === 0) exhausted.add(area.id);
  }

  let guard = 0;
  while (picked.length < length && guard < length) {
    guard += 1;
    const extras = backfillShortAreaCounts({
      slots,
      filled: slots.map((area) => ({ id: area.id, count: filled.get(area.id) ?? 0 })),
      spare: slots.map((area) => ({
        id: area.id,
        count: exhausted.has(area.id) ? 0 : length,
      })),
      length,
    });
    if (!extras.length) break;
    let added = 0;
    for (const extra of extras) {
      const area = byArea.get(extra.id);
      if (!area || extra.extra <= 0) continue;
      const more = await fillArea({
        fieldId: params.fieldId,
        areaId: area.id,
        areaLabel: area.label,
        need: extra.extra,
        used,
        excludeIds: hard,
      });
      picked.push(...more);
      filled.set(area.id, (filled.get(area.id) ?? 0) + more.length);
      added += more.length;
      if (more.length < extra.extra) exhausted.add(area.id);
    }
    if (added === 0) break;
  }

  return shuffle(picked);
}
