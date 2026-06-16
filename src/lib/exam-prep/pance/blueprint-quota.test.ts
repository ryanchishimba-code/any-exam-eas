import { describe, expect, it } from "vitest";
import {
  computePanceContentQuotas,
  computePanceTaskQuotas,
  getPanceCategoryTarget,
  assessBlueprintAlignment,
  planPanceGenerationSlots,
  PANCE_TARGET_TOTAL,
} from "./blueprint-quota";

describe("PANCE blueprint quotas", () => {
  it("allocates 6000 questions proportional to NCCPA 2025 weights", () => {
    const quotas = computePanceContentQuotas(PANCE_TARGET_TOTAL);
    const total = quotas.reduce((s, q) => s + q.targetCount, 0);
    expect(total).toBeGreaterThanOrEqual(5990);
    expect(total).toBeLessThanOrEqual(6010);

    const cardio = quotas.find((q) => q.contentCategory === "cardiovascular");
    expect(cardio?.targetCount).toBe(660);
    expect(cardio?.weight).toBeCloseTo(0.11, 2);
  });

  it("covers all 8 NCCPA task categories", () => {
    const tasks = computePanceTaskQuotas(PANCE_TARGET_TOTAL);
    expect(tasks).toHaveLength(8);
    const diagnosis = tasks.find((t) => t.taskCategory === "diagnosis");
    expect(diagnosis?.targetCount).toBe(1080);
  });

  it("returns category target for cardiovascular at 11%", () => {
    expect(getPanceCategoryTarget("cardiovascular")).toBe(660);
  });

  it("detects blueprint misalignment", () => {
    const counts = { cardiovascular: 2000, pulmonary: 100 };
    const result = assessBlueprintAlignment(counts, 2100);
    expect(result.aligned).toBe(false);
    expect(result.deviations.some((d) => d.category === "cardiovascular")).toBe(true);
  });
});

describe("planPanceGenerationSlots — deficit-weighted allocation", () => {
  it("only allocates slots to categories with a positive deficit", () => {
    const slots = planPanceGenerationSlots({
      count: 100,
      deficitsByCategory: { cardiovascular: 300, pulmonary: 100 },
    });
    const cats = new Set(slots.map((s) => s.contentCategory));
    expect(cats).toEqual(new Set(["cardiovascular", "pulmonary"]));
  });

  it("allocates proportional to deficit (≈3:1)", () => {
    const slots = planPanceGenerationSlots({
      count: 100,
      deficitsByCategory: { cardiovascular: 300, pulmonary: 100 },
    });
    const cv = slots.filter((s) => s.contentCategory === "cardiovascular").length;
    const pulm = slots.filter((s) => s.contentCategory === "pulmonary").length;
    expect(cv + pulm).toBe(100);
    expect(cv).toBeGreaterThan(pulm);
    expect(cv / pulm).toBeGreaterThan(2);
  });

  it("never exceeds a category's deficit", () => {
    const slots = planPanceGenerationSlots({
      count: 100,
      deficitsByCategory: { cardiovascular: 10, pulmonary: 5 },
    });
    expect(slots.length).toBeLessThanOrEqual(15);
    const cv = slots.filter((s) => s.contentCategory === "cardiovascular").length;
    expect(cv).toBeLessThanOrEqual(10);
  });

  it("falls back to an even split when no deficits supplied", () => {
    const slots = planPanceGenerationSlots({ count: 30, deficitsByCategory: {} });
    expect(slots.length).toBe(30);
    const cats = new Set(slots.map((s) => s.contentCategory));
    expect(cats.size).toBeGreaterThan(1);
  });
});
