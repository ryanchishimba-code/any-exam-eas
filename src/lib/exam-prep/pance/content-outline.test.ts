import { describe, expect, it } from "vitest";
import {
  PANCE_HIGH_YIELD_FOCUS_AREAS,
  PANCE_KNOWLEDGE_AREAS,
  PANCE_OUTLINE_SOURCE,
  PANCE_TASK_AREAS,
  normalizePanceContentCategory,
} from "./content-outline";

describe("PANCE content outline", () => {
  it("defines 15 NCCPA knowledge areas that sum to 100%", () => {
    expect(PANCE_KNOWLEDGE_AREAS).toHaveLength(15);
    const total = PANCE_KNOWLEDGE_AREAS.reduce((sum, d) => sum + d.weight, 0);
    expect(total).toBeCloseTo(1, 5);
  });

  it("matches the January 2025 NCCPA medical content allocations", () => {
    const weights = Object.fromEntries(PANCE_KNOWLEDGE_AREAS.map((d) => [d.id, d.weight]));
    expect(weights).toEqual({
      cardiovascular: 0.11,
      pulmonary: 0.09,
      gastrointestinal: 0.08,
      musculoskeletal: 0.08,
      "infectious-diseases": 0.07,
      neurologic: 0.07,
      psychiatry: 0.07,
      reproductive: 0.07,
      endocrine: 0.06,
      eent: 0.06,
      "professional-practice": 0.06,
      hematologic: 0.05,
      renal: 0.05,
      dermatologic: 0.04,
      genitourinary: 0.04,
    });
    const cardio = PANCE_KNOWLEDGE_AREAS.find((d) => d.id === "cardiovascular");
    expect(cardio?.weightLabel).toBe("11%");
    expect(cardio?.topics.some((t) => /hypertension/i.test(t))).toBe(true);
    expect(cardio?.topics.some((t) => /acute coronary/i.test(t))).toBe(true);
  });

  it("matches the January 2025 NCCPA task allocations", () => {
    expect(PANCE_TASK_AREAS).toHaveLength(8);
    const total = PANCE_TASK_AREAS.reduce((sum, t) => sum + t.weight, 0);
    expect(total).toBeCloseTo(1, 5);
    const weights = Object.fromEntries(PANCE_TASK_AREAS.map((t) => [t.id, t.weight]));
    expect(weights).toEqual({
      "history-physical": 0.16,
      labs: 0.1,
      diagnosis: 0.18,
      prevention: 0.11,
      intervention: 0.16,
      pharmacotherapy: 0.15,
      foundational: 0.08,
      professional: 0.06,
    });
    expect(PANCE_TASK_AREAS.find((t) => t.id === "prevention")?.label).toBe(
      "Health Maintenance, Patient Education, and Preventive Measures"
    );
    expect(PANCE_TASK_AREAS.find((t) => t.id === "foundational")?.label).toBe(
      "Applying Basic Scientific Concepts"
    );
  });

  it("maps legacy other slug to professional-practice", () => {
    expect(normalizePanceContentCategory("renal")).toBe("renal");
    expect(normalizePanceContentCategory("professional-practice")).toBe("professional-practice");
    expect(normalizePanceContentCategory("other")).toBe("professional-practice");
    expect(normalizePanceContentCategory("cardiovascular")).toBe("cardiovascular");
  });

  it("lists cross-cutting high-yield focus areas", () => {
    expect(PANCE_HIGH_YIELD_FOCUS_AREAS.length).toBeGreaterThanOrEqual(5);
    expect(PANCE_HIGH_YIELD_FOCUS_AREAS.some((f) => /Pharmacology/i.test(f))).toBe(true);
  });

  it("cites the January 2025 NCCPA blueprint page and PDF", () => {
    expect(PANCE_OUTLINE_SOURCE).toContain("January 2025");
    expect(PANCE_OUTLINE_SOURCE).toContain("https://www.nccpa.net/become-certified/pance-blueprint/");
    expect(PANCE_OUTLINE_SOURCE).toContain("https://www.nccpa.net/wp-content/uploads/PANCE-Blueprint.pdf");
    expect(PANCE_OUTLINE_SOURCE).toContain("300");
  });
});
