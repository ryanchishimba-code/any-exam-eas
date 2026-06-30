import { USMLE_CALC_MCQ_ALL } from "./usmle-calc-mcq-curated";
import { generateUsmleProceduralCalcs } from "./usmle-calc-procedural";

/** Curated hand-authored calculation MCQs (12 per step). */
export { USMLE_CALC_MCQ_ALL, USMLE_STEP1_CALC_CURATED, USMLE_STEP2_CALC_CURATED, USMLE_STEP3_CALC_CURATED } from "./usmle-calc-mcq-curated";

/** Procedural pool — parametric, deduped by vignette+answer. */
export function buildUsmleCalcPool(proceduralPerStep = 150) {
  return [...USMLE_CALC_MCQ_ALL, ...generateUsmleProceduralCalcs(proceduralPerStep)];
}

export const USMLE_CALC_MCQ_POOL = buildUsmleCalcPool(150);
