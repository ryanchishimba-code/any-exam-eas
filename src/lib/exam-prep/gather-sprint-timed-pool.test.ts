import { describe, expect, it } from "vitest";
import {
  gatherSprintTimedExamPool,
  isSprintTimedExamLimit,
} from "@/lib/exam-prep/gather-sprint-timed-pool";
import { resolveComposePoolLimit } from "@/lib/exam-prep/progressive-exam-relaxation";

describe("gather-sprint-timed-pool", () => {
  it("treats 50 and 100 as sprint limits", () => {
    expect(isSprintTimedExamLimit(50)).toBe(true);
    expect(isSprintTimedExamLimit(100)).toBe(true);
    expect(isSprintTimedExamLimit(101)).toBe(false);
  });

  it("returns empty for non-sprint limits", async () => {
    await expect(gatherSprintTimedExamPool({ fieldId: "pharmacy", limit: 225 })).resolves.toEqual(
      []
    );
  });
});

describe("resolveComposePoolLimit sprint cap", () => {
  it("caps compose pool for 100Q sessions", () => {
    expect(resolveComposePoolLimit(100)).toBeLessThanOrEqual(236);
    expect(resolveComposePoolLimit(100)).toBeGreaterThanOrEqual(200);
  });
});
