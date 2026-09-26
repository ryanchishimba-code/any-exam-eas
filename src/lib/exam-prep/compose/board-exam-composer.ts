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
  answerKey?: string;
  /** Content signals such as "calculation". Not a stored tag. */
  signals?: readonly string[];
};

export type CoverageFloor = {
  subjectId: string;
  minPerExam: number;
};

export type SignalFloor = {
  areaId: string;
  signal: string;
  minPerExam: number;
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
  /** How many times one item may appear in the published set. Unused items are used before any reuse. */
  maxItemReuse: number;
  /** Stable shuffle so the same low ids are not always chosen first. */
  selectionSeed?: string;
  /** Near-duplicate scenarios with different keys cannot share an exam. */
  blockContradictoryKeys?: boolean;
  /** Drop shared clinical boilerplate before the near-duplicate comparison. */
  dropBoilerplateTokens?: boolean;
  coverageFloors?: readonly CoverageFloor[];
  signalFloors?: readonly SignalFloor[];
  /**
   * When a scarce area cannot fill its quota, take what exists and fill the
   * rest from this area. The exam title should say the outline was not met.
   */
  shortfallFillAreaId?: string;
  fullExamTitle: (index: number, shortfall?: readonly string[]) => string;
  subjectSets?: SubjectSetConfig;
};

export type ComposedExam = {
  kind: "full" | "subject-set";
  title: string;
  subjectId?: string;
  itemIds: string[];
  areaCounts: Record<string, number>;
  areasOutOfRange: string[];
  shortfall: string[];
  signalCounts: Record<string, number>;
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
const BOILERPLATE = new Set([
  "the", "and", "or", "of", "to", "in", "on", "for", "with", "from", "at", "by", "is", "are",
  "was", "be", "has", "have", "had", "this", "that", "who", "which", "a", "an", "as", "into",
  "year", "old", "patient", "presents", "presenting", "history", "male", "female", "pharmacy",
  "prescribed", "prescription", "medication", "medications", "current", "taking", "reports",
  "reported", "known", "allergies", "allergy", "past", "two", "days", "day",
]);
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
  order: number;
  answerKey?: string;
  signals: readonly string[];
  signature: string[];
};

function prepareScenario(text: string, dropBoilerplate = false): Pick<Prepared, "tokens" | "vitals"> {
  const tokens = scenarioTokens(text);
  if (dropBoilerplate) {
    for (const token of tokens) {
      if (BOILERPLATE.has(token)) tokens.delete(token);
    }
  }
  return { tokens, vitals: vitalFingerprints(text) };
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

function prepareItem(item: ComposerItem, order: number, dropBoilerplate = false): Prepared {
  const scenario = prepareScenario(item.scenarioText, dropBoilerplate);
  return {
    id: item.id,
    areaId: item.areaId,
    subjectId: item.subjectId,
    text: item.scenarioText,
    tokens: scenario.tokens,
    vitals: scenario.vitals,
    order,
    answerKey: item.answerKey,
    signals: item.signals ?? [],
    signature: [],
  };
}

function assignSignatures(items: readonly Prepared[]) {
  const documentFrequency = new Map<string, number>();
  for (const item of items) {
    for (const token of item.tokens) {
      if (token.length < 4) continue;
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
    }
  }
  for (const item of items) {
    const shared = [...item.tokens].filter((token) => token.length >= 4 && (documentFrequency.get(token) ?? 0) >= 2);
    const source = shared.length > 0 ? shared : [...item.tokens].filter((token) => token.length >= 4);
    item.signature = source
      .sort(
        (a, b) =>
          (documentFrequency.get(a) ?? 0) - (documentFrequency.get(b) ?? 0) || a.localeCompare(b)
      )
      .slice(0, 8);
  }
}

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shuffleWithSeed<T>(items: readonly T[], seed: string): T[] {
  const next = [...items];
  let state = hashSeed(seed);
  const random = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let index = next.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1));
    const current = next[index]!;
    next[index] = next[swap]!;
    next[swap] = current;
  }
  return next;
}

function normalizeAnswerKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function contradictoryKeys(a: Prepared, b: Prepared): boolean {
  if (!a.answerKey || !b.answerKey) return false;
  if (normalizeAnswerKey(a.answerKey) === normalizeAnswerKey(b.answerKey)) return false;
  return jaccard(a.tokens, b.tokens) >= 0.35;
}

function blockedTogether(a: Prepared, b: Prepared, blockContradictions: boolean): boolean {
  const longEnough = a.text.trim().length >= 40 && b.text.trim().length >= 40;
  if (longEnough && preparedNearDuplicate(a, b)) return true;
  return blockContradictions && contradictoryKeys(a, b);
}

function takeUpTo(
  pool: readonly Prepared[],
  need: number,
  used: Map<string, number>,
  maxReuse: number,
  selected: Prepared[],
  floors: readonly CoverageFloor[],
  signal: SignalFloor | undefined,
  blockContradictions: boolean
): Prepared[] {
  const taken: Prepared[] = [];
  const takenIds = new Set<string>();
  const candidates = pool
    .filter((item) => (used.get(item.id) ?? 0) < maxReuse)
    .filter((item) => !selected.some((kept) => kept.id === item.id))
    .sort((a, b) => (used.get(a.id) ?? 0) - (used.get(b.id) ?? 0) || a.order - b.order);
  const tokenIndex = new Map<string, Prepared[]>();
  const vitalIndex = new Map<string, Prepared[]>();
  const addToIndex = (item: Prepared) => {
    for (const token of item.signature) {
      const list = tokenIndex.get(token);
      if (list) list.push(item);
      else tokenIndex.set(token, [item]);
    }
    for (const vital of item.vitals) {
      const list = vitalIndex.get(vital);
      if (list) list.push(item);
      else vitalIndex.set(vital, [item]);
    }
  };
  for (const item of selected) addToIndex(item);
  const blocked = (item: Prepared) => {
    const seen = new Set<Prepared>();
    const consider = (other: Prepared) => {
      if (seen.has(other)) return false;
      seen.add(other);
      return blockedTogether(other, item, blockContradictions);
    };
    for (const token of item.signature) {
      for (const other of tokenIndex.get(token) ?? []) {
        if (consider(other)) return true;
      }
    }
    for (const vital of item.vitals) {
      for (const other of vitalIndex.get(vital) ?? []) {
        if (consider(other)) return true;
      }
    }
    return false;
  };
  const subjectCounts = new Map<string, number>();
  const signalCounts = new Map<string, number>();
  for (const item of selected) {
    subjectCounts.set(item.subjectId, (subjectCounts.get(item.subjectId) ?? 0) + 1);
    for (const name of item.signals) signalCounts.set(name, (signalCounts.get(name) ?? 0) + 1);
  }
  const wanted = (item: Prepared) => {
    for (const floor of floors) {
      if (item.subjectId === floor.subjectId && (subjectCounts.get(item.subjectId) ?? 0) < floor.minPerExam) {
        return true;
      }
    }
    return (
      signal != null &&
      item.signals.includes(signal.signal) &&
      (signalCounts.get(signal.signal) ?? 0) < signal.minPerExam
    );
  };
  const floorSubjects = new Set(floors.map((floor) => floor.subjectId));
  const priority = candidates.filter(
    (item) => floorSubjects.has(item.subjectId) || (signal != null && item.signals.includes(signal.signal))
  );
  let priorityIndex = 0;
  let restIndex = 0;
  while (taken.length < need) {
    let choice: Prepared | null = null;
    while (priorityIndex < priority.length) {
      const item = priority[priorityIndex]!;
      priorityIndex += 1;
      if (takenIds.has(item.id) || !wanted(item) || blocked(item)) continue;
      choice = item;
      break;
    }
    if (!choice) {
      while (restIndex < candidates.length) {
        const item = candidates[restIndex]!;
        restIndex += 1;
        if (takenIds.has(item.id) || blocked(item)) continue;
        choice = item;
        break;
      }
    }
    if (!choice) break;
    taken.push(choice);
    takenIds.add(choice.id);
    addToIndex(choice);
    subjectCounts.set(choice.subjectId, (subjectCounts.get(choice.subjectId) ?? 0) + 1);
    for (const name of choice.signals) signalCounts.set(name, (signalCounts.get(name) ?? 0) + 1);
  }
  return taken;
}

function takeItems(
  pool: readonly Prepared[],
  need: number,
  used: Map<string, number>,
  maxReuse: number,
  selected: Prepared[],
  floors: readonly CoverageFloor[] = [],
  signal?: SignalFloor,
  blockContradictions = false
): Prepared[] | null {
  const taken = takeUpTo(pool, need, used, maxReuse, selected, floors, signal, blockContradictions);
  return taken.length === need ? taken : null;
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
  const seeded = config.selectionSeed
    ? shuffleWithSeed(items, config.selectionSeed)
    : [...items].sort((a, b) => a.id.localeCompare(b.id));
  seeded.forEach((item, order) => {
    const prepared = prepareItem(item, order, config.dropBoilerplateTokens === true);
    allPrepared.push(prepared);
    const bucket = byArea.get(item.areaId);
    if (!bucket) {
      unmapped += 1;
      return;
    }
    bucket.push(prepared);
  });
  assignSignatures(allPrepared);

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

  const floors = config.coverageFloors ?? [];
  const blockContradictions = config.blockContradictoryKeys === true;
  if (quota) {
    for (let index = 1; index <= config.maxFullExams; index++) {
      const selected: Prepared[] = [];
      const counts: Record<string, number> = {};
      const shortfall: string[] = [];
      let failedArea: string | null = null;
      let failedNeed = 0;
      for (const area of pickOrder) {
        const need = quota[area.id] ?? 0;
        const signal = config.signalFloors?.find((floor) => floor.areaId === area.id);
        const pool = byArea.get(area.id) ?? [];
        const taken = config.shortfallFillAreaId
          ? takeUpTo(pool, need, used, config.maxItemReuse, selected, floors, signal, blockContradictions)
          : takeItems(pool, need, used, config.maxItemReuse, selected, floors, signal, blockContradictions);
        if (!taken || taken.length < need) {
          const partial = taken ?? [];
          selected.push(...partial);
          counts[area.id] = (counts[area.id] ?? 0) + partial.length;
          if (!config.shortfallFillAreaId) {
            failedArea = area.id;
            failedNeed = need;
            break;
          }
          shortfall.push(area.id);
          continue;
        }
        selected.push(...taken);
        counts[area.id] = (counts[area.id] ?? 0) + taken.length;
        if (signal) {
          const have = taken.filter((item) => item.signals.includes(signal.signal)).length;
          if (have < signal.minPerExam) shortfall.push(`signal:${signal.signal}`);
        }
      }
      if (!failedArea && config.shortfallFillAreaId && selected.length < config.fullExamLength) {
        const gap = config.fullExamLength - selected.length;
        const fill = takeUpTo(
          byArea.get(config.shortfallFillAreaId) ?? [],
          gap,
          used,
          config.maxItemReuse,
          selected,
          floors,
          undefined,
          blockContradictions
        );
        if (fill.length < gap) {
          failedArea = config.shortfallFillAreaId;
          failedNeed = gap;
        } else {
          selected.push(...fill);
          counts[config.shortfallFillAreaId] = (counts[config.shortfallFillAreaId] ?? 0) + fill.length;
        }
      }
      if (!failedArea) {
        for (const floor of floors) {
          const have = selected.filter((item) => item.subjectId === floor.subjectId).length;
          if (have < floor.minPerExam) shortfall.push(`subject:${floor.subjectId}`);
        }
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
      const signalCounts: Record<string, number> = {};
      for (const item of selected) {
        for (const signal of item.signals) signalCounts[signal] = (signalCounts[signal] ?? 0) + 1;
      }
      exams.push({
        kind: "full",
        title: config.fullExamTitle(index, shortfall),
        itemIds: selected.map((item) => item.id),
        areaCounts,
        areasOutOfRange: areasOutsidePlan(areaCounts, config.fullExamLength, config.areas),
        shortfall,
        signalCounts,
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
        const taken = takeItems(
          pool,
          subjectConfig.length,
          used,
          config.maxItemReuse,
          [],
          floors,
          undefined,
          blockContradictions
        );
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
          shortfall: [],
          signalCounts: {},
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

export function reuseStats(exams: readonly { itemIds: readonly string[] }[]): {
  distinctItems: number;
  maxReuse: number;
  reusedItems: number;
  slotsFromReusedItems: number;
} {
  const counts = new Map<string, number>();
  for (const exam of exams) {
    for (const id of exam.itemIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  let maxReuse = 0;
  let reusedItems = 0;
  let slotsFromReusedItems = 0;
  for (const count of counts.values()) {
    if (count > maxReuse) maxReuse = count;
    if (count > 1) {
      reusedItems += 1;
      slotsFromReusedItems += count;
    }
  }
  return { distinctItems: counts.size, maxReuse, reusedItems, slotsFromReusedItems };
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
