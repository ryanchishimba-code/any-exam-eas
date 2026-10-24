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
import { TOP_500_COUNT } from "@/lib/drugs300/catalog";
import { pharmacyHeroFromQuestion, selectNaplexPractice } from "./pharmacy-case";
import type { LandingQuestion } from "./model";

const BANNED = /uworld|archer|kaplan|rxprep|amboss/i;

const STEM =
  "A 6-year-old boy weighing 20 kg with acute otitis media is prescribed amoxicillin 90 mg/kg/day by mouth divided every 12 hours. The pharmacy stocks amoxicillin oral suspension 400 mg/5 mL. How many mL should be given per dose? Round to one decimal place.";

const WORK =
  "Correct answer: C. 11.3 mL. The daily dose is 90 mg/kg x 20 kg = 1,800 mg, so each 12-hour dose is 900 mg; 900 mg x 5 mL/400 mg = 11.25 mL, which rounds to 11.3 mL.";

function sample(): LandingQuestion {
  return {
    id: "naplex-sample",
    stem: STEM,
    rationale: WORK,
    sources: ["NABP NAPLEX Content Outline (2025)"],
    options: [
      { id: "a", text: "22.5 mL", correct: false, rationale: "22.5 mL is the whole daily dose given at once." },
      { id: "b", text: "11.3 mL", correct: true, rationale: WORK },
      { id: "c", text: "7.5 mL", correct: false, rationale: "7.5 mL is the daily dose divided into three doses." },
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
    expect(`${model.h1Lead} ${model.h1Accent}`).toBe("80 NAPLEX questions explained · $27.99/mo");
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

describe("pharmacy dosing hero", () => {
  it("uses the stored calculation, the catalog monograph, and the real drug-deck count", () => {
    const hero = pharmacyHeroFromQuestion(sample());
    expect(hero?.kicker).toBe("Dosing calculation");
    expect(hero?.keyedAnswer).toBe("11.3 mL");
    expect(hero?.work).toMatch(/1,800 mg/);
    expect(hero?.monograph).toMatchObject({
      generic: "Amoxicillin",
      brand: "Amoxil",
      className: "Aminopenicillin",
    });
    expect(hero?.topDrugCount).toBe(TOP_500_COUNT);
    expect(hero?.topDrugCount).toBeGreaterThanOrEqual(500);
    expect(JSON.stringify(hero)).not.toMatch(/nurse|vital signs/i);
  });

  it("reads lettered reasons stored in the explanation", () => {
    const picked = selectNaplexPractice([
      {
        id: "row-1",
        question: STEM,
        options: JSON.stringify(["22.5 mL", "11.3 mL", "7.5 mL"]),
        correctAnswer: "11.3 mL",
        explanation:
          "Correct answer: B. 11.3 mL. The daily dose is 90 mg/kg x 20 kg = 1,800 mg. Why the other options are wrong: A. 22.5 mL is the whole daily dose given at once instead of split. C. 7.5 mL splits the daily dose into three doses instead of two.",
        references: [{ label: "NABP NAPLEX Content Outline (2025)" }],
      },
    ]);
    expect(picked?.sample.options.find((option) => option.text === "22.5 mL")?.rationale).toMatch(/whole daily dose/);
    expect(picked?.hero?.keyedAnswer).toBe("11.3 mL");
    expect(picked?.hero?.monograph?.generic).toBe("Amoxicillin");
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
