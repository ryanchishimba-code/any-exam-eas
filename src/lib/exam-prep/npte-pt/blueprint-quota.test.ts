import { describe, expect, it } from "vitest";
import {
  computeNptePtContentQuotas,
  computeNptePtTaskQuotas,
  getNptePtCategoryTarget,
  assessBlueprintAlignment,
  NPTE_PT_TARGET_TOTAL,
} from "./blueprint-quota";

describe("NPTE-PT blueprint quotas", () => {
  it("allocates 6000 questions proportional to FSBPT content weights", () => {
    const quotas = computeNptePtContentQuotas(NPTE_PT_TARGET_TOTAL);
    const total = quotas.reduce((s, q) => s + q.targetCount, 0);
    expect(total).toBeGreaterThanOrEqual(5990);
    expect(total).toBeLessThanOrEqual(6010);

    const msk = quotas.find((q) => q.contentCategory === "musculoskeletal");
    expect(msk?.targetCount).toBe(1667);
    expect(msk?.weight).toBeCloseTo(0.2 / 0.72, 2);
  });

  it("covers all FSBPT process task categories", () => {
    const tasks = computeNptePtTaskQuotas(NPTE_PT_TARGET_TOTAL);
    expect(tasks).toHaveLength(3);
    const evalDx = tasks.find((t) => t.taskCategory === "evaluation-diagnosis-prognosis");
    expect(evalDx?.targetCount).toBe(1440);
  });

  it("returns category target for musculoskeletal at largest body-system weight", () => {
    expect(getNptePtCategoryTarget("musculoskeletal")).toBe(1667);
  });

  it("detects blueprint misalignment", () => {
    const counts = { musculoskeletal: 2000, "cardiovascular-pulmonary": 100 };
    const result = assessBlueprintAlignment(counts, 2100);
    expect(result.aligned).toBe(false);
    expect(result.deviations.some((d) => d.category === "musculoskeletal")).toBe(true);
  });
});
