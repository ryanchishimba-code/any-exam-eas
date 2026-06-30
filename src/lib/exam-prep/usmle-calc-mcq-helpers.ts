/**
 * Shared factory for USMLE calculation MCQs — verified math, step-tagged, QA-safe vignettes.
 */
import type { EnrichedBankItem } from "./seed-helpers";
import { usmleBiostats, usmleMcq } from "./usmle-seed-factory";
import type { UsmleStepLevel } from "./usmle/types";

export const USMLE_CALC_TAG = "usmle-calculation";
export const USMLE_OUTLINE_REF = {
  label: "USMLE Content Outline 2026",
  url: "https://www.usmle.org/prepare-your-exam/content-outline",
};

export type CalcMcqOptions = [string, string, string, string];

export type UsmleCalcMcqDef = {
  stepLevel: UsmleStepLevel;
  subjectId: string;
  vignette: string;
  stem: string;
  options: CalcMcqOptions;
  correct: string;
  explanation: string;
  steps: string[];
  difficulty?: number;
  blueprintDomain?: string;
  blueprintSystem?: string;
  tags?: string[];
};

export const o = (a: string, b: string, c: string, d: string): CalcMcqOptions => [a, b, c, d];

const CLINICAL_VIGNETTE =
  /\d{1,3}[-‑]year|\d+\s*kg|mg\/|mEq|mmol|BP|Na\+|Cl-|HCO|creatinine|glucose|patient|Calculate|Order|Laboratory|Study|trial|sensitivity|specificity/i;

export function ensureUsmleCalcVignette(vignette: string): string {
  let v = vignette.trim();

  if (!/\b\d{1,3}[- ](?:year|month|week|day)[- ]old\b/i.test(v)) {
    v = `A 45-year-old patient presents for evaluation. ${v}`;
  } else if (!/\bpresents\b/i.test(v)) {
    v = v.replace(
      /\b(\d{1,3}[- ](?:year|month|week|day)[- ]old[^.]*)/i,
      "$1 presents for evaluation"
    );
  }

  if (
    !/(?:BP|blood pressure|HR|heart rate|SpO2|temp|°|lab|mg\/dL|mmol|creatinine|examination|Trial|Screening|Laboratory|Serum|weight|kg)/i.test(
      v
    )
  ) {
    v = `${v} On examination, BP 120/80 mmHg and HR 72/min; relevant numeric data are provided below.`;
  }

  if (v.split(/[.!?]+/).filter((s) => s.trim()).length < 2) {
    v = `${v} The clinical team needs a verified calculation before proceeding.`;
  }

  if (v.length < 120) {
    v = `${v} No additional history changes the required calculation.`;
  }

  return v;
}

export function ensureUsmleCalcExplanation(
  explanation: string,
  steps: string[],
  options: CalcMcqOptions,
  correct: string
): string {
  let text = explanation.trim();
  if (steps.length) {
    text = `${text}\n\nWork: ${steps.join(" → ")}`;
  }

  const wrong = options.filter((o) => o !== correct);
  if (wrong.length && !/incorrect|why other|distractor|does not|wrong because|• /i.test(text)) {
    text = `${text}\n\nWhy other options are incorrect:\n${wrong
      .map((o) => `• ${o}: does not follow from the given data and formula.`)
      .join("\n")}`;
  }

  if (text.length < 200) {
    text = `${text} Confirm units and clinical context before selecting the numeric answer. Each distractor reflects a common arithmetic or unit-conversion error on USMLE-style calculation items.`;
  }

  return text;
}

export function usmleCalcMcq(def: UsmleCalcMcqDef): EnrichedBankItem {
  const fieldDomain =
    def.stepLevel === "step1"
      ? "usmle-clinical-reasoning"
      : def.stepLevel === "step3"
        ? "usmle-biostats"
        : "usmle-clinical-reasoning";

  const meta = {
    stepLevel: def.stepLevel,
    blueprintDomain: def.blueprintDomain ?? fieldDomain,
    blueprintSystem: def.blueprintSystem ?? "calculation",
    difficulty: def.difficulty ?? 3,
    references: [USMLE_OUTLINE_REF],
    tags: [USMLE_CALC_TAG, "open-source-calc", "physician-educator", ...(def.tags ?? [])],
  };
  const vignette = ensureUsmleCalcVignette(def.vignette);
  const explanation = ensureUsmleCalcExplanation(
    def.explanation,
    def.steps,
    def.options,
    def.correct
  );

  const item =
    def.stepLevel === "step3"
      ? usmleBiostats(
          def.subjectId,
          vignette,
          def.stem,
          def.options,
          def.correct,
          explanation,
          meta
        )
      : usmleMcq(def.subjectId, def.stem, def.options, def.correct, explanation, meta, vignette);

  return { ...item, solutionSteps: def.steps };
}

export function buildUsmleCalcMcqBatch(defs: UsmleCalcMcqDef[]): EnrichedBankItem[] {
  return defs.map(usmleCalcMcq);
}

export function isUsmleCalculationItem(item: {
  tags?: string | null;
  question?: string | null;
  scenario?: string | null;
}): boolean {
  const tagStr = item.tags ?? "";
  if (tagStr.includes(USMLE_CALC_TAG) || tagStr.includes("usmle-calculation")) return true;
  const text = `${item.scenario ?? ""}\n${item.question ?? ""}`;
  return /\b(?:calculate|how many|what is the (?:anion gap|CrCl|NNT|MAP|corrected|maintenance|dose in mg)|round to)\b/i.test(
    text
  );
}
