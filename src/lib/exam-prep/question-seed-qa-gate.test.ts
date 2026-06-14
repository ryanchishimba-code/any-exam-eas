/**
 * CI entry point for curated question-bank editorial QA.
 * Register new hand-crafted batches here after adding their assert* helper.
 */
import { describe, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-01";
import { NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/naplex-physician-educator-batch-01";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-01";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_02 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-02";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_03 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-03";
import { assertMpjePhysicianEducatorQuality } from "./mpje-physician-educator-quality";
import { assertNaplexPhysicianEducatorQuality } from "./naplex-physician-educator-quality";
import { assertUsmlePhysicianEducatorQuality } from "./usmle-physician-educator-quality";
import { assertNclexCuratedSeedQuality } from "./nclex-curated-seeds-quality";
import { NCLEX_CURATED_QUALITY } from "./nclex-curated-quality";
import { assertNaplexSeedBatchQuality } from "./naplex-seed-qa";
import { NAPLEX_QUALITY_V2 } from "./naplex-quality-v2";
import { NAPLEX_CALC_CASES_V3 } from "./naplex-calc-cases-v3";
import { NAPLEX_AREA3_V3 } from "./naplex-area3-v3";
import { NAPLEX_VIGNETTE_SEEDS } from "./vignette-seeds";

describe("Question seed QA gate", () => {
  it("USMLE physician-educator batch 01 (curated vignettes)", () => {
    assertUsmlePhysicianEducatorQuality(USMLE_PHYSICIAN_EDUCATOR_BATCH_01);
  });

  it("USMLE physician-educator batch 02 (curated vignettes)", () => {
    assertUsmlePhysicianEducatorQuality(USMLE_PHYSICIAN_EDUCATOR_BATCH_02);
  });

  it("USMLE physician-educator batch 03 (curated vignettes)", () => {
    assertUsmlePhysicianEducatorQuality(USMLE_PHYSICIAN_EDUCATOR_BATCH_03);
  });

  it("NAPLEX physician-educator batch 01 (curated pharmacy items)", () => {
    assertNaplexPhysicianEducatorQuality(NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01);
  });

  it("MPJE physician-educator batch 01 (curated jurisprudence items)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_01);
  });

  it("NCLEX curated quality (high-yield vignettes)", () => {
    assertNclexCuratedSeedQuality(NCLEX_CURATED_QUALITY, "NCLEX_CURATED_QUALITY");
  });

  it("NAPLEX quality v2 seed batch (50 board-style items)", () => {
    assertNaplexSeedBatchQuality(NAPLEX_QUALITY_V2, "NAPLEX_QUALITY_V2");
  });

  it("NAPLEX calc cases v3 (constructed response)", () => {
    assertNaplexSeedBatchQuality(NAPLEX_CALC_CASES_V3, "NAPLEX_CALC_CASES_V3");
  });

  it("NAPLEX area 3 v3 vignettes", () => {
    assertNaplexSeedBatchQuality(NAPLEX_AREA3_V3, "NAPLEX_AREA3_V3");
  });

  it("NAPLEX vignette seeds", () => {
    assertNaplexSeedBatchQuality(NAPLEX_VIGNETTE_SEEDS, "NAPLEX_VIGNETTE_SEEDS");
  });
});
