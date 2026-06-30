import { describe, expect, it } from "vitest";
import {
  USMLE_STEP1_2026_BLUEPRINT,
  USMLE_STEP2_2026_BLUEPRINT,
  mergeUsmleQuotaWithCounts,
} from "./blueprint-quota";
import { resolveUsmleBlueprintCategory } from "./blueprint-resolver";

describe("USMLE blueprint quota", () => {
  it("Step 1 category weights sum to 1", () => {
    const sum = USMLE_STEP1_2026_BLUEPRINT.categories.reduce((s, c) => s + c.weight, 0);
    expect(sum).toBeCloseTo(1, 5);
  });

  it("Step 2 CK rebalanced weights sum to 1", () => {
    const sum = USMLE_STEP2_2026_BLUEPRINT.categories.reduce((s, c) => s + c.weight, 0);
    expect(sum).toBeCloseTo(1, 5);
    const ob = USMLE_STEP2_2026_BLUEPRINT.categories.find((c) => c.id === "obgyn");
    expect(ob?.weight).toBe(0.1);
  });

  it("mergeUsmleQuotaWithCounts computes deficit and surplus", () => {
    const rows = mergeUsmleQuotaWithCounts(
      USMLE_STEP2_2026_BLUEPRINT,
      { "internal-medicine": 500, pediatrics: 50 },
      1000
    );
    const im = rows.find((r) => r.categoryId === "internal-medicine");
    expect(im?.targetCount).toBe(550);
    expect(im?.deficit).toBe(50);
    expect(im?.surplus).toBe(0);
  });
});

describe("USMLE blueprint resolver", () => {
  it("maps Step 2 emergency medicine to surgery", () => {
    expect(
      resolveUsmleBlueprintCategory("usmle-step-2", {
        subjectId: "emergency-medicine",
      })
    ).toBe("surgery-acute-care");
  });

  it("maps Step 3 item types before subject", () => {
    expect(
      resolveUsmleBlueprintCategory("usmle-step-3", {
        subjectId: "internal-medicine",
        itemType: "biostats",
      })
    ).toBe("biostatistics");
  });

  it("maps Step 1 pharmacology to discipline category for audit", () => {
    expect(
      resolveUsmleBlueprintCategory("usmle-step-1", { subjectId: "pharmacology" })
    ).toBe("pharmacology");
  });
});
