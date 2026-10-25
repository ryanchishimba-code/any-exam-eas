import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildCompareJsonLd, buildCompareMetadata } from "@/lib/seo/marketing-metadata";

const FORBIDDEN =
  /Kaplan|Archer Review|\bUWorld\b|AMBOSS|RxPrep|BoardVitals|Rosh Review|Hurst/i;

const NEUTRAL_COMPARE_SOURCES = [
  "src/lib/seo/competitor-comparison.ts",
  "src/components/compare/ComparePageContent.tsx",
  "src/lib/seo/marketing-metadata.ts",
  "src/lib/landing/content.ts",
  "src/components/home/HowWeCompare.tsx",
  "src/components/landing/CostComparisonChart.tsx",
  "src/components/landing/flagship/LandingWhyChoose.tsx",
  "src/components/landing/v2/LandingWhyChooseV2.tsx",
  "src/components/landing/v2/LandingFaqV2.tsx",
  "src/components/marketing/board-landing/NclexToolkitDonutSection.tsx",
  "src/components/marketing/board-landing/NaplexAceDonutSection.tsx",
];

describe("neutral compare surfaces", () => {
  it("keeps compare metadata and JSON-LD free of competitor brands", () => {
    const meta = buildCompareMetadata();
    const json = JSON.stringify(buildCompareJsonLd());
    const blob = [JSON.stringify(meta), json].join(" ");
    expect(blob).not.toMatch(FORBIDDEN);
    expect(blob).toMatch(/affordable multi-exam board prep/i);
  });

  it("keeps compare-related UI modules free of competitor brands", () => {
    for (const file of NEUTRAL_COMPARE_SOURCES) {
      const text = readFileSync(path.resolve(process.cwd(), file), "utf8");
      const withoutResourceSlugs = text
        .split("\n")
        .filter((line) => !/slug:\s*"/.test(line))
        .join("\n");
      expect(withoutResourceSlugs, file).not.toMatch(FORBIDDEN);
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
