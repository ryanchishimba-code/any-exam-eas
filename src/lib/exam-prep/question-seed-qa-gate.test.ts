/**
 * CI entry point for curated question-bank editorial QA.
 * Register new hand-crafted batches here after adding their assert* helper.
 */
import { describe, it } from "vitest";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-01";
import { assertUsmlePhysicianEducatorQuality } from "./usmle-physician-educator-quality";

describe("Question seed QA gate", () => {
  it("USMLE physician-educator batch (curated vignettes)", () => {
    assertUsmlePhysicianEducatorQuality(USMLE_PHYSICIAN_EDUCATOR_BATCH_01);
  });
});
