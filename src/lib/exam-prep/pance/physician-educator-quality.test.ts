import { describe, it, expect } from "vitest";
import { assertPancePhysicianEducatorQuality } from "./physician-educator-quality";
import { PANCE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/pance-physician-educator-batch-01";
import { PANCE_PHYSICIAN_EDUCATOR_BATCH_02 } from "@/lib/edtech/seeds/pance-physician-educator-batch-02";
import { PANCE_PHYSICIAN_EDUCATOR_BATCH_03 } from "@/lib/edtech/seeds/pance-physician-educator-batch-03";
import { PANCE_PHYSICIAN_EDUCATOR_BATCH_04 } from "@/lib/edtech/seeds/pance-physician-educator-batch-04";
import { PANCE_PHYSICIAN_EDUCATOR_BATCH_05 } from "@/lib/edtech/seeds/pance-physician-educator-batch-05";
import { PANCE_PHYSICIAN_EDUCATOR_BATCH_06 } from "@/lib/edtech/seeds/pance-physician-educator-batch-06";
import { PANCE_PHYSICIAN_EDUCATOR_BATCH_07 } from "@/lib/edtech/seeds/pance-physician-educator-batch-07";
import { PANCE_PHYSICIAN_EDUCATOR_BATCH_08 } from "@/lib/edtech/seeds/pance-physician-educator-batch-08";

describe("PANCE physician-educator seed QA", () => {
  it("batch 01 (mixed high-yield)", () => {
    assertPancePhysicianEducatorQuality(PANCE_PHYSICIAN_EDUCATOR_BATCH_01);
  });

  it("batch 02 (cardiovascular)", () => {
    assertPancePhysicianEducatorQuality(PANCE_PHYSICIAN_EDUCATOR_BATCH_02);
  });

  it("batch 08 (renal, derm, GU, EENT, professional)", () => {
    assertPancePhysicianEducatorQuality(PANCE_PHYSICIAN_EDUCATOR_BATCH_08);
  });

  it("all starter seeds meet 50+ count", () => {
    const all = [
      ...PANCE_PHYSICIAN_EDUCATOR_BATCH_01,
      ...PANCE_PHYSICIAN_EDUCATOR_BATCH_02,
      ...PANCE_PHYSICIAN_EDUCATOR_BATCH_03,
      ...PANCE_PHYSICIAN_EDUCATOR_BATCH_04,
      ...PANCE_PHYSICIAN_EDUCATOR_BATCH_05,
      ...PANCE_PHYSICIAN_EDUCATOR_BATCH_06,
      ...PANCE_PHYSICIAN_EDUCATOR_BATCH_07,
      ...PANCE_PHYSICIAN_EDUCATOR_BATCH_08,
    ];
    expect(all.length).toBeGreaterThanOrEqual(50);
    assertPancePhysicianEducatorQuality(all);
  });
});
