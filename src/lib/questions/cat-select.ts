/** Pure helpers for rule-based CAT item selection (practice only). */

import { narrowTopicShareCap } from "@/lib/exam-prep/narrow-topic";
import {
  difficultyForQuestion,
  targetDifficulty,
  type CatDifficulty,
  type CatSessionState,
} from "./cat-engine";

export type CatSelectableItem = {
  id: string;
  difficultyBand: CatDifficulty;
  /** Alternate-format item the practice CAT can score right/wrong. */
  ngn?: boolean;
  setId?: string;
  stepIndex?: number;
  /** Narrow clinical topic. Used to avoid a third item in a row and a topic pile-up. */
  narrowTopic?: string | null;
};

export type CatFormatHint = {
  /** Share of delivered items that should be NGN when the pool has any. 0 disables. */
  ngnTargetRatio?: number;
  delivered?: ReadonlyArray<
    Pick<CatSelectableItem, "id" | "ngn" | "setId" | "stepIndex" | "narrowTopic">
  >;
};

/** Map bank difficulty strings (or index fallback) onto CAT bands. */
export function mapDifficultyToCatBand(
  difficulty: string | undefined | null,
  fallbackIndex: number
): CatDifficulty {
  const raw = (difficulty ?? "").trim().toLowerCase();
  if (raw === "easy" || raw === "beginner" || raw === "low") return "easy";
  if (raw === "hard" || raw === "advanced" || raw === "high" || raw === "expert") return "hard";
  if (raw === "medium" || raw === "moderate" || raw === "intermediate") return "medium";
  return difficultyForQuestion(fallbackIndex);
}

function pickFrom<T extends CatSelectableItem>(items: T[], random: () => number): T | null {
  if (items.length === 0) return null;
  const idx = Math.floor(random() * items.length);
  return items[idx] ?? null;
}

function topicOf(item: Pick<CatSelectableItem, "narrowTopic">): string | null {
  const key = item.narrowTopic?.trim();
  return key ? key : null;
}

/** Drop a third consecutive topic, then anything already at the share cap. */
function filterByTopic<T extends CatSelectableItem>(
  candidates: T[],
  delivered: ReadonlyArray<Pick<CatSelectableItem, "narrowTopic">>
): T[] {
  if (candidates.length === 0) return candidates;
  if (!candidates.some((item) => topicOf(item)) && !delivered.some((item) => topicOf(item))) {
    return candidates;
  }
  const keys = delivered.map(topicOf);
  const cap = narrowTopicShareCap(delivered.length + 1);
  const prev = keys.length >= 1 ? keys[keys.length - 1] : null;
  const before = keys.length >= 2 ? keys[keys.length - 2] : null;
  const blocked = prev && before && prev === before ? prev : null;
  const counts = new Map<string, number>();
  for (const key of keys) {
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const underCap = candidates.filter((item) => {
    const key = topicOf(item);
    if (!key) return true;
    return (counts.get(key) ?? 0) < cap;
  });
  const pool = underCap.length > 0 ? underCap : candidates;
  const spaced = blocked
    ? pool.filter((item) => topicOf(item) !== blocked)
    : pool;
  return spaced.length > 0 ? spaced : pool;
}

/**
 * Next unused item. Continues an open sequential case in order, then keeps a
 * published-NGN share when the pool contains those items and a target was set.
 * Difficulty banding still wins when a matching item exists.
 */
export function pickCatNext<T extends CatSelectableItem>(
  state: CatSessionState,
  pool: T[],
  excludeIds: ReadonlySet<string>,
  random: () => number = Math.random,
  hint?: CatFormatHint
): T | null {
  const available = pool.filter((q) => !excludeIds.has(q.id));
  if (available.length === 0) return null;

  const delivered = hint?.delivered ?? [];
  const last = delivered[delivered.length - 1];
  if (last?.setId) {
    const nextStep = available.find(
      (item) => item.setId === last.setId && item.stepIndex === (last.stepIndex ?? 0) + 1
    );
    if (nextStep) return nextStep;
  }

  const want = targetDifficulty(state);
  const inBand = available.filter((q) => q.difficultyBand === want);
  const bandOrAny = filterByTopic(inBand.length > 0 ? inBand : available, delivered);

  const target = hint?.ngnTargetRatio ?? 0;
  const poolHasNgn = available.some((item) => item.ngn);
  if (target > 0 && poolHasNgn && delivered.length >= 6) {
    const deliveredNgn = delivered.filter((item) => item.ngn).length;
    const ratio = deliveredNgn / delivered.length;
    if (ratio < target) {
      const ngnBand = bandOrAny.filter((item) => item.ngn);
      const ngnAny = filterByTopic(
        available.filter((item) => item.ngn),
        delivered
      );
      return pickFrom(ngnBand.length > 0 ? ngnBand : ngnAny, random);
    }
    if (ratio > target + 0.06) {
      const classic = bandOrAny.filter((item) => !item.ngn);
      if (classic.length > 0) return pickFrom(classic, random);
    }
  }

  return pickFrom(bandOrAny, random);
}

/** Ability in [-1, 1] → 0–100 practice progress (not a pass predictor). */
export function catAbilityToPracticePct(ability: number): number {
  if (!Number.isFinite(ability)) return 0;
  return Math.round(((ability + 1) / 2) * 100);
}

/**
 * Early-ended practice shows the share answered correctly.
 * Ability floors at -1 after a short run of misses, which painted 0% beside a real score.
 */
export function catPracticeProgressPct(input: {
  ability: number;
  correctCount: number;
  incorrectCount: number;
  stopReason?: string | null;
}): number {
  const correct = Math.max(0, Math.floor(input.correctCount) || 0);
  const incorrect = Math.max(0, Math.floor(input.incorrectCount) || 0);
  const answered = correct + incorrect;
  const natural =
    input.stopReason === "confidence" ||
    input.stopReason === "maximum" ||
    input.stopReason === "minimum";
  if (!natural && answered > 0) {
    return Math.round((correct / answered) * 100);
  }
  const fromAbility = catAbilityToPracticePct(input.ability);
  if (fromAbility === 0 && correct > 0 && answered > 0) {
    return Math.round((correct / answered) * 100);
  }
  return fromAbility;
}

export function catStopReasonLabel(
  reason: CatSessionState["stopReason"]
): string | null {
  if (reason === "confidence") return "Practice confidence threshold reached";
  if (reason === "maximum") return "Reached maximum practice length (150)";
  if (reason === "minimum") return "Minimum practice length reached";
  return null;
}
