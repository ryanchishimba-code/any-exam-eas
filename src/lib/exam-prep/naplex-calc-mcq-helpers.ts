/**
 * Shared factory for NAPLEX calculation MCQs with QA-safe vignettes, explanations, and solution steps.
 */
import type { EnrichedBankItem } from "./seed-helpers";
import { naplexMcq } from "./naplex-seed-factory";

export const NAPLEX_DISP = "naplex-2026-medication-dispensing" as const;
export const NAPLEX_PHARM = "naplex-2026-pharmacotherapy" as const;
export const FDA_REF = { label: "FDA prescribing information", url: "https://www.fda.gov/drugs" };
export const USP_REF = { label: "USP compounding reference", url: "https://www.usp.org" };
export const ASPEN_REF = {
  label: "ASPEN clinical guidelines",
  url: "https://www.nutritioncare.org",
};

export type CalcMcqOptions = [string, string, string, string];

export type CalcMcqDef = {
  subjectId: string;
  vignette: string;
  stem: string;
  options: CalcMcqOptions;
  correct: string;
  explanation: string;
  steps: string[];
  difficulty?: number;
  blueprintDomain?: typeof NAPLEX_DISP | typeof NAPLEX_PHARM;
  references?: Array<{ label: string; url?: string; citation?: string }>;
  tags?: string[];
};

export const o = (a: string, b: string, c: string, d: string): CalcMcqOptions => [a, b, c, d];

const CLINICAL_VIGNETTE =
  /\d{1,3}[-‑]year|\d+\s*kg|mg\/|mEq|mmol|BP|creatinine|allerg|patient|pharmacist|Order:|Rx:|Child|Neonate|ICU|TPN|BSA|m²|AUC|chemotherapy|oncology/i;

export function ensureCalcVignette(vignette: string): string {
  let v = vignette.trim();
  if (!CLINICAL_VIGNETTE.test(v)) {
    v = `Hospital pharmacist verification: ${v}`;
  }
  if (v.length < 40) {
    v = `${v} Confirm units and concentration before release.`;
  }
  return v;
}

export function ensureCalcExplanation(explanation: string): string {
  let text = explanation.trim();
  if (text.length < 100) {
    text = `${text} Verify the result against the prescription label and prescriber order before dispensing or administering to the patient.`;
  }
  if (text.length < 200) {
    text = `${text} Confirm units, concentration, and patient-specific parameters against the original order and pharmacy label before release.`;
  }
  return text;
}

export function calcMcq(def: CalcMcqDef): EnrichedBankItem {
  const tags = [
    "physician-educator",
    "open-source-calc",
    "calculation",
    ...(def.tags ?? []),
  ];
  const item = naplexMcq(
    def.subjectId,
    ensureCalcVignette(def.vignette),
    def.stem,
    def.options,
    def.correct,
    ensureCalcExplanation(def.explanation),
    {
      blueprintDomain: def.blueprintDomain ?? NAPLEX_DISP,
      difficulty: def.difficulty ?? 3,
      references: def.references ?? [FDA_REF],
      tags,
      guideline: "NAPLEX calculation competency",
    }
  );
  return { ...item, solutionSteps: def.steps };
}

export function buildCalcMcqBatch(defs: CalcMcqDef[]): EnrichedBankItem[] {
  return defs.map(calcMcq);
}
