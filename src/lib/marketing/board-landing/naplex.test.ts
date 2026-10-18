import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { boardQuestionUnits } from "@/lib/counts";
import { OPEN_PHARMACY_QUICK_BITE_SLUG } from "@/lib/quick-bites/pharmacy-catalog";
import { SEO_DESC_MAX, SEO_DESC_MIN, SEO_TITLE_MAX } from "@/lib/seo/meta-budget";
import {
  buildNaplexLandingModel,
  naplexFormatCards,
  naplexMetaDescription,
  naplexMetaTitle,
} from "./naplex";
import { pharmacyChartFromStem, pharmacyHeroFromQuestion, selectNaplexPractice } from "./pharmacy-case";
import type { LandingQuestion } from "./model";

const BANNED = /uworld|archer|kaplan|rxprep|amboss/i;

const STEM =
  "A 55-year-old man with atrial fibrillation takes rivaroxaban 20 mg daily and amlodipine. His labs show creatinine clearance 50 mL/min, hemoglobin 14 g/dL, platelets 250,000/mm3 and ALT 30 U/L. Which laboratory value warrants a therapeutic change?";

function sample(): LandingQuestion {
  return {
    id: "naplex-sample",
    stem: STEM,
    rationale: "At a creatinine clearance of 50 mL/min the atrial fibrillation dose changes.",
    sources: ["Product labeling — rivaroxaban dosing by renal function"],
    options: [
      {
        id: "a",
        text: "Creatinine clearance 50 mL/min",
        correct: true,
        rationale: "At a creatinine clearance of 50 mL/min the atrial fibrillation dose changes.",
      },
      {
        id: "b",
        text: "Hemoglobin 14 g/dL",
        correct: false,
        rationale: "A hemoglobin of 14 g/dL is within a typical adult range and does not change this dose.",
      },
      {
        id: "c",
        text: "ALT 30 U/L",
        correct: false,
        rationale: "An ALT of 30 U/L is within a typical range and does not change this dose.",
      },
    ],
  };
}

describe("NAPLEX landing model", () => {
  it("keeps the title and description inside the SEO budget", () => {
    const title = naplexMetaTitle();
    const description = naplexMetaDescription();
    expect(title.length).toBeGreaterThanOrEqual(50);
    expect(title.length).toBeLessThanOrEqual(SEO_TITLE_MAX);
    expect(description.length).toBeGreaterThanOrEqual(SEO_DESC_MIN);
    expect(description.length).toBeLessThanOrEqual(SEO_DESC_MAX);
    expect(title).toMatch(/NAPLEX practice questions/i);
    expect(description).toMatch(/\$27\.99/);
  });

  it("lists only live pharmacy item types and hides zeros", () => {
    const cards = naplexFormatCards({ vignette: 12, constructed_response: 0, select_all: 3 });
    expect(cards.map((card) => card.id)).toEqual(["vignette", "sata"]);
    expect(JSON.stringify(cards)).toContain("12");
    expect(JSON.stringify(cards)).toContain("3");
  });

  it("uses the live count, one pharmacy video, Ryan only, and a checked list price", () => {
    const model = buildNaplexLandingModel({
      degraded: false,
      units: boardQuestionUnits({
        slug: "naplex",
        bankItems: 80,
        formats: { mcq: 80, ngn: 0, case: 0 },
      }),
      bankTypes: { vignette: 40 },
      sample: sample(),
      testimonials: [],
    });
    const serialized = JSON.stringify(model);
    expect(serialized).not.toMatch(BANNED);
    expect(serialized).not.toMatch(/aggregateRating|reviewCount|Ileen/);
    expect(serialized).not.toMatch(/\b\d+ lessons\b/);
    expect(`${model.h1Lead} ${model.h1Accent}`).toBe("Pass the NAPLEX on your first try.");
    expect(model.prices.map((price) => price.amount)).toEqual(["$299", "$27.99/mo"]);
    expect(model.prices[0]?.label).toBe("Typical NAPLEX prep");
    expect(model.reviewers.map((reviewer) => reviewer.name)).toEqual(["Ryan Chishimba, PharmD"]);
    expect(model.quickBite?.slug).toBe(OPEN_PHARMACY_QUICK_BITE_SLUG);
    expect(model.quickBite?.track).toBe("pharmacy");
    expect(model.stats.map((stat) => stat.label)).toEqual(["Questions", "Patient vignettes", "NABP outline"]);
    expect(model.stats[0]?.value).toBe("80");
    const types = (model.jsonLd["@graph"] as { "@type": string }[]).map((node) => node["@type"]);
    expect(types).toEqual(
      expect.arrayContaining(["Organization", "BreadcrumbList", "Product", "FAQPage", "VideoObject"])
    );
    const video = (model.jsonLd["@graph"] as { "@type": string; embedUrl?: string }[]).find(
      (node) => node["@type"] === "VideoObject"
    );
    expect(video?.embedUrl).toMatch(/\/naplex#quick-bites$/);
  });

  it("omits the question total when the bank lookup failed", () => {
    const model = buildNaplexLandingModel({
      degraded: true,
      units: boardQuestionUnits({
        slug: "naplex",
        bankItems: 80,
        formats: { mcq: 80, ngn: 0, case: 0 },
      }),
      bankTypes: { vignette: 40 },
      sample: null,
      testimonials: [],
    });
    expect(model.stats).toEqual([]);
    expect(model.countLine).toBeNull();
    expect(model.formats).toEqual([]);
    expect(model.faqs[0]?.answer).toMatch(/do not publish a guessed total/i);
  });
});

describe("pharmacy hero chart", () => {
  it("copies labs from the stem and keeps a stored wrong-option reason", () => {
    const chart = pharmacyChartFromStem(STEM);
    expect(chart?.rows).toEqual([
      ["creatinine clearance", "50 mL/min"],
      ["hemoglobin", "14 g/dL"],
      ["platelets", "250,000/mm3"],
      ["ALT", "30 U/L"],
    ]);
    expect(chart?.notes[0]).toMatch(/atrial fibrillation/);
    expect(chart?.question).toMatch(/Which laboratory value/);
    const scene = pharmacyHeroFromQuestion(sample());
    expect(scene?.keyedAnswer).toBe("Creatinine clearance 50 mL/min");
    expect(scene?.whyNot).toMatch(/hemoglobin of 14/);
    expect(scene?.vitalsLabel).toBe("Laboratory values");
  });

  it("reads lettered reasons stored in the explanation", () => {
    const picked = selectNaplexPractice([
      {
        id: "row-1",
        question: STEM,
        options: JSON.stringify(["Creatinine clearance 50 mL/min", "Hemoglobin 14 g/dL", "ALT 30 U/L"]),
        correctAnswer: "Creatinine clearance 50 mL/min",
        explanation:
          "Correct answer: the renal result changes the dose. Why the other options are wrong: B. A hemoglobin of 14 g/dL is within a typical adult range and does not change this dose. C. An ALT of 30 U/L is within a typical range and does not change this dose.",
        references: [{ label: "Product labeling", citation: "Rivaroxaban renal dosing" }],
      },
    ]);
    expect(picked?.sample.options.find((option) => option.text.startsWith("Hemoglobin"))?.rationale).toMatch(
      /does not change this dose/
    );
    expect(picked?.scene?.rows).toHaveLength(4);
  });
});

describe("NAPLEX crawl files", () => {
  it("keeps /naplex in the sitemap and allows it in robots", () => {
    const sitemap = readFileSync(path.resolve(process.cwd(), "src/app/sitemap.ts"), "utf8");
    const robots = readFileSync(path.resolve(process.cwd(), "src/app/robots.ts"), "utf8");
    expect(sitemap).toContain('path === "/naplex"');
    expect(robots).toContain('"/naplex"');
  });
});
