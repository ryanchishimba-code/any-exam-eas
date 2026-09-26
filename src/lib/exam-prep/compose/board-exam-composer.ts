/**
 * Board-generic practice-exam composer.
 *
 * Builds forms from an already student-eligible pool, balances each full exam
 * to a config-driven test plan, keeps items unique across the set, and refuses
 * near-duplicate scenarios inside one exam. Single-subject leftovers get
 * honest practice-set titles.
 */

export type TestPlanArea = {
  id: string;
  label: string;
  minPct: number;
  maxPct: number;
  /** Midpoint percent used to place the leftover items. */
  weight: number;
};

export type ComposerItem = {
  id: string;
  areaId: string;
  subjectId: string;
  scenarioText: string;
};

export type SubjectSetConfig = {
  length: number;
  /** subjectId → honest title, for example "Pediatrics Practice Set". */
  titles: Record<string, string>;
};

export type BoardComposeConfig = {
  boardId: string;
  areas: readonly TestPlanArea[];
  fullExamLength: number;
  maxFullExams: number;
  /** How many times one item may appear in the published set. */
  maxItemReuse: number;
  fullExamTitle: (index: number) => string;
  subjectSets?: SubjectSetConfig;
};

export type ComposedExam = {
  kind: "full" | "subject-set";
  title: string;
  subjectId?: string;
  itemIds: string[];
  areaCounts: Record<string, number>;
  areasOutOfRange: string[];
};

export type OverlapStats = {
  exams: number;
  identicalPairs: number;
  maxSharedItems: number;
  meanSharedItems: number;
  maxJaccard: number;
  meanJaccard: number;
};

export type ComposeMath = {
  requestedFullExams: number;
  fullExamLength: number;
  poolByArea: Record<string, number>;
  unmappedItems: number;
  quota: Record<string, number> | null;
  maxFullExamsByArea: Record<string, number>;
  limitingArea: string | null;
  publishedFullExams: number;
  publishedSubjectSets: number;
  stopReason: string;
};

export type ComposeResult = {
  exams: ComposedExam[];
  math: ComposeMath;
  overlap: OverlapStats;
};

const TOKEN = /[a-z0-9]+(?:\/[0-9]+)?/g;
const VITAL = /\b\d{2,3}\/\d{2,3}\b|\b\d+(?:\.\d+)?\b/g;

export function scenarioTokens(text: string): Set<string> {
  const set = new Set<string>();
  const norm = text.toLowerCase();
  for (const match of norm.match(TOKEN) ?? []) {
    if (match.length < 2) continue;
    set.add(match);
  }
  return set;
}

export function vitalFingerprints(text: string): Set<string> {
  return new Set(text.match(VITAL) ?? []);
}

export function jaccard(a: ReadonlySet<string>, b: ReadonlySet<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let shared = 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const token of small) {
    if (large.has(token)) shared += 1;
  }
  const union = a.size + b.size - shared;
  return union === 0 ? 0 : shared / union;
}

/** Audit heuristic: unigram Jaccard ≥ 0.45, or ≥ 4 shared numbers and Jaccard ≥ 0.25. */
export function scenariosNearDuplicate(a: string, b: string): boolean {
  if (a.trim().length < 40 || b.trim().length < 40) return false;
  return preparedNearDuplicate(prepareScenario(a), prepareScenario(b));
}

type Prepared = {
  id: string;
  areaId: string;
  subjectId: string;
  text: string;
  tokens: Set<string>;
  vitals: Set<string>;
};

function prepareScenario(text: string): Pick<Prepared, "tokens" | "vitals"> {
  return { tokens: scenarioTokens(text), vitals: vitalFingerprints(text) };
}

function preparedNearDuplicate(
  a: Pick<Prepared, "tokens" | "vitals">,
  b: Pick<Prepared, "tokens" | "vitals">
): boolean {
  const score = jaccard(a.tokens, b.tokens);
  if (score >= 0.45) return true;
  let sharedVitals = 0;
  const [small, large] = a.vitals.size <= b.vitals.size ? [a.vitals, b.vitals] : [b.vitals, a.vitals];
  for (const vital of small) {
    if (large.has(vital)) sharedVitals += 1;
  }
  return sharedVitals >= 4 && score >= 0.25;
}

export function planAreaCounts(
  length: number,
  areas: readonly TestPlanArea[]
): Record<string, number> | null {
  if (length <= 0 || areas.length === 0) return null;
  const bounds = areas.map((area) => {
    const min = Math.ceil((length * area.minPct) / 100 - 1e-9);
    const max = Math.floor((length * area.maxPct) / 100 + 1e-9);
    return { ...area, min, max };
  });
  if (bounds.some((area) => area.min > area.max || area.min < 0)) return null;
  const minSum = bounds.reduce((sum, area) => sum + area.min, 0);
  const maxSum = bounds.reduce((sum, area) => sum + area.max, 0);
  if (minSum > length || maxSum < length) return null;

  const counts: Record<string, number> = {};
  for (const area of bounds) counts[area.id] = area.min;
  let left = length - minSum;
  while (left > 0) {
    let best: { id: string; gap: number } | null = null;
    for (const area of bounds) {
      const current = counts[area.id] ?? 0;
      if (current >= area.max) continue;
      const ideal = (length * area.weight) / 100;
      const gap = ideal - current;
      if (!best || gap > best.gap + 1e-9 || (Math.abs(gap - best.gap) <= 1e-9 && area.id < best.id)) {
        best = { id: area.id, gap };
      }
    }
    if (!best) return null;
    counts[best.id] = (counts[best.id] ?? 0) + 1;
    left -= 1;
  }
  return counts;
}

export function areasOutsidePlan(
  counts: Record<string, number>,
  length: number,
  areas: readonly TestPlanArea[]
): string[] {
  if (length <= 0) return areas.map((area) => area.id);
  const outside: string[] = [];
  for (const area of areas) {
    const pct = ((counts[area.id] ?? 0) / length) * 100;
    if (pct + 1e-6 < area.minPct || pct - 1e-6 > area.maxPct) outside.push(area.id);
  }
  return outside;
}

function prepareItem(item: ComposerItem): Prepared {
  const scenario = prepareScenario(item.scenarioText);
  return {
    id: item.id,
    areaId: item.areaId,
    subjectId: item.subjectId,
    text: item.scenarioText,
    tokens: scenario.tokens,
    vitals: scenario.vitals,
  };
}

function takeItems(
  pool: readonly Prepared[],
  need: number,
  used: Map<string, number>,
  maxReuse: number,
  selected: Prepared[]
): Prepared[] | null {
  const taken: Prepared[] = [];
  for (const item of pool) {
    if ((used.get(item.id) ?? 0) >= maxReuse) continue;
    if (selected.some((kept) => kept.id === item.id) || taken.some((kept) => kept.id === item.id)) continue;
    const blocked =
      item.text.trim().length >= 40 &&
      (selected.some((kept) => preparedNearDuplicate(kept, item)) ||
        taken.some((kept) => preparedNearDuplicate(kept, item)));
    if (blocked) continue;
    taken.push(item);
    if (taken.length === need) return taken;
  }
  return null;
}

export function overlapStats(exams: readonly { itemIds: readonly string[] }[]): OverlapStats {
  const sets = exams.map((exam) => new Set(exam.itemIds));
  let identicalPairs = 0;
  let maxShared = 0;
  let sharedSum = 0;
  let maxJac = 0;
  let jacSum = 0;
  let pairs = 0;
  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      const a = sets[i]!;
      const b = sets[j]!;
      let shared = 0;
      const [small, large] = a.size <= b.size ? [a, b] : [b, a];
      for (const id of small) if (large.has(id)) shared += 1;
      const union = a.size + b.size - shared;
      const score = union === 0 ? 0 : shared / union;
      if (a.size > 0 && shared === a.size && shared === b.size) identicalPairs += 1;
      if (shared > maxShared) maxShared = shared;
      if (score > maxJac) maxJac = score;
      sharedSum += shared;
      jacSum += score;
      pairs += 1;
    }
  }
  return {
    exams: exams.length,
    identicalPairs,
    maxSharedItems: maxShared,
    meanSharedItems: pairs === 0 ? 0 : sharedSum / pairs,
    maxJaccard: maxJac,
    meanJaccard: pairs === 0 ? 0 : jacSum / pairs,
  };
}

export function composeBoardExams(items: readonly ComposerItem[], config: BoardComposeConfig): ComposeResult {
  const quota = planAreaCounts(config.fullExamLength, config.areas);
  const byArea = new Map<string, Prepared[]>();
  for (const area of config.areas) byArea.set(area.id, []);
  let unmapped = 0;
  const allPrepared: Prepared[] = [];
  for (const item of items) {
    const prepared = prepareItem(item);
    allPrepared.push(prepared);
    const bucket = byArea.get(item.areaId);
    if (!bucket) {
      unmapped += 1;
      continue;
    }
    bucket.push(prepared);
  }
  for (const list of byArea.values()) {
    list.sort((a, b) => a.id.localeCompare(b.id));
  }

  const poolByArea = Object.fromEntries(
    config.areas.map((area) => [area.id, byArea.get(area.id)?.length ?? 0])
  );
  const maxFullExamsByArea: Record<string, number> = {};
  let limitingArea: string | null = null;
  let limitingCount = Number.POSITIVE_INFINITY;
  if (quota) {
    for (const area of config.areas) {
      const need = quota[area.id] ?? 0;
      const capacity = need > 0 ? Math.floor((poolByArea[area.id] ?? 0) / need) : 0;
      maxFullExamsByArea[area.id] = capacity;
      if (capacity < limitingCount || (capacity === limitingCount && area.id < (limitingArea ?? "\uffff"))) {
        limitingCount = capacity;
        limitingArea = area.id;
      }
    }
  }

  const used = new Map<string, number>();
  const exams: ComposedExam[] = [];
  let stopReason = quota
    ? "Filled the requested full exams."
    : "Test-plan percentages cannot sum to the exam length.";

  const pickOrder = [...config.areas].sort((a, b) => {
    const size = (byArea.get(a.id)?.length ?? 0) - (byArea.get(b.id)?.length ?? 0);
    return size || a.id.localeCompare(b.id);
  });

  if (quota) {
    for (let index = 1; index <= config.maxFullExams; index++) {
      const selected: Prepared[] = [];
      const counts: Record<string, number> = {};
      let failedArea: string | null = null;
      let failedNeed = 0;
      for (const area of pickOrder) {
        const need = quota[area.id] ?? 0;
        const taken = takeItems(byArea.get(area.id) ?? [], need, used, config.maxItemReuse, selected);
        if (!taken) {
          failedArea = area.id;
          failedNeed = need;
          break;
        }
        selected.push(...taken);
        counts[area.id] = taken.length;
      }
      if (failedArea || selected.length !== config.fullExamLength) {
        const have = byArea.get(failedArea ?? "")?.filter((item) => (used.get(item.id) ?? 0) < config.maxItemReuse).length ?? 0;
        stopReason = failedArea
          ? `Stopped at ${exams.length} full exams. ${failedArea} needed ${failedNeed} more items and had ${have} unused after near-duplicate and reuse checks.`
          : `Stopped at ${exams.length} full exams. The form did not reach ${config.fullExamLength} items.`;
        break;
      }
      for (const item of selected) used.set(item.id, (used.get(item.id) ?? 0) + 1);
      const areaCounts = Object.fromEntries(config.areas.map((area) => [area.id, counts[area.id] ?? 0]));
      exams.push({
        kind: "full",
        title: config.fullExamTitle(index),
        itemIds: selected.map((item) => item.id),
        areaCounts,
        areasOutOfRange: areasOutsidePlan(areaCounts, config.fullExamLength, config.areas),
      });
    }
    if (exams.length === config.maxFullExams) {
      stopReason = `Pool supports ${exams.length} unique full exams of ${config.fullExamLength}.`;
    }
  }

  const subjectConfig = config.subjectSets;
  const room = Math.max(0, config.maxFullExams - exams.filter((exam) => exam.kind === "full").length);
  if (subjectConfig && room > 0) {
    const bySubject = new Map<string, Prepared[]>();
    for (const item of allPrepared) {
      if (!subjectConfig.titles[item.subjectId]) continue;
      if ((used.get(item.id) ?? 0) >= config.maxItemReuse) continue;
      const list = bySubject.get(item.subjectId) ?? [];
      list.push(item);
      bySubject.set(item.subjectId, list);
    }
    const subjects = [...bySubject.keys()].sort();
    let added = 0;
    for (const subjectId of subjects) {
      if (added >= room) break;
      const pool = (bySubject.get(subjectId) ?? []).sort((a, b) => a.id.localeCompare(b.id));
      let setIndex = 1;
      while (added < room) {
        const taken = takeItems(pool, subjectConfig.length, used, config.maxItemReuse, []);
        if (!taken) break;
        for (const item of taken) used.set(item.id, (used.get(item.id) ?? 0) + 1);
        const base = subjectConfig.titles[subjectId] ?? "Practice Set";
        const title = setIndex <= 1 ? base : `${base} ${setIndex}`;
        const areaCounts: Record<string, number> = {};
        for (const area of config.areas) areaCounts[area.id] = 0;
        for (const item of taken) areaCounts[item.areaId] = (areaCounts[item.areaId] ?? 0) + 1;
        exams.push({
          kind: "subject-set",
          title,
          subjectId,
          itemIds: taken.map((item) => item.id),
          areaCounts,
          areasOutOfRange: areasOutsidePlan(areaCounts, taken.length, config.areas),
        });
        setIndex += 1;
        added += 1;
      }
    }
  }

  const fullCount = exams.filter((exam) => exam.kind === "full").length;
  const subjectCount = exams.length - fullCount;
  return {
    exams,
    overlap: overlapStats(exams),
    math: {
      requestedFullExams: config.maxFullExams,
      fullExamLength: config.fullExamLength,
      poolByArea,
      unmappedItems: unmapped,
      quota,
      maxFullExamsByArea,
      limitingArea: quota ? limitingArea : null,
      publishedFullExams: fullCount,
      publishedSubjectSets: subjectCount,
      stopReason,
    },
  };
}

export function formatAreaDistribution(
  exam: ComposedExam,
  areas: readonly TestPlanArea[]
): string[] {
  const length = exam.itemIds.length;
  return areas.map((area) => {
    const count = exam.areaCounts[area.id] ?? 0;
    const pct = length === 0 ? 0 : (count / length) * 100;
    const inside = pct + 1e-6 >= area.minPct && pct - 1e-6 <= area.maxPct;
    return `${area.id} ${count}/${length} ${pct.toFixed(1)}% [${area.minPct}-${area.maxPct}] ${inside ? "in range" : "out of range"}`;
  });
}
