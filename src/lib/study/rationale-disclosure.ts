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

/**
 * Board-generic step labels that are not an explanation.
 * NCLEX CJMM is the common case; the same headers show up on NGN and case items.
 */
const CJMM_LABEL =
  /^(?:clinical judgment(?:\s*\(cjmm\))?|ncsbn clinical judgment(?:\s+measurement)?(?:\s+model)?)\s*:?\s*/i;

const STEP_HEADER =
  /^(?:recognize cues|analyze cues|prioritize hypotheses|generate solutions(?:\s*\/\s*take action)?|take action|evaluate outcomes|correct answer)\s*:\s*/i;

const LEADING_NUMBER = /^\d+\s*[.)]\s*/;

const NON_EXPLANATION =
  /^(?:why other options are incorrect|why the other options are wrong|references|reference)\b/i;

function firstSentence(text: string): string {
  const match = text.match(/^(.{8,220}?(?<!\d)[.!?])(?:\s|$)/);
  if (match?.[1]) return match[1].trim();
  if (text.length <= RATIONALE_INLINE_MAX_CHARS) return text;
  const slice = text.slice(0, 140);
  const space = slice.lastIndexOf(" ");
  const cut = (space > 60 ? slice.slice(0, space) : slice).trim();
  return `${cut}…`;
}

/** Drop a leading CJMM label, step number, or step header. Repeats while they stack. */
export function stripLeadingRationaleLabels(text: string): string {
  let rest = text.trim();
  for (let i = 0; i < 8 && rest; i += 1) {
    const next = rest
      .replace(CJMM_LABEL, "")
      .replace(LEADING_NUMBER, "")
      .replace(STEP_HEADER, "")
      .trim();
    if (next === rest) break;
    rest = next;
  }
  return rest;
}

function explanatoryEnough(sentence: string): boolean {
  const stripped = stripLeadingRationaleLabels(sentence).replace(/[.…]+$/g, "").trim();
  if (!stripped || NON_EXPLANATION.test(stripped)) return false;
  if (CJMM_LABEL.test(stripped) || STEP_HEADER.test(stripped) || LEADING_NUMBER.test(stripped)) {
    return false;
  }
  const words = stripped.split(/\s+/).filter((word) => /[A-Za-z]{2,}/.test(word));
  return words.length >= 2;
}

/**
 * First real explanatory sentence.
 * Strips CJMM prefixes ("Clinical Judgment (CJMM): 1.") and step headers
 * ("Recognize cues:") before picking a sentence. Empty string when the text
 * is only a label — callers fall back to the full rationale or a short prompt.
 */
export function explanatoryRationaleSummary(text: string | null | undefined): string {
  let rest = stripLeadingRationaleLabels(stripRationaleMarkup(text ?? ""));
  if (!rest) return "";

  for (let i = 0; i < 6 && rest; i += 1) {
    if (NON_EXPLANATION.test(rest)) break;
    const sentence = firstSentence(rest);
    const body = stripLeadingRationaleLabels(sentence).replace(/[.…]+$/g, "").trim();
    if (explanatoryEnough(body)) {
      const finished = /[.!?…]$/.test(body) ? body : `${body}.`;
      return finished.length > RATIONALE_INLINE_MAX_CHARS
        ? firstSentence(finished)
        : finished;
    }
    const consumed = Math.max(sentence.length, 1);
    rest = stripLeadingRationaleLabels(rest.slice(consumed).replace(/^[\s.!?:—–-]+/, ""));
  }

  return "";
}

/**
 * True when the old first-period picker would have shown only a step label
 * ("Clinical Judgment (CJMM): 1.") instead of an explanation.
 */
export function wouldRenderLabelOnlySummary(text: string | null | undefined): boolean {
  const cleaned = stripRationaleMarkup(text ?? "");
  if (!cleaned) return false;
  const match = cleaned.match(/^(.{8,160}?[.!?])(?:\s|$)/);
  const legacy = (match?.[1] ?? "").trim();
  if (!legacy) return false;
  return !explanatoryEnough(legacy);
}

/** First real sentence, or the fallback when the text is only a label. */
export function rationaleSummaryOr(
  text: string | null | undefined,
  fallback: string
): string {
  return explanatoryRationaleSummary(text) || fallback;
}

/** Principle line or first explanatory sentence, kept short enough to sit above Show more. */
export function shortRationaleLead(text: string | null | undefined): string {
  const cleaned = stripRationaleMarkup(text ?? "");
  if (!cleaned) return "";
  if (
    cleaned.length <= RATIONALE_INLINE_MAX_CHARS &&
    rationaleVisualLines(cleaned) <= RATIONALE_INLINE_MAX_LINES &&
    explanatoryEnough(cleaned)
  ) {
    return cleaned;
  }
  return explanatoryRationaleSummary(cleaned);
}

function usableLead(text: string | null | undefined): string {
  return shortRationaleLead(text);
}

export function selectRationaleLead(input: {
  principle?: string | null;
  headline?: string | null;
  explanation?: string | null;
}): string {
  const principle = usableLead(input.principle);
  if (principle) return principle;
  const headline = usableLead(input.headline);
  if (headline) return headline;
  return usableLead(input.explanation);
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
