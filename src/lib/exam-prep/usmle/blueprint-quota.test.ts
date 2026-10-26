import { describe, expect, it } from "vitest";
import { organSystemWeightsForStep } from "./official-content-model";
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

  it("Step 2 CK organ-system weights sum to 1", () => {
    const sum = USMLE_STEP2_2026_BLUEPRINT.categories.reduce((s, c) => s + c.weight, 0);
    expect(sum).toBeCloseTo(1, 5);
    const repro = USMLE_STEP2_2026_BLUEPRINT.categories.find(
      (c) => c.id === "reproductive-endocrine"
    );
    expect(repro?.weight).toBeCloseTo(
      organSystemWeightsForStep("step2")["reproductive-endocrine"],
      5
    );
  });

  it("mergeUsmleQuotaWithCounts computes deficit and surplus", () => {
    const weight = organSystemWeightsForStep("step2").cardiovascular;
    const total = 1000;
    const current = 40;
    const target = Math.round(total * weight);
    const rows = mergeUsmleQuotaWithCounts(
      USMLE_STEP2_2026_BLUEPRINT,
      { cardiovascular: current },
      total
    );
    const cv = rows.find((r) => r.categoryId === "cardiovascular");
    expect(cv?.targetCount).toBe(target);
    expect(cv?.deficit).toBe(Math.max(0, target - current));
    expect(cv?.surplus).toBe(Math.max(0, current - target));
    expect(cv?.deficit).toBeGreaterThan(0);
  });
});

describe("USMLE blueprint resolver", () => {
  it("maps Step 2 emergency medicine onto the multisystem organ system", () => {
    expect(
      resolveUsmleBlueprintCategory("usmle-step-2", {
        subjectId: "emergency-medicine",
      })
    ).toBe("multisystem");
  });

  it("maps Step 2 surgery onto the multisystem organ system", () => {
    expect(
      resolveUsmleBlueprintCategory("usmle-step-2", {
        subjectId: "surgery",
      })
    ).toBe("multisystem");
  });

  it("maps Step 3 biostats items to biostats-epi before the subject system", () => {
    expect(
      resolveUsmleBlueprintCategory("usmle-step-3", {
        subjectId: "internal-medicine",
        itemType: "biostats",
      })
    ).toBe("biostats-epi");
  });

  it("maps Step 1 pharmacology onto the multisystem organ system", () => {
    expect(
      resolveUsmleBlueprintCategory("usmle-step-1", { subjectId: "pharmacology" })
    ).toBe("multisystem");
  });
});
