import { describe, expect, it } from "vitest";
import {
  TOPIC_MODULE_QA_CHECKLIST,
  buildDailyAssignment,
  buildUsmleDailyAssignment,
  validateTopicModuleDefinition,
  USMLE_TOPIC_MODULES,
} from "@/lib/edtech/learning-hub";

describe("learning-hub", () => {
  it("defines editorial QA checklist for topic modules", () => {
    expect(TOPIC_MODULE_QA_CHECKLIST.length).toBeGreaterThanOrEqual(8);
    expect(TOPIC_MODULE_QA_CHECKLIST.every((c) => c.rule && c.dimension)).toBe(true);
  });

  it("validates topic module definitions", () => {
    for (const mod of USMLE_TOPIC_MODULES) {
      expect(validateTopicModuleDefinition(mod)).toEqual([]);
    }
  });

  it("builds USMLE daily assignment with review + practice + weak area", () => {
    const plan = buildUsmleDailyAssignment(["nephrology"]);
    expect(plan.tasks.length).toBeGreaterThanOrEqual(3);
    expect(plan.tasks.some((t) => t.kind === "practice")).toBe(true);
    expect(plan.tasks.some((t) => t.kind === "weak-area")).toBe(true);
  });

  it("builds generic daily assignment for nclex", () => {
    const plan = buildDailyAssignment("nclex");
    expect(plan.examSlug).toBe("nclex");
    expect(plan.tasks.length).toBe(3);
  });
});
