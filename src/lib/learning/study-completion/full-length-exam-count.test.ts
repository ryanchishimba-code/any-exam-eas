import { describe, expect, it } from "vitest";
import { qualifiesAsFullLengthExam } from "./full-length-exam-count";

describe("qualifiesAsFullLengthExam", () => {
  it("counts an NCLEX CAT that stopped at 87", () => {
    expect(
      qualifiesAsFullLengthExam({ questionCount: 150, analysis: { answeredCount: 87 } }, 85)
    ).toBe(true);
  });

  it("does not count a short early end stored on the prefetch length", () => {
    expect(
      qualifiesAsFullLengthExam({ questionCount: 150, analysis: { answeredCount: 12 } }, 85)
    ).toBe(false);
  });

  it("counts a fixed form that met the board minimum", () => {
    expect(qualifiesAsFullLengthExam({ questionCount: 85, analysis: null }, 85)).toBe(true);
  });
});
