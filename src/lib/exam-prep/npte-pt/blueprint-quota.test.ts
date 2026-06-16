import { describe, expect, it } from "vitest";
import {
  computeNptePtContentQuotas,
  computeNptePtTaskQuotas,
  getNptePtCategoryTarget,
  assessBlueprintAlignment,
  NPTE_PT_TARGET_TOTAL,
} from "./blueprint-quota";

describe("NPTE-PT blueprint quotas", () => {
  it("allocates 6000 questions proportional to NCCPA 2025 weights", () => {
    const quotas = computeNptePtContentQuotas(NPTE_PT_TARGET_TOTAL);
    const total = quotas.reduce((s, q) => s + q.targetCount, 0);
    expect(total).toBeGreaterThanOrEqual(5990);
    expect(total).toBeLessThanOrEqual(6010);

    const cardio = quotas.find((q) => q.contentCategory === "cardiovascular");
    expect(cardio?.targetCount).toBe(660);
    expect(cardio?.weight).toBeCloseTo(0.11, 2);
  });

  it("covers all 8 NCCPA task categories", () => {
    const tasks = computeNptePtTaskQuotas(NPTE_PT_TARGET_TOTAL);
    expect(tasks).toHaveLength(8);
    const diagnosis = tasks.find((t) => t.taskCategory === "diagnosis");
    expect(diagnosis?.targetCount).toBe(1080);
  });

  it("returns category target for cardiovascular at 11%", () => {
    expect(getNptePtCategoryTarget("cardiovascular")).toBe(660);
  });

  it("detects blueprint misalignment", () => {
    const counts = { cardiovascular: 2000, pulmonary: 100 };
    const result = assessBlueprintAlignment(counts, 2100);
    expect(result.aligned).toBe(false);
    expect(result.deviations.some((d) => d.category === "cardiovascular")).toBe(true);
  });
});
