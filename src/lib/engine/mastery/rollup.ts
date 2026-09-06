/**
 * Mastery rollup — coverage, competence, top leaks for the readiness strip.
 * Omit a tile when it cannot be computed.
 */

import type {
  CellState,
  MasteryRollup,
  SkillCellDef,
  UserCellStateSnapshot,
} from "./types";

const COMPETENCE_STATES: CellState[] = ["stable", "exam_ready"];
const TOUCHED_STATES: CellState[] = [
  "primed",
  "learning",
  "shaky",
  "stable",
  "exam_ready",
];

function leakRank(state: CellState): number {
  switch (state) {
    case "shaky":
      return 0;
    case "learning":
      return 1;
    case "primed":
      return 2;
    case "unseen":
      return 3;
    default:
      return 9;
  }
}

export function computeMasteryRollup(input: {
  cells: SkillCellDef[];
  states: Map<string, UserCellStateSnapshot>;
}): MasteryRollup {
  const { cells, states } = input;
  if (cells.length === 0) {
    return { coveragePct: null, competencePct: null, topLeaks: [] };
  }

  const totalWeight = cells.reduce((s, c) => s + c.blueprintWeight, 0) || 1;

  let coveredWeight = 0;
  let competentWeight = 0;

  for (const cell of cells) {
    const st = states.get(cell.cellKey)?.state ?? "unseen";
    if (TOUCHED_STATES.includes(st)) coveredWeight += cell.blueprintWeight;
    if (COMPETENCE_STATES.includes(st)) competentWeight += cell.blueprintWeight;
  }

  const coveragePct = Math.round((coveredWeight / totalWeight) * 100);
  const competencePct = Math.round((competentWeight / totalWeight) * 100);

  const leaks = cells
    .map((cell) => {
      const st = states.get(cell.cellKey)?.state ?? "unseen";
      return {
        cellKey: cell.cellKey,
        systemLabel: cell.systemLabel,
        topicLabel: cell.topicLabel,
        state: st,
        weight: cell.blueprintWeight,
        rank: leakRank(st),
      };
    })
    .filter((l) => l.rank < 9)
    .sort((a, b) => a.rank - b.rank || b.weight - a.weight)
    .slice(0, 3)
    .map(({ cellKey, systemLabel, topicLabel, state, weight }) => ({
      cellKey,
      systemLabel,
      topicLabel,
      state,
      weight,
    }));

  return {
    coveragePct,
    competencePct,
    topLeaks: leaks,
  };
}
