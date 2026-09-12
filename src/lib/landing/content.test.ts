import { describe, expect, it } from "vitest";
import {
  LANDING_HERO_HEADLINE,
  LANDING_HERO_SUBLINE_BODY,
  formatExamHeroEyebrow,
  formatExamHeroHeadline,
  formatExamLiveCountLine,
  formatHeroTotalCountLine,
  landingTrialHrefForExam,
} from "./content";
import { FALLBACK_QUESTION_COUNTS } from "@/lib/marketing/bank-stats";

describe("homepage hero copy", () => {
  it("defaults to an NCLEX-specific job with a six-board offer subline", () => {
    expect(LANDING_HERO_HEADLINE).toMatch(/NCLEX/i);
    expect(formatExamHeroEyebrow("nclex")).toBe("NCLEX prep");
    expect(formatExamHeroHeadline("nclex")).toBe(LANDING_HERO_HEADLINE);
    expect(LANDING_HERO_SUBLINE_BODY).toMatch(/one login/i);
    expect(LANDING_HERO_SUBLINE_BODY).toMatch(/six boards/i);
    expect(LANDING_HERO_SUBLINE_BODY).toMatch(/27\.99/);
    expect(LANDING_HERO_SUBLINE_BODY).not.toMatch(/rent money/i);
  });

  it("labels the six-board total instead of an unlabeled single-bank count", () => {
    expect(formatHeroTotalCountLine(FALLBACK_QUESTION_COUNTS.total)).toBe(
      `${FALLBACK_QUESTION_COUNTS.total} questions across six boards`
    );
    expect(formatHeroTotalCountLine("7,581 serve-ready questions")).toBe(
      "7,581 questions across six boards"
    );
    expect(formatExamLiveCountLine("NCLEX", "8,327")).toBe("8,327 NCLEX questions live");
  });

  it("keeps exam= deep links on board chips", () => {
    expect(landingTrialHrefForExam("nclex")).toContain("exam=nclex");
    expect(landingTrialHrefForExam("naplex")).toContain("exam=naplex");
  });
});
