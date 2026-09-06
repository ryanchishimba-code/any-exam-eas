/**
 * Teaching lab ranges for NAPLEX miss attachments.
 * Label: “Teaching ranges. Act on the number in the stem.”
 */

export type LabTeachingRange = {
  id: string;
  label: string;
  teachingRange: string;
  note?: string;
};

export const NAPLEX_LAB_TEACHING_DISCLAIMER =
  "Teaching ranges. Act on the number in the stem.";

/** Priority labs to attach-on-miss for NAPLEX. */
export const NAPLEX_PRIORITY_LABS: LabTeachingRange[] = [
  {
    id: "crcl-egfr",
    label: "CrCl / eGFR",
    teachingRange: "Interpret stem CrCl/eGFR for renal dosing — do not invent a value",
    note: "DOAC, antibiotic, and metformin decisions hinge on the given clearance",
  },
  {
    id: "potassium",
    label: "Potassium (K⁺)",
    teachingRange: "Typical adult serum K⁺ ~3.5–5.0 mEq/L (lab-dependent)",
    note: "Hold digoxin / ACE / MRA / potassium when hyperkalemia is in the stem",
  },
  {
    id: "inr-aptt",
    label: "INR / aPTT",
    teachingRange: "Therapeutic INR and aPTT goals are stem-specific",
    note: "Warfarin bleed/clot flips and heparin protocol changes",
  },
  {
    id: "lfts",
    label: "LFTs",
    teachingRange: "AST/ALT/bilirubin elevations guide hold/adjust decisions",
  },
  {
    id: "vanc-ag-trough",
    label: "Vancomycin / AG trough",
    teachingRange: "Use the stem trough + timing — AUC/MIC or trough targets vary by protocol",
  },
  {
    id: "tsh",
    label: "TSH",
    teachingRange: "Levothyroxine adjust from TSH trend in the stem",
  },
  {
    id: "a1c",
    label: "A1c",
    teachingRange: "ADA targets are context-dependent; follow stem goals",
  },
  {
    id: "anc",
    label: "ANC",
    teachingRange: "Neutropenia thresholds drive chemo hold and filgrastim decisions",
  },
  {
    id: "qtc",
    label: "QTc-related",
    teachingRange: "Drug–drug QTc risk — act on the reported interval / symptoms",
  },
];

export const NAPLEX_CALC_PATTERN_CARDS = [
  { id: "mg-kg", label: "mg/kg dosing" },
  { id: "ml-hr", label: "mL/hr infusion rate" },
  { id: "meq", label: "mEq conversions" },
  { id: "alligation", label: "Alligation" },
  { id: "tpn", label: "TPN / macronutrient calc" },
  { id: "crcl", label: "CrCl (Cockcroft–Gault)" },
  { id: "bioavailability", label: "Bioavailability (F)" },
  { id: "half-life", label: "Half-life (t½)" },
] as const;

export function naplexLabRowsForFlags(
  flags: string[] | null | undefined
): LabTeachingRange[] {
  if (!flags?.length) return [];
  const set = new Set(flags.map((f) => f.toLowerCase()));
  return NAPLEX_PRIORITY_LABS.filter(
    (row) =>
      set.has(row.id) ||
      flags.some(
        (f) =>
          f.toLowerCase().includes(row.id) ||
          row.id.includes(f.toLowerCase()) ||
          row.label.toLowerCase().includes(f.toLowerCase())
      )
  );
}

export function naplexCalcPatternsForFlags(
  flags: string[] | null | undefined
): Array<(typeof NAPLEX_CALC_PATTERN_CARDS)[number]> {
  if (!flags?.length) return [];
  const set = new Set(flags.map((f) => f.toLowerCase()));
  const matched = NAPLEX_CALC_PATTERN_CARDS.filter(
    (card) =>
      set.has(card.id) ||
      flags.some(
        (f) =>
          f.toLowerCase().includes(card.id) ||
          card.id.includes(f.toLowerCase()) ||
          card.label.toLowerCase().includes(f.toLowerCase())
      )
  );
  // Generic "calculation" flag → pin common Domain 1 patterns under beat 2.
  if (matched.length === 0 && flags.some((f) => /calc/i.test(f))) {
    return NAPLEX_CALC_PATTERN_CARDS.filter((c) =>
      ["mg-kg", "ml-hr", "crcl", "alligation"].includes(c.id)
    );
  }
  return matched;
}
