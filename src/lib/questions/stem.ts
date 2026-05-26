/** Normalize question stems — fluid, direct, less robotic. */

const PREFIX_PATTERNS = [
  /^question\s*\d*\s*:\s*/i,
  /^q\d+\s*:\s*/i,
  /^case\s*:\s*/i,
  /^scenario\s*:\s*/i,
  /^clinical\s*scenario\s*:\s*/i,
  /^vignette\s*:\s*/i,
];

const VIGNETTE_OPENERS = [
  /^a\s+\d{1,3}[-\s]?year[-\s]?old\s+(male|female|man|woman|patient)\b/i,
  /^an?\s+\d{1,3}[-\s]?year[-\s]?old\b/i,
  /^a\s+patient\s+(presents|is\s+brought|undergoes|develops)\b/i,
  /^a\s+\d{1,3}[-\s]?yo\b/i,
];

/** Extract a direct question if buried after a long vignette. */
function extractDirectQuestion(stem: string): string {
  const trimmed = stem.trim();
  if (trimmed.length < 220) return trimmed;

  const questionMarks = [...trimmed.matchAll(/\?/g)];
  if (questionMarks.length === 0) return trimmed;

  const lastQ = trimmed.lastIndexOf("?");
  const before = trimmed.slice(0, lastQ + 1);
  const sentences = before.split(/(?<=[.!?])\s+/);
  const lastSentence = sentences[sentences.length - 1]?.trim() ?? before;

  if (lastSentence.length >= 15 && lastSentence.length <= 220) {
    return lastSentence;
  }

  return trimmed;
}

export function normalizeStem(raw: string, opts?: { preferDirect?: boolean }): string {
  let stem = raw.trim().replace(/\s+/g, " ");

  for (const p of PREFIX_PATTERNS) {
    stem = stem.replace(p, "");
  }

  stem = stem.trim();

  const isVignetteOpener = VIGNETTE_OPENERS.some((p) => p.test(stem));
  if (opts?.preferDirect !== false && isVignetteOpener && stem.length > 180) {
    stem = extractDirectQuestion(stem);
  }

  if (stem && !/[?.!]$/.test(stem) && stem.length < 120) {
    stem = `${stem}?`;
  }

  return stem;
}

export function stemPatternScore(stem: string): number {
  let score = 1;
  if (VIGNETTE_OPENERS.some((p) => p.test(stem))) score -= 0.3;
  if (/^case\s*:/i.test(stem)) score -= 0.5;
  if (stem.length > 280) score -= 0.2;
  if (stem.length < 120) score += 0.1;
  return Math.max(0, Math.min(1, score));
}
