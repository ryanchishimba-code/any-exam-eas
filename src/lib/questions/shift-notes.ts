/** Strip EHR shift-note / chart-entry formatting from NCLEX vignettes. */

const SHIFT_NOTE_PREFIX = /^(?:At\s+)?\d{3,4}\s*—\s*/i;

/** Bank item id + unit/room header merged into the stem (not clinical content after a time stamp). */
const CHART_METADATA =
  /room\s+\d+|post-anesthesia care unit|inpatient psychiatric unit|labor and delivery unit|medical-surgical unit|handoff|report on|assigned clients|post-anesthesia|pacu,/i;

const CHART_HEADER =
  /^(?:The nurse performs an assessment and (?:finds|documents):?|At \d{3,4}, the nurse performs an assessment and documents:?)$/i;

const HANDOFF_REF = /^Handoff ref \d+/i;

const VAGUE_STEM =
  /^choose the single best answer based on clinical judgment\.?$/i;

/** True when text uses timestamp or handoff chart-entry framing. */
export function hasShiftNoteArtifacts(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (SHIFT_NOTE_PREFIX.test(t)) return true;
  if (/^\d{3,4}\s*—\s*/.test(t) && CHART_METADATA.test(t.split("\n")[0] ?? t)) return true;
  if (/^Handoff report —/i.test(t)) return true;
  if (/^\d{4} — Report on four assigned clients/i.test(t)) return true;
  return t.split("\n").some((line) => SHIFT_NOTE_PREFIX.test(line.trim()));
}

/** Remove leading question-bank id + unit/room line when unrelated chart metadata. */
export function stripLeadingShiftNoteBlock(text: string | null | undefined): string {
  const t = String(text ?? "").trim();
  if (!t) return "";
  const m = t.match(/^(\d{3,4}\s*—\s*)([^?\n]+?)(\.\s*)/);
  if (!m) return t;
  const header = m[2] ?? "";
  if (!CHART_METADATA.test(header)) return t;
  return t.slice(m[0].length).trim();
}

export function isVagueClinicalJudgmentStem(stem: string): boolean {
  return VAGUE_STEM.test(stem.trim());
}

const ACTION_OPTION =
  /^(Notify|Document|Delegate|Reassure|Administer|Establish|Apply|Encourage|Assist|Ask|Hold|Complete|Wait|Measure|Place|Initiate|Assess|Provide|Prepare)/i;

/** Replace generic stems with a specific lead-in inferred from option type. */
export function resolveNclexStem(stem: string, options: string[]): string {
  if (!isVagueClinicalJudgmentStem(stem)) return stem.trim();
  const actionCount = options.filter((o) => ACTION_OPTION.test(o.trim())).length;
  if (actionCount >= 3) return "Which nursing action should the nurse take first?";
  return "Which finding requires immediate nursing follow-up?";
}

/** Split combined bank text: clinical paragraph + generic instruction line. */
export function splitVagueCombinedQuestion(text: string): { vignette?: string; stem: string } {
  const trimmed = text.trim();
  if (isVagueClinicalJudgmentStem(trimmed)) {
    return { stem: "Which nursing action should the nurse take first?" };
  }

  const byNewline = trimmed.split(/\n+(?=Choose the single best answer)/i);
  if (byNewline.length === 2 && byNewline[0]!.length >= 40) {
    return {
      vignette: stripShiftNotes(stripLeadingShiftNoteBlock(byNewline[0]!.trim())),
      stem: "Which nursing action should the nurse take first?",
    };
  }

  const inline = trimmed.match(
    /^(.{40,}?\.)\s*Choose the single best answer based on clinical judgment\.?\s*$/i
  );
  if (inline) {
    return {
      vignette: stripShiftNotes(stripLeadingShiftNoteBlock(inline[1]!.trim())),
      stem: "Which nursing action should the nurse take first?",
    };
  }

  return { stem: trimmed };
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
