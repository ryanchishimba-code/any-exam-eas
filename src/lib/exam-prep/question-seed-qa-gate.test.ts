/**
 * CI entry point for curated question-bank editorial QA.
 * Register new hand-crafted batches here after adding their assert* helper.
 */
import { describe, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-01";
import { NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/naplex-physician-educator-batch-01";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-01";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_02 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-02";
import { assertMpjePhysicianEducatorQuality } from "./mpje-physician-educator-quality";
import { assertNaplexPhysicianEducatorQuality } from "./naplex-physician-educator-quality";
import { assertUsmlePhysicianEducatorQuality } from "./usmle-physician-educator-quality";

describe("Question seed QA gate", () => {
  it("USMLE physician-educator batch 01 (curated vignettes)", () => {
    assertUsmlePhysicianEducatorQuality(USMLE_PHYSICIAN_EDUCATOR_BATCH_01);
  });

  it("USMLE physician-educator batch 02 (curated vignettes)", () => {
    assertUsmlePhysicianEducatorQuality(USMLE_PHYSICIAN_EDUCATOR_BATCH_02);
  });

  it("NAPLEX physician-educator batch 01 (curated pharmacy items)", () => {
    assertNaplexPhysicianEducatorQuality(NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01);
  });

  it("MPJE physician-educator batch 01 (curated jurisprudence items)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_01);
  });
});
