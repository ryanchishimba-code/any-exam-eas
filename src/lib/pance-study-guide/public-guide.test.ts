import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  SEO_DESC_MAX,
  SEO_DESC_MIN,
  SEO_TITLE_MAX,
  validateMetaDescription,
  validateMetaTitle,
} from "@/lib/seo/meta-budget";
import {
  PANCE_STUDY_GUIDE_DESCRIPTION,
  PANCE_STUDY_GUIDE_PATH,
  PANCE_STUDY_GUIDE_TITLE,
  loadPanceStudyGuidePage,
} from "./public-guide";

describe("public PANCE study guide", () => {
  const page = loadPanceStudyGuidePage();

  it("publishes one H1, a budgeted title, and a budgeted description", () => {
    const h1s = page.html.match(/<h1\b/g) ?? [];
    expect(h1s).toHaveLength(1);
    expect(page.h1).toBe(
      "Free PANCE Study Guide (2026): Blueprint-Weighted Plans, Frameworks & High-Yield Topic Index"
    );
    expect(validateMetaTitle(PANCE_STUDY_GUIDE_TITLE)).toBeNull();
    expect(PANCE_STUDY_GUIDE_TITLE.length).toBeLessThanOrEqual(SEO_TITLE_MAX);
    expect(validateMetaDescription(PANCE_STUDY_GUIDE_DESCRIPTION)).toBeNull();
    expect(PANCE_STUDY_GUIDE_DESCRIPTION.length).toBeGreaterThanOrEqual(SEO_DESC_MIN);
    expect(PANCE_STUDY_GUIDE_DESCRIPTION.length).toBeLessThanOrEqual(SEO_DESC_MAX);
  });

  it("emits valid Article, breadcrumb, and FAQ JSON-LD that matches the visible answers", () => {
    const serialized = JSON.stringify(page.jsonLd);
    const parsed = JSON.parse(serialized) as {
      "@context": string;
      "@graph": Array<Record<string, unknown>>;
    };
    expect(parsed["@context"]).toBe("https://schema.org");
    const types = parsed["@graph"].map((node) => node["@type"]);
    expect(types).toEqual(["BreadcrumbList", "Article", "FAQPage"]);
    const faq = parsed["@graph"][2] as {
      mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
    };
    expect(faq.mainEntity.length).toBeGreaterThanOrEqual(7);
    const visible = page.html
      .replace(/<[^>]+>/g, " ")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
    for (const item of faq.mainEntity) {
      expect(item.name.length).toBeGreaterThan(0);
      expect(item.acceptedAnswer.text.length).toBeGreaterThan(0);
      expect(visible).toContain(item.name);
      expect(visible).toContain(item.acceptedAnswer.text);
    }
    expect(serialized).toContain(PANCE_STUDY_GUIDE_PATH);
  });

  it("sizes every diagram and lazy-loads every figure after the first", () => {
    const images = [...page.html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
    expect(images.length).toBeGreaterThan(0);
    images.forEach((tag, index) => {
      expect(tag, tag).toMatch(/\bwidth="\d+"/);
      expect(tag, tag).toMatch(/\bheight="\d+"/);
      expect(tag, tag).toContain('class="sg-img--sized"');
      expect(tag).toContain(index === 0 ? 'loading="eager"' : 'loading="lazy"');
      expect(tag).toMatch(/src="\/pance-study-guide\/visuals\/[^"]+\.svg"/);
    });
  });

  it("has no leftover placeholder markers and keeps the checked fee and penicillin dose", () => {
    expect(page.html).not.toMatch(/\[TODO\]|\[C\d|\[C#\]|Appendix B|\bTODO\b|\bFIXME\b|\bXXX\b|\bTK\b|\{\{|placeholder/i);
    expect(page.html).toContain("$550");
    expect(page.html).toContain("2.4 million units IM once");
    expect(page.html).toContain("once a week for 3 weeks");
    expect(page.html).toContain("Bicillin L-A");
  });

  it("keeps the January 2025 NCCPA organ-system and task weights", () => {
    expect(page.html).toContain("effective January 2025");
    expect(page.html).toContain("https://www.nccpa.net/become-certified/pance-blueprint/");
    expect(page.html).toContain("Cardiovascular");
    expect(page.html).toContain("<strong>11%</strong>");
    expect(page.html).toContain("<strong>9%</strong>");
    expect(page.html).toContain("8 task areas");
    expect(page.html).not.toContain("13%");
    expect(page.html).not.toContain("7 task areas");
  });

  it("is a static marketing route listed in the sitemap", () => {
    const pageSource = readFileSync(
      "src/app/(marketing)/(with-flagship)/pance-study-guide/page.tsx",
      "utf8"
    );
    expect(pageSource).toContain('dynamic = "force-static"');
    expect(pageSource).not.toContain('"use client"');
    expect(pageSource).toContain("canonical: PANCE_STUDY_GUIDE_PATH");
    expect(PANCE_STUDY_GUIDE_PATH).toBe("/pance-study-guide");
    const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
    expect(sitemap).toContain(`path: "${PANCE_STUDY_GUIDE_PATH}"`);
  });
});
