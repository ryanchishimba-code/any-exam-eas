import { describe, expect, it } from "vitest";
import { getCycleKey } from "./cycles";
import { TOP_500_COUNT, getDrugById } from "./catalog";
import { applySpacedRepetition, initialSpacedRepetitionState } from "./spaced-repetition";

describe("drugs300", () => {
  it("catalog has 501 drugs including GLP-1 agents", () => {
    expect(TOP_500_COUNT).toBe(501);
    expect(getDrugById("semaglutide")?.brand).toContain("Ozempic");
    expect(getDrugById("tirzepatide")?.brand).toContain("Mounjaro");
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
