/**
 * Student-facing text cleanup. Stored stems, options, keys, and rationales
 * stay as written. Callers apply this at render time.
 */

const VISIT_BATCH = /\s*\(?\bvisit batch\s+\d+\b\)?/gi;

const INTERNAL_META = [
  VISIT_BATCH,
  /\s*\(\s*batch\s+\d+\s*\)/gi,
  /\s*\(\s*unit\s+\d+\s*\)/gi,
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

export function stripInternalDisplayMetadata(text: string): string {
  let next = collapseQuoteLineBreaks(text);
  for (const pattern of INTERNAL_META) {
    next = next.replace(pattern, "");
  }
  return next
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([.?!])/g, "$1")
    .replace(/:\s*,\s*/g, ": ")
    .replace(/,\s*,/g, ",")
    .replace(/\(\s*\)/g, "")
    .replace(/\.\s*\)\s*\?/g, ".")
    .replace(/\)\s*\?/g, ")")
    .replace(/\.\.(?!\.)/g, ".")
    .trim();
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
  const scene = stem.trim();
  if (!scene) return true;
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
