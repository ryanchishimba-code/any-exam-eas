/**
 * Decide when a post-answer rationale is short enough to show in full.
 * Longer teaching (why correct, why wrong, principle, source) stays behind Show more.
 * Threshold is about 2–3 short lines on a phone study card.
 */

/** Characters that still read as roughly 2–3 short lines. */
export const RATIONALE_INLINE_MAX_CHARS = 160;

/** Visual lines before the rationale collapses. */
export const RATIONALE_INLINE_MAX_LINES = 3;

/** Approximate characters per line on a phone study card. */
export const RATIONALE_CHARS_PER_LINE = 56;

export function stripRationaleMarkup(text: string): string {
  return text
    .replace(/^\s*#{1,6}\s+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/^[•*-]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function rationaleVisualLines(text: string): number {
  const lines = text
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return 0;
  return lines.reduce(
    (total, line) => total + Math.max(1, Math.ceil(line.length / RATIONALE_CHARS_PER_LINE)),
    0
  );
}

/** True when the joined rationale is longer than a short on-screen summary. */
export function shouldCollapseRationale(parts: Array<string | null | undefined>): boolean {
  const blocks = parts.map((part) => part?.trim()).filter((part): part is string => Boolean(part));
  if (blocks.length === 0) return false;
  const text = blocks.join("\n");
  return text.length > RATIONALE_INLINE_MAX_CHARS || rationaleVisualLines(text) > RATIONALE_INLINE_MAX_LINES;
}

function firstSentence(text: string): string {
  const match = text.match(/^(.{12,160}?[.!?])(?:\s|$)/);
  if (match?.[1]) return match[1].trim();
  if (text.length <= RATIONALE_INLINE_MAX_CHARS) return text;
  const slice = text.slice(0, 140);
  const space = slice.lastIndexOf(" ");
  const cut = (space > 60 ? slice.slice(0, space) : slice).trim();
  return `${cut}…`;
}

/** Principle line or first sentence, kept short enough to sit above Show more. */
export function shortRationaleLead(text: string | null | undefined): string {
  const cleaned = stripRationaleMarkup(text ?? "");
  if (!cleaned) return "";
  if (
    cleaned.length <= RATIONALE_INLINE_MAX_CHARS &&
    rationaleVisualLines(cleaned) <= RATIONALE_INLINE_MAX_LINES
  ) {
    return cleaned;
  }
  return firstSentence(cleaned);
}

export function selectRationaleLead(input: {
  principle?: string | null;
  headline?: string | null;
  explanation?: string | null;
}): string {
  const principle = input.principle?.trim();
  if (principle) return shortRationaleLead(principle);
  const headline = input.headline?.trim();
  if (headline) return shortRationaleLead(headline);
  return shortRationaleLead(input.explanation);
}

/** Remainder after a lead that is a prefix of the full text. Otherwise the full text. */
export function rationaleAfterLead(text: string, lead: string): string {
  const full = text.trim();
  const summary = lead.trim();
  if (!full) return "";
  if (!summary || full === summary) return full === summary ? "" : full;
  if (full.startsWith(summary)) {
    return full.slice(summary.length).replace(/^[\s.!?:—–-]+/, "").trim();
  }
  return full;
}

/**
 * Join student-visible rationale pieces once.
 * Skips a fragment already contained in the stored explanation so structured
 * markdown is not measured twice.
 */
export function uniqueRationaleParts(
  explanation: string | null | undefined,
  extras: Array<string | null | undefined>
): string[] {
  const base = explanation?.trim() ?? "";
  const parts: string[] = [];
  if (base) parts.push(base);
  for (const extra of extras) {
    const text = extra?.trim();
    if (!text) continue;
    if (base.includes(text)) continue;
    parts.push(text);
  }
  return parts;
}
