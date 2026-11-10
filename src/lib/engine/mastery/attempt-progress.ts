import type { DomainMapTile } from "@/components/dashboard/DomainMap";
import type { SkillCellDef, UserCellStateSnapshot } from "@/lib/engine/mastery/types";
import { emptyCellState } from "@/lib/engine/mastery/transitions";

export type DomainAttemptTally = {
  domainId: string;
  answered: number;
  correct: number;
};

/**
 * Practice progress for one domain from saved attempts.
 * Accuracy is most of the bar. Depth keeps a handful of perfect answers
 * from reading as finished. Zero answers is 0, not a placeholder.
 */
export function domainPracticeScore(input: {
  answered: number;
  correct: number;
  served?: number;
}): number {
  const answered = Math.max(0, Math.floor(input.answered) || 0);
  if (answered <= 0) return 0;
  const correct = Math.max(0, Math.min(answered, Math.floor(input.correct) || 0));
  const accuracy = Math.round((correct / answered) * 100);
  const served = Math.max(0, Math.floor(input.served ?? 0) || 0);
  const depth =
    served > 0 ? Math.min(100, Math.round((Math.min(answered, served) / served) * 100)) : Math.min(100, answered);
  return Math.round(accuracy * 0.7 + depth * 0.3);
}

/**
 * Replace the unseen 10% ladder with attempt totals.
 * A domain the student has answered moves. Untouched domains stay at 0.
 */
export function applyAttemptProgressToTiles(
  tiles: DomainMapTile[],
  tallies: readonly DomainAttemptTally[]
): DomainMapTile[] {
  const byId = new Map(tallies.map((row) => [row.domainId, row]));
  return tiles.map((tile) => {
    const tally = byId.get(tile.id);
    if (!tally || tally.answered <= 0) {
      if (tile.score === 10) return { ...tile, score: 0 };
      return tile;
    }
    const score = domainPracticeScore(tally);
    return {
      ...tile,
      score,
      coveragePct: Math.min(100, Math.max(tile.coveragePct ?? 0, Math.min(100, tally.answered))),
      status: score >= 75 ? "strong" : score >= 55 ? "needs_review" : "needs_more_work",
    };
  });
}

/**
 * Skill-cell coverage from attempts when the cell table was never written.
 * One practiced domain marks that system's first unseen cell as primed so
 * the coverage percent moves. Existing cell states are left alone.
 */
export function statesWithAttemptedDomains(
  cells: readonly SkillCellDef[],
  states: Map<string, UserCellStateSnapshot>,
  tallies: readonly DomainAttemptTally[]
): Map<string, UserCellStateSnapshot> {
  const next = new Map(states);
  for (const tally of tallies) {
    if (tally.answered <= 0) continue;
    const systemCells = cells.filter((cell) => cell.systemKey === tally.domainId);
    const already = systemCells.some((cell) => {
      const state = next.get(cell.cellKey)?.state ?? "unseen";
      return state !== "unseen";
    });
    if (already) continue;
    const cell = systemCells[0];
    if (!cell) continue;
    const base = emptyCellState(cell.cellKey);
    next.set(cell.cellKey, {
      ...base,
      state: "primed",
      itemsAnswered: Math.min(4, tally.answered),
    });
  }
  return next;
}
