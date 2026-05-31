import { describe, expect, it } from "vitest";
import {
  CAT_MIN_QUESTIONS,
  initCatSession,
  targetDifficulty,
  updateCatSession,
} from "./cat-engine";

describe("cat-engine", () => {
  it("starts at medium difficulty with zero questions", () => {
    const s = initCatSession();
    expect(s.questionNumber).toBe(0);
    expect(s.difficulty).toBe("medium");
    expect(s.isComplete).toBe(false);
  });

  it("increases ability after correct answers", () => {
    let s = initCatSession();
    s = updateCatSession(s, true, "medium");
    expect(s.questionNumber).toBe(1);
    expect(s.ability).toBeGreaterThan(0);
  });

  it("does not complete before minimum questions", () => {
    let s = initCatSession();
    for (let i = 0; i < CAT_MIN_QUESTIONS - 1; i++) {
      s = updateCatSession(s, true, "medium");
    }
    expect(s.isComplete).toBe(false);
  });

  it("targets harder difficulty when ability is high", () => {
    let s = initCatSession();
    for (let i = 0; i < 40; i++) {
      s = updateCatSession(s, true, "hard");
    }
    expect(targetDifficulty(s)).toBe("hard");
  });
});
