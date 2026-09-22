/**
 * Still-incorrect items from persisted QuestionAttempt rows.
 * An item is open when it has been missed and has no correct attempt yet.
 * Ephemeral numeric session keys (no bank id) are ignored — same rule as Review incorrect.
 */

export type AttemptCorrectnessRow = {
  bankItemId?: string | null;
  questionKey?: string | null;
  correct: boolean;
};

/** Stable bank identity, or null when the row cannot be re-drilled. */
export function attemptItemId(row: {
  bankItemId?: string | null;
  questionKey?: string | null;
}): string | null {
  const id = row.bankItemId || row.questionKey;
  if (!id) return null;
  if (!row.bankItemId && /^\d+$/.test(id)) return null;
  return id;
}

export function countOpenIncorrectItems(attempts: AttemptCorrectnessRow[]): number {
  const correctIds = new Set<string>();
  const missed = new Set<string>();

  for (const row of attempts) {
    const id = attemptItemId(row);
    if (!id) continue;
    if (row.correct) {
      if (row.bankItemId) correctIds.add(row.bankItemId);
      if (row.questionKey) correctIds.add(row.questionKey);
      correctIds.add(id);
    } else {
      missed.add(id);
    }
  }

  let open = 0;
  for (const id of missed) {
    if (!correctIds.has(id)) open += 1;
  }
  return open;
}
