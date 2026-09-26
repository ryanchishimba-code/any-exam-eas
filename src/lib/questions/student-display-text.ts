/**
 * Student-facing text cleanup. Stored stems, options, keys, and rationales
 * stay as written. Callers apply this at render time.
 */

const VISIT_BATCH = /\s*\(?\bvisit batch\s+\d+\b\)?/gi;

const INTERNAL_META = [
  VISIT_BATCH,
  /\s*\(\s*batch\s+\d+\s*\)/gi,
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

export function stripInternalDisplayMetadata(text: string): string {
  let next = text;
  for (const pattern of INTERNAL_META) {
    next = next.replace(pattern, "");
  }
  return next
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([.?!])/g, "$1")
    .replace(/:\s*,\s*/g, ": ")
    .replace(/,\s*,/g, ",")
    .replace(/\(\s*\)/g, "")
    .trim();
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
