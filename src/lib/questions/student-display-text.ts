/**
 * Student-facing text cleanup. Stored stems, options, keys, and rationales
 * stay as written. Callers apply this at render time.
 */

const VISIT_BATCH = /\s*\(?\bvisit batch\s+\d+\b\)?/gi;

const INTERNAL_META = [
  VISIT_BATCH,
  /\s*\(\s*batch\s+\d+\s*\)/gi,
];

/** Question lead-ins that get glued to the end of a scenario. */
const LEAD_IN =
  /\b(?:Which action|Which of the following|Which finding|Which client|Which nursing|Which assessment|Which task|Which response|What is the priority|What should the nurse)\b/;

export function stripInternalDisplayMetadata(text: string): string {
  let next = text;
  for (const pattern of INTERNAL_META) {
    next = next.replace(pattern, "");
  }
  return next.replace(/[ \t]{2,}/g, " ").replace(/\s+([.?!])/g, "$1").trim();
}

/**
 * Split "…therapy Which action…" into a scenario and a lead-in.
 * Already-punctuated text is left as one stem.
 */
export function splitGluedLeadIn(text: string): { vignette?: string; stem: string } {
  const trimmed = stripInternalDisplayMetadata(text);
  const match = LEAD_IN.exec(trimmed);
  if (!match || match.index < 8) return { stem: trimmed };
  const before = trimmed.slice(0, match.index).trim();
  const lead = trimmed.slice(match.index).trim();
  if (!before || !lead) return { stem: trimmed };
  const last = before.slice(-1);
  if (/[.!?;:]/.test(last)) return { stem: trimmed };
  return { vignette: `${before}.`, stem: lead };
}

export function studentFacingStem(stem: string): string {
  return stripInternalDisplayMetadata(stem);
}

export function studentFacingVignette(text: string): string {
  return stripInternalDisplayMetadata(text);
}
