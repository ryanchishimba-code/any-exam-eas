import { describe, expect, it } from "vitest";
import { boardHeroMarketingCopy } from "@/lib/marketing/board-landing/board-hero-marketing";

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
    expect(boardHeroMarketingCopy("pance").testimonial?.quote).toBe(
      "With everything premium becoming expensive, it's a welcome sight to see premium material."
    );
  });
});
