import { describe, expect, it } from "vitest";
import { boardHeroMarketingCopy, BOARD_LANDING_HERO_QUIZ_LABEL } from "@/lib/marketing/board-landing/board-hero-marketing";

describe("boardHeroMarketingCopy", () => {
  it("matches approved hero headlines and sublines", () => {
    expect(boardHeroMarketingCopy("nclex").headline).toBe(
      "NCLEX-RN questions that match the current test plan."
    );
    expect(boardHeroMarketingCopy("nclex").subline).toMatch(/Next Generation case studies/i);
    expect(boardHeroMarketingCopy("nclex").subline).not.toMatch(/\bpass\b/i);
    expect(boardHeroMarketingCopy("usmle").subline).not.toMatch(/flashcard|NGN|case stud/i);
    expect(boardHeroMarketingCopy("npte-pt").subline).not.toMatch(/flashcard|NGN/i);
    expect(boardHeroMarketingCopy("naplex").headline).toBe(
      "NAPLEX questions for the calculations and the drugs."
    );
    expect(boardHeroMarketingCopy("naplex").subline).toMatch(/flashcards/i);
    expect(boardHeroMarketingCopy("pance").headline).toMatch(/^PANCE /);
    expect(boardHeroMarketingCopy("aanp-fnp").headline).toMatch(/AANP FNP/);
    expect(boardHeroMarketingCopy("npte-pt").headline).toMatch(/^NPTE-PT /);
    expect(boardHeroMarketingCopy("usmle").testimonial).toBeNull();
    expect(boardHeroMarketingCopy("npte-pt").testimonial).toBeNull();
    expect(BOARD_LANDING_HERO_QUIZ_LABEL).toBe("Try the free quiz");
    expect(boardHeroMarketingCopy("pance").testimonial).toEqual({
      name: "N., PA",
      quote:
        "Great website to study for PANCE, with a question bank as well as videos for learning. I would recommend anyexameasy.com to all future PAs, and current PAs can use it to study for PANRE.",
      board: "PANCE",
    });
  });
});
