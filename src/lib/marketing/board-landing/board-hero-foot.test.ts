import { describe, expect, it } from "vitest";
import { CONSENTED_TESTIMONIAL_SEEDS } from "@/lib/testimonials/consented-seed";
import { TESTIMONIAL_RESULTS_NOTE } from "@/lib/marketing/legal-copy";
import {
  boardHeroMarketingCopy,
  boardHeroProofFacts,
  storiesBelowHero,
} from "@/lib/marketing/board-landing/board-hero-marketing";

const seedQuote = (name: string) =>
  CONSENTED_TESTIMONIAL_SEEDS.find((row) => row.name === name)?.quote;

describe("board hero foot", () => {
  it("uses the consented quote already on the site", () => {
    expect(boardHeroMarketingCopy("nclex").testimonial).toEqual({
      name: "Nathan C.",
      quote: seedQuote("Nathan C."),
      board: "NCLEX-RN",
    });
    expect(boardHeroMarketingCopy("naplex").testimonial).toEqual({
      name: "Frank C.",
      quote: "The drug cards were a game changer.",
      board: "NAPLEX",
    });
    expect(boardHeroMarketingCopy("pance").testimonial?.name).toBe("N., PA");
    expect(boardHeroMarketingCopy("pance").testimonial?.quote).toBe(
      "Great website to study for PANCE, with a question bank as well as videos for learning. I would recommend anyexameasy.com to all future PAs, and current PAs can use it to study for PANRE."
    );
    expect(boardHeroMarketingCopy("aanp-fnp").testimonial?.quote).toBe(
      "I couldn't believe the price for everything I got."
    );
    expect(boardHeroMarketingCopy("usmle").testimonial).toBeNull();
    expect(boardHeroMarketingCopy("npte-pt").testimonial).toBeNull();
    expect(TESTIMONIAL_RESULTS_NOTE).toBe("Individual experiences. Results vary.");
  });

  it("keeps the hero quote out of the band below the photo", () => {
    const stories = [
      { name: "Nathan C.", quote: "The best questions I've found for NCLEX prep." },
      { name: "Priscilla J.", quote: "I wish I'd found AnyExamEasy sooner. It would have saved me from wasting money on other prep." },
    ];
    expect(storiesBelowHero(stories, stories[0]?.quote).map((story) => story.name)).toEqual([
      "Priscilla J.",
    ]);
    expect(storiesBelowHero(stories, null)).toHaveLength(2);
  });

  it("builds a factual chip from live count and price, with no invented review", () => {
    expect(
      boardHeroProofFacts({ liveQuestions: "1,240", proPrice: "$27.99/mo" })
    ).toEqual(["1,240 questions", "Cited rationales", "$27.99/mo"]);
    expect(boardHeroProofFacts({ liveQuestions: null, proPrice: "$27.99/mo" })).toEqual([
      "Cited rationales",
      "$27.99/mo",
    ]);
    expect(boardHeroProofFacts(null).join(" ")).not.toMatch(/\bpass\b/i);
  });
});
