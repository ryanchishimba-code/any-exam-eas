import { describe, it, expect } from "vitest";
import { assertNptePtPhysicianEducatorQuality } from "./physician-educator-quality";
import { NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/npte-pt-physician-educator-batch-01";
import { NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_02 } from "@/lib/edtech/seeds/npte-pt-physician-educator-batch-02";
import { NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_03 } from "@/lib/edtech/seeds/npte-pt-physician-educator-batch-03";
import { NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_04 } from "@/lib/edtech/seeds/npte-pt-physician-educator-batch-04";

describe("NPTE-PT physician-educator seed QA", () => {
  it("batch 01 (musculoskeletal)", () => {
    assertNptePtPhysicianEducatorQuality(NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_01);
  });

  it("batch 02 (neuromuscular-nervous)", () => {
    assertNptePtPhysicianEducatorQuality(NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_02);
  });

  it("batch 03 (cardiovascular-pulmonary)", () => {
    assertNptePtPhysicianEducatorQuality(NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_03);
  });

  it("batch 04 (mixed non-systems + smaller body systems)", () => {
    assertNptePtPhysicianEducatorQuality(NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_04);
  });

  it("all starter seeds meet 130+ count", () => {
    const all = [
      ...NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_01,
      ...NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_02,
      ...NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_03,
      ...NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_04,
    ];
    expect(all.length).toBeGreaterThanOrEqual(130);
    assertNptePtPhysicianEducatorQuality(all);
  });
});
