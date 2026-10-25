import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildCompareJsonLd, buildCompareMetadata } from "@/lib/seo/marketing-metadata";
import { getComparePageFaq } from "@/lib/seo/compare-faq";

const FORBIDDEN =
  /Kaplan|Archer Review|\bArcher\b|BoardVitals|Rosh Review|\bRosh\b|Hurst|\bUWorld\b|AMBOSS|RxPrep|Boards and Beyond|Picmonic|Sketchy|TrueLearn|Bootcamp|Pocket Prep|\bAPEA\b|Fitzgerald|Barron|\bPEAT\b|Scorebuilders|Pass the PT/i;

/** Student-facing UI/SEO modules checked for competitor brand names (vs-* articles excluded). */
const NEUTRAL_STUDENT_FACING_SOURCES = [
  "src/lib/seo/competitor-comparison.ts",
  "src/lib/seo/compare-faq.ts",
  "src/lib/seo/seo-copy.ts",
  "src/lib/seo/exam-config.ts",
  "src/lib/seo/resources-content.ts",
  "src/lib/seo/marketing-metadata.ts",
  "src/components/compare/ComparePageContent.tsx",
  "src/lib/landing/content.ts",
  "src/components/home/HowWeCompare.tsx",
  "src/components/home/LandingCompact.tsx",
  "src/components/home/LandingDifferentiators.tsx",
  "src/components/landing/CostComparisonChart.tsx",
  "src/components/landing/flagship/LandingWhyChoose.tsx",
  "src/components/landing/v2/LandingWhyChooseV2.tsx",
  "src/components/landing/v2/LandingFaqV2.tsx",
  "src/components/toolkit/ToolkitStudyGuides.tsx",
  "src/components/marketing/board-landing/NclexToolkitDonutSection.tsx",
  "src/components/marketing/board-landing/NaplexAceDonutSection.tsx",
  "src/lib/seo/additional-resource-articles.ts",
];

function stripDeprecatedAliases(source: string): string {
  return source
    .split("\n")
    .filter((line) => !/UWORLD_COMPARE_ROWS/.test(line))
    .join("\n");
}

describe("neutral compare surfaces", () => {
  it("keeps compare metadata and JSON-LD free of competitor brands", () => {
    const meta = buildCompareMetadata();
    const json = JSON.stringify(buildCompareJsonLd());
    const blob = [JSON.stringify(meta), json].join(" ");
    expect(blob).not.toMatch(FORBIDDEN);
    expect(blob).toMatch(/affordable multi-exam board prep/i);
  });

  it("matches visible /compare FAQ copy to JSON-LD FAQ entities", () => {
    const faq = getComparePageFaq();
    const jsonLd = buildCompareJsonLd();
    const faqPage = jsonLd["@graph"].find(
      (node: { "@type"?: string }) => node["@type"] === "FAQPage"
    ) as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(faqPage.mainEntity).toHaveLength(faq.length);
    for (let i = 0; i < faq.length; i++) {
      expect(faqPage.mainEntity[i].name).toBe(faq[i].question);
      expect(faqPage.mainEntity[i].acceptedAnswer.text).toBe(faq[i].answer);
    }
  });

  it("keeps student-facing modules free of competitor brands", () => {
    for (const file of NEUTRAL_STUDENT_FACING_SOURCES) {
      const text = stripDeprecatedAliases(readFileSync(path.resolve(process.cwd(), file), "utf8"));
      expect(text, file).not.toMatch(FORBIDDEN);
    }
  });

  it("uses structured hub donut headings for NCLEX and NAPLEX", () => {
    const nclex = readFileSync(
      path.resolve(process.cwd(), "src/components/marketing/board-landing/NclexToolkitDonutSection.tsx"),
      "utf8"
    );
    const naplex = readFileSync(
      path.resolve(process.cwd(), "src/components/marketing/board-landing/NaplexAceDonutSection.tsx"),
      "utf8"
    );
    expect(nclex).toMatch(/Structured NCLEX prep across the NCSBN test plan/);
    expect(nclex).not.toMatch(/ace the NCLEX/i);
    expect(naplex).toMatch(/Structured NAPLEX prep across the NABP content outline/);
    expect(naplex).not.toMatch(/ace the NAPLEX/i);
  });
});
