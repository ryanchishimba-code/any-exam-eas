import { describe, expect, it } from "vitest";
import { boardQuestionUnits } from "@/lib/counts";
import { boardLandingHeroHeadline } from "./hero";

describe("boardLandingHeroHeadline", () => {
  it("uses the board keyword in the H1 and a factual subline with count", () => {
    const units = boardQuestionUnits({
      slug: "pance",
      bankItems: 1200,
      formats: { mcq: 1200, ngn: 0, case: 0 },
    });
    const headline = boardLandingHeroHeadline("PANCE", units);
    expect(headline).toEqual({
      h1Lead: "PANCE Practice Questions",
      h1Accent: "1,200 questions · explained · $27.99/mo",
    });
  });

  it("keeps the SEO H1 when the bank lookup failed", () => {
    const headline = boardLandingHeroHeadline("USMLE", null);
    expect(headline.h1Lead).toBe("USMLE Practice Questions");
    expect(headline.h1Accent).toBe("Explained rationales · $27.99/mo");
  });
});
