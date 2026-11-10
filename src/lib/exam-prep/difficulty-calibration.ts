/**
 * Map observed accuracy to the 1–5 difficulty chip.
 * 1 is the easiest band. Items with too few attempts are left unchanged.
 */
export const DIFFICULTY_MIN_ATTEMPTS = 20;

export function proposedDifficulty(correct: number, answered: number): number | null {
  const total = Math.max(0, Math.floor(answered) || 0);
  if (total < DIFFICULTY_MIN_ATTEMPTS) return null;
  const hits = Math.max(0, Math.min(total, Math.floor(correct) || 0));
  const rate = hits / total;
  if (rate >= 0.85) return 1;
  if (rate >= 0.7) return 2;
  if (rate >= 0.5) return 3;
  if (rate >= 0.3) return 4;
  return 5;
}

export type DifficultyProposal = {
  id: string;
  from: number | null;
  to: number;
  answered: number;
  correct: number;
};

export function proposeDifficultyChanges(
  rows: readonly {
    id: string;
    difficulty: number | null;
    answered: number;
    correct: number;
  }[]
): DifficultyProposal[] {
  const changes: DifficultyProposal[] = [];
  for (const row of rows) {
    const next = proposedDifficulty(row.correct, row.answered);
    if (next == null || next === row.difficulty) continue;
    changes.push({
      id: row.id,
      from: row.difficulty,
      to: next,
      answered: row.answered,
      correct: row.correct,
    });
  }
  return changes;
}
