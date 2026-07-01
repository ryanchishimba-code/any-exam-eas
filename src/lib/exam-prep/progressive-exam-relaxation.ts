/**
 * Unified progressive relaxation for exam generation.
 *
 * Orchestrates three relaxation axes:
 * 1. Gather — DB pool quality gates (strict → structural → relaxed → minimal)
 * 2. Compose — selection/dedupe/uniqueness tiers
 * 3. Finalize — session spread + board-bar tiers (see finalize-exam-session)
 */
import type { BankItem } from "@/lib/question-bank";
import { QUESTION_BANK_SAMPLE_MAX_PULL } from "@/lib/question-bank-db";
import { timedExamGatherLadderForField } from "@/lib/exam-prep/exam-fill-gates";
import {
  candidateViolatesExamRules,
  enforceExamItemUniqueness,
} from "@/lib/exam-prep/exam-similarity";
import { sessionDedupeKey } from "@/lib/exam-prep/diverse-session-selection";
import {
  type ProgressiveComposeTier,
  resolveTierUniquenessPolicy,
} from "@/lib/exam-prep/progressive-compose";

/** Pool size for progressive gather — scales with exam length and dedupe headroom. */
export function resolveProgressivePoolLimit(limit: number): number {
  const base = Math.max(limit + 16, Math.ceil(limit * 1.35));
  const dedupeHeadroom = limit >= 100 ? Math.ceil(limit * 0.12) : Math.ceil(limit * 0.06);
  return Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, base + dedupeHeadroom);
}

/** Compose pulls need a wider pool than gather-only paths for blueprint balancing. */
export function resolveComposePoolLimit(numQuestions: number): number {
  return Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(
      numQuestions * 6,
      numQuestions + 200,
      resolveProgressivePoolLimit(numQuestions)
    )
  );
}

/** First DB pull size from expected gate pass rate (~92% for qaPassed clinical banks). */
export function resolveProgressivePullSize(limit: number, poolTarget: number): number {
  return Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(Math.ceil(poolTarget / 0.92), limit + 16, 32)
  );
}

/**
 * Map a compose tier to the highest gather-gate index it may use.
 * Higher compose tiers unlock progressively lower editorial bars in the bank pull.
 */
export function maxGatherTierIndexForComposeTier(
  fieldId: string,
  tier: ProgressiveComposeTier
): number {
  const ladder = timedExamGatherLadderForField(fieldId);
  const last = ladder.length - 1;
  if (tier.id === "exact-fill" || tier.id === "fill") return last;
  if (tier.useRelaxedGate) return Math.min(last, Math.max(2, last - 1));
  if (tier.id === "balanced") return Math.min(last, 1);
  return 0;
}

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  let a = seed >>> 0;
  const rng = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Whether the compose tier skips the final similarity/uniqueness enforcement pass. */
export function tierSkipsFinalUniqueness(tier: ProgressiveComposeTier): boolean {
  return tier.id === "fill" || tier.id === "exact-fill";
}

/**
 * Trim, optionally enforce uniqueness, then pad from pool until the exact count
 * is reached (or the pool is exhausted at this tier's policy).
 */
export function fillExamItemsToCount(
  items: BankItem[],
  pool: BankItem[],
  requested: number,
  tier: ProgressiveComposeTier,
  seed: number
): BankItem[] {
  const skipUniqueness = tierSkipsFinalUniqueness(tier);
  let out = items.slice(0, requested);

  if (!skipUniqueness) {
    out = enforceExamItemUniqueness(out, requested);
  }

  const usedKeys = new Set(out.map(sessionDedupeKey));
  const policy = resolveTierUniquenessPolicy(requested, pool, tier);
  const shuffledPool = shuffleWithSeed(pool, seed ^ 0x9e3779b9);

  for (const item of shuffledPool) {
    if (out.length >= requested) break;
    const key = sessionDedupeKey(item);
    if (usedKeys.has(key)) continue;
    if (!skipUniqueness && candidateViolatesExamRules(item, out, policy)) continue;
    out.push(item);
    usedKeys.add(key);
  }

  if (out.length < requested && tier.id === "exact-fill") {
    for (const item of shuffledPool) {
      if (out.length >= requested) break;
      const key = sessionDedupeKey(item);
      if (usedKeys.has(key)) continue;
      out.push(item);
      usedKeys.add(key);
    }
  }

  return out.slice(0, requested);
}
