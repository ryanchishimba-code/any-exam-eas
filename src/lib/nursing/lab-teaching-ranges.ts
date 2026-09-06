/**
 * Teaching lab ranges for NCLEX practice — not an official NCSBN list.
 * Act on the value printed on the item.
 */

export type LabTeachingRow = {
  id: string;
  name: string;
  /** Teaching range string for study (not diagnostic). */
  teachingRange: string;
  unit?: string;
  /** First-nurse-action cue when critically out of range. */
  firstNurseAction: string;
  /** Attach this row on miss when item has matching lab_flags. */
  attachOnMiss: boolean;
  /** Priority flags for Today / Deep Dive. */
  priority: boolean;
};

export const LAB_TEACHING_DISCLAIMER =
  "Teaching ranges. Act on the value printed on the item — facility reference ranges and the vignette always win.";

/** Priority + common teaching labs for NCLEX miss attachments. */
export const LAB_TEACHING_RANGES: LabTeachingRow[] = [
  {
    id: "k",
    name: "Potassium (K⁺)",
    teachingRange: "3.5–5.0",
    unit: "mEq/L",
    firstNurseAction:
      "Hold K-wasting/K-sparing drugs as indicated; cardiac monitor; notify provider for critical highs/lows.",
    attachOnMiss: true,
    priority: true,
  },
  {
    id: "na",
    name: "Sodium (Na⁺)",
    teachingRange: "135–145",
    unit: "mEq/L",
    firstNurseAction:
      "Assess neuro status and fluid balance; do not correct rapidly; follow ordered fluid/Na plan.",
    attachOnMiss: true,
    priority: true,
  },
  {
    id: "glucose",
    name: "Glucose",
    teachingRange: "70–110 fasting (teaching)",
    unit: "mg/dL",
    firstNurseAction:
      "Hypoglycemia: give 15g carb / glucagon / D50 per protocol; recheck. Hyperglycemia: assess ketones, fluids, insulin orders.",
    attachOnMiss: true,
    priority: true,
  },
  {
    id: "o2-abg",
    name: "O₂ sat / ABG cues",
    teachingRange: "SpO₂ ≥ 95% typical (COPD targets may be lower)",
    firstNurseAction:
      "Airway/breathing first — O₂ per order, raise HOB, prepare for ABG/vent support if deteriorating.",
    attachOnMiss: true,
    priority: true,
  },
  {
    id: "inr-aptt",
    name: "INR / aPTT",
    teachingRange: "INR ~0.8–1.1 (therapeutic warfarin often 2–3); aPTT ~25–35 s baseline",
    firstNurseAction:
      "Hold anticoagulant if critically high; assess bleeding; follow reversal protocol (vit K, protamine, PCC) per order.",
    attachOnMiss: true,
    priority: true,
  },
  {
    id: "creatinine",
    name: "Creatinine",
    teachingRange: "~0.6–1.2 (teaching; sex/muscle mass vary)",
    unit: "mg/dL",
    firstNurseAction:
      "Hold nephrotoxic meds as ordered; check I&O; dose-adjust renally cleared drugs; report rising trend.",
    attachOnMiss: true,
    priority: true,
  },
  {
    id: "wbc",
    name: "WBC",
    teachingRange: "4.5–11 ×10³/µL (teaching)",
    firstNurseAction: "Neutropenic precautions if low; infection workup if high with fever.",
    attachOnMiss: true,
    priority: false,
  },
  {
    id: "hgb",
    name: "Hemoglobin",
    teachingRange: "~12–17 g/dL (teaching; sex-specific)",
    firstNurseAction: "Assess bleeding/perfusion; prepare for transfusion per order if symptomatic.",
    attachOnMiss: true,
    priority: false,
  },
];

export function labRowsForFlags(flags: string[] | null | undefined): LabTeachingRow[] {
  if (!flags?.length) return [];
  const set = new Set(flags.map((f) => f.toLowerCase()));
  return LAB_TEACHING_RANGES.filter(
    (row) => set.has(row.id) || flags.some((f) => f.toLowerCase().includes(row.id))
  );
}

export function priorityLabRows(): LabTeachingRow[] {
  return LAB_TEACHING_RANGES.filter((r) => r.priority);
}
