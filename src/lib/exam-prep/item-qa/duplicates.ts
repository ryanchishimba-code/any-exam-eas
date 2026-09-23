/**
 * Near-duplicate detection for stems and options.
 * Lexical only — no embeddings — so it can run as a batch job on any board.
 */
import { itemFingerprint, itemTokens, jaccardSimilarity, normalizeItemText, stemShingles } from "./normalize";

export type DuplicateCandidate = {
  id: string;
  fieldId: string;
  stem: string;
  options: readonly string[];
};

export type DuplicatePair = {
  keepId: string;
  flagId: string;
  kind: "exact" | "near_stem" | "near_stem_and_options";
  stemSimilarity: number;
  optionSimilarity: number;
};

/** Stem-only near match. High on purpose so shared templates are not flagged. */
const NEAR_STEM = 0.9;
/** Slightly looser stem match when the options are also nearly the same. */
const NEAR_STEM_WITH_OPTIONS = 0.84;
const NEAR_OPTIONS = 0.8;
const MIN_NEAR_STEM_CHARS = 48;
const MAX_SHINGLE_BUCKET = 30;

type Indexed = {
  item: DuplicateCandidate;
  fingerprint: string;
  normalizedStem: string;
  stemTokens: string[];
  optionTokens: string[];
};

function indexItem(item: DuplicateCandidate): Indexed {
  const optionText = item.options.join(" ");
  return {
    item,
    fingerprint: itemFingerprint(item.stem, item.options),
    normalizedStem: normalizeItemText(item.stem),
    stemTokens: itemTokens(item.stem),
    optionTokens: itemTokens(optionText),
  };
}

function pairKind(
  stemSimilarity: number,
  optionSimilarity: number,
  exact: boolean
): DuplicatePair["kind"] | null {
  if (exact) return "exact";
  if (stemSimilarity >= NEAR_STEM) return "near_stem";
  if (stemSimilarity >= NEAR_STEM_WITH_OPTIONS && optionSimilarity >= NEAR_OPTIONS) {
    return "near_stem_and_options";
  }
  return null;
}

/**
 * Compare items within the same field. The lower id is kept; the other is the flag.
 * Exact fingerprint matches are always returned. Near matches require a long enough stem.
 */
export function findNearDuplicatePairs(items: readonly DuplicateCandidate[]): DuplicatePair[] {
  const indexed = items.map(indexItem);
  const pairs: DuplicatePair[] = [];
  const seen = new Set<string>();

  const consider = (left: Indexed, right: Indexed) => {
    if (left.item.id === right.item.id) return;
    if (left.item.fieldId !== right.item.fieldId) return;
    const key = [left.item.id, right.item.id].sort().join("|");
    if (seen.has(key)) return;
    seen.add(key);

    const exact = left.fingerprint === right.fingerprint && left.normalizedStem.length > 0;
    const stemSimilarity = exact
      ? 1
      : jaccardSimilarity(left.stemTokens, right.stemTokens);
    const optionSimilarity = jaccardSimilarity(left.optionTokens, right.optionTokens);
    const longEnough =
      left.normalizedStem.length >= MIN_NEAR_STEM_CHARS &&
      right.normalizedStem.length >= MIN_NEAR_STEM_CHARS;
    const kind = pairKind(stemSimilarity, optionSimilarity, exact);
    if (!kind) return;
    if (!exact && !longEnough) return;

    const [keepId, flagId] = [left.item.id, right.item.id].sort();
    pairs.push({
      keepId,
      flagId,
      kind,
      stemSimilarity: Number(stemSimilarity.toFixed(3)),
      optionSimilarity: Number(optionSimilarity.toFixed(3)),
    });
  };

  const byFingerprint = new Map<string, Indexed[]>();
  for (const entry of indexed) {
    const bucket = byFingerprint.get(entry.fingerprint) ?? [];
    bucket.push(entry);
    byFingerprint.set(entry.fingerprint, bucket);
  }
  for (const bucket of byFingerprint.values()) {
    if (bucket.length < 2) continue;
    for (let i = 0; i < bucket.length; i += 1) {
      for (let j = i + 1; j < bucket.length; j += 1) {
        consider(bucket[i]!, bucket[j]!);
      }
    }
  }

  const buckets = new Map<string, Indexed[]>();
  for (const entry of indexed) {
    for (const shingle of stemShingles(entry.item.stem)) {
      const bucket = buckets.get(shingle) ?? [];
      if (bucket.length >= MAX_SHINGLE_BUCKET) continue;
      bucket.push(entry);
      buckets.set(shingle, bucket);
    }
  }
  for (const bucket of buckets.values()) {
    if (bucket.length < 2 || bucket.length > MAX_SHINGLE_BUCKET) continue;
    for (let i = 0; i < bucket.length; i += 1) {
      for (let j = i + 1; j < bucket.length; j += 1) {
        consider(bucket[i]!, bucket[j]!);
      }
    }
  }

  return pairs.sort((a, b) => a.flagId.localeCompare(b.flagId) || a.keepId.localeCompare(b.keepId));
}
