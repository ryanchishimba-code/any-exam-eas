import { describe, expect, it } from "vitest";
import {
  computeCoveragePct,
  countSeenBySubjectFromAttempts,
  sumCategoryPushCoverage,
} from "./exam-progress";

describe("exam progress coverage", () => {
  it("computes coverage percent capped at 100", () => {
    expect(computeCoveragePct(0, 100)).toBe(0);
    expect(computeCoveragePct(25, 100)).toBe(25);
    expect(computeCoveragePct(150, 100)).toBe(100);
    expect(computeCoveragePct(5, 0)).toBe(0);
  });

  it("sums subject coverage for a blueprint category", () => {
    const bySubject = {
      a: { seen: 10, available: 40, coveragePct: 25 },
      b: { seen: 5, available: 10, coveragePct: 50 },
    };
    expect(sumCategoryPushCoverage(["a", "b"], bySubject)).toEqual({
      pushesCompleted: 15,
      pushesAvailable: 50,
      pushCoveragePct: 30,
    });
  });

  it("derives distinct seen counts from an attempt list", () => {
    const seen = countSeenBySubjectFromAttempts([
      { subjectId: "cardio", bankItemId: "q1" },
      { subjectId: "cardio", bankItemId: "q1" },
      { subjectId: "cardio", bankItemId: "q2" },
      { subjectId: "pulm", questionKey: "p1" },
      { subjectId: null, bankItemId: "ignored" },
    ]);
    expect(seen.get("cardio")).toBe(2);
    expect(seen.get("pulm")).toBe(1);
    expect(seen.size).toBe(2);
  });
});
