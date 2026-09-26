import { NCLEX_RN_2026_PROFILE } from "@/lib/assessment/profiles/nclex-rn-2026";

/** FNV-1a then a mulberry32 step. Same seed always yields the same permutation. */
export function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const next = items.slice();
  let state = hashSeed(seed) || 1;
  for (let i = next.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    const swap = next[i] as T;
    next[i] = next[j] as T;
    next[j] = swap;
  }
  return next;
}

const SHUFFLE = new Set<string>(NCLEX_RN_2026_PROFILE.shuffleFormats);

/** Highlight tokens and matrix rows/columns keep authored order. */
export function orderForFormat<T>(format: string, options: readonly T[], seed: string): T[] {
  if (!SHUFFLE.has(format)) return options.slice();
  return seededShuffle(options, seed);
}
