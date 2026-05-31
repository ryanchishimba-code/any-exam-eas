import { describe, expect, it } from "vitest";
import { getCycleKey } from "./cycles";
import { TOP_500_COUNT } from "./catalog";
import { applySpacedRepetition, initialSpacedRepetitionState } from "./spaced-repetition";

describe("drugs300", () => {
  it("catalog has 500 drugs", () => {
    expect(TOP_500_COUNT).toBe(500);
  });

  it("uses quarterly cycle keys", () => {
    expect(getCycleKey(new Date("2026-04-15T12:00:00Z"))).toBe("2026-Q2");
    expect(getCycleKey(new Date("2026-01-10T12:00:00Z"))).toBe("2026-Q1");
  });

  it("schedules sooner after again, later after easy", () => {
    const now = new Date("2026-05-01T12:00:00Z");
    const again = applySpacedRepetition({
      ...initialSpacedRepetitionState(now),
      grade: 0,
      reviewedAt: now,
    });
    const easy = applySpacedRepetition({
      ...initialSpacedRepetitionState(now),
      grade: 3,
      reviewedAt: now,
    });
    expect(again.nextReviewAt.getTime()).toBeLessThan(easy.nextReviewAt.getTime());
  });
});
