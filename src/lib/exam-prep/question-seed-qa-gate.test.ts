/**
 * CI entry point for curated question-bank editorial QA.
 * Register new hand-crafted batches here after adding their assert* helper.
 */
import { describe, it } from "vitest";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-01";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_02 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-02";
import { assertUsmlePhysicianEducatorQuality } from "./usmle-physician-educator-quality";

describe("Question seed QA gate", () => {
  it("USMLE physician-educator batch 01 (curated vignettes)", () => {
    assertUsmlePhysicianEducatorQuality(USMLE_PHYSICIAN_EDUCATOR_BATCH_01);
  });

  it("USMLE physician-educator batch 02 (curated vignettes)", () => {
    assertUsmlePhysicianEducatorQuality(USMLE_PHYSICIAN_EDUCATOR_BATCH_02);
  });
});
