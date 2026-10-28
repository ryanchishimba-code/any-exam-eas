import { describe, expect, it } from "vitest";
import { boardHeroMarketingCopy, BOARD_LANDING_HERO_QUIZ_LABEL } from "@/lib/marketing/board-landing/board-hero-marketing";

describe("boardHeroMarketingCopy", () => {
  it("matches approved hero headlines and sublines", () => {
    expect(boardHeroMarketingCopy("nclex").headline).toBe(
      "NCLEX-RN practice with every answer explained."
    );
    expect(boardHeroMarketingCopy("nclex").subline).toBe(
      "NGN case studies, explained rationales, and timed mocks. $27.99/mo after a 5-day free trial."
    );
    expect(boardHeroMarketingCopy("naplex").headline).toBe(
      "NAPLEX questions. Every answer explained."
    );
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
