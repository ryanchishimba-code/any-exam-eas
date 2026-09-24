import { describe, expect, it } from "vitest";
import { countServableOpenRemediation } from "./open-remediation-counts";

const t0 = Date.parse("2026-09-01T15:00:00.000Z");
const day = 24 * 60 * 60 * 1000;

const attempts = [
  {
    bankItemId: "care",
    correct: false,
    createdAt: t0,
    sessionId: "s1",
    subjectId: "management-of-care",
  },
  {
    bankItemId: "pharm",
    correct: false,
    createdAt: t0,
    sessionId: "s1",
    subjectId: "pharmacological-therapies",
  },
  {
    bankItemId: "pharm",
    correct: true,
    createdAt: t0 + 1000,
    sessionId: "s1",
    subjectId: "pharmacological-therapies",
  },
  {
    bankItemId: "bare",
    correct: false,
    createdAt: t0,
    sessionId: "s1",
    subjectId: null,
  },
  {
    bankItemId: "retired",
    correct: false,
    createdAt: t0,
    sessionId: "s1",
    subjectId: "pharmacology",
  },
  {
    bankItemId: "done",
    correct: false,
    createdAt: t0,
    sessionId: "s1",
    subjectId: "cardiac",
  },
  {
    bankItemId: "done",
    correct: true,
    createdAt: t0 + 2000,
    sessionId: "s2",
    subjectId: "cardiac",
  },
  {
    bankItemId: "done",
    correct: true,
    createdAt: t0 + 2 * day,
    sessionId: "s3",
    subjectId: "cardiac",
  },
];

describe("servable open remediation counts", () => {
  it("keeps one open total for the queue, the split, and items with no topic", () => {
    for (const examSlug of ["nclex", "naplex", "usmle"] as const) {
      const counted = countServableOpenRemediation({
        examSlug,
        fieldId: examSlug === "naplex" ? "pharmacy" : examSlug === "usmle" ? "usmle-step-2" : "nursing",
        attempts,
        servableIds: new Set(["care", "pharm", "bare", "done"]),
        now: t0 + 2 * day,
      });
      const stillMissed = counted.totalOpen - counted.pendingReproof;
      const listed = counted.loops.reduce((sum, loop) => sum + loop.openCount, 0);

      expect([...counted.openIds].sort()).toEqual(["bare", "care", "pharm"]);
      expect(counted.totalOpen).toBe(counted.openIds.length);
      expect(counted.pendingReproof).toBe(1);
      expect(stillMissed).toBe(2);
      expect(counted.unscopedCount).toBe(1);
      expect(listed + counted.unscopedCount).toBe(counted.totalOpen);
      expect(counted.unscopedCount).toBeLessThanOrEqual(counted.totalOpen);
    }
  });
});
