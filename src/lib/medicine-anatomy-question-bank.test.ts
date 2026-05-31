import { describe, expect, it } from "vitest";
import { ANATOMY_QUESTION_BANK } from "./medicine-anatomy-question-bank";

describe("ANATOMY_QUESTION_BANK", () => {
  it("contains 20 USMLE-style anatomy items", () => {
    expect(ANATOMY_QUESTION_BANK).toHaveLength(20);
  });

  it("each item has four options and a valid correct answer", () => {
    for (const item of ANATOMY_QUESTION_BANK) {
      expect(item.options).toHaveLength(4);
      expect(item.options).toContain(item.correctAnswer);
      expect(item.subjectId).toBe("anatomy");
      expect(item.question.length).toBeGreaterThan(40);
      expect(item.explanation.length).toBeGreaterThan(20);
    }
  });
});
