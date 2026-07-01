import { getExamBlueprint } from "@/lib/engine/blueprints";
import type { QualityScoreResult } from "./types";

function nclexBlueprint() {
  return getExamBlueprint("nursing")!;
}

export type ScoredItem = {
  id: string;
  subjectId: string;
  blueprintTopic: string | null;
  clusterId: string;
  quality: QualityScoreResult;
};

/** Map bank subjectId → NCLEX Client Needs category id. */
export const SUBJECT_TO_CLIENT_NEEDS: Record<string, string> = {
  "management-of-care": "management-of-care",
  "safety-infection": "safety-infection",
  "health-promotion": "health-promotion",
  psychosocial: "psychosocial",
  "basic-care-comfort": "basic-care",
  "pharmacology-nursing": "pharmacology",
  "reduction-risk": "risk-reduction",
  "physiological-adaptation": "physiological-adaptation",
  fundamentals: "basic-care",
  "med-surg": "physiological-adaptation",
  "maternal-child": "health-promotion",
  "pediatrics-nursing": "health-promotion",
};

export function resolveClientNeedsCategory(subjectId: string): string {
  return SUBJECT_TO_CLIENT_NEEDS[subjectId] ?? "management-of-care";
}

export function pickClusterKeepers(
  members: ScoredItem[],
  opts: { maxKeep?: number; minGapForSecond?: number } = {}
): string[] {
  const maxKeep = opts.maxKeep ?? 2;
  const minGap = opts.minGapForSecond ?? 0.75;

  if (members.length === 0) return [];
  const sorted = [...members].sort((a, b) => b.quality.composite - a.quality.composite);

  const top = sorted[0]!;
  if (top.quality.tier === "drop") return [];

  const keep: string[] = [top.id];

  if (members.length >= 3 && maxKeep > 1 && sorted[1]) {
    const second = sorted[1];
    const gap = top.quality.composite - second.quality.composite;
    if (second.quality.tier !== "drop" && gap <= minGap && second.quality.composite >= 7.5) {
      keep.push(second.id);
    }
  }

  return keep.slice(0, maxKeep);
}

export function selectKeepersFromClusters(
  clusters: Map<string, ScoredItem[]>
): Map<string, { keep: boolean; review: boolean }> {
  const decisions = new Map<string, { keep: boolean; review: boolean }>();

  for (const members of clusters.values()) {
    const keeperIds = new Set(pickClusterKeepers(members));

    for (const member of members) {
      if (keeperIds.has(member.id)) {
        decisions.set(member.id, {
          keep: member.quality.tier === "keep" || member.quality.composite >= 7.8,
          review: member.quality.tier === "review",
        });
      } else {
        decisions.set(member.id, { keep: false, review: false });
      }
    }
  }

  return decisions;
}

export function allocateToTarget(
  items: ScoredItem[],
  target: number
): { kept: ScoredItem[]; dropped: ScoredItem[] } {
  const categories = nclexBlueprint().categories;
  const targets = new Map<string, number>();
  let allocated = 0;
  for (const cat of categories) {
    const count = Math.floor(target * cat.weight);
    targets.set(cat.id, count);
    allocated += count;
  }
  let remainder = target - allocated;
  let i = 0;
  while (remainder > 0) {
    const cat = categories[i % categories.length]!;
    targets.set(cat.id, (targets.get(cat.id) ?? 0) + 1);
    remainder--;
    i++;
  }

  const byCategory = new Map<string, ScoredItem[]>();
  for (const item of items) {
    const cat = resolveClientNeedsCategory(item.subjectId);
    const list = byCategory.get(cat) ?? [];
    list.push(item);
    byCategory.set(cat, list);
  }

  for (const list of byCategory.values()) {
    list.sort((a, b) => b.quality.composite - a.quality.composite);
  }

  const kept: ScoredItem[] = [];
  const keptIds = new Set<string>();

  for (const cat of categories) {
    const pool = byCategory.get(cat.id) ?? [];
    const take = Math.min(targets.get(cat.id) ?? 0, pool.length);
    for (const item of pool.slice(0, take)) {
      kept.push(item);
      keptIds.add(item.id);
    }
  }

  const remaining = items
    .filter((item) => !keptIds.has(item.id))
    .sort((a, b) => b.quality.composite - a.quality.composite);

  for (const item of remaining) {
    if (kept.length >= target) break;
    kept.push(item);
    keptIds.add(item.id);
  }

  return {
    kept,
    dropped: items.filter((item) => !keptIds.has(item.id)),
  };
}

export function buildCategoryBalance(
  before: ScoredItem[],
  after: ScoredItem[],
  target: number
) {
  return nclexBlueprint().categories.map((cat) => {
    const beforeCount = before.filter(
      (item) => resolveClientNeedsCategory(item.subjectId) === cat.id
    ).length;
    const afterCount = after.filter(
      (item) => resolveClientNeedsCategory(item.subjectId) === cat.id
    ).length;
    const targetCount = Math.round(target * cat.weight);
    return {
      categoryId: cat.id,
      label: cat.label,
      targetWeight: cat.weight,
      targetCount,
      beforeCount,
      afterCount,
      delta: afterCount - targetCount,
    };
  });
}
