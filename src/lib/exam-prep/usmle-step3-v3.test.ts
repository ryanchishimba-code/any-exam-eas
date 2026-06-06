import { describe, expect, it } from "vitest";
import { USMLE_QUALITY_V2 } from "./usmle-quality-v2";
import { USMLE_STEP3_V3 } from "./usmle-step3-v3";

describe("USMLE_STEP3_V3", () => {
  it("adds 32 Step 3 specialty items", () => {
    expect(USMLE_STEP3_V3).toHaveLength(32);
    expect(USMLE_STEP3_V3.every((q) => q.ngnPayload?.stepLevel === "step3")).toBe(true);
  });

  it("ships 20 CCS prompts and expanded abstract/drug-ad coverage", () => {
    const ccs = USMLE_STEP3_V3.filter((q) => q.itemType === "ccs_prompt");
    const abstracts = USMLE_STEP3_V3.filter((q) => q.itemType === "abstract");
    const drugAds = USMLE_STEP3_V3.filter((q) => q.itemType === "drug_ad");
    expect(ccs).toHaveLength(20);
    expect(abstracts).toHaveLength(6);
    expect(drugAds).toHaveLength(6);
  });

  it("raises total USMLE bank Step 3 counts", () => {
    const all = [...USMLE_QUALITY_V2, ...USMLE_STEP3_V3];
    const step3 = all.filter((q) => q.ngnPayload?.stepLevel === "step3");
    const ccs = step3.filter((q) => q.itemType === "ccs_prompt");
    const abstracts = step3.filter((q) => q.itemType === "abstract");
    const drugAds = step3.filter((q) => q.itemType === "drug_ad");
    expect(step3.length).toBeGreaterThanOrEqual(40);
    expect(ccs.length).toBeGreaterThanOrEqual(24);
    expect(abstracts.length).toBeGreaterThanOrEqual(8);
    expect(drugAds.length).toBeGreaterThanOrEqual(9);
  });
});
