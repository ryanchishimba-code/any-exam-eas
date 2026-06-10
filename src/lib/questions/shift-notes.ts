/** Strip EHR shift-note / chart-entry formatting from NCLEX vignettes. */

const SHIFT_NOTE_PREFIX = /^(?:At\s+)?\d{3,4}\s*—\s*/i;

const CHART_HEADER =
  /^(?:The nurse performs an assessment and (?:finds|documents):?|At \d{3,4}, the nurse performs an assessment and documents:?)$/i;

const HANDOFF_REF = /^Handoff ref \d+/i;

/** True when text uses timestamp or handoff chart-entry framing. */
export function hasShiftNoteArtifacts(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (SHIFT_NOTE_PREFIX.test(t)) return true;
  if (/^Handoff report —/i.test(t)) return true;
  if (/^\d{4} — Report on four assigned clients/i.test(t)) return true;
  return t.split("\n").some((line) => SHIFT_NOTE_PREFIX.test(line.trim()));
}

/** Remove shift-note timestamps and unrelated chart boilerplate from vignette text. */
export function stripShiftNotes(text: string): string {
  if (!text.trim()) return text;

  const lines = text
    .split("\n")
    .map((line) => line.replace(SHIFT_NOTE_PREFIX, "").trim())
    .filter((line) => line.length > 0 && !CHART_HEADER.test(line) && !HANDOFF_REF.test(line));

  let joined = lines.join("\n\n").trim();

  joined = joined.replace(/^Handoff report —\s*/i, "The nurse receives report on ");
  joined = joined.replace(
    /^(\d{4} — Report on four assigned clients[^:\n]*:?)\s*/i,
    "The nurse is assigned four clients. "
  );

  return joined.replace(/\n{3,}/g, "\n\n").trim();
}
