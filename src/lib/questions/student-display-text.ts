/**
 * Student-facing text cleanup. Stored stems, options, keys, and rationales
 * stay as written. Callers apply this at render time.
 */

const VISIT_BATCH = /\s*\(?\bvisit batch\s+\d+\b\)?/gi;

const INTERNAL_META = [
  VISIT_BATCH,
  /\s*\(\s*batch\s+\d+\s*\)/gi,
  /\s*\(\s*unit\s+\d+\s*\)/gi,
  /\s*\(\s*visit\s+\d+\s*\)/gi,
  /\bNABP NAPLEX 2026\b/gi,
];

const EXHIBIT_KIND_LABELS: Record<string, string> = {
  med_label: "Medication label",
  insulin_chart: "Insulin chart",
  lab_panel: "Laboratory panel",
  fetal_strip: "Fetal monitoring strip",
  cxr: "Chest radiograph",
  ecg: "Electrocardiogram",
  histo: "Histology",
  gross: "Gross specimen",
  pathway: "Pathway",
  diagram: "Diagram",
  ppe: "Protective equipment",
  wound: "Wound",
};

/** Student-facing exhibit kind. Internal ids such as med_label stay in the catalog. */
export function studentFacingExhibitKind(kind: string): string {
  const normalized = kind.trim().toLowerCase();
  const known = EXHIBIT_KIND_LABELS[normalized];
  if (known) return known;
  if (/^[a-z0-9_]+$/.test(normalized) && normalized.includes("_")) {
    return normalized
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  return kind.trim();
}

export function studentFacingExhibitTitle(title: string): string {
  const cleaned = stripInternalDisplayMetadata(title);
  if (/^med_label$/i.test(cleaned)) return "Medication label";
  return cleaned;
}

/** Question lead-ins that get glued to the end of a scenario. */
const LEAD_IN =
  /\b(?:Which action|Which of the following|Which finding|Which client|Which nursing|Which assessment|Which task|Which response|What is the priority|What should the nurse)\b/;

/** A quoted phrase split by an authoring line break reads as one sentence. */
function collapseQuoteLineBreaks(text: string): string {
  return text
    .replace(/“([^”]*?)\s*\n+\s*([^”]*?)”/g, "“$1 $2”")
    .replace(/"([^"]*?)\s*\n+\s*([^"]*?)"/g, '"$1 $2"');
}

const REPEATED_LABEL = "Remember|Reviewed|Updated|Revised|Note|Caution|Warning|Trap|Source";

const REVIEW_MONTH = "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec";

/** A lone "Reviewed" heading beside "Reviewed Oct 2026" is the same label twice. */
function dropBareReviewedBesideDate(text: string): string {
  if (!new RegExp(`\\bReviewed\\s+(?:${REVIEW_MONTH})\\b`, "i").test(text)) return text;
  const beside = new RegExp(
    `\\bReviewed\\b\\s+(?=Reviewed\\s+(?:${REVIEW_MONTH})\\b)`,
    "gi"
  );
  const ownLine = new RegExp(
    `(^|\\n)\\s*Reviewed\\s*(?=\\n+\\s*Reviewed\\s+(?:${REVIEW_MONTH})\\b)`,
    "gi"
  );
  return text.replace(ownLine, "$1").replace(beside, "");
}

const BOW_TIE_COUNT = "one|two|three|four|1|2|3|4";

function bowTieCount(word: string): number {
  const named: Record<string, number> = { one: 1, two: 2, three: 3, four: 4 };
  return named[word.toLowerCase()] ?? Number(word);
}

/** Stem, banner, and body use one bow-tie sentence. */
export function normalizeBowTieInstruction(text: string): string {
  const pattern = new RegExp(
    `(?:complete the bow-tie(?: diagram)?[:,]?\\s*)?(?:select|choose)\\s+(?:exactly\\s+)?(${BOW_TIE_COUNT})\\s+actions?\\s+to take\\s+and\\s+(?:the required number of\\s+)?(${BOW_TIE_COUNT})\\s+(?:conditions?|parameters?|findings?)\\s+to monitor\\.*`,
    "gi"
  );
  const shortPattern = new RegExp(
    `(?:complete the bow-tie(?: diagram)?[:,]?\\s*)?(?:select|choose)\\s+(?:exactly\\s+)?(${BOW_TIE_COUNT})\\s+actions?\\s+and\\s+(?:exactly\\s+)?(${BOW_TIE_COUNT})\\s+(?:conditions?|parameters?|findings?)\\s+to monitor\\.*`,
    "gi"
  );
  const rewrite = (_match: string, actions: string, monitors: string) => {
    const actionCount = bowTieCount(actions);
    const monitorCount = bowTieCount(monitors);
    const actionLabel = `${actionCount} action${actionCount === 1 ? "" : "s"}`;
    const monitorLabel = `${monitorCount} parameter${monitorCount === 1 ? "" : "s"}`;
    return `Choose the condition, ${actionLabel} to take, and ${monitorLabel} to monitor.`;
  };
  return text.replace(pattern, rewrite).replace(shortPattern, rewrite);
}

/** "Remember: Remember" and "Reviewed Reviewed" collapse to one label. */
export function collapseRepeatedLabels(text: string): string {
  const labeled = new RegExp(`\\b(${REPEATED_LABEL})\\b\\s*[:：]\\s*\\1\\b\\s*[,:]?\\s*`, "gi");
  const doubled = new RegExp(`\\b(${REPEATED_LABEL})\\b(?:\\s+\\1\\b)+`, "gi");
  return text.replace(labeled, "$1: ").replace(doubled, "$1");
}

/**
 * A closing quote that landed on the instruction line belongs back on the scenario.
 * The instruction then starts at Which / What / How.
 */
export function repairSplitInstructionQuote(
  vignette: string,
  stem: string
): { vignette: string; stem: string } {
  const straight = (vignette.match(/"/g) ?? []).length;
  const curlyOpen = (vignette.match(/“/g) ?? []).length;
  const curlyClose = (vignette.match(/”/g) ?? []).length;
  const unclosed = straight % 2 === 1 || curlyOpen > curlyClose;
  if (unclosed && /^["“]\s+/.test(stem)) {
    const closer = curlyOpen > curlyClose ? "”" : '"';
    return {
      vignette: `${vignette.trim()}${closer}`,
      stem: stem.replace(/^["“]\s+/, ""),
    };
  }
  return { vignette, stem };
}

/**
 * Dose tokens that mark a split number as a decimal, not a new sentence.
 * Tablets, doses, and hours are left alone.
 */
const DOSE_UNIT =
  "mcg\\/kg|mg\\/kg|mcg\\/kg\\/min|meq\\/l|mg\\/dl|ml\\/hr|ml\\/h|mcg|meq|mmol|mg|ml|units?|iu|ng|gtt|g|l";

/**
 * Join a space that broke a decimal ("0. 125 mg", "2. 5 mL").
 * A lone 0 before the period is always a decimal. Any other join needs 1–2
 * digits before the period and a dose unit right after the fraction.
 * Clock times (0800) and sentence breaks ("Day 1. 3 doses") stay put.
 */
export function joinBrokenDoseDecimals(text: string): string {
  const withLeadingZero = text.replace(/\b0\.\s+(?=\d)/g, "0.");
  const withUnit = new RegExp(
    `(?<!\\d)(\\d{1,2})\\.\\s+(?=\\d+\\s*(?:(?:${DOSE_UNIT})\\b|%))`,
    "gi"
  );
  return withLeadingZero.replace(withUnit, "$1.");
}

/** Close a stem that opened "(" and never closed it, keeping the final punctuation. */
export function closeDanglingParen(text: string): string {
  const open = (text.match(/\(/g) ?? []).length;
  const close = (text.match(/\)/g) ?? []).length;
  if (open <= close) return text;
  let next = text;
  for (let i = 0; i < open - close; i += 1) {
    if (/[.?!]$/.test(next)) next = `${next.slice(0, -1)})${next.slice(-1)}`;
    else next = `${next})`;
  }
  return next;
}

export function stripInternalDisplayMetadata(text: string): string {
  if (typeof text !== "string" || !text) return "";
  let next = normalizeBowTieInstruction(dropBareReviewedBesideDate(collapseRepeatedLabels(collapseQuoteLineBreaks(text))));
  next = joinBrokenDoseDecimals(next).replace(/\b1\s+hours\b/gi, "1 hour");
  for (const pattern of INTERNAL_META) {
    next = next.replace(pattern, "");
  }
  next = next
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([.?!])/g, "$1")
    .replace(/:\s*,\s*/g, ": ")
    .replace(/,\s*,/g, ",")
    .replace(/\(\s*\)/g, "")
    .replace(/\.\s*\)\s*\?/g, ".")
    .replace(/\)\s*\?/g, ")")
    .replace(/\.\.(?!\.)/g, ".")
    .replace(/^["“]\s+(?=(?:which|what|how)\b)/i, "")
    .trim();
  return closeDanglingParen(next);
}

const CITATION_REQUIRES_STEM: { citation: RegExp; stem: RegExp }[] = [
  { citation: /heart failure|hf guideline/i, stem: /heart failure|\bhf\b|ejection fraction|\bnyha\b/i },
  {
    citation: /joint commission|patient identification|patient id/i,
    stem: /identif|two identifiers|name and (?:dob|date of birth)|patient id/i,
  },
];

/** Hide a bare outline label, and a citation whose topic is absent from the stem. */
export function citationFitsQuestion(label: string, stem: string): boolean {
  const cleaned = label.trim();
  if (!cleaned) return false;
  if (/^(?:source|content outline|source\s*\/\s*content outline|nabp naplex(?: content outline)?)$/i.test(cleaned)) {
    return false;
  }
  if (/^source\s+\d+\b/i.test(cleaned)) return false;
  const scene = stem.trim();
  if (!scene) return true;
  if (/clinical judgment measurement model/i.test(cleaned) && !/\b(cjmm|clinical judgment|ngn)\b/i.test(scene)) {
    return false;
  }
  return CITATION_REQUIRES_STEM.every((rule) => !rule.citation.test(cleaned) || rule.stem.test(scene));
}

/** Hide an MDI diagram on a dry-powder item, and the reverse. */
export function figureFitsQuestion(caption: string, stem: string): boolean {
  const cap = caption.toLowerCase();
  const text = stem.toLowerCase();
  const capMdi = /\bmdi\b|metered[- ]dose/.test(cap);
  const capDpi = /\bdpi\b|dry[- ]powder|diskus/.test(cap);
  const stemMdi = /\bmdi\b|metered[- ]dose/.test(text);
  const stemDpi = /\bdpi\b|dry[- ]powder|diskus/.test(text);
  if (capMdi && stemDpi && !stemMdi) return false;
  if (capDpi && stemMdi && !stemDpi) return false;
  return true;
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

/**
 * The scenario sometimes already ends with the question line, which then
 * repeats under it. Drop that ending so the question is shown once.
 */
export function vignetteWithoutRepeatedQuestion(vignette: string, stem: string): string {
  const scene = stripInternalDisplayMetadata(vignette);
  const ask = stripInternalDisplayMetadata(stem);
  if (!scene || !ask || ask.length < 12) return scene;
  const loose = (value: string) =>
    value
      .toLowerCase()
      .replace(/["'“”]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const sceneLoose = loose(scene);
  const askLoose = loose(ask);
  if (!sceneLoose.endsWith(askLoose)) return scene;
  const pattern = askLoose.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+");
  const stripped = scene
    .replace(new RegExp(`(?:["'“”]\\s*)?${pattern}\\s*$`, "i"), "")
    .replace(/[\s"'“”]+$/g, "")
    .trim();
  return stripped;
}

export function studentFacingVignette(text: string): string {
  return stripInternalDisplayMetadata(text);
}
