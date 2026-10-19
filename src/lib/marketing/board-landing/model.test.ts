import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { boardQuestionUnits } from "@/lib/counts";
import { OPEN_QUICK_BITE_SLUG } from "@/lib/quick-bites/catalog";
import { OPEN_PHARMACY_QUICK_BITE_SLUG } from "@/lib/quick-bites/pharmacy-catalog";
import { SEO_DESC_MAX, SEO_DESC_MIN, SEO_TITLE_MAX } from "@/lib/seo/meta-budget";
import { sumBankTypeCounts } from "./bank-types";
import {
  buildNclexLandingModel,
  iso8601Duration,
  mediaVersionUploadDate,
  nclexFormatCards,
  nclexMetaDescription,
  nclexMetaTitle,
  openBoardQuickBite,
} from "./model";

const BANNED = /uworld|archer|kaplan|rxprep|amboss/i;

describe("NCLEX landing model", () => {
  it("keeps the title and description inside the SEO budget", () => {
    const title = nclexMetaTitle();
    const description = nclexMetaDescription();
    expect(title.length).toBeLessThanOrEqual(SEO_TITLE_MAX);
    expect(title.length).toBeGreaterThanOrEqual(50);
    expect(description.length).toBeGreaterThanOrEqual(SEO_DESC_MIN);
    expect(description.length).toBeLessThanOrEqual(SEO_DESC_MAX);
    expect(description).toMatch(/NCLEX-RN practice questions/i);
    expect(description).toMatch(/Next Gen NCLEX/i);
    expect(description).toMatch(/\$27\.99/);
  });

  it("uses live counts and hides item types at zero", () => {
    const cards = nclexFormatCards({
      bankTypes: { select_all: 12, ngn_matrix: 0, ngn_bowtie: 3 },
      caseStudies: 4,
      caseItems: 24,
      standaloneNgn: 0,
      bankNgnStyle: 15,
      bankCaseStyle: 0,
    });
    expect(cards.map((card) => card.id)).toEqual(["case", "sata", "bowtie"]);
    expect(cards.find((card) => card.id === "matrix")).toBeUndefined();
    expect(JSON.stringify(cards)).toContain("12");
    expect(JSON.stringify(cards)).toContain("3");
    expect(JSON.stringify(cards)).not.toMatch(/matrix/i);
  });

  it("names a leftover NGN bucket without inventing a type", () => {
    const cards = nclexFormatCards({
      bankTypes: {},
      caseStudies: 0,
      caseItems: 0,
      standaloneNgn: 2,
      bankNgnStyle: 9,
      bankCaseStyle: 0,
    });
    expect(cards.map((card) => card.title)).toEqual(["NGN-style items", "Standalone NGN items"]);
    expect(JSON.stringify(cards)).not.toMatch(/bow-tie|matrix/i);
  });

  it("builds the page from real prices, seeded quotes, and one nursing video", () => {
    const model = buildNclexLandingModel({
      degraded: false,
      units: boardQuestionUnits({
        slug: "nclex",
        bankItems: 100,
        formats: { mcq: 80, ngn: 20, case: 0 },
        clinical: { standaloneNgn: 2, caseStudies: 1, caseItems: 6 },
      }),
      bankTypes: { select_all: 20 },
      sample: null,
      testimonials: [],
    });
    const serialized = JSON.stringify(model);
    expect(serialized).not.toMatch(BANNED);
    expect(serialized).not.toMatch(/aggregateRating|reviewCount|ratingValue/);
    expect(serialized).not.toMatch(/\b\d+ lessons\b/);
    expect(model.prices.map((price) => price.amount)).toEqual(["$139", "$27.99/mo"]);
    expect(model.prices[0]?.label).toBe("Typical 30-day prep");
    expect(model.proofPoints).toHaveLength(2);
    expect(model.features.map((feature) => feature.id)).toEqual(
      expect.arrayContaining(["adaptive", "readiness", "explained", "qotd", "review", "mobile"])
    );
    expect(model.features.find((feature) => feature.id === "ngn")?.line).toMatch(/select all that apply/i);
    expect(model.heroOffer.liveQuestions).toBe("108");
    expect(model.heroOffer.proPrice).toBe("$27.99/mo");
    expect(model.heroOffer.typicalPrice).toBe("$139");
    expect(model.stats.map((stat) => stat.label)).toEqual([
      "Questions",
      "Case studies",
      "NGN items",
      "NCSBN test plan",
    ]);
    expect(model.stats[0]?.value).toBe("108");
    expect(model.stories).toEqual([]);
    expect(model.formats).toEqual([]);
    expect(model.faqs).toHaveLength(6);
    expect(model.quickBite?.slug).toBe(OPEN_QUICK_BITE_SLUG);
    expect(model.quickBite?.mediaUrl).toBe(`/api/quick-bites/${OPEN_QUICK_BITE_SLUG}/media`);
    expect(model.faqs.map((faq) => faq.question).join(" ")).toMatch(/how many|Next Gen|cost|trial|rationales|reviews/i);
    const types = (model.jsonLd["@graph"] as { "@type": string }[]).map((node) => node["@type"]);
    expect(types).toEqual(
      expect.arrayContaining(["Organization", "BreadcrumbList", "Product", "FAQPage", "VideoObject"])
    );
    expect(model.sample?.stem.length).toBeGreaterThan(40);
    expect(model.sample?.options.some((option) => option.correct && option.rationale)).toBe(true);
  });

  it("omits numeric stats when the bank lookup failed", () => {
    const model = buildNclexLandingModel({
      degraded: true,
      units: boardQuestionUnits({
        slug: "nclex",
        bankItems: 100,
        formats: { mcq: 100, ngn: 0, case: 0 },
      }),
      bankTypes: {},
      sample: null,
      testimonials: [],
    });
    expect(model.stats).toEqual([]);
    expect(model.countLine).toBeNull();
    expect(model.faqs[0]?.answer).toMatch(/do not publish a guessed total/i);
  });
});

describe("Quick Bites sample", () => {
  it("exposes one nursing sample and one pharmacy sample, with no lesson count", () => {
    const nursing = openBoardQuickBite("nursing");
    const pharmacy = openBoardQuickBite("pharmacy");
    expect(nursing?.slug).toBe(OPEN_QUICK_BITE_SLUG);
    expect(pharmacy?.slug).toBe(OPEN_PHARMACY_QUICK_BITE_SLUG);
    expect(nursing?.isoDuration).toBe("PT3M15S");
    expect(mediaVersionUploadDate("v2-20261017")).toBe("2026-10-17");
    expect(iso8601Duration("3:15")).toBe("PT3M15S");
    expect(JSON.stringify(nursing)).not.toMatch(/lessons|locked|premium/i);
  });

  it("does not list episodes or counts in the landing section", () => {
    const landing = readFileSync(
      path.resolve(process.cwd(), "src/components/marketing/board-landing/BoardLanding.tsx"),
      "utf8"
    );
    expect(landing).not.toMatch(/QUICK_BITE_EPISODES|lessons|locked/i);
    expect(landing).toMatch(/HomeSamplePlayer/);
    expect(landing).toMatch(/bl-proof/);
    expect(landing).toMatch(/bl-hero-band/);
    expect(landing).toMatch(/BoardFeatureGrid/);
  });
});

describe("bank type sums", () => {
  it("drops empty and blank types", () => {
    expect(
      sumBankTypeCounts([
        { itemType: "select_all", count: 4 },
        { itemType: "matrix", count: 0 },
        { itemType: "  ", count: 3 },
        { itemType: "NGN_Bowtie", count: "2" },
      ])
    ).toEqual({ select_all: 4, ngn_bowtie: 2 });
  });
});

describe("NCLEX crawl files", () => {
  it("keeps /nclex in the sitemap and allows it in robots", () => {
    const sitemap = readFileSync(path.resolve(process.cwd(), "src/app/sitemap.ts"), "utf8");
    const robots = readFileSync(path.resolve(process.cwd(), "src/app/robots.ts"), "utf8");
    expect(sitemap).toContain('path === "/nclex"');
    expect(robots).toContain('"/nclex"');
    expect(robots).not.toMatch(/disallow:\s*\[[^\]]*\/nclex/);
  });
});
