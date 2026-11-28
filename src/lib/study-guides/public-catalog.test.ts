import { describe, expect, it } from "vitest";
import { SEO_DESC_MAX, SEO_DESC_MIN, SEO_TITLE_MAX } from "@/lib/seo/meta-budget";
import { loadPublicStudyGuide } from "@/lib/study-guides/load-public-guide";
import {
  PUBLIC_STUDY_GUIDE_LIST,
  USMLE_PUBLIC_STEPS,
  legacyStudyGuideRedirects,
} from "@/lib/study-guides/public-catalog";

describe("public study guides", () => {
  it("keeps titles and descriptions inside the metadata budget", () => {
    for (const guide of PUBLIC_STUDY_GUIDE_LIST) {
      expect(guide.title.length, guide.id).toBeLessThanOrEqual(SEO_TITLE_MAX);
      expect(guide.description.length, `${guide.id} ${guide.description}`).toBeGreaterThanOrEqual(SEO_DESC_MIN);
      expect(guide.description.length, guide.id).toBeLessThanOrEqual(SEO_DESC_MAX);
    }
    for (const step of USMLE_PUBLIC_STEPS) {
      expect(step.title.length, step.id).toBeLessThanOrEqual(SEO_TITLE_MAX);
      expect(step.description.length, step.id).toBeGreaterThanOrEqual(SEO_DESC_MIN);
      expect(step.description.length, step.id).toBeLessThanOrEqual(SEO_DESC_MAX);
    }
  });

  it("redirects the old reader URLs, including NPTE, onto the public pages", () => {
    const rules = legacyStudyGuideRedirects();
    expect(rules).toContainEqual({
      source: "/nclex/study-guide",
      destination: "/nclex-study-guide",
      statusCode: 301,
    });
    expect(rules).toContainEqual({
      source: "/npte-pt/study-guide",
      destination: "/npte-pt-study-guide",
      statusCode: 301,
    });
    expect(rules).toContainEqual({
      source: "/usmle/study-guide/step-2-ck",
      destination: "/usmle-study-guide/step-2-ck",
      statusCode: 301,
    });
  });

  it("renders the NPTE outline with one H1 and FAQ schema, without a pass promise", () => {
    const page = loadPublicStudyGuide("npte-pt");
    expect(page.html.match(/<h1\b/g)).toHaveLength(1);
    expect(page.html).toContain("180 scored");
    expect(page.html).not.toMatch(/you will pass the/i);
    expect(page.html).not.toMatch(/guarantee/i);
    const types = (page.jsonLd["@graph"] as Array<{ "@type": string }>).map((node) => node["@type"]);
    expect(types).toEqual(["BreadcrumbList", "Article", "FAQPage"]);
  });
});
