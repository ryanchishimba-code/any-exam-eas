import { describe, expect, it } from "vitest";
import {
  readinessEligibilityWhere,
  readinessItemHasOpenQaFlag,
  readinessItemIsEligible,
  selectReadinessItems,
} from "@/lib/learning/readiness-check/eligibility";

const clean = {
  id: "clean",
  reviewFlag: false,
  reviewStatus: "pending" as const,
  qualityScore: 6,
};

describe("readiness item eligibility", () => {
  it("rejects an open Item QA flag, including a stored code with the flag unset", () => {
    expect(readinessItemHasOpenQaFlag({ reviewFlag: true })).toBe(true);
    expect(readinessItemHasOpenQaFlag({ reviewStatus: "flagged" })).toBe(true);
    expect(readinessItemHasOpenQaFlag({ reviewStatus: "rejected" })).toBe(true);
    expect(
      readinessItemHasOpenQaFlag({
        reviewFlag: false,
        curationMeta: {
          itemQa: {
            pipeline: "item-qa-v1",
            checkedAt: "2026-09-01T00:00:00.000Z",
            codes: ["fails_schema"],
            summary: "Needs a person.",
          },
        },
      })
    ).toBe(true);
    expect(readinessItemIsEligible(clean)).toBe(true);
    expect(readinessItemIsEligible({ reviewFlag: null, reviewStatus: null })).toBe(true);
    expect(readinessItemIsEligible({ reviewStatus: "approved", qualityScore: 9 })).toBe(true);
  });

  it("can require an approved review without a second call-site rule", () => {
    const policy = { requireApprovedReview: true };
    expect(readinessItemIsEligible(clean, policy)).toBe(false);
    expect(readinessItemIsEligible({ ...clean, reviewStatus: "approved" }, policy)).toBe(true);
    expect(readinessItemIsEligible({ reviewFlag: true, reviewStatus: "approved" }, policy)).toBe(false);
    expect(readinessEligibilityWhere(policy)).toEqual({
      AND: [
        { NOT: { reviewFlag: true } },
        { NOT: { reviewStatus: { in: ["flagged", "rejected"] } } },
        { reviewStatus: "approved" },
      ],
    });
  });

  it("prefers a higher quality score and does not pad with flagged items", () => {
    const picked = selectReadinessItems(
      [
        { id: "flagged", reviewFlag: true, qualityScore: 10 },
        { id: "low", reviewFlag: false, qualityScore: 4 },
        { id: "high", reviewFlag: false, qualityScore: 9.2, keepRecommendation: true },
        { id: "mid", reviewFlag: false, qualityScore: 7 },
        { id: "rejected", reviewStatus: "rejected", qualityScore: 8 },
      ],
      2,
      undefined,
      () => 0.999
    );
    expect(picked.map((row) => row.id)).toEqual(["high", "mid"]);
  });

  it("returns a short list when the clean pool is smaller than the ask", () => {
    const picked = selectReadinessItems(
      [
        { id: "only", reviewFlag: false, qualityScore: 5 },
        { id: "needs-human", reviewFlag: true, qualityScore: 9 },
      ],
      3,
      undefined,
      () => 0
    );
    expect(picked.map((row) => row.id)).toEqual(["only"]);
  });
});
