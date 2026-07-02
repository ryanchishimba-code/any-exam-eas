import { describe, expect, it } from "vitest";
import {
  gatherSprintTimedExamPool,
  isSprintTimedExamLimit,
  resolveFastTimedPullSize,
} from "@/lib/exam-prep/gather-sprint-timed-pool";
import {
  resolveComposePoolLimit,
  resolveLiveComposePoolLimit,
} from "@/lib/exam-prep/progressive-exam-relaxation";

describe("gather-sprint-timed-pool", () => {
  it("treats 50 and 100 as sprint limits", () => {
    expect(isSprintTimedExamLimit(50)).toBe(true);
    expect(isSprintTimedExamLimit(100)).toBe(true);
    expect(isSprintTimedExamLimit(101)).toBe(false);
  });

  it("scales fast pull size for sprint and full-length sessions", () => {
    expect(resolveFastTimedPullSize(50)).toBeLessThanOrEqual(180);
    expect(resolveFastTimedPullSize(100)).toBeLessThanOrEqual(180);
    expect(resolveFastTimedPullSize(225)).toBeLessThanOrEqual(420);
    expect(resolveFastTimedPullSize(280)).toBeGreaterThanOrEqual(280);
    expect(resolveFastTimedPullSize(280)).toBeLessThanOrEqual(420);
  });

  it("accepts full-length limits without short-circuiting", async () => {
    const result = await gatherSprintTimedExamPool({ fieldId: "nursing", limit: 225 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("resolveComposePoolLimit sprint cap", () => {
  it("caps compose pool for 100Q sessions", () => {
    expect(resolveComposePoolLimit(100)).toBeLessThanOrEqual(236);
    expect(resolveComposePoolLimit(100)).toBeGreaterThanOrEqual(200);
  });

  it("caps live compose pool below batch compose pulls", () => {
    expect(resolveLiveComposePoolLimit(280)).toBeLessThan(resolveComposePoolLimit(280));
    expect(resolveLiveComposePoolLimit(280)).toBeLessThanOrEqual(420);
  });
});
