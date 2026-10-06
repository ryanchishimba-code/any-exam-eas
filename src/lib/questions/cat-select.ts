/** Pure helpers for rule-based CAT item selection (practice only). */

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
};

export type CatFormatHint = {
  /** Share of delivered items that should be NGN when the pool has any. 0 disables. */
  ngnTargetRatio?: number;
  delivered?: ReadonlyArray<Pick<CatSelectableItem, "id" | "ngn" | "setId" | "stepIndex">>;
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
  const bandOrAny = inBand.length > 0 ? inBand : available;

  const target = hint?.ngnTargetRatio ?? 0;
  const poolHasNgn = available.some((item) => item.ngn);
  if (target > 0 && poolHasNgn && delivered.length >= 6) {
    const deliveredNgn = delivered.filter((item) => item.ngn).length;
    const ratio = deliveredNgn / delivered.length;
    if (ratio < target) {
      const ngnBand = bandOrAny.filter((item) => item.ngn);
      const ngnAny = available.filter((item) => item.ngn);
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
  return Math.round(((ability + 1) / 2) * 100);
}

export function catStopReasonLabel(
  reason: CatSessionState["stopReason"]
): string | null {
  if (reason === "confidence") return "Practice confidence threshold reached";
  if (reason === "maximum") return "Reached maximum practice length (150)";
  if (reason === "minimum") return "Minimum practice length reached";
  return null;
}
