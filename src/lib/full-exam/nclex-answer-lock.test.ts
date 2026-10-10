import { describe, expect, it } from "vitest";
import {
  analysisWithLock,
  answerSelectionLocked,
  nclexExamMode,
  raisedLockedThrough,
  readLockedThrough,
} from "./nclex-answer-lock";

const examAnalysis = { sessionConfig: { nclexExamMode: true } };

describe("nclex answer lock", () => {
  it("recognizes NCLEX exam mode from the stored session config", () => {
    expect(nclexExamMode(examAnalysis)).toBe(true);
    expect(nclexExamMode({ sessionConfig: { nclexExamMode: false } })).toBe(false);
    expect(nclexExamMode(null)).toBe(false);
  });

  it("moves the lock forward when the student reaches a later item or clicks Next", () => {
    expect(raisedLockedThrough(0, 0, null)).toBe(0);
    expect(raisedLockedThrough(0, 1, null)).toBe(1);
    expect(raisedLockedThrough(1, null, 2)).toBe(2);
    expect(raisedLockedThrough(3, 1, 2)).toBe(3);
  });

  it("rejects a changed selection only after the student has moved past that item", () => {
    expect(
      answerSelectionLocked({
        examMode: true,
        lockedThrough: 0,
        existingSelected: "Alpha",
        incomingIndex: 0,
        incomingSelected: "Beta",
      })
    ).toBe(false);
    expect(
      answerSelectionLocked({
        examMode: true,
        lockedThrough: 1,
        existingSelected: "Alpha",
        incomingIndex: 0,
        incomingSelected: "Beta",
      })
    ).toBe(true);
    expect(
      answerSelectionLocked({
        examMode: true,
        lockedThrough: 1,
        existingSelected: "Alpha",
        incomingIndex: 0,
        incomingSelected: "Alpha",
      })
    ).toBe(false);
    expect(
      answerSelectionLocked({
        examMode: true,
        lockedThrough: 2,
        existingSelected: "",
        incomingIndex: 1,
        incomingSelected: "Alpha",
      })
    ).toBe(false);
    expect(
      answerSelectionLocked({
        examMode: false,
        lockedThrough: 5,
        existingSelected: "Alpha",
        incomingIndex: 0,
        incomingSelected: "Beta",
      })
    ).toBe(false);
  });

  it("keeps the lock on the session analysis", () => {
    const next = analysisWithLock({ sessionConfig: { nclexExamMode: true }, presetFormId: "nclex:1" }, 2);
    expect(readLockedThrough(next)).toBe(2);
    expect(next.presetFormId).toBe("nclex:1");
    expect(readLockedThrough(null)).toBe(0);
  });
});
