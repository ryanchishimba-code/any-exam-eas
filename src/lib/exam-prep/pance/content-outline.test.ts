import { describe, expect, it } from "vitest";
import {
  PANCE_HIGH_YIELD_FOCUS_AREAS,
  PANCE_KNOWLEDGE_AREAS,
  PANCE_OUTLINE_SOURCE,
  PANCE_TASK_AREAS,
  normalizePanceContentCategory,
} from "./content-outline";

describe("PANCE content outline", () => {
  it("defines 14 NCCPA knowledge areas that sum to 100%", () => {
    expect(PANCE_KNOWLEDGE_AREAS).toHaveLength(14);
    const total = PANCE_KNOWLEDGE_AREAS.reduce((sum, d) => sum + d.weight, 0);
    expect(total).toBeCloseTo(1, 5);
  });

  it("weights cardiovascular as the heaviest organ system (13%)", () => {
    const cardio = PANCE_KNOWLEDGE_AREAS.find((d) => d.id === "cardiovascular");
    expect(cardio?.weight).toBe(0.13);
    expect(cardio?.topics.some((t) => /hypertension/i.test(t))).toBe(true);
    expect(cardio?.topics.some((t) => /ACS/i.test(t))).toBe(true);
  });

  it("covers eight NCCPA task areas that sum to 100%", () => {
    expect(PANCE_TASK_AREAS).toHaveLength(8);
    const total = PANCE_TASK_AREAS.reduce((sum, t) => sum + t.weight, 0);
    expect(total).toBeCloseTo(1, 5);
    const diagnosis = PANCE_TASK_AREAS.find((t) => t.id === "diagnosis");
    expect(diagnosis?.weight).toBe(0.18);
  });

  it("maps legacy renal and professional-practice slugs", () => {
    expect(normalizePanceContentCategory("renal")).toBe("genitourinary");
    expect(normalizePanceContentCategory("professional-practice")).toBe("other");
    expect(normalizePanceContentCategory("cardiovascular")).toBe("cardiovascular");
  });

  it("lists cross-cutting high-yield focus areas", () => {
    expect(PANCE_HIGH_YIELD_FOCUS_AREAS.length).toBeGreaterThanOrEqual(5);
    expect(PANCE_HIGH_YIELD_FOCUS_AREAS.some((f) => /Pharmacology/i.test(f))).toBe(true);
  });

  it("references the 2026 NCCPA blueprint", () => {
    expect(PANCE_OUTLINE_SOURCE).toContain("2026");
    expect(PANCE_OUTLINE_SOURCE).toContain("300");
  });
});
