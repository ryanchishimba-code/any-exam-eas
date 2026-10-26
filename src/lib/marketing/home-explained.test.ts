import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SAMPLE_QUESTION_PREVIEWS } from "@/lib/landing/content";
import { HOME_FAQ } from "@/lib/marketing/home-faq";
import { HOME_EXPLAINED_SAMPLE } from "@/lib/marketing/home-explained";
import { TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { HOME_PRACTICE_HEADLINE } from "@/lib/marketing/legal-copy";

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
  it("keeps the short FAQ free of hours and bank-count claims", () => {
    const joined = HOME_FAQ.map((item) => `${item.q} ${item.a}`).join(" ");
    expect(joined).not.toMatch(/24\/7|support hours|\d+,\d+\+?\s*questions/i);
    expect(joined).toContain(
      `${TRIAL_LIFETIME_QUESTIONS} practice questions across all six boards`
    );
    expect(HOME_FAQ.length).toBeLessThanOrEqual(6);
  });

  it("shows the monthly price once on the homepage", () => {
    const source = readFileSync(
      path.resolve(process.cwd(), "src/components/marketing/elevation/PublicHome.tsx"),
      "utf8"
    );
    expect(source).not.toMatch(/formatMonthlyPrice\(/);
    expect(source).toContain("HOME_PRACTICE_HEADLINE");
    expect(HOME_PRACTICE_HEADLINE).toMatch(/\$27\.99\/mo/);
    expect(source).not.toMatch(/24\/7|support hours|Quality exam prep shouldn't/);
    expect(source).toContain("formatHomeHeroSubline");
    expect(source).toContain("HOME_PRACTICE_HEADLINE");
  });
});
