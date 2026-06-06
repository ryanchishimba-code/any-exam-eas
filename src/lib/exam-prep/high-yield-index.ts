/**
 * Central index for 2015–2026 high-yield exam prep seeds.
 * Wired into collectSeedQuestionRows via health-sciences-question-bank.
 */
import type { EnrichedBankItem } from "./seed-helpers";
import { NGN_NURSING_SEEDS } from "./ngn-nursing-seeds";
import { NAPLEX_VIGNETTE_SEEDS, USMLE_VIGNETTE_SEEDS } from "./vignette-seeds";

export type HighYieldSeedRow = {
  fieldId: string;
  subjectId: string;
  item: EnrichedBankItem;
};

export function collectHighYieldSeedRows(): HighYieldSeedRow[] {
  const rows: HighYieldSeedRow[] = [];

  for (const item of NGN_NURSING_SEEDS) {
    rows.push({
      fieldId: "nursing",
      subjectId: item.subjectId ?? "physiological-adaptation",
      item,
    });
  }

  for (const item of NAPLEX_VIGNETTE_SEEDS) {
    rows.push({
      fieldId: "pharmacy",
      subjectId: item.subjectId ?? "patient-counseling",
      item,
    });
  }

  for (const item of USMLE_VIGNETTE_SEEDS) {
    rows.push({
      fieldId: "usmle-step-1",
      subjectId: item.subjectId ?? "pathology",
      item,
    });
  }

  return rows;
}
