import { describe, expect, it } from "vitest";
import {
  planUsmleFullExamSlots,
  resolveExamQuestionCount,
  resolveExamTitle,
  summarizeExamBlueprint,
  summarizeExamTasks,
} from "./blueprint-quota";

describe("planUsmleFullExamSlots", () => {
  it("alternates step1 and step2 by exam number", () => {
    const s1 = planUsmleFullExamSlots({ examNumber: 1, questionCount: 80 });
    const s2 = planUsmleFullExamSlots({ examNumber: 2, questionCount: 80 });
    expect(s1[0]?.stepLevel).toBe("step1");
    expect(s2[0]?.stepLevel).toBe("step2");
  });

  it("produces 75–85 questions by default", () => {
    for (let n = 1; n <= 10; n++) {
      const count = resolveExamQuestionCount(n);
      expect(count).toBeGreaterThanOrEqual(75);
      expect(count).toBeLessThanOrEqual(85);
    }
  });

  it("covers blueprint systems and physician tasks", () => {
    const slots = planUsmleFullExamSlots({ examNumber: 1, questionCount: 80 });
    expect(slots).toHaveLength(80);
    const systems = summarizeExamBlueprint(slots);
    expect(Object.keys(systems).length).toBeGreaterThan(3);
    const tasks = summarizeExamTasks(slots);
    expect(Object.keys(tasks).length).toBeGreaterThan(3);
  });

  it("generates descriptive exam titles", () => {
    expect(resolveExamTitle(1, "step1")).toContain("Step 1");
    expect(resolveExamTitle(2, "step2")).toContain("Step 2 CK");
  });
});
