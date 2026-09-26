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
  /**
   * Second blueprint axis (AANP age group, PANCE task). Items with no id,
   * or an id outside `secondaryAreas`, stay out of the form.
   */
  secondaryId?: string;
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
  /**
   * Optional second axis that must also land inside its bands.
   * Absent for NCLEX and NAPLEX. A form that misses this axis is not published.
   */
  secondaryAreas?: readonly TestPlanArea[];
  /**
   * Most items any two published forms may share. Absent means no pairwise cap.
   * An item is still never repeated inside one form.
   */
  maxSharedItems?: number;
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
  /** Second-axis counts. Empty when the board has no secondary plan. */
  secondaryCounts: Record<string, number>;
  secondaryOutOfRange: string[];
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
  /** Eligible items whose primary tag mapped and whose secondary tag did not. */
  secondaryUnmappedItems: number;
  quota: Record<string, number> | null;
  secondaryQuota: Record<string, number> | null;
  secondaryPool: Record<string, number>;
  maxFullExamsByArea: Record<string, number>;
  secondaryMaxFullExamsByArea: Record<string, number>;
  limitingArea: string | null;
  secondaryLimitingArea: string | null;
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
  secondaryId?: string;
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

export type AreaCountBound = { id: string; min: number; max: number };

/** Integer floor/ceil of each percent band. Null when a band cannot hold an integer. */
export function areaCountBounds(
  length: number,
  areas: readonly TestPlanArea[]
): AreaCountBound[] | null {
  if (length <= 0 || areas.length === 0) return null;
  const bounds = areas.map((area) => {
    const min = Math.ceil((length * area.minPct) / 100 - 1e-9);
    const max = Math.floor((length * area.maxPct) / 100 + 1e-9);
    return { id: area.id, min, max };
  });
  if (bounds.some((area) => area.min > area.max || area.min < 0)) return null;
  return bounds;
}

export function planAreaCounts(
  length: number,
  areas: readonly TestPlanArea[]
): Record<string, number> | null {
  const bounds = areaCountBounds(length, areas);
  if (!bounds) return null;
  const minSum = bounds.reduce((sum, area) => sum + area.min, 0);
  const maxSum = bounds.reduce((sum, area) => sum + area.max, 0);
  if (minSum > length || maxSum < length) return null;

  const weightById = new Map(areas.map((area) => [area.id, area.weight]));
  const counts: Record<string, number> = {};
  for (const area of bounds) counts[area.id] = area.min;
  let left = length - minSum;
  while (left > 0) {
    let best: { id: string; gap: number } | null = null;
    for (const area of bounds) {
      const current = counts[area.id] ?? 0;
      if (current >= area.max) continue;
      const ideal = (length * (weightById.get(area.id) ?? 0)) / 100;
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
    secondaryId: item.secondaryId,
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

type SecondaryPick = {
  counts: Map<string, number>;
  min: Record<string, number>;
  max: Record<string, number>;
};

type PairwiseCap = {
  maxShared: number;
  members: Map<string, number[]>;
  formCount: number;
};

function createPairwiseCap(maxShared: number | undefined): PairwiseCap | null {
  if (maxShared == null || !Number.isFinite(maxShared) || maxShared < 0) return null;
  return { maxShared, members: new Map(), formCount: 0 };
}

function runningOverlap(cap: PairwiseCap | null, selected: readonly { id: string }[]): number[] {
  if (!cap) return [];
  const running = new Array<number>(cap.formCount).fill(0);
  for (const item of selected) {
    for (const index of cap.members.get(item.id) ?? []) running[index] = (running[index] ?? 0) + 1;
  }
  return running;
}

function overlapWouldExceed(cap: PairwiseCap | null, itemId: string, running: number[]): boolean {
  if (!cap) return false;
  for (const index of cap.members.get(itemId) ?? []) {
    if ((running[index] ?? 0) + 1 > cap.maxShared) return true;
  }
  return false;
}

function noteTaken(cap: PairwiseCap | null, running: number[], itemId: string) {
  if (!cap) return;
  for (const index of cap.members.get(itemId) ?? []) running[index] = (running[index] ?? 0) + 1;
}

function adjustSwap(cap: PairwiseCap | null, running: number[], removeId: string, addId: string) {
  if (!cap) return;
  for (const index of cap.members.get(removeId) ?? []) running[index] = (running[index] ?? 0) - 1;
  for (const index of cap.members.get(addId) ?? []) running[index] = (running[index] ?? 0) + 1;
}

function swapKeepsCap(cap: PairwiseCap | null, running: number[], removeId: string, addId: string): boolean {
  if (!cap) return true;
  const removed = new Set(cap.members.get(removeId) ?? []);
  for (const index of cap.members.get(addId) ?? []) {
    const after = (running[index] ?? 0) - (removed.has(index) ? 1 : 0) + 1;
    if (after > cap.maxShared) return false;
  }
  return true;
}

function formExceedsCap(cap: PairwiseCap | null, ids: readonly string[]): boolean {
  if (!cap) return false;
  const counts = new Array<number>(cap.formCount).fill(0);
  for (const id of ids) {
    for (const index of cap.members.get(id) ?? []) {
      counts[index] = (counts[index] ?? 0) + 1;
      if (counts[index]! > cap.maxShared) return true;
    }
  }
  return false;
}

function commitForm(cap: PairwiseCap | null, ids: readonly string[]) {
  if (!cap) return;
  const index = cap.formCount;
  for (const id of ids) {
    const list = cap.members.get(id);
    if (list) list.push(index);
    else cap.members.set(id, [index]);
  }
  cap.formCount += 1;
}

function takeUpTo(
  pool: readonly Prepared[],
  need: number,
  used: Map<string, number>,
  maxReuse: number,
  selected: Prepared[],
  floors: readonly CoverageFloor[],
  signal: SignalFloor | undefined,
  blockContradictions: boolean,
  secondary?: SecondaryPick,
  pairwise: PairwiseCap | null = null
): Prepared[] {
  const taken: Prepared[] = [];
  const takenIds = new Set<string>();
  const running = runningOverlap(pairwise, selected);
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
    if (overlapWouldExceed(pairwise, item.id, running)) return true;
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
  const localSecondary = new Map<string, number>();
  if (secondary) {
    for (const [id, count] of secondary.counts) localSecondary.set(id, count);
  }
  const secondaryGroups = new Map<string, Prepared[]>();
  const secondaryCursor = new Map<string, number>();
  if (secondary) {
    for (const item of candidates) {
      const key = item.secondaryId ?? "";
      const list = secondaryGroups.get(key);
      if (list) list.push(item);
      else secondaryGroups.set(key, [item]);
    }
  }
  const secondaryScore = (id: string) => {
    if (!secondary) return 0;
    const have = localSecondary.get(id) ?? 0;
    const min = secondary.min[id] ?? 0;
    const max = secondary.max[id] ?? min;
    if (have < min) return 1000 + (min - have);
    if (have < max) return 1;
    return -1;
  };
  const nextInGroup = (key: string): Prepared | null => {
    const list = secondaryGroups.get(key) ?? [];
    let cursor = secondaryCursor.get(key) ?? 0;
    while (cursor < list.length) {
      const item = list[cursor]!;
      cursor += 1;
      if (takenIds.has(item.id) || blocked(item)) continue;
      secondaryCursor.set(key, cursor);
      return item;
    }
    secondaryCursor.set(key, cursor);
    return null;
  };
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
    if (!choice && secondary) {
      const ranked = [...secondaryGroups.keys()].sort(
        (a, b) => secondaryScore(b) - secondaryScore(a) || a.localeCompare(b)
      );
      for (const key of ranked) {
        if (secondaryScore(key) < 0) break;
        const item = nextInGroup(key);
        if (!item) continue;
        choice = item;
        break;
      }
      if (!choice) {
        for (const key of ranked) {
          const item = nextInGroup(key);
          if (!item) continue;
          choice = item;
          break;
        }
      }
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
    noteTaken(pairwise, running, choice.id);
    addToIndex(choice);
    if (secondary && choice.secondaryId) {
      localSecondary.set(choice.secondaryId, (localSecondary.get(choice.secondaryId) ?? 0) + 1);
    }
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
  blockContradictions = false,
  secondary?: SecondaryPick,
  pairwise: PairwiseCap | null = null
): Prepared[] | null {
  const taken = takeUpTo(
    pool,
    need,
    used,
    maxReuse,
    selected,
    floors,
    signal,
    blockContradictions,
    secondary,
    pairwise
  );
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

/**
 * Split each primary quota across the second axis so column totals land
 * inside the secondary bands and no cell asks for more items than exist.
 * Returns null when the joint pool cannot fill one form.
 */
export function allocateSecondaryTargets(input: {
  primaryQuota: Record<string, number>;
  bounds: readonly AreaCountBound[];
  available: Record<string, Record<string, number>>;
}): Record<string, Record<string, number>> | null {
  const left: Record<string, Record<string, number>> = {};
  for (const [areaId, row] of Object.entries(input.available)) left[areaId] = { ...row };
  const domainLeft = { ...input.primaryQuota };
  const got: Record<string, number> = {};
  const placed: Record<string, Record<string, number>> = {};
  for (const areaId of Object.keys(input.primaryQuota)) placed[areaId] = {};
  for (const bound of input.bounds) got[bound.id] = 0;
  const order = [...input.bounds].sort(
    (a, b) => a.max - a.min - (b.max - b.min) || b.min - a.min || a.id.localeCompare(b.id)
  );
  for (const bound of order) {
    let still = bound.min;
    const donors = Object.keys(domainLeft).sort(
      (a, b) => (left[b]?.[bound.id] ?? 0) - (left[a]?.[bound.id] ?? 0) || a.localeCompare(b)
    );
    for (const areaId of donors) {
      if (still <= 0) break;
      const take = Math.min(still, left[areaId]?.[bound.id] ?? 0, domainLeft[areaId] ?? 0);
      if (take <= 0) continue;
      left[areaId]![bound.id] = (left[areaId]?.[bound.id] ?? 0) - take;
      domainLeft[areaId] = (domainLeft[areaId] ?? 0) - take;
      got[bound.id] = (got[bound.id] ?? 0) + take;
      placed[areaId]![bound.id] = (placed[areaId]?.[bound.id] ?? 0) + take;
      still -= take;
    }
    if ((got[bound.id] ?? 0) < bound.min) return null;
  }
  for (const areaId of Object.keys(domainLeft)) {
    while ((domainLeft[areaId] ?? 0) > 0) {
      let best: string | null = null;
      let bestHave = -1;
      for (const bound of input.bounds) {
        const room = bound.max - (got[bound.id] ?? 0);
        const have = left[areaId]?.[bound.id] ?? 0;
        if (room <= 0 || have <= 0) continue;
        if (have > bestHave || (have === bestHave && best != null && bound.id < best)) {
          bestHave = have;
          best = bound.id;
        }
      }
      if (!best) return null;
      left[areaId]![best] = (left[areaId]?.[best] ?? 0) - 1;
      domainLeft[areaId] = (domainLeft[areaId] ?? 0) - 1;
      got[best] = (got[best] ?? 0) + 1;
      placed[areaId]![best] = (placed[areaId]?.[best] ?? 0) + 1;
    }
  }
  for (const bound of input.bounds) {
    const count = got[bound.id] ?? 0;
    if (count < bound.min || count > bound.max) return null;
  }
  return placed;
}

function secondaryCountsOf(
  items: readonly Prepared[],
  areas: readonly TestPlanArea[]
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const area of areas) counts[area.id] = 0;
  for (const item of items) {
    if (item.secondaryId && counts[item.secondaryId] != null) {
      counts[item.secondaryId] += 1;
    }
  }
  return counts;
}

/**
 * Swap same-area items until the second axis sits inside its integer band.
 * Returns null when no swap can fix the form. Does not mark items used.
 */
function balanceSecondary(
  selected: readonly Prepared[],
  byArea: ReadonlyMap<string, readonly Prepared[]>,
  used: ReadonlyMap<string, number>,
  maxReuse: number,
  areas: readonly TestPlanArea[],
  bounds: readonly AreaCountBound[],
  blockContradictions: boolean,
  pairwise: PairwiseCap | null = null
): Prepared[] | null {
  const next = [...selected];
  const running = runningOverlap(pairwise, next);
  for (let attempt = 0; attempt < next.length * 2; attempt++) {
    const counts = secondaryCountsOf(next, areas);
    if (areasOutsidePlan(counts, next.length, areas).length === 0) return next;
    const over = bounds.find((bound) => (counts[bound.id] ?? 0) > bound.max);
    const under = bounds.find((bound) => (counts[bound.id] ?? 0) < bound.min);
    if (!over || !under) return null;
    let swapped = false;
    for (let index = 0; index < next.length; index++) {
      const current = next[index]!;
      if (current.secondaryId !== over.id) continue;
      const pool = byArea.get(current.areaId) ?? [];
      const replacement = pool.find((item) => {
        if (item.secondaryId !== under.id) return false;
        if ((used.get(item.id) ?? 0) >= maxReuse) return false;
        if (next.some((kept) => kept.id === item.id)) return false;
        if (!swapKeepsCap(pairwise, running, current.id, item.id)) return false;
        return !next.some(
          (other, otherIndex) =>
            otherIndex !== index && blockedTogether(other, item, blockContradictions)
        );
      });
      if (!replacement) continue;
      adjustSwap(pairwise, running, current.id, replacement.id);
      next[index] = replacement;
      swapped = true;
      break;
    }
    if (!swapped) return null;
  }
  const counts = secondaryCountsOf(next, areas);
  return areasOutsidePlan(counts, next.length, areas).length === 0 ? next : null;
}

export function composeBoardExams(items: readonly ComposerItem[], config: BoardComposeConfig): ComposeResult {
  const quota = planAreaCounts(config.fullExamLength, config.areas);
  const secondaryAreas = config.secondaryAreas ?? [];
  const secondaryIds = new Set(secondaryAreas.map((area) => area.id));
  const secondaryQuota =
    secondaryAreas.length > 0 ? planAreaCounts(config.fullExamLength, secondaryAreas) : null;
  const secondaryBounds =
    secondaryAreas.length > 0 ? areaCountBounds(config.fullExamLength, secondaryAreas) : null;
  const byArea = new Map<string, Prepared[]>();
  for (const area of config.areas) byArea.set(area.id, []);
  let unmapped = 0;
  let secondaryUnmapped = 0;
  const allPrepared: Prepared[] = [];
  const seeded = config.selectionSeed
    ? shuffleWithSeed(items, config.selectionSeed)
    : [...items].sort((a, b) => a.id.localeCompare(b.id));
  seeded.forEach((item, order) => {
    const prepared = prepareItem(item, order, config.dropBoilerplateTokens === true);
    const bucket = byArea.get(item.areaId);
    if (!bucket) {
      unmapped += 1;
      allPrepared.push(prepared);
      return;
    }
    if (secondaryAreas.length > 0 && (!prepared.secondaryId || !secondaryIds.has(prepared.secondaryId))) {
      secondaryUnmapped += 1;
      return;
    }
    allPrepared.push(prepared);
    bucket.push(prepared);
  });
  assignSignatures(allPrepared);

  const poolByArea = Object.fromEntries(
    config.areas.map((area) => [area.id, byArea.get(area.id)?.length ?? 0])
  );
  const secondaryPool: Record<string, number> = {};
  for (const area of secondaryAreas) secondaryPool[area.id] = 0;
  if (secondaryAreas.length > 0) {
    for (const list of byArea.values()) {
      for (const item of list) {
        if (item.secondaryId && secondaryPool[item.secondaryId] != null) {
          secondaryPool[item.secondaryId] += 1;
        }
      }
    }
  }
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
  const secondaryMaxFullExamsByArea: Record<string, number> = {};
  let secondaryLimitingArea: string | null = null;
  let secondaryLimitingCount = Number.POSITIVE_INFINITY;
  if (secondaryQuota) {
    for (const area of secondaryAreas) {
      const need = secondaryQuota[area.id] ?? 0;
      const capacity = need > 0 ? Math.floor((secondaryPool[area.id] ?? 0) / need) : 0;
      secondaryMaxFullExamsByArea[area.id] = capacity;
      if (
        capacity < secondaryLimitingCount ||
        (capacity === secondaryLimitingCount && area.id < (secondaryLimitingArea ?? "\uffff"))
      ) {
        secondaryLimitingCount = capacity;
        secondaryLimitingArea = area.id;
      }
    }
  }

  const used = new Map<string, number>();
  const pairwise = createPairwiseCap(config.maxSharedItems);
  const exams: ComposedExam[] = [];
  let stopReason = !quota
    ? "Test-plan percentages cannot sum to the exam length."
    : secondaryAreas.length > 0 && !secondaryQuota
      ? "Secondary test-plan percentages cannot sum to the exam length."
      : "Filled the requested full exams.";
  const secondaryMin = Object.fromEntries((secondaryBounds ?? []).map((bound) => [bound.id, bound.min]));
  const secondaryMax = Object.fromEntries((secondaryBounds ?? []).map((bound) => [bound.id, bound.max]));

  const pickOrder = [...config.areas].sort((a, b) => {
    const size = (byArea.get(a.id)?.length ?? 0) - (byArea.get(b.id)?.length ?? 0);
    return size || a.id.localeCompare(b.id);
  });

  const floors = config.coverageFloors ?? [];
  const blockContradictions = config.blockContradictoryKeys === true;
  const canFill = Boolean(quota) && (secondaryAreas.length === 0 || Boolean(secondaryQuota));
  if (canFill && quota) {
    for (let index = 1; index <= config.maxFullExams; index++) {
      const selected: Prepared[] = [];
      const counts: Record<string, number> = {};
      const shortfall: string[] = [];
      const runningSecondary = new Map<string, number>();
      const secondaryPick: SecondaryPick | undefined = secondaryBounds
        ? { counts: runningSecondary, min: secondaryMin, max: secondaryMax }
        : undefined;
      let failedArea: string | null = null;
      let failedNeed = 0;
      const available: Record<string, Record<string, number>> = {};
      if (secondaryBounds) {
        for (const area of config.areas) {
          available[area.id] = {};
          for (const item of byArea.get(area.id) ?? []) {
            if ((used.get(item.id) ?? 0) >= config.maxItemReuse) continue;
            const key = item.secondaryId ?? "";
            available[area.id]![key] = (available[area.id]?.[key] ?? 0) + 1;
          }
        }
      }
      const crossTargets =
        quota && secondaryBounds
          ? allocateSecondaryTargets({ primaryQuota: quota, bounds: secondaryBounds, available })
          : null;
      if (crossTargets) {
        for (const area of pickOrder) {
          const row = crossTargets[area.id] ?? {};
          const secondaryIds = Object.keys(row).sort();
          for (const secondaryId of secondaryIds) {
            const need = row[secondaryId] ?? 0;
            if (need <= 0) continue;
            const pool = (byArea.get(area.id) ?? []).filter((item) => item.secondaryId === secondaryId);
            const taken = takeItems(
              pool,
              need,
              used,
              config.maxItemReuse,
              selected,
              floors,
              undefined,
              blockContradictions,
              undefined,
              pairwise
            );
            if (!taken) {
              failedArea = `${area.id}/${secondaryId}`;
              failedNeed = need;
              break;
            }
            selected.push(...taken);
            counts[area.id] = (counts[area.id] ?? 0) + taken.length;
            for (const item of taken) {
              if (!item.secondaryId) continue;
              runningSecondary.set(item.secondaryId, (runningSecondary.get(item.secondaryId) ?? 0) + 1);
            }
          }
          if (failedArea) break;
        }
      }
      for (const area of pickOrder) {
        if (crossTargets) break;
        const need = quota[area.id] ?? 0;
        const signal = config.signalFloors?.find((floor) => floor.areaId === area.id);
        const pool = byArea.get(area.id) ?? [];
        const taken = config.shortfallFillAreaId
          ? takeUpTo(
              pool,
              need,
              used,
              config.maxItemReuse,
              selected,
              floors,
              signal,
              blockContradictions,
              undefined,
              pairwise
            )
          : takeItems(
              pool,
              need,
              used,
              config.maxItemReuse,
              selected,
              floors,
              signal,
              blockContradictions,
              secondaryPick,
              pairwise
            );
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
        for (const item of taken) {
          if (!item.secondaryId) continue;
          runningSecondary.set(item.secondaryId, (runningSecondary.get(item.secondaryId) ?? 0) + 1);
        }
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
          blockContradictions,
          undefined,
          pairwise
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
        const [areaId, secondaryId] = (failedArea ?? "").split("/");
        const have =
          (byArea.get(areaId) ?? [])
            .filter((item) => !secondaryId || item.secondaryId === secondaryId)
            .filter((item) => (used.get(item.id) ?? 0) < config.maxItemReuse).length;
        const checks = pairwise
          ? "near-duplicate, reuse, and pairwise-overlap checks"
          : "near-duplicate and reuse checks";
        stopReason = failedArea
          ? `Stopped at ${exams.length} full exams. ${failedArea} needed ${failedNeed} more items and had ${have} unused after ${checks}.`
          : `Stopped at ${exams.length} full exams. The form did not reach ${config.fullExamLength} items.`;
        break;
      }
      let placed = selected;
      if (secondaryAreas.length > 0 && secondaryBounds) {
        const balanced = balanceSecondary(
          selected,
          byArea,
          used,
          config.maxItemReuse,
          secondaryAreas,
          secondaryBounds,
          blockContradictions,
          pairwise
        );
        if (!balanced) {
          const missed = areasOutsidePlan(
            secondaryCountsOf(selected, secondaryAreas),
            selected.length,
            secondaryAreas
          );
          stopReason = `Stopped at ${exams.length} full exams. Secondary plan missed ${missed.join(", ") || "its bands"} after swap repair.`;
          break;
        }
        placed = balanced;
      }
      if (formExceedsCap(pairwise, placed.map((item) => item.id))) {
        stopReason = `Stopped at ${exams.length} full exams. The next form would share more than ${config.maxSharedItems} items with an earlier form.`;
        break;
      }
      for (const item of placed) used.set(item.id, (used.get(item.id) ?? 0) + 1);
      commitForm(pairwise, placed.map((item) => item.id));
      const areaCounts = Object.fromEntries(config.areas.map((area) => [area.id, 0]));
      for (const item of placed) areaCounts[item.areaId] = (areaCounts[item.areaId] ?? 0) + 1;
      const secondaryCounts =
        secondaryAreas.length > 0 ? secondaryCountsOf(placed, secondaryAreas) : {};
      const signalCounts: Record<string, number> = {};
      for (const item of placed) {
        for (const signal of item.signals) signalCounts[signal] = (signalCounts[signal] ?? 0) + 1;
      }
      exams.push({
        kind: "full",
        title: config.fullExamTitle(index, shortfall),
        itemIds: placed.map((item) => item.id),
        areaCounts,
        areasOutOfRange: areasOutsidePlan(areaCounts, config.fullExamLength, config.areas),
        secondaryCounts,
        secondaryOutOfRange:
          secondaryAreas.length > 0
            ? areasOutsidePlan(secondaryCounts, config.fullExamLength, secondaryAreas)
            : [],
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
          blockContradictions,
          undefined,
          pairwise
        );
        if (!taken) break;
        for (const item of taken) used.set(item.id, (used.get(item.id) ?? 0) + 1);
        commitForm(pairwise, taken.map((item) => item.id));
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
          secondaryCounts: {},
          secondaryOutOfRange: [],
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
      secondaryUnmappedItems: secondaryUnmapped,
      quota,
      secondaryQuota,
      secondaryPool,
      maxFullExamsByArea,
      secondaryMaxFullExamsByArea,
      limitingArea: quota ? limitingArea : null,
      secondaryLimitingArea: secondaryQuota ? secondaryLimitingArea : null,
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
