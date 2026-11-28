import { describe, expect, it } from "vitest";
import { SEO_DESC_MAX, SEO_DESC_MIN, SEO_TITLE_MAX, SEO_TITLE_MIN, fitMetaTitle } from "@/lib/seo/meta-budget";
import { loadPublicStudyGuide, loadUsmleStepGuide, publishGuide, publishUsmleStep, guideSizeReport, PUBLIC_GUIDE_BODY_BUDGET, boardChapterAt } from "@/lib/study-guides/load-public-guide";
import { guideSectionToc, presentGuideHtml } from "@/lib/study-guides/present-html";
import {
  PUBLIC_STUDY_GUIDE_LIST,
  USMLE_PUBLIC_STEPS,
  legacyStudyGuideRedirects,
} from "@/lib/study-guides/public-catalog";
import { GUIDE_SEO, STEP_SEO, guideJsonLd } from "@/lib/study-guides/seo-copy";
import { boardChapterMetadata, publicGuideMetadata, usmleChapterMetadata, usmleStepMetadata } from "@/components/marketing/study-guide/PublicStudyGuidePage";

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
        dateModified: "2026-11-07",
      })["@graph"] as Array<Record<string, unknown>>;
      expect(graph.map((node) => node["@type"])).toEqual([
        "BreadcrumbList",
        "Article",
        "LearningResource",
        "FAQPage",
      ]);
      expect(JSON.stringify(graph)).not.toMatch(/aggregateRating|reviewCount|ratingValue/);
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
    expect(types).toEqual(["BreadcrumbList", "Article", "LearningResource", "FAQPage"]);
  });

  it("turns Important to remember quotes into boxes and keeps tables in columns", () => {
    const html = presentGuideHtml(
      [
        "<h2 id=\"acs\">Acute coronary syndrome</h2>",
        "<blockquote><p><strong>Important to remember</strong></p><p>- <strong>ECG first</strong> for chest pain.</p><p>- Choosing a fibrinolytic when PCI is available.</p></blockquote>",
        "<table><thead><tr><th>Finding</th><th>Meaning</th></tr></thead><tbody><tr><td>ST elevation</td><td>Reperfusion</td></tr></tbody></table>",
        '<figure class="sg-figure"><img src="/pance-study-guide/visuals/10-stemi.svg" alt="STEMI reperfusion flowchart" /></figure>',
      ].join(""),
      "PANCE study guide"
    );
    expect(html).toContain("psg-callout--remember");
    expect(html).toContain("Important to remember");
    expect(html).toContain("<li><strong>ECG first</strong> for chest pain.</li>");
    expect(html).toContain('<div class="sg-table-scroll"><table>');
    expect(html).not.toMatch(/<table[^>]*display:\s*block/);
    expect(html).toContain("/pance-study-guide/visuals/10-stemi.svg");
  });

  it("keeps the paid depth of each public manuscript", () => {
    const pance = loadPublicStudyGuide("pance");
    expect(pance.html).toContain("Cardiovascular disease is 11% of the PANCE");
    expect(presentGuideHtml(pance.html, "PANCE study guide")).toContain("psg-callout--remember");
    const nclex = loadPublicStudyGuide("nclex");
    expect(nclex.html).toContain("Coronary arteries supply myocardium");
    const naplex = loadPublicStudyGuide("naplex");
    expect(naplex.html).toContain("Domain 3");
    const fnp = loadPublicStudyGuide("aanp-fnp");
    expect(fnp.html).toContain("MUST KNOW");
    const step = loadUsmleStepGuide("step-2-ck");
    expect(step?.html).toContain("A focal deficit that is sudden is a vascular event");
    expect(step?.html).toContain("/usmle-study-guide/step-2-ck/visuals/stroke-clock.svg");
    expect(step?.html).not.toContain("/usmle-study-guide/visuals/stroke-clock.svg");
  });

  it("publishes heavy books as linked chapters and keeps the USMLE hub light", () => {
    expect(publishGuide("nclex").mode).toBe("chapters");
    expect(publishGuide("naplex").mode).toBe("chapters");
    expect(publishGuide("aanp-fnp").mode).toBe("chapters");
    expect(publishGuide("pance").mode).toBe("single");
    expect(publishGuide("npte-pt").mode).toBe("single");
    const hub = publishGuide("usmle");
    expect(hub.mode).toBe("hub");
    if (hub.mode === "hub") {
      expect(hub.cards.map((card) => card.href)).toEqual([
        "/usmle-study-guide/step-1",
        "/usmle-study-guide/step-2-ck",
        "/usmle-study-guide/step-3",
      ]);
      const titles = hub.cards.flatMap((card) => card.chapters.map((chapter) => chapter.title)).join(" ");
      expect(titles.length).toBeGreaterThan(80);
      expect(titles).not.toContain("A focal deficit that is sudden is a vascular event");
    }
    for (const step of USMLE_PUBLIC_STEPS) {
      expect(publishUsmleStep(step.id)?.mode).toBe("chapters");
    }
    const nclex = publishGuide("nclex");
    if (nclex.mode === "chapters") {
      const hit = nclex.chapters
        .map((chapter) => boardChapterAt("nclex", chapter.slug))
        .find((located) => located?.chapter.html.includes("Coronary arteries supply myocardium"));
      expect(hit?.chapter.slug).toBeTruthy();
    }
  });

  it("keeps every published guide URL under the HTML size that passed 1 MB", () => {
    const rows = guideSizeReport();
    expect(rows.length).toBeGreaterThan(40);
    for (const row of rows) {
      expect(row.bodyBytes, `${row.kind} ${row.path}`).toBeLessThanOrEqual(PUBLIC_GUIDE_BODY_BUDGET);
      expect(row.bodyBytes, row.path).toBeGreaterThan(0);
    }
    const hub = rows.find((row) => row.path === "/usmle-study-guide");
    expect(hub?.kind).toBe("hub");
    expect(hub?.bodyBytes).toBeLessThan(20_000);
  });

  it("marks chapter pages indexable with titles inside the metadata budget", () => {
    for (const guide of PUBLIC_STUDY_GUIDE_LIST) {
      expect(publicGuideMetadata(guide.id).robots).toEqual({ index: true, follow: true });
    }
    for (const step of USMLE_PUBLIC_STEPS) {
      expect(usmleStepMetadata(step.id).robots).toEqual({ index: true, follow: true });
      expect(usmleStepMetadata(step.id).alternates).toEqual({ canonical: step.path });
      const published = publishUsmleStep(step.id);
      expect(published?.mode).toBe("chapters");
      if (published?.mode !== "chapters") continue;
      const query = STEP_SEO[step.id]!.query;
      for (const chapter of published.chapters) {
        const title = fitMetaTitle([chapter.title, query]);
        expect(title.length, title).toBeLessThanOrEqual(SEO_TITLE_MAX);
        expect(title.length, title).toBeGreaterThanOrEqual(SEO_TITLE_MIN);
      }
      const meta = usmleChapterMetadata(step.id, published.chapters[0]!.slug);
      expect(meta.robots).toEqual({ index: true, follow: true });
      expect(meta.alternates).toEqual({ canonical: `${step.path}/${published.chapters[0]!.slug}` });
    }
    const nclex = publishGuide("nclex");
    if (nclex.mode === "chapters") {
      const meta = boardChapterMetadata("nclex", nclex.chapters[0]!.slug);
      expect(meta.robots).toEqual({ index: true, follow: true });
      const description = typeof meta.description === "string" ? meta.description : "";
      expect(description.length).toBeGreaterThanOrEqual(SEO_DESC_MIN);
      expect(description.length).toBeLessThanOrEqual(SEO_DESC_MAX);
    }
  });
});
