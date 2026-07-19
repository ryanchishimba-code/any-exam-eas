import { describe, expect, it } from "vitest";
import type { Metadata } from "next";
import { buildHomeMetadata } from "@/lib/seo";
import {
  buildAboutMetadata,
  buildCompareMetadata,
  buildExamMetadata,
  buildPricingMetadata,
  buildResourceArticleMetadata,
  buildToolkitHubMetadata,
} from "@/lib/seo/marketing-metadata";
import { EXAM_SEO_CONFIG, EXAM_SEO_KEYS } from "@/lib/seo/exam-config";
import { RESOURCE_ARTICLES } from "@/lib/seo/resources-content";
import {
  SEO_DESC_MAX,
  SEO_DESC_MIN,
  SEO_TITLE_MAX,
  assertMetaDescription,
  assertMetaTitle,
  clampMetaDescription,
  clampMetaTitle,
  fitMetaDescription,
  fitMetaTitle,
  validateMetaDescription,
  validateMetaTitle,
} from "@/lib/seo/meta-budget";

function readTitle(meta: Metadata): string {
  const t = meta.title;
  if (typeof t === "string") return t;
  if (t && typeof t === "object") {
    if ("absolute" in t && t.absolute) return String(t.absolute);
    if ("default" in t && t.default) return String(t.default);
  }
  return "";
}

function readDescription(meta: Metadata): string {
  return typeof meta.description === "string" ? meta.description : "";
}

function readCanonical(meta: Metadata): string {
  const c = meta.alternates?.canonical;
  if (typeof c === "string") return c;
  if (c && typeof c === "object" && "pathname" in c) return String(c.pathname ?? "");
  return "";
}

describe("meta-budget helpers", () => {
  it("rejects titles over 60 chars", () => {
    const long = "A".repeat(SEO_TITLE_MAX + 1);
    expect(validateMetaTitle(long)?.field).toBe("title");
    expect(() => assertMetaTitle(long)).toThrow(/title/);
  });

  it("rejects descriptions outside 140–160", () => {
    expect(validateMetaDescription("short")?.field).toBe("description");
    expect(validateMetaDescription("x".repeat(SEO_DESC_MAX + 1))?.field).toBe("description");
    expect(() => assertMetaDescription("x".repeat(SEO_DESC_MIN - 1))).toThrow(/description/);
  });

  it("fits and clamps titles/descriptions into budget", () => {
    const title = fitMetaTitle(["Keyword Lead Phrase", "Extra Differentiator", "Year 2026"], 60);
    expect(title.length).toBeLessThanOrEqual(SEO_TITLE_MAX);
    expect(clampMetaTitle("A".repeat(80)).length).toBeLessThanOrEqual(SEO_TITLE_MAX);

    const short = "NCLEX practice questions with Blueprint Roadmaps.";
    const clamped = clampMetaDescription(short);
    expect(clamped.length).toBeGreaterThanOrEqual(SEO_DESC_MIN);
    expect(clamped.length).toBeLessThanOrEqual(SEO_DESC_MAX);

    const long = "x".repeat(220);
    expect(fitMetaDescription([long], SEO_DESC_MAX).length).toBeLessThanOrEqual(SEO_DESC_MAX);
  });
});

describe("public marketing metadata budgets", () => {
  const pages: { label: string; meta: Metadata }[] = [
    { label: "home", meta: buildHomeMetadata() },
    { label: "about", meta: buildAboutMetadata() },
    { label: "toolkit", meta: buildToolkitHubMetadata() },
    { label: "pricing", meta: buildPricingMetadata() },
    { label: "compare", meta: buildCompareMetadata() },
    ...EXAM_SEO_KEYS.map((key) => ({
      label: `exam:${key}`,
      meta: buildExamMetadata(key),
    })),
    ...RESOURCE_ARTICLES.map((article) => ({
      label: `resource:${article.slug}`,
      meta: buildResourceArticleMetadata(article),
    })),
  ];

  it("keeps every public builder title ≤60 and description 140–160", () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();

    for (const { label, meta } of pages) {
      const title = readTitle(meta);
      const description = readDescription(meta);
      const canonical = readCanonical(meta);

      expect(title, `${label} title`).toBeTruthy();
      expect(description, `${label} description`).toBeTruthy();
      expect(canonical, `${label} canonical`).toBeTruthy();

      expect(validateMetaTitle(title), `${label} title length ${title.length}: ${title}`).toBeNull();
      expect(
        validateMetaDescription(description),
        `${label} description length ${description.length}: ${description}`
      ).toBeNull();

      expect(meta.openGraph?.title ?? title).toBe(title);
      expect(meta.openGraph?.description ?? description).toBe(description);
      expect(meta.twitter?.title ?? title).toBe(title);
      expect(meta.twitter?.description ?? description).toBe(description);

      expect(titles.has(title), `duplicate title: ${title}`).toBe(false);
      expect(descriptions.has(description), `duplicate description: ${description}`).toBe(false);
      titles.add(title);
      descriptions.add(description);
    }
  });

  it("keeps exam-config source strings inside the A+ bar before builders run", () => {
    for (const key of EXAM_SEO_KEYS) {
      const config = EXAM_SEO_CONFIG[key];
      expect(validateMetaTitle(config.metaTitle), key).toBeNull();
      expect(validateMetaDescription(config.metaDescription), key).toBeNull();
    }
  });
});
