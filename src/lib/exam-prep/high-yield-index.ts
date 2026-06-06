/**
 * Central index for 2015–2026 high-yield exam prep seeds.
 * Wired into collectSeedQuestionRows via health-sciences-question-bank.
 */
import type { EnrichedBankItem } from "./seed-helpers";
import { NGN_NURSING_SEEDS } from "./ngn-nursing-seeds";
import { NGN_NURSING_QUALITY_V2 } from "./ngn-nursing-quality-v2";
import { NAPLEX_AREA3_V3 } from "./naplex-area3-v3";
import { NAPLEX_CALC_CASES_V3 } from "./naplex-calc-cases-v3";
import { NAPLEX_QUALITY_V2 } from "./naplex-quality-v2";
import { USMLE_QUALITY_V2 } from "./usmle-quality-v2";
import { USMLE_STEP3_V3 } from "./usmle-step3-v3";
import { NAPLEX_VIGNETTE_SEEDS, USMLE_VIGNETTE_SEEDS } from "./vignette-seeds";

export type HighYieldSeedRow = {
  fieldId: string;
  subjectId: string;
  item: EnrichedBankItem;
};

export function collectHighYieldSeedRows(): HighYieldSeedRow[] {
  const rows: HighYieldSeedRow[] = [];

  for (const item of [...NGN_NURSING_SEEDS, ...NGN_NURSING_QUALITY_V2]) {
    rows.push({
      fieldId: "nursing",
      subjectId: item.subjectId ?? "physiological-adaptation",
      item,
    });
  }

  for (const item of [
    ...NAPLEX_VIGNETTE_SEEDS,
    ...NAPLEX_QUALITY_V2,
    ...NAPLEX_CALC_CASES_V3,
    ...NAPLEX_AREA3_V3,
  ]) {
    rows.push({
      fieldId: "pharmacy",
      subjectId: item.subjectId ?? "patient-counseling",
      item,
    });
  }

  function usmleFieldForItem(item: EnrichedBankItem): string {
    const step = item.ngnPayload?.stepLevel;
    if (step === "step3") return "usmle-step-3";
    if (step === "step2") return "usmle-step-2";
    return "usmle-step-1";
  }

  for (const item of [...USMLE_VIGNETTE_SEEDS, ...USMLE_QUALITY_V2, ...USMLE_STEP3_V3]) {
    rows.push({
      fieldId: usmleFieldForItem(item),
      subjectId: item.subjectId ?? "pathology",
      item,
    });
  }

  return rows;
}
