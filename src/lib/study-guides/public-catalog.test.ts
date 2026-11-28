import { describe, expect, it } from "vitest";
import { SEO_DESC_MAX, SEO_DESC_MIN, SEO_TITLE_MAX } from "@/lib/seo/meta-budget";
import { loadPublicStudyGuide } from "@/lib/study-guides/load-public-guide";
import { guideSectionToc, presentGuideHtml } from "@/lib/study-guides/present-html";
import {
  PUBLIC_STUDY_GUIDE_LIST,
  USMLE_PUBLIC_STEPS,
  legacyStudyGuideRedirects,
} from "@/lib/study-guides/public-catalog";
import { GUIDE_SEO, STEP_SEO, guideJsonLd } from "@/lib/study-guides/seo-copy";

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

  it("puts the target query in the title, H1, first paragraph, and URL", () => {
    for (const guide of PUBLIC_STUDY_GUIDE_LIST) {
      const seo = GUIDE_SEO[guide.id]!;
      expect(guide.title.toLowerCase(), guide.id).toContain(seo.query.toLowerCase());
      expect(seo.headline, guide.id).toContain(seo.query);
      expect(seo.lede, guide.id).toContain(seo.query);
      expect(guide.path, guide.id).toContain(seo.query.toLowerCase().split(" ")[0]!.toLowerCase());
      expect(seo.answers.length, guide.id).toBeGreaterThanOrEqual(3);
      for (const answer of seo.answers) {
        expect(answer.question.endsWith("?"), answer.question).toBe(true);
        expect(answer.answer.toLowerCase()).not.toMatch(/you will pass|guarantee/);
      }
      const graph = guideJsonLd({
        path: guide.path,
        headline: seo.headline,
        description: guide.description,
        answers: seo.answers,
      })["@graph"] as Array<Record<string, unknown>>;
      expect(graph.map((node) => node["@type"])).toEqual(["BreadcrumbList", "Article", "FAQPage"]);
      expect(graph[1]?.dateModified).toBeTruthy();
    }
    expect(STEP_SEO["step-1"]?.lede).toContain("USMLE Step 1 study guide");
    expect(STEP_SEO["step-2-ck"]?.lede).toContain("USMLE Step 2 CK study guide");
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

  it("keeps bookkeeping headings out of the table of contents", () => {
    const html = presentGuideHtml(
      [
        "<h1>Old title</h1>",
        '<h2 id="disclaimer">Study-aid disclaimer (read this)</h2><p>Aid.</p>',
        '<h2 id="use">How to use this book</h2><p>Read.</p>',
        '<h2 id="toc">Table of contents</h2><p>List.</p>',
        '<h2 id="pair">Pairing with the bank</h2><p>Pair.</p>',
        '<h2 id="ch">Chapter 4 — Cardiac</h2><p>Perfusion.</p>',
        "<blockquote><p>TRAP — Memorizing drugs without the patient.</p></blockquote>",
      ].join(""),
      "NCLEX study guide"
    );
    const names = guideSectionToc(html).map((item) => item.text);
    expect(names).toEqual(["Cardiac"]);
    expect(html).toContain("psg-callout--pitfall");
    expect(html).not.toContain("<h1");
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
