/**
 * Progressive threshold lowering for preset exam composition.
 * Starts strict; relaxes gates until the target count is met or tiers exhaust.
 */
import type { BankItem } from "@/lib/question-bank";
import type { ExamUniquenessPolicy } from "@/lib/exam-prep/exam-similarity";
import { resolveExamUniquenessPolicy } from "@/lib/exam-prep/exam-similarity";

export type ProgressiveComposeTier = {
  id: string;
  label: string;
  /** Minimum fraction of requested count required (1 = exact). */
  minFillRatio: number;
  /** Allow reusing bank rows already used in earlier preset exams in this batch. */
  allowCrossExamReuse: boolean;
  /** Dedupe identical clinical cases within one exam. */
  dedupeClinicalCases: boolean;
  /** Use diverse session selection + anti-cluster sequencing. */
  useDiverseSelection: boolean;
  /** Prefer relaxed serve gate over strict structural gate. */
  useRelaxedGate: boolean;
  /** Added to resolved maxPerConcept cap. */
  maxPerConceptBoost: number;
};

export const PROGRESSIVE_COMPOSE_TIERS: ProgressiveComposeTier[] = [
  {
    id: "strict",
    label: "Strict board bar",
    minFillRatio: 1,
    allowCrossExamReuse: false,
    dedupeClinicalCases: true,
    useDiverseSelection: true,
    useRelaxedGate: false,
    maxPerConceptBoost: 0,
  },
  {
    id: "balanced",
    label: "Balanced (95% fill, wider concepts)",
    minFillRatio: 0.95,
    allowCrossExamReuse: false,
    dedupeClinicalCases: true,
    useDiverseSelection: true,
    useRelaxedGate: false,
    maxPerConceptBoost: 3,
  },
  {
    id: "relaxed",
    label: "Relaxed gate + 90% fill",
    minFillRatio: 0.9,
    allowCrossExamReuse: false,
    dedupeClinicalCases: true,
    useDiverseSelection: true,
    useRelaxedGate: true,
    maxPerConceptBoost: 6,
  },
  {
    id: "reuse",
    label: "Cross-exam reuse allowed",
    minFillRatio: 0.9,
    allowCrossExamReuse: true,
    dedupeClinicalCases: true,
    useDiverseSelection: true,
    useRelaxedGate: true,
    maxPerConceptBoost: 8,
  },
  {
    id: "fill",
    label: "Fill mode (85%+, minimal filters)",
    minFillRatio: 0.85,
    allowCrossExamReuse: true,
    dedupeClinicalCases: false,
    useDiverseSelection: false,
    useRelaxedGate: true,
    maxPerConceptBoost: 12,
  },
];

/**
 * Live mock / full-exam compose ladder — same relaxation steps as batch preset
 * generation, but every tier must hit the exact requested count (50, 100, full).
 */
export const USER_FACING_PROGRESSIVE_TIERS: ProgressiveComposeTier[] =
  PROGRESSIVE_COMPOSE_TIERS.map((tier) => ({
    ...tier,
    minFillRatio: 1,
  }));

/** @deprecated Use USER_FACING_PROGRESSIVE_TIERS. */
export const NCLEX_USER_FACING_COMPOSE_TIERS = USER_FACING_PROGRESSIVE_TIERS;

export function userFacingComposeTiers(_fieldId: string): ProgressiveComposeTier[] {
  return USER_FACING_PROGRESSIVE_TIERS;
}

export function minQuestionsForTier(requested: number, tier: ProgressiveComposeTier): number {
  return Math.max(1, Math.ceil(requested * tier.minFillRatio));
}

export function resolveTierUniquenessPolicy(
  requested: number,
  pool: BankItem[],
  tier: ProgressiveComposeTier
): ExamUniquenessPolicy {
  const base = resolveExamUniquenessPolicy(requested, pool);
  return {
    ...base,
    maxPerConcept: base.maxPerConcept + tier.maxPerConceptBoost,
    blockOptionOverlapInSelection: tier.id !== "fill",
    blockOptionOverlapInAudit: tier.id !== "fill",
  };
}

/** Pick starting tier index — escalate when prior exams in batch struggled. */
export function startingTierIndex(failedStreak: number, examsComposed: number): number {
  if (failedStreak >= 3) return Math.min(4, 2 + failedStreak);
  if (examsComposed >= 30) return 2;
  if (examsComposed >= 50) return 3;
  return 0;
}

export function nextTierIndex(current: number): number | null {
  const next = current + 1;
  return next < PROGRESSIVE_COMPOSE_TIERS.length ? next : null;
}

export function tierByIndex(index: number): ProgressiveComposeTier {
  return PROGRESSIVE_COMPOSE_TIERS[Math.min(index, PROGRESSIVE_COMPOSE_TIERS.length - 1)]!;
}

/** Accept session when returned count meets tier minimum. */
export function sessionMeetsTierFill(
  returned: number,
  requested: number,
  tier: ProgressiveComposeTier
): boolean {
  return returned >= minQuestionsForTier(requested, tier);
}

export function trimToRequested(items: BankItem[], requested: number): BankItem[] {
  return items.slice(0, requested);
}

export function padToMinimum(
  selected: BankItem[],
  pool: BankItem[],
  minCount: number,
  usedInExam: Set<string>,
  keyFn: (item: BankItem) => string = (item) => item.id ?? ""
): BankItem[] {
  const out = [...selected];
  if (out.length >= minCount) return out;
  for (const item of pool) {
    const key = keyFn(item);
    if (!key || usedInExam.has(key)) continue;
    if (out.some((s) => keyFn(s) === key)) continue;
    out.push(item);
    usedInExam.add(key);
    if (out.length >= minCount) break;
  }
  return out;
}
