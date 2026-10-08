/**
 * Case sessions: unseen cases first, then least-recently attempted.
 * Ties shuffle with the seed. Steps inside a case are not reordered.
 */

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededShuffle<T>(rows: readonly T[], seed: string): T[] {
  const copy = [...rows];
  let state = hashSeed(seed) || 1;
  for (let i = copy.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    const swap = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = swap;
  }
  return copy;
}

function attemptedAt(
  lastAttemptedAt: ReadonlyMap<string, number | null> | null | undefined,
  id: string
): number | null {
  if (!lastAttemptedAt) return null;
  const raw = lastAttemptedAt.get(id);
  return typeof raw === "number" && Number.isFinite(raw) ? raw : null;
}

/** Unseen first, then oldest attempt. Equal stamps shuffle together. */
export function orderByAttemptRecency<T>(
  rows: readonly T[],
  idOf: (row: T) => string,
  lastAttemptedAt: ReadonlyMap<string, number | null> | null | undefined,
  seed: string
): T[] {
  const unseen: T[] = [];
  const seen = new Map<number, T[]>();
  for (const row of rows) {
    const at = attemptedAt(lastAttemptedAt, idOf(row));
    if (at == null) {
      unseen.push(row);
      continue;
    }
    const bucket = seen.get(at) ?? [];
    bucket.push(row);
    seen.set(at, bucket);
  }
  const ordered = seededShuffle(unseen, `${seed}:unseen`);
  for (const at of [...seen.keys()].sort((left, right) => left - right)) {
    ordered.push(...seededShuffle(seen.get(at) ?? [], `${seed}:seen:${at}`));
  }
  return ordered;
}
