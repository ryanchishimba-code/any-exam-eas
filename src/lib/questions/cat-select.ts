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

/** Pick the next unused item matching the CAT target difficulty band. */
export function pickCatNext<T extends CatSelectableItem>(
  state: CatSessionState,
  pool: T[],
  excludeIds: ReadonlySet<string>,
  random: () => number = Math.random
): T | null {
  const available = pool.filter((q) => !excludeIds.has(q.id));
  if (available.length === 0) return null;

  const want = targetDifficulty(state);
  const bandMatch = available.filter((q) => q.difficultyBand === want);
  const pickFrom = bandMatch.length > 0 ? bandMatch : available;
  const idx = Math.floor(random() * pickFrom.length);
  return pickFrom[idx] ?? null;
}

/** Ability in [-1, 1] → 0–100 practice progress (not a pass predictor). */
export function catAbilityToPracticePct(ability: number): number {
  return Math.round(((ability + 1) / 2) * 100);
}

export function catStopReasonLabel(
  reason: CatSessionState["stopReason"]
): string | null {
  if (reason === "confidence") return "Practice confidence threshold reached";
  if (reason === "maximum") return "Reached maximum practice length (145)";
  if (reason === "minimum") return "Minimum practice length reached";
  return null;
}
