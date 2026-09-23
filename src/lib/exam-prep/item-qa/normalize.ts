/**
 * Board-generic text normalization for near-duplicate detection.
 * Keeps letters and numbers so clinical stems can be compared without
 * punctuation, markdown, or encoding noise deciding the match.
 */

const MARKDOWN_NOISE = /[*_`#>]+/g;

export function normalizeItemText(input: string): string {
  return input
    .normalize("NFKC")
    .replace(/\u00a0/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(MARKDOWN_NOISE, " ")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function itemTokens(input: string): string[] {
  return normalizeItemText(input)
    .split(" ")
    .filter((token) => token.length > 2);
}

export function jaccardSimilarity(a: readonly string[], b: readonly string[]): number {
  if (a.length === 0 && b.length === 0) return 1;
  const left = new Set(a);
  const right = new Set(b);
  if (left.size === 0 && right.size === 0) return 1;
  let intersection = 0;
  for (const token of left) {
    if (right.has(token)) intersection += 1;
  }
  const union = left.size + right.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/** Stable fingerprint of a stem plus its options, order-independent. */
export function itemFingerprint(stem: string, options: readonly string[]): string {
  const normalizedStem = normalizeItemText(stem);
  const normalizedOptions = options
    .map((option) => normalizeItemText(option))
    .filter(Boolean)
    .sort();
  return `${normalizedStem}||${normalizedOptions.join("|")}`;
}

export function stemShingles(stem: string, size = 4): string[] {
  const tokens = itemTokens(stem);
  if (tokens.length < size) {
    return tokens.length ? [tokens.join(" ")] : [];
  }
  const shingles: string[] = [];
  for (let i = 0; i <= tokens.length - size; i += 1) {
    shingles.push(tokens.slice(i, i + size).join(" "));
  }
  return shingles;
}
