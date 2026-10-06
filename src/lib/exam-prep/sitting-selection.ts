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
  questionFrame,
  sequentialSetId,
} from "@/lib/exam-prep/sitting-clusters";

/** Same question frame, different scenario. Lifted when the pool cannot fill. */
export const SITTING_FRAME_CAP = 2;
import { selectWithNgnFormatMix } from "@/lib/full-exam/ngn-format-mix";
import { NCLEX_CAT_NGN_TARGET_RATIO } from "@/lib/full-exam/nclex-cat-ngn";
import {
  isPublishedClinicalBankItem,
  reservePublishedClinicalItems,
} from "@/lib/full-exam/published-clinical-exam";

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
  /** Max rows that may share a lead-in frame. Null leaves the frame uncapped. */
  frameCap?: number | null;
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
  const unseenFirst = [
    ...ordered.filter((block) => block.members.some((item) => !isSeen(item, params.seenIds))),
    ...ordered.filter((block) => block.members.every((item) => isSeen(item, params.seenIds))),
  ];

  const selected: BankItem[] = [];
  const usedIds = new Set<string>();
  const frameCounts = new Map<string, number>();
  const frameCap = params.frameCap;
  const frameBlocked = (items: BankItem[]) => {
    if (frameCap == null) return false;
    const sample = items[0];
    if (!sample || sequentialSetId(sample)) return false;
    const frame = questionFrame(sample.question ?? "");
    if (frame === "other") return false;
    return (frameCounts.get(frame) ?? 0) >= frameCap;
  };
  const noteFrame = (items: BankItem[]) => {
    if (frameCap == null) return;
    const sample = items[0];
    if (!sample || sequentialSetId(sample)) return;
    const frame = questionFrame(sample.question ?? "");
    if (frame === "other") return;
    frameCounts.set(frame, (frameCounts.get(frame) ?? 0) + 1);
  };
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
    if (frameBlocked(representative)) continue;
    noteFrame(representative);
    take(representative);
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
      if (frameBlocked([item])) continue;
      relaxed = true;
      noteFrame([item]);
      take([item]);
    }
  }

  return {
    items: selected.slice(0, limit),
    relaxed,
    clusterCount: blocks.length,
  };
}

export type AssembledSitting = {
  items: BankItem[];
  relaxed: boolean;
  excludeSeenApplied: boolean;
};

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
}): AssembledSitting {
  const limit = Math.max(0, params.limit);
  const seed = params.seed ?? 0x51ed270b;
  const includeNgn = params.includeNgn !== false;
  const seen = params.seenIds;
  const clinical = includeNgn ? params.pool.filter((item) => isPublishedClinicalBankItem(item)) : [];
  const classic = clinical.length > 0 ? params.pool.filter((item) => !isPublishedClinicalBankItem(item)) : params.pool;
  const ngnTarget =
    clinical.length > 0 ? Math.min(limit, Math.max(8, Math.round(limit * NCLEX_CAT_NGN_TARGET_RATIO))) : 0;
  const reserved = reservePublishedClinicalItems({
    items: clinical,
    target: ngnTarget,
    seenIds: seen,
    seed,
  });
  const restLimit = Math.max(0, limit - reserved.length);

  const fillClassic = (frameCap: number | null, relax: boolean) =>
    selectSittingItems({
      pool: classic,
      limit: relax ? restLimit : Math.max(classic.length, restLimit),
      seenIds: seen,
      seed,
      relax,
      frameCap,
    });

  let classicPick = fillClassic(SITTING_FRAME_CAP, false);
  let relaxed = false;
  if (classicPick.items.length < restLimit) {
    const lifted = fillClassic(null, false);
    if (lifted.items.length > classicPick.items.length) classicPick = lifted;
  }
  if (classicPick.items.length < restLimit) {
    const filled = fillClassic(null, true);
    relaxed = filled.relaxed;
    if (filled.items.length > classicPick.items.length) classicPick = filled;
  }

  const applyMix = (source: BankItem[]) =>
    includeNgn && reserved.length === 0
      ? selectWithNgnFormatMix(source, restLimit, params.fieldId, seed)
      : source.slice(0, restLimit);

  let classicItems = applyMix(classicPick.items);
  if (classicItems.length < restLimit && reserved.length === 0) {
    const filled = selectSittingItems({
      pool: classic,
      limit: restLimit,
      seenIds: seen,
      seed,
      relax: true,
    });
    relaxed = filled.relaxed || relaxed;
    const mixed = applyMix(filled.items);
    classicItems = mixed.length >= classicItems.length ? mixed : filled.items.slice(0, restLimit);
  }

  const picked = [...reserved, ...classicItems].slice(0, limit);
  const excludeSeenApplied = Boolean(seen && seen.size > 0 && picked.length > 0);

  return { items: picked, relaxed, excludeSeenApplied };
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
