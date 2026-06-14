/**
 * Central index for 2015–2026 high-yield exam prep seeds.
 * Wired into collectSeedQuestionRows via health-sciences-question-bank.
 */
import type { EnrichedBankItem } from "./seed-helpers";
import { NGN_NURSING_SEEDS } from "./ngn-nursing-seeds";
import { NGN_NURSING_QUALITY_V2 } from "./ngn-nursing-quality-v2";
import { NCLEX_CURATED_QUALITY } from "./nclex-curated-quality";
import { NAPLEX_AREA3_V3 } from "./naplex-area3-v3";
import { NAPLEX_CALC_CASES_V3 } from "./naplex-calc-cases-v3";
import { NAPLEX_QUALITY_V2 } from "./naplex-quality-v2";
import { USMLE_QUALITY_V2 } from "./usmle-quality-v2";
import { USMLE_STEP3_V3 } from "./usmle-step3-v3";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-01";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_02 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-02";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_03 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-03";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_04 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-04";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_05 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-05";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_06 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-06";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_07 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-07";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_08 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-08";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_09 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-09";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_10 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-10";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_11 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-11";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_12 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-12";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_13 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-13";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_14 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-14";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_15 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-15";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_16 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-16";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_17 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-17";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_18 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-18";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_19 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-19";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_20 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-20";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_21 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-21";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_22 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-22";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_23 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-23";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_24 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-24";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_25 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-25";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_26 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-26";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_27 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-27";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_28 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-28";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_29 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-29";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_30 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-30";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_31 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-31";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_32 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-32";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_33 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-33";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_34 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-34";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_35 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-35";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_36 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-36";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_37 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-37";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_38 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-38";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_39 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-39";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_40 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-40";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_41 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-41";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_42 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-42";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_43 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-43";
import { NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/naplex-physician-educator-batch-01";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-01";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_02 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-02";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_03 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-03";
import { NAPLEX_VIGNETTE_SEEDS, USMLE_VIGNETTE_SEEDS } from "./vignette-seeds";
import { isMpjeBestQuality } from "./mpje-quality-gate";

export { MPJE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-01";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_02 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-02";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_03 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-03";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_04 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-04";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_05 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-05";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_06 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-06";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_07 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-07";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_08 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-08";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_09 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-09";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_10 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-10";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_11 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-11";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_12 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-12";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_13 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-13";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_14 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-14";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_15 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-15";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_16 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-16";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_17 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-17";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_18 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-18";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_19 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-19";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_20 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-20";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_21 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-21";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_22 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-22";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_23 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-23";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_24 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-24";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_25 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-25";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_26 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-26";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_27 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-27";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_28 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-28";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_29 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-29";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_30 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-30";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_31 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-31";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_32 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-32";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_33 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-33";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_34 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-34";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_35 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-35";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_36 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-36";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_37 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-37";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_38 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-38";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_39 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-39";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_40 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-40";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_41 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-41";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_42 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-42";
export { MPJE_PHYSICIAN_EDUCATOR_BATCH_43 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-43";
export { NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/naplex-physician-educator-batch-01";
export { USMLE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-01";
export { USMLE_PHYSICIAN_EDUCATOR_BATCH_02 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-02";
export { USMLE_PHYSICIAN_EDUCATOR_BATCH_03 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-03";

export type HighYieldSeedRow = {
  fieldId: string;
  subjectId: string;
  item: EnrichedBankItem;
};

export function collectHighYieldSeedRows(): HighYieldSeedRow[] {
  const rows: HighYieldSeedRow[] = [];

  for (const item of [...NGN_NURSING_SEEDS, ...NGN_NURSING_QUALITY_V2, ...NCLEX_CURATED_QUALITY]) {
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
    ...NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01,
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

  for (const item of [
    ...USMLE_VIGNETTE_SEEDS,
    ...USMLE_QUALITY_V2,
    ...USMLE_STEP3_V3,
    ...USMLE_PHYSICIAN_EDUCATOR_BATCH_01,
    ...USMLE_PHYSICIAN_EDUCATOR_BATCH_02,
    ...USMLE_PHYSICIAN_EDUCATOR_BATCH_03,
  ]) {
    rows.push({
      fieldId: usmleFieldForItem(item),
      subjectId: item.subjectId ?? "pathology",
      item,
    });
  }

  for (const item of [
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_01,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_02,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_03,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_04,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_05,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_06,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_07,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_08,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_09,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_10,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_11,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_12,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_13,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_14,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_15,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_16,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_17,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_18,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_19,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_20,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_21,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_22,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_23,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_24,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_25,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_26,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_27,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_28,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_29,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_30,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_31,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_32,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_33,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_34,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_35,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_36,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_37,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_38,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_39,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_40,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_41,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_42,
    ...MPJE_PHYSICIAN_EDUCATOR_BATCH_43,
  ].filter((i) => isMpjeBestQuality(i, { source: "seed" }))) {
    rows.push({
      fieldId: "mpje",
      subjectId: item.subjectId ?? "uniform-mpje",
      item,
    });
  }

  return rows;
}
