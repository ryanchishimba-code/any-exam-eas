import { describe, expect, it } from "vitest";
import { boardQuestionUnits } from "@/lib/counts";
import { boardLandingHeroHeadline } from "./hero";

describe("boardLandingHeroHeadline", () => {
  it("uses the live count and Pro price when units are known", () => {
    const units = boardQuestionUnits({
      slug: "pance",
      bankItems: 1200,
      formats: { mcq: 1200, ngn: 0, case: 0 },
    });
    const headline = boardLandingHeroHeadline("PANCE", units, { questionNoun: "PANCE questions" });
    expect(headline).toEqual({
      h1Lead: "1,200 PANCE questions",
      h1Accent: "explained · $27.99/mo",
    });
  });

  it("falls back to a board label when the bank lookup failed", () => {
    const headline = boardLandingHeroHeadline("USMLE", null, { questionNoun: "USMLE questions" });
    expect(headline.h1Lead).toBe("USMLE practice questions");
    expect(headline.h1Accent).toMatch(/explained · \$27\.99\/mo/);
  });
});
