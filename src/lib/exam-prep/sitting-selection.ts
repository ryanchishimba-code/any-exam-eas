/**
 * Sitting assembly: at most one item from each template/near-duplicate cluster,
 * preferring rows this student has not already seen. When the eligible pool
 * cannot fill the length, a later pass may take another row from a cluster.
 * Eligibility and hidden-item rules stay with the caller — this only chooses
 * among rows already allowed to serve.
 */
import type { BankItem } from "@/lib/question-bank";
import {
  assignSittingClusters,
  sequentialSetId,
} from "@/lib/exam-prep/sitting-clusters";
import {
  narrowTopicKeyFromBankItem,
  narrowTopicShareCap,
  orderWithTopicGap,
} from "@/lib/exam-prep/narrow-topic";
import {
  enforceEntityAndDosageCap,
  isPharmacyCalculationItem,
  pharmacyCalculationQuota,
  sittingCapLimits,
  type CapRejectionStats,
} from "@/lib/exam-prep/entity-cap";

export { isPharmacyCalculationItem, pharmacyCalculationQuota };
import { selectWithNgnFormatMix } from "@/lib/full-exam/ngn-format-mix";
import { deferClinicalStandalones, shapeNclexBankSitting } from "@/lib/full-exam/nclex-exam-shape";
import { composeWithinClientNeeds } from "@/lib/exam-prep/nclex-client-needs-quota";
import { isPharmacyBlueprintField, rankSittingByBlueprint } from "@/lib/exam-prep/sitting-blueprint";

export type SittingSelection = {
  items: BankItem[];
  /** True when filling the length required a second row from some cluster. */
  relaxed: boolean;
  clusterCount: number;
};

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const random = mulberry32(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function stepIndex(item: BankItem): number {
  const payload = item.ngnPayload;
  if (!payload || typeof payload !== "object") return 0;
  const step = payload.stepIndex;
  return typeof step === "number" ? step : 0;
}

function isSeen(item: BankItem, seenIds: ReadonlySet<string> | undefined): boolean {
  const id = item.id?.trim();
  return Boolean(id && seenIds?.has(id));
}

type ClusterBlock = {
  id: string;
  members: BankItem[];
  sequential: boolean;
};

function buildBlocks(pool: readonly BankItem[]): ClusterBlock[] {
  const clusters = assignSittingClusters(pool);
  const groups = new Map<string, BankItem[]>();
  pool.forEach((item, index) => {
    const id = clusters[index]!;
    const list = groups.get(id) ?? [];
    list.push(item);
    groups.set(id, list);
  });

  const blocks: ClusterBlock[] = [];
  for (const [id, members] of groups) {
    const sequential = members.some((item) => sequentialSetId(item));
    const ordered = sequential ? [...members].sort((a, b) => stepIndex(a) - stepIndex(b)) : members;
    blocks.push({ id, members: ordered, sequential });
  }
  return blocks;
}

function pickRepresentative(
  block: ClusterBlock,
  seenIds: ReadonlySet<string> | undefined,
  random: () => number
): BankItem[] {
  if (block.sequential) return block.members;
  const unseen = block.members.filter((item) => !isSeen(item, seenIds));
  const pool = unseen.length > 0 ? unseen : block.members;
  const bestScore = Math.max(...pool.map((item) => item.qualityScore ?? 0));
  const tied = pool.filter((item) => (item.qualityScore ?? 0) === bestScore);
  const index = Math.floor(random() * tied.length);
  return [tied[index]!];
}

function dedupeById(items: readonly BankItem[]): BankItem[] {
  const seen = new Set<string>();
  const out: BankItem[] = [];
  for (const item of items) {
    const id = item.id?.trim() || `${item.question}:${(item.options ?? []).join("|")}`;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(item);
  }
  return out;
}

export function countSittingClusters(items: readonly BankItem[]): number {
  return new Set(assignSittingClusters(items)).size;
}

/**
 * Choose up to `limit` rows. The first pass takes one representative (or one
 * whole sequential case) per cluster, unseen before seen. `relax: false` stops
 * there even if the sitting is short.
 */
export function selectSittingItems(params: {
  pool: readonly BankItem[];
  limit: number;
  seenIds?: ReadonlySet<string>;
  seed?: number;
  relax?: boolean;
}): SittingSelection {
  const limit = Math.max(0, params.limit);
  const pool = dedupeById(params.pool);
  const blocks = buildBlocks(pool);
  if (limit === 0 || blocks.length === 0) {
    return { items: [], relaxed: false, clusterCount: blocks.length };
  }

  const seed = params.seed ?? 0x51ed270b;
  const random = mulberry32(seed);
  const ordered = shuffleWithSeed(blocks, seed);
  const topicCap = narrowTopicShareCap(limit);
  const topicCounts = new Map<string, number>();
  const topicBlocked = (item: BankItem) => {
    const key = narrowTopicKeyFromBankItem(item);
    if (!key) return false;
    return (topicCounts.get(key) ?? 0) >= topicCap;
  };
  const noteTopic = (item: BankItem) => {
    const key = narrowTopicKeyFromBankItem(item);
    if (!key) return;
    topicCounts.set(key, (topicCounts.get(key) ?? 0) + 1);
  };
  const unseenFirst = [
    ...ordered.filter((block) => block.members.some((item) => !isSeen(item, params.seenIds))),
    ...ordered.filter((block) => block.members.every((item) => isSeen(item, params.seenIds))),
  ];

  const selected: BankItem[] = [];
  const usedIds = new Set<string>();
  const take = (items: BankItem[]) => {
    for (const item of items) {
      const id = item.id?.trim();
      if (id && usedIds.has(id)) continue;
      if (id) usedIds.add(id);
      selected.push(item);
    }
  };

  for (const block of unseenFirst) {
    if (selected.length >= limit) break;
    const representative = pickRepresentative(block, params.seenIds, random);
    if (block.sequential && selected.length + representative.length > limit) continue;
    if (!block.sequential && representative.some((item) => topicBlocked(item))) continue;
    take(representative);
    if (!block.sequential) representative.forEach(noteTopic);
  }

  let relaxed = false;
  if (params.relax !== false && selected.length < limit) {
    const leftovers: BankItem[] = [];
    for (const block of unseenFirst) {
      if (block.sequential) continue;
      for (const item of block.members) {
        const id = item.id?.trim();
        if (id && usedIds.has(id)) continue;
        leftovers.push(item);
      }
    }
    const unseenLeft = leftovers.filter((item) => !isSeen(item, params.seenIds));
    const seenLeft = leftovers.filter((item) => isSeen(item, params.seenIds));
    for (const item of [...shuffleWithSeed(unseenLeft, seed ^ 0x9e37), ...shuffleWithSeed(seenLeft, seed ^ 0x85eb)]) {
      if (selected.length >= limit) break;
      if (topicBlocked(item)) continue;
      relaxed = true;
      take([item]);
      noteTopic(item);
    }
  }

  const spread = orderWithTopicGap(selected, (item) =>
    sequentialSetId(item) ? null : narrowTopicKeyFromBankItem(item)
  );
  return {
    items: spread.slice(0, limit),
    relaxed,
    clusterCount: blocks.length,
  };
}

function clusterLookup(pool: readonly BankItem[]): (item: BankItem) => string | undefined {
  const clusterIds = assignSittingClusters([...pool]);
  const byItem = new Map<BankItem, string>();
  const byId = new Map<string, string>();
  pool.forEach((item, index) => {
    const cluster = clusterIds[index] ?? `pool-${index}`;
    byItem.set(item, cluster);
    const id = item.id?.trim();
    if (id) byId.set(id, cluster);
  });
  return (item) => byItem.get(item) ?? (item.id ? byId.get(item.id.trim()) : undefined);
}

function enforceNarrowTopicCap(
  items: readonly BankItem[],
  pool: readonly BankItem[],
  limit: number,
  cap = narrowTopicShareCap(limit)
): BankItem[] {
  const counts = new Map<string, number>();
  const kept: BankItem[] = [];
  const used = new Set<string>();
  const clusterOf = clusterLookup(pool);
  const usedClusters = new Set<string>();
  const consider = (item: BankItem): boolean => {
    const id = item.id?.trim();
    if (id && used.has(id)) return false;
    const sequential = Boolean(sequentialSetId(item));
    const cluster = sequential ? undefined : clusterOf(item);
    if (cluster && usedClusters.has(cluster)) return false;
    const key = sequential ? null : narrowTopicKeyFromBankItem(item);
    if (key && (counts.get(key) ?? 0) >= cap) return false;
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
    if (cluster) usedClusters.add(cluster);
    if (id) used.add(id);
    kept.push(item);
    return true;
  };
  for (const item of items) {
    if (kept.length >= limit) break;
    consider(item);
  }
  if (kept.length < limit) {
    for (const item of pool) {
      if (kept.length >= limit) break;
      consider(item);
    }
  }
  return kept.slice(0, limit);
}

export type AssembledSitting = {
  items: BankItem[];
  relaxed: boolean;
  excludeSeenApplied: boolean;
  capStats: CapRejectionStats;
};

/** Stable 32-bit seed from a session id so calc placement survives refresh. */
export function sessionOrderSeed(sessionId: string): number {
  let hash = 2166136261;
  for (let i = 0; i < sessionId.length; i++) {
    hash ^= sessionId.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Place pharmacy numeric-entry calculations through the sitting.
 * Positions are deterministic for a seed, so the same session id keeps the
 * same order on refresh and resume.
 */
export function spreadPharmacyNumericEntries(items: readonly BankItem[], seed: number): BankItem[] {
  const calcs: BankItem[] = [];
  const rest: BankItem[] = [];
  for (const item of items) {
    if (isPharmacyCalculationItem(item)) calcs.push(item);
    else rest.push(item);
  }
  if (calcs.length === 0 || rest.length === 0) return [...items];
  const total = items.length;
  const random = mulberry32(seed ^ 0x9e3779b9);
  const used = new Set<number>();
  const span = total / calcs.length;
  const positions: number[] = [];
  for (let i = 0; i < calcs.length; i++) {
    const start = Math.floor(i * span);
    const end = Math.min(total - 1, Math.max(start, Math.ceil((i + 1) * span) - 1));
    let slot = start + Math.floor(random() * (end - start + 1));
    let guard = 0;
    while (used.has(slot) && guard < total) {
      slot = (slot + 1) % total;
      guard += 1;
    }
    used.add(slot);
    positions.push(slot);
  }
  positions.sort((left, right) => left - right);
  const out: BankItem[] = new Array(total);
  calcs.forEach((item, index) => {
    out[positions[index]!] = item;
  });
  let restIndex = 0;
  for (let i = 0; i < total; i++) {
    if (out[i]) continue;
    out[i] = rest[restIndex]!;
    restIndex += 1;
  }
  return out;
}

/**
 * A case counts as attempted when any of its steps is in the seen set.
 * Those cases sort after unseen cases. Equal stamps shuffle together.
 */
function caseStampsFromSeen(
  pool: readonly BankItem[],
  seenIds: ReadonlySet<string> | undefined
): Map<string, number> | undefined {
  if (!seenIds || seenIds.size === 0) return undefined;
  const stamps = new Map<string, number>();
  for (const item of pool) {
    const setId = sequentialSetId(item);
    const id = item.id?.trim();
    if (!setId || !id || !seenIds.has(id)) continue;
    if (!stamps.has(setId)) stamps.set(setId, 1);
  }
  return stamps.size > 0 ? stamps : undefined;
}

/**
 * Final pass for a timed or full exam: cluster cap, unseen preference, then
 * the blueprint NGN mix when this field has one.
 */
export function finalizeAssembledSitting(params: {
  pool: readonly BankItem[];
  limit: number;
  fieldId: string;
  seenIds?: ReadonlySet<string>;
  seed?: number;
  includeNgn?: boolean;
  /** Full NCLEX exam mode: 3 cases before item 86, bow-tie and trend only after. */
  nclexExamMode?: boolean;
}): AssembledSitting {
  const limit = Math.max(0, params.limit);
  const seed = params.seed ?? 0x51ed270b;
  const includeNgn = params.includeNgn !== false;
  const seen = params.seenIds;

  const rankedPool = rankSittingByBlueprint(params.pool, limit, params.fieldId, seed);
  const diverse = selectSittingItems({
    pool: rankedPool,
    limit: Math.max(params.pool.length, limit),
    seenIds: seen,
    seed,
    relax: false,
  });

  const caseLastAttemptedAt = caseStampsFromSeen(params.pool, seen);
  const applyMix = (source: BankItem[]) =>
    includeNgn
      ? selectWithNgnFormatMix(source, limit, params.fieldId, seed, caseLastAttemptedAt)
      : source.slice(0, limit);

  let picked = applyMix(rankSittingByBlueprint(diverse.items, limit, params.fieldId, seed ^ 0x9e37));
  let relaxed = false;

  if (picked.length < limit) {
    const filled = selectSittingItems({
      pool: params.pool,
      limit,
      seenIds: seen,
      seed,
      relax: true,
    });
    relaxed = filled.relaxed;
    const mixed = applyMix(filled.items);
    picked = mixed.length >= picked.length ? mixed : filled.items.slice(0, limit);
  }

  const excludeSeenApplied = Boolean(seen && seen.size > 0 && picked.length > 0);

  let chosen = picked;
  let capStats: CapRejectionStats = { poolSize: params.pool.length, kept: 0, rejections: {}, relaxLevel: 0 };
  let strict: { kept: number; rejections: Record<string, number> } | null = null;
  const relaxCeiling = isPharmacyBlueprintField(params.fieldId) ? 7 : 9;
  for (let level = 0; level <= relaxCeiling; level++) {
    const limits = sittingCapLimits(limit, level);
    const narrowed = enforceNarrowTopicCap(picked, rankedPool, limit, limits.narrowCap);
    const stats: CapRejectionStats = {
      poolSize: params.pool.length,
      kept: 0,
      rejections: {},
      relaxLevel: level,
    };
    const capped = enforceEntityAndDosageCap(
      narrowed,
      rankedPool,
      limit,
      params.fieldId,
      seen,
      stats,
      limits
    );
    if (level === 0) strict = { kept: stats.kept, rejections: { ...stats.rejections } };
    chosen = capped;
    capStats = stats;
    if (capped.length >= limit) break;
  }

  const gapped = orderWithTopicGap(chosen, (item) =>
    sequentialSetId(item) ? null : narrowTopicKeyFromBankItem(item)
  ).slice(0, limit);
  const orderedBase = params.fieldId === "pharmacy" ? spreadPharmacyNumericEntries(gapped, seed) : gapped;
  const shaped =
    params.nclexExamMode && params.fieldId === "nursing" && limit >= 85
      ? shapeNclexBankSitting({
          pool: params.pool,
          preferred: orderedBase,
          limit,
          seed,
          caseLastAttemptedAt,
        })
      : null;
  const orderedBaseFinal = shaped && shaped.length === limit ? shaped : orderedBase;
  const quota =
    params.fieldId === "nursing" && orderedBaseFinal.length === limit
      ? composeWithinClientNeeds({
          preferred: orderedBaseFinal,
          pool: params.pool,
          limit,
          seed,
        })
      : null;
  const ordered =
    params.nclexExamMode && params.fieldId === "nursing" && limit >= 85
      ? deferClinicalStandalones(quota ?? orderedBaseFinal)
      : (quota ?? orderedBaseFinal);
  capStats.kept = ordered.length;
  capStats.strict = strict ?? { kept: ordered.length, rejections: { ...capStats.rejections } };
  return { items: ordered, relaxed, excludeSeenApplied, capStats };
}

/**
 * Serve a stored form at the length the launcher advertised.
 *
 * `selectSittingItems` keeps the narrow-topic cap at its strict share (4 on a
 * 135-item AANP form) and never climbs the sitting ladder. A form that is
 * stored as 135 can come back as 126, and the start route then shrinks the
 * clock to that shorter delivery. The ladder already raises the narrow cap
 * (and, off pharmacy, cluster/case caps) without turning off eligibility.
 * Use the strict picker when it fills. Otherwise take a full ladder result.
 * A pool that still cannot fill returns null so the caller composes fresh
 * instead of launching the short sitting.
 */
export function selectStoredFormSitting(params: {
  pool: readonly BankItem[];
  limit: number;
  fieldId: string;
  seenIds?: ReadonlySet<string>;
  seed?: number;
}): BankItem[] | null {
  const limit = Math.max(0, params.limit);
  if (limit === 0) return [];
  const strict = selectSittingItems({
    pool: params.pool,
    limit,
    seenIds: params.seenIds,
    seed: params.seed,
    relax: true,
  });
  if (strict.items.length === limit) return strict.items;
  const finalized = finalizeAssembledSitting({
    pool: params.pool,
    limit,
    fieldId: params.fieldId,
    seenIds: params.seenIds,
    seed: params.seed,
    includeNgn: params.fieldId === "nursing",
  });
  if (finalized.items.length !== limit) return null;
  return finalized.items;
}

/**
 * A stored form whose unseen, one-per-cluster rows cannot cover most of the
 * length should yield to a fresh assembly. A form the student asked for by
 * number stays.
 */
export function storedFormNeedsFreshAssembly(params: {
  items: readonly BankItem[];
  limit: number;
  seenIds?: ReadonlySet<string>;
  namedForm: boolean;
}): boolean {
  if (params.namedForm) return false;
  const fresh = selectSittingItems({
    pool: params.items,
    limit: params.limit,
    seenIds: params.seenIds,
    relax: false,
    seed: 1,
  });
  const seen = params.seenIds;
  const unseen = fresh.items.filter((item) => {
    const id = item.id?.trim();
    return !id || !seen?.has(id);
  }).length;
  return unseen < Math.ceil(params.limit * 0.7);
}
