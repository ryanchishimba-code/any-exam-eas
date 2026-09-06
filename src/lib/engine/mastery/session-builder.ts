/**
 * Today session builder — wires into the existing quiz player queue.
 *
 * Default 40 items (20/40/60):
 * 1. shaky then learning, sort by (weight × distance below bar)
 * 2. ~20–30% unseen high-weight cells
 * 3. remainder = stable due for spacing
 * 4. max 3 consecutive from same cell
 * 5. if unseen/shaky and a high-yield card exists, primer before first item
 * 6. optional calcShareMin — keep math items in the set when tagged
 */

import type {
  BuiltTodaySession,
  CellState,
  SessionCandidate,
} from "./types";

const DEFAULT_SIZE = 40;
const MAX_CONSECUTIVE_SAME_CELL = 3;
const UNSEEN_SHARE_MIN = 0.2;
const UNSEEN_SHARE_MAX = 0.3;

function priorityRank(state: CellState): number {
  switch (state) {
    case "shaky":
      return 0;
    case "learning":
      return 1;
    case "primed":
      return 2;
    case "unseen":
      return 3;
    case "stable":
      return 4;
    case "exam_ready":
      return 5;
  }
}

function scoreWeak(c: SessionCandidate): number {
  return c.weight * c.distanceBelowBar;
}

function interleaveMaxConsecutive(
  ordered: SessionCandidate[],
  maxConsecutive: number
): SessionCandidate[] {
  // Bucket by cell, then round-robin so we never exceed maxConsecutive.
  const buckets = new Map<string, SessionCandidate[]>();
  for (const c of ordered) {
    const list = buckets.get(c.cellKey) ?? [];
    list.push(c);
    buckets.set(c.cellKey, list);
  }
  const keys = [...buckets.keys()];
  const out: SessionCandidate[] = [];
  let lastCell: string | null = null;
  let streak = 0;

  while (out.length < ordered.length) {
    let progressed = false;
    for (const key of keys) {
      const bucket = buckets.get(key);
      if (!bucket?.length) continue;
      if (lastCell === key && streak >= maxConsecutive) continue;
      const next = bucket.shift()!;
      out.push(next);
      if (next.cellKey === lastCell) streak += 1;
      else {
        lastCell = next.cellKey;
        streak = 1;
      }
      progressed = true;
      if (out.length >= ordered.length) break;
    }
    if (!progressed) {
      // All remaining are the same cell — append and stop enforcing.
      for (const key of keys) {
        const bucket = buckets.get(key);
        while (bucket?.length) out.push(bucket.shift()!);
      }
      break;
    }
  }
  return out;
}

function isCalcCandidate(c: SessionCandidate): boolean {
  return Boolean(c.tags?.calcFlags && c.tags.calcFlags.length > 0);
}

export function buildTodaySession(
  candidates: SessionCandidate[],
  opts?: {
    size?: number;
    /** Target share of calculation items (0–1), e.g. 0.15–0.2 for NAPLEX. */
    calcShareMin?: number;
  }
): BuiltTodaySession {
  const size = opts?.size ?? DEFAULT_SIZE;
  if (candidates.length === 0) {
    return { questionIds: [], primers: [], cellKeys: [], size: 0 };
  }

  const shakyLearning = candidates
    .filter((c) => c.cellState === "shaky" || c.cellState === "learning")
    .sort(
      (a, b) =>
        scoreWeak(b) - scoreWeak(a) ||
        priorityRank(a.cellState) - priorityRank(b.cellState)
    );

  const unseenHigh = candidates
    .filter((c) => c.cellState === "unseen" || c.cellState === "primed")
    .sort((a, b) => b.weight - a.weight || scoreWeak(b) - scoreWeak(a));

  const stableDue = candidates
    .filter((c) => c.cellState === "stable" && c.dueForSpacing)
    .sort((a, b) => scoreWeak(b) - scoreWeak(a));

  const picked: SessionCandidate[] = [];
  const used = new Set<string>();

  const take = (list: SessionCandidate[], n: number) => {
    for (const c of list) {
      if (picked.length >= n) break;
      if (used.has(c.questionId)) continue;
      used.add(c.questionId);
      picked.push(c);
    }
  };

  const unseenTarget = Math.round(
    size * (UNSEEN_SHARE_MIN + (UNSEEN_SHARE_MAX - UNSEEN_SHARE_MIN) / 2)
  );
  const primaryTarget = Math.max(0, size - unseenTarget);
  take(shakyLearning, primaryTarget);
  take(unseenHigh, size);
  take(stableDue, size);

  if (picked.length < size) {
    const rest = [...candidates].sort(
      (a, b) =>
        priorityRank(a.cellState) - priorityRank(b.cellState) ||
        scoreWeak(b) - scoreWeak(a)
    );
    take(rest, size);
  }

  const calcShare = opts?.calcShareMin;
  if (calcShare && calcShare > 0) {
    const calcTarget = Math.max(1, Math.round(size * calcShare));
    const currentCalc = picked.filter(isCalcCandidate).length;
    if (currentCalc < calcTarget) {
      const need = calcTarget - currentCalc;
      const calcPool = candidates
        .filter((c) => isCalcCandidate(c) && !used.has(c.questionId))
        .sort((a, b) => scoreWeak(b) - scoreWeak(a) || b.weight - a.weight);
      for (let i = 0; i < need && calcPool.length > 0; i++) {
        const swapIdx = [...picked]
          .map((c, idx) => ({ c, idx }))
          .reverse()
          .find((x) => !isCalcCandidate(x.c))?.idx;
        const next = calcPool.shift();
        if (swapIdx == null || !next) break;
        used.delete(picked[swapIdx]!.questionId);
        used.add(next.questionId);
        picked[swapIdx] = next;
      }
    }
  }

  const ordered = interleaveMaxConsecutive(
    picked.slice(0, size),
    MAX_CONSECUTIVE_SAME_CELL
  );

  const primers: BuiltTodaySession["primers"] = [];
  const primedCells = new Set<string>();
  for (const c of ordered) {
    if (primedCells.has(c.cellKey)) continue;
    primedCells.add(c.cellKey);
    const needsPrimer =
      (c.cellState === "unseen" || c.cellState === "shaky") &&
      Boolean(c.tags?.primerCardId || c.highYield);
    if (needsPrimer && c.tags?.primerCardId) {
      primers.push({
        beforeQuestionId: c.questionId,
        cardId: c.tags.primerCardId,
        cellKey: c.cellKey,
      });
    }
  }

  return {
    questionIds: ordered.map((c) => c.questionId),
    primers,
    cellKeys: [...new Set(ordered.map((c) => c.cellKey))],
    size: ordered.length,
  };
}

export function resolveTodaySize(requested?: number): 20 | 40 | 60 {
  if (requested === 20 || requested === 60) return requested;
  return 40;
}
