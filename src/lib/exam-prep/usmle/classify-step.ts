/**
 * Keyword-based USMLE step (exam_type) classifier.
 *
 * The canonical exam_type is `stepLevel` (step1 | step2 | step3), kept in sync with
 * the per-step `fieldId` (usmle-step-1/2/3). Most rows are already separated by
 * field, but some are untagged or mis-filed (e.g. a Step 3 biostats/CCS item stored
 * under the usmle-step-2 field by the legacy full-exam inserter). This module infers
 * the correct step purely from question metadata + stem text, so the classification
 * script can backfill / correct rows. It is intentionally dependency-free and pure
 * so it is fast and unit-testable; the script layer adds optional LLM tie-breaking.
 */
import type { UsmleStepLevel } from "./types";
import { USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES } from "./steps";

export type UsmleStepConfidence = "high" | "medium" | "low";

export type UsmleStepGuess = {
  /** Inferred step, or null when nothing (not even fieldId) is informative. */
  step: UsmleStepLevel | null;
  confidence: UsmleStepConfidence;
  /** Short human-readable explanation of the deciding signal. */
  reason: string;
};

export type UsmleStepClassifierInput = {
  fieldId?: string | null;
  stepLevel?: string | null;
  subjectId?: string | null;
  itemType?: string | null;
  blueprintDomain?: string | null;
  blueprintTopic?: string | null;
  topicCategory?: string | null;
  /** JSON array string or comma-separated list. */
  tags?: string | null;
  question?: string | null;
  scenario?: string | null;
};

/** Step 1 — foundational biomedical sciences. */
const STEP1_PATTERNS =
  /\b(anatom|physiolog|patholog(?:y|ic)|pharmacolog|biochem|microbiolog|immunolog|histolog|embryolog|genetics|molecular biology|cell biology|mechanism of action|mechanism of disease|enzyme|metabolic pathway|receptor (?:agonis|antagonis)|first aid)\b/i;

/** Step 3 — biostatistics, ethics, abstracts, drug ads, CCS, systems-based practice. */
const STEP3_PATTERNS =
  /\b(biostatistic|statistic|number needed to treat|likelihood ratio|odds ratio|confidence interval|sensitivity|specificity|study design|cohort study|case-control|randomized controlled|p-?value|pharmaceutical ad|drug advertisement|abstract|clinical case simulation|\bccs\b|quality improvement|patient safety|systems-based|root cause|ethics|informed consent|end-of-life|advance directive)\b/i;

/** Step 2 CK — clinical diagnosis & next-best-step management. */
const STEP2_PATTERNS =
  /\b(next best step|most appropriate next step|best next step|initial step in management|most appropriate management|most likely diagnosis|initial treatment|first-line treatment|appropriate workup|next step in diagnosis|management of)\b/i;

function buildHaystack(input: UsmleStepClassifierInput): string {
  const parts = [
    input.subjectId,
    input.itemType,
    input.blueprintDomain,
    input.blueprintTopic,
    input.topicCategory,
    input.tags,
    input.scenario?.slice(0, 600),
    input.question?.slice(0, 600),
  ];
  return parts.filter(Boolean).join(" \n ").toLowerCase();
}

function stepFromFieldId(fieldId?: string | null): UsmleStepLevel | null {
  switch (fieldId) {
    case "usmle-step-1":
      return "step1";
    case "usmle-step-2":
      return "step2";
    case "usmle-step-3":
      return "step3";
    default:
      return null;
  }
}

/**
 * Infer the USMLE step for a question-bank row.
 *
 * Strong content signals (Step 3 item types, biostat/ethics vocabulary, basic-science
 * vocabulary) win with high confidence; otherwise the row's existing `fieldId` is used
 * as a medium-confidence fallback. Returns `step: null` only when there is nothing to
 * go on at all (no field, no signals).
 */
export function classifyUsmleStep(input: UsmleStepClassifierInput): UsmleStepGuess {
  const itemType = (input.itemType ?? "").toLowerCase();
  const haystack = buildHaystack(input);
  const fieldStep = stepFromFieldId(input.fieldId);

  // 1. Step 3 non-vignette item types are definitive.
  if (USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES.has(itemType)) {
    return { step: "step3", confidence: "high", reason: `itemType "${itemType}"` };
  }

  // 2. Strong vocabulary signals.
  const step3Hit = STEP3_PATTERNS.test(haystack);
  const step1Hit = STEP1_PATTERNS.test(haystack);
  const step2Hit = STEP2_PATTERNS.test(haystack);

  // Step 3 vocabulary is the most distinctive — trust it over generic clinical text.
  if (step3Hit && !step1Hit) {
    return { step: "step3", confidence: "high", reason: "Step 3 vocabulary (biostats/ethics/CCS)" };
  }

  // Basic-science vocabulary without management language → Step 1.
  if (step1Hit && !step2Hit) {
    return { step: "step1", confidence: "high", reason: "basic-science vocabulary" };
  }

  // Explicit clinical management phrasing → Step 2 CK.
  if (step2Hit && !step1Hit) {
    return { step: "step2", confidence: "high", reason: "clinical management phrasing" };
  }

  // 3. Mixed/weak signals — disambiguate with the field, else best single hit.
  if (fieldStep) {
    return { step: fieldStep, confidence: "medium", reason: `fieldId "${input.fieldId}"` };
  }
  if (step2Hit) return { step: "step2", confidence: "low", reason: "weak clinical signal" };
  if (step1Hit) return { step: "step1", confidence: "low", reason: "weak basic-science signal" };
  if (step3Hit) return { step: "step3", confidence: "low", reason: "weak Step 3 signal" };

  return { step: null, confidence: "low", reason: "no signal" };
}

/** Map an inferred step to its canonical per-step field id. */
export function fieldIdForUsmleStep(step: UsmleStepLevel): "usmle-step-1" | "usmle-step-2" | "usmle-step-3" {
  return step === "step1" ? "usmle-step-1" : step === "step3" ? "usmle-step-3" : "usmle-step-2";
}
