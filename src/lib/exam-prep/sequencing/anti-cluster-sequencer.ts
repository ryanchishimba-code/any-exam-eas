/**
 * Anti-clustering sequencer.
 *
 * Greedy constraint-aware placement that maximizes "distance" between similar
 * items, followed by a targeted repair pass that eliminates correct-answer
 * streaks. Exam-agnostic — callers supply a `toSequenceItem` adapter.
 *
 * Constraint priority (mirrors board-sequencing best practice):
 *   1. Major domain spreading (coarse interleave)
 *   2. Concept / sub-topic spreading
 *   3. Answer-key balance (strictly forbid runs of 3+)
 *   4. Difficulty mixing (no two hard items adjacent)
 *   5. Format variety
 */

import {
  DEFAULT_SEQUENCING_CONFIG,
  type SequenceItem,
  type SequencingConfig,
  type SequencingReport,
  type SequencingResult,
} from "./types";

/** Deterministic PRNG so sequencing is reproducible (and testable). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function trailingAnswerRun(order: SequenceItem[]): { answer: string | null; run: number } {
  if (order.length === 0) return { answer: null, run: 0 };
  const answer = order[order.length - 1].answer;
  let run = 0;
  for (let i = order.length - 1; i >= 0; i--) {
    if (order[i].answer === answer) run += 1;
    else break;
  }
  return { answer, run };
}

const PENALTY = {
  domain: 100,
  concept: 40,
  answerStreak: 1000,
  adjacentHard: 60,
  formatRepeat: 10,
  scarcityBonus: 0.5,
} as const;

/** Sequence an already-selected item set into an anti-clustered delivery order. */
export function sequenceItems<T>(
  items: T[],
  toSequenceItem: (item: T) => SequenceItem,
  config: Partial<SequencingConfig> = {},
  seed = 0x9e3779b9
): SequencingResult<T> {
  const cfg: SequencingConfig = { ...DEFAULT_SEQUENCING_CONFIG, ...config };
  const rng = mulberry32(seed);

  const metas = items.map(toSequenceItem);
  const n = items.length;
  if (n <= 1) {
    return { ordered: [...items], report: buildReport(metas, cfg) };
  }

  const remaining = new Set<number>(metas.map((_, i) => i));
  const remainingByDomain = new Map<string, number>();
  for (const m of metas) remainingByDomain.set(m.domain, (remainingByDomain.get(m.domain) ?? 0) + 1);

  const orderIdx: number[] = [];
  const placedMetas: SequenceItem[] = [];
  const lastDomainPos = new Map<string, number>();
  const lastConceptPos = new Map<string, number>();

  for (let pos = 0; pos < n; pos++) {
    const tail = trailingAnswerRun(placedMetas);
    const prev = placedMetas[placedMetas.length - 1];
    const prevHard = prev ? prev.difficulty >= cfg.hardDifficultyThreshold : false;

    let bestIdx = -1;
    let bestPenalty = Number.POSITIVE_INFINITY;

    for (const idx of remaining) {
      const c = metas[idx];
      let penalty = 0;

      const ld = lastDomainPos.get(c.domain);
      if (ld !== undefined) {
        const gap = pos - ld;
        if (gap < cfg.domainMinGap) penalty += (cfg.domainMinGap - gap) * PENALTY.domain;
      }

      for (const concept of c.concepts) {
        const lc = lastConceptPos.get(concept);
        if (lc !== undefined) {
          const gap = pos - lc;
          if (gap < cfg.conceptMinGap) penalty += (cfg.conceptMinGap - gap) * PENALTY.concept;
        }
      }

      if (tail.answer !== null && tail.answer === c.answer && tail.run + 1 > cfg.maxAnswerStreak) {
        penalty += PENALTY.answerStreak;
      }

      if (cfg.forbidAdjacentHard && prevHard && c.difficulty >= cfg.hardDifficultyThreshold) {
        penalty += PENALTY.adjacentHard;
      }

      if (prev && prev.format === c.format) penalty += PENALTY.formatRepeat;

      // Place scarcer-but-still-plentiful domains a touch earlier to avoid stranding
      // a single domain at the tail (which would force clustering).
      penalty -= (remainingByDomain.get(c.domain) ?? 0) * PENALTY.scarcityBonus;

      // Deterministic jitter for stable tie-breaking + variety across seeds.
      penalty += rng() * 0.01;

      if (penalty < bestPenalty) {
        bestPenalty = penalty;
        bestIdx = idx;
      }
    }

    const chosen = metas[bestIdx];
    orderIdx.push(bestIdx);
    placedMetas.push(chosen);
    remaining.delete(bestIdx);
    remainingByDomain.set(chosen.domain, (remainingByDomain.get(chosen.domain) ?? 1) - 1);
    lastDomainPos.set(chosen.domain, pos);
    for (const concept of chosen.concepts) lastConceptPos.set(concept, pos);
  }

  // Repair pass: composite-cost hill-climb that breaks answer streaks / adjacent
  // hard pairs / domain-gap violations without trading one for another.
  localRepair(orderIdx, metas, cfg);

  const orderedMetas = orderIdx.map((i) => metas[i]);
  return {
    ordered: orderIdx.map((i) => items[i]),
    report: buildReport(orderedMetas, cfg),
  };
}

/** Weighted total of remaining constraint violations + the earliest offender. */
function scanViolations(
  order: SequenceItem[],
  cfg: SequencingConfig
): { cost: number; firstViolator: number } {
  let answerViol = 0;
  let domainViol = 0;
  let adjHard = 0;
  let conceptViol = 0;
  let earliest = Number.POSITIVE_INFINITY;

  let run = 1;
  const lastDomain = new Map<string, number>();
  const lastConcept = new Map<string, number>();

  order.forEach((item, pos) => {
    if (pos > 0) {
      const prev = order[pos - 1];
      if (item.answer === prev.answer) {
        run += 1;
        if (run > cfg.maxAnswerStreak) {
          answerViol += 1;
          earliest = Math.min(earliest, pos);
        }
      } else {
        run = 1;
      }
      if (
        cfg.forbidAdjacentHard &&
        prev.difficulty >= cfg.hardDifficultyThreshold &&
        item.difficulty >= cfg.hardDifficultyThreshold
      ) {
        adjHard += 1;
        earliest = Math.min(earliest, pos);
      }
    }

    const ld = lastDomain.get(item.domain);
    if (ld !== undefined && pos - ld < cfg.domainMinGap) {
      domainViol += 1;
      earliest = Math.min(earliest, pos);
    }
    lastDomain.set(item.domain, pos);

    for (const concept of item.concepts) {
      const lc = lastConcept.get(concept);
      if (lc !== undefined && pos - lc < cfg.conceptMinGap) {
        conceptViol += 1;
        earliest = Math.min(earliest, pos);
      }
      lastConcept.set(concept, pos);
    }
  });

  const cost = answerViol * 1000 + domainViol * 120 + adjHard * 40 + conceptViol;
  return { cost, firstViolator: Number.isFinite(earliest) ? earliest : -1 };
}

function localRepair(orderIdx: number[], metas: SequenceItem[], cfg: SequencingConfig): void {
  const view = () => orderIdx.map((i) => metas[i]);
  const limit = orderIdx.length * 4;
  let guard = 0;

  let current = scanViolations(view(), cfg);
  while (current.cost > 0 && current.firstViolator >= 0 && guard++ < limit) {
    // Pivot on the earliest offender and its predecessor (the two members of an
    // adjacency violation), so the climber can escape single-position plateaus.
    const pivots = current.firstViolator > 0
      ? [current.firstViolator, current.firstViolator - 1]
      : [current.firstViolator];

    let bestP = -1;
    let bestJ = -1;
    let bestCost = current.cost;

    for (const p of pivots) {
      for (let j = 0; j < orderIdx.length; j++) {
        if (j === p) continue;
        [orderIdx[p], orderIdx[j]] = [orderIdx[j], orderIdx[p]];
        const c = scanViolations(view(), cfg).cost;
        [orderIdx[p], orderIdx[j]] = [orderIdx[j], orderIdx[p]];
        if (c < bestCost) {
          bestCost = c;
          bestP = p;
          bestJ = j;
        }
      }
    }

    if (bestJ < 0) break; // no improving swap available
    [orderIdx[bestP], orderIdx[bestJ]] = [orderIdx[bestJ], orderIdx[bestP]];
    current = scanViolations(view(), cfg);
  }
}

function buildReport(order: SequenceItem[], cfg: SequencingConfig): SequencingReport {
  const answerDistribution: Record<string, number> = {};
  let longestAnswerStreak = order.length > 0 ? 1 : 0;
  let currentRun = order.length > 0 ? 1 : 0;
  let adjacentHardPairs = 0;

  const lastDomainAt = new Map<string, number>();
  const lastConceptAt = new Map<string, number>();
  let domainMinSeparation = Number.POSITIVE_INFINITY;
  let conceptMinSeparation = Number.POSITIVE_INFINITY;
  let domainGapViolations = 0;
  let conceptGapViolations = 0;

  order.forEach((item, pos) => {
    answerDistribution[item.answer] = (answerDistribution[item.answer] ?? 0) + 1;

    if (pos > 0) {
      const prev = order[pos - 1];
      if (item.answer === prev.answer) {
        currentRun += 1;
        longestAnswerStreak = Math.max(longestAnswerStreak, currentRun);
      } else {
        currentRun = 1;
      }
      if (
        cfg.forbidAdjacentHard &&
        prev.difficulty >= cfg.hardDifficultyThreshold &&
        item.difficulty >= cfg.hardDifficultyThreshold
      ) {
        adjacentHardPairs += 1;
      }
    }

    const ld = lastDomainAt.get(item.domain);
    if (ld !== undefined) {
      const gap = pos - ld;
      domainMinSeparation = Math.min(domainMinSeparation, gap);
      if (gap < cfg.domainMinGap) domainGapViolations += 1;
    }
    lastDomainAt.set(item.domain, pos);

    for (const concept of item.concepts) {
      const lc = lastConceptAt.get(concept);
      if (lc !== undefined) {
        const gap = pos - lc;
        conceptMinSeparation = Math.min(conceptMinSeparation, gap);
        if (gap < cfg.conceptMinGap) conceptGapViolations += 1;
      }
      lastConceptAt.set(concept, pos);
    }
  });

  const notes: string[] = [];
  if (longestAnswerStreak > cfg.maxAnswerStreak) {
    notes.push(
      `Could not fully break answer streaks (longest ${longestAnswerStreak}); answer-key diversity in the pool is limited.`
    );
  }
  if (domainGapViolations > 0) {
    notes.push(
      `${domainGapViolations} domain-spacing violation(s) — a domain has too many items for the requested length to fully separate.`
    );
  }
  if (conceptGapViolations > 0) {
    notes.push(
      `${conceptGapViolations} concept-spacing violation(s) within the ${cfg.conceptMinGap}-position window (tolerated).`
    );
  }
  if (adjacentHardPairs > 0) {
    notes.push(`${adjacentHardPairs} adjacent hard–hard pair(s) remain.`);
  }
  if (notes.length === 0) notes.push("All anti-clustering constraints satisfied.");

  const passed =
    longestAnswerStreak <= cfg.maxAnswerStreak &&
    domainGapViolations === 0 &&
    (!cfg.forbidAdjacentHard || adjacentHardPairs === 0);

  return {
    total: order.length,
    domainMinSeparation,
    conceptMinSeparation,
    answerDistribution,
    longestAnswerStreak,
    adjacentHardPairs,
    domainGapViolations,
    conceptGapViolations,
    passed,
    notes,
  };
}
