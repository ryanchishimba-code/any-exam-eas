import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SAMPLE_QUESTION_PREVIEWS } from "@/lib/landing/content";
import { HOME_FAQ } from "@/lib/marketing/home-faq";
import { HOME_EXPLAINED_SAMPLE } from "@/lib/marketing/home-explained";
import { formatMonthlyPrice } from "@/lib/site";

describe("homepage explained sample", () => {
  it("uses the existing NCLEX preview and explains every option", () => {
    const source = SAMPLE_QUESTION_PREVIEWS.find((item) => item.exam === "NCLEX-RN");
    expect(HOME_EXPLAINED_SAMPLE.stem).toBe(source?.stem);
    expect(HOME_EXPLAINED_SAMPLE.options.map((option) => option.text)).toEqual(source?.options);
    expect(HOME_EXPLAINED_SAMPLE.options.filter((option) => option.correct)).toHaveLength(1);
    expect(HOME_EXPLAINED_SAMPLE.options.find((option) => option.correct)?.rationale).toBe(
      source?.rationale
    );
    expect(HOME_EXPLAINED_SAMPLE.options.every((option) => option.rationale.length > 20)).toBe(true);
  });
});

describe("homepage faq and price placement", () => {
  it("keeps the short FAQ free of hours, prices, and bank counts", () => {
    const joined = HOME_FAQ.map((item) => `${item.q} ${item.a}`).join(" ");
    expect(joined).not.toMatch(/24\/7|support hours|\$\d|\d+,\d+\+?\s*questions/i);
    expect(joined).toMatch(/500 practice questions across all six boards/i);
    expect(HOME_FAQ.length).toBeLessThanOrEqual(4);
  });

  it("shows the monthly price once on the homepage", () => {
    const source = readFileSync(
      path.resolve(process.cwd(), "src/components/marketing/elevation/PublicHome.tsx"),
      "utf8"
    );
    expect(source.match(/formatMonthlyPrice\(/g)).toHaveLength(1);
    expect(source).toContain(formatMonthlyPrice.name);
    expect(source).not.toMatch(/24\/7|support hours|Quality exam prep shouldn't/);
    expect(source).toContain("HOME_NO_CARD_LINE");
    expect(source).toContain("buildHomeHeroBenefitLine");
    expect(source).toContain("HOME_PRACTICE_HEADLINE");
  });
});
