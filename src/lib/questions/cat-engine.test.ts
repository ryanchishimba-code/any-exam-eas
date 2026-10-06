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

  it("stops for confidence once accuracy is decisive after the minimum", () => {
    let s = initCatSession();
    for (let i = 0; i < CAT_MIN_QUESTIONS; i++) {
      s = updateCatSession(s, true, "medium");
    }
    expect(s.isComplete).toBe(true);
    expect(s.stopReason).toBe("confidence");
    expect(s.questionNumber).toBe(CAT_MIN_QUESTIONS);
  });

  it("runs an 83 percent sitting to the maximum length", () => {
    let s = initCatSession();
    for (let i = 0; i < 150; i++) {
      s = updateCatSession(s, i % 6 !== 0, "medium");
    }
    expect(s.questionNumber).toBe(150);
    expect(s.stopReason).toBe("maximum");
    expect(s.isComplete).toBe(true);
  });

  it("targets harder difficulty when ability is high", () => {
    let s = initCatSession();
    for (let i = 0; i < 40; i++) {
      s = updateCatSession(s, true, "hard");
    }
    expect(targetDifficulty(s)).toBe("hard");
  });
});
