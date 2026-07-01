import { describe, expect, it } from "vitest";
import {
  planNclexGapFillExamSlots,
  mergeNclexQuotaWithCounts,
  allocateGapFillSlotsByDeficit,
} from "@/lib/exam-prep/nclex/blueprint-quota";

describe("planNclexGapFillExamSlots", () => {
  it("assigns all slots to focus categories", () => {
    const slots = planNclexGapFillExamSlots({
      examNumber: 1,
      questionCount: 20,
      focusCategoryIds: ["physiological-adaptation", "pharmacology"],
    });
    expect(slots).toHaveLength(20);
    const nonCase = slots.filter((s) => !s.caseGroupId);
    expect(nonCase.length).toBeGreaterThan(0);
    for (const slot of nonCase) {
      expect(["physiological-adaptation", "pharmacology"]).toContain(slot.categoryId);
    }
  });

  it("computes deficits from category counts", () => {
    const quotas = mergeNclexQuotaWithCounts(
      { "physiological-adaptation": 100, pharmacology: 50 },
      2500
    );
    const phys = quotas.find((q) => q.categoryId === "physiological-adaptation");
    expect(phys?.deficit).toBeGreaterThan(0);
  });

  it("allocates proportionally by deficit", () => {
    const plan = allocateGapFillSlotsByDeficit(80, {
      "management-of-care": 400,
      "health-promotion": 250,
      "basic-care-comfort": 200,
    });
    expect(plan).toHaveLength(80);
    const hp = plan.filter((c) => c === "health-promotion").length;
    const bc = plan.filter((c) => c === "basic-care-comfort").length;
    expect(hp).toBeGreaterThan(15);
    expect(bc).toBeGreaterThan(10);
  });
});
