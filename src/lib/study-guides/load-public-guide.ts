import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  NPTE_PT_BODY_SYSTEMS,
  NPTE_PT_EXAM_DOMAINS,
  NPTE_PT_TASK_AREAS,
} from "@/lib/exam-prep/npte-pt/content-outline";
import { readImageSize } from "@/lib/nclex-study-guide/image-dimensions";
import { markdownToSimpleHtml } from "@/lib/nclex-study-guide/markdown";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import { SCHEMA_BRAND_NAME } from "@/lib/seo/course-jsonld";
import {
  PUBLIC_STUDY_GUIDES,
  USMLE_PUBLIC_STEPS,
  type PublicStudyGuide,
  type PublicStudyGuideId,
} from "@/lib/study-guides/public-catalog";

export type PublicGuideFaq = { question: string; answer: string };

export type PublicGuideTocItem = { id: string; text: string };

export type LoadedPublicGuide = {
  html: string;
  h1: string;
  faqs: PublicGuideFaq[];
  toc: PublicGuideTocItem[];
  jsonLd: Record<string, unknown>;
};

function chapterFiles(dir: string, prefixes?: string[]): string[] {
  return readdirSync(dir)
    .filter((name) => /^\d{2}-.+\.md$/.test(name))
    .filter((name) => !prefixes || prefixes.some((prefix) => name.startsWith(prefix)))
    .sort();
}

function singleH1(html: string): string {
  let opened = 0;
  return html.replace(/<(\/?)h1(\s|>)/g, (match, slash: string, rest: string) => {
    if (!slash) {
      opened += 1;
      return opened === 1 ? `<h1${rest}` : `<h2${rest}`;
    }
    return opened === 1 ? `</h1${rest}` : `</h2${rest}`;
  });
}

function decodeVisible(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function parseFaqs(markdown: string): PublicGuideFaq[] {
  const faqs: PublicGuideFaq[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    const heading = /^###\s+(.+)$/.exec(lines[i]?.trim() ?? "");
    if (!heading) continue;
    const answer: string[] = [];
    i += 1;
    while (i < lines.length && !(lines[i] ?? "").trim().startsWith("#")) {
      const line = (lines[i] ?? "").trim();
      if (line && line !== "---" && !line.startsWith("<!--")) answer.push(line);
      i += 1;
    }
    i -= 1;
    const text = answer.join(" ").replace(/\*\*/g, "").trim();
    if (text) faqs.push({ question: heading[1]!.trim(), answer: text });
  }
  return faqs;
}

function tocFromHtml(html: string): PublicGuideTocItem[] {
  const items: PublicGuideTocItem[] = [];
  const pattern = /<h2\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g;
  for (const match of html.matchAll(pattern)) {
    const text = decodeVisible(match[2] ?? "");
    if (match[1] && text) items.push({ id: match[1], text });
  }
  return items;
}

function buildJsonLd(guide: { path: string; description: string; boardLabel: string }, h1: string, faqs: PublicGuideFaq[]) {
  const pageUrl = absoluteUrl(guide.path);
  const site = getSiteUrl();
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site },
        { "@type": "ListItem", position: 2, name: `${guide.boardLabel} study guide`, item: pageUrl },
      ],
    },
    {
      "@type": "Article",
      headline: h1,
      description: guide.description,
      mainEntityOfPage: pageUrl,
      author: { "@type": "Organization", name: SCHEMA_BRAND_NAME },
      publisher: { "@type": "Organization", name: SCHEMA_BRAND_NAME },
    },
  ];
  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

function renderMarkdown(markdown: string, visualsPrefix: string, visualsDir: string | null): string {
  const rewritten = markdown.replace(/\]\(visuals\//g, `](${visualsPrefix}`);
  return markdownToSimpleHtml(rewritten, {
    imageSize: (src) => {
      if (!visualsDir) return undefined;
      const fileName = src.split("/").pop();
      if (!fileName) return undefined;
      return readImageSize(path.join(visualsDir, fileName));
    },
  });
}

/**
 * Literal paths. The file tracer does not follow this switch into `readdirSync`,
 * so `STUDY_GUIDE_SERVER_FILES` copies each directory into the page function.
 */
function guideContentDirs(id: PublicStudyGuideId): string[] {
  switch (id) {
    case "nclex":
      return [path.join(process.cwd(), "content/nclex-study-guide")];
    case "naplex":
      return [path.join(process.cwd(), "content/naplex-study-guide")];
    case "pance":
      return [path.join(process.cwd(), "content/pance-study-guide")];
    case "aanp-fnp":
      return [path.join(process.cwd(), "content/aanp-fnp-study-guide")];
    case "usmle":
      return [
        path.join(process.cwd(), "content/usmle-study-guide/step-1"),
        path.join(process.cwd(), "content/usmle-study-guide/step-2-ck"),
        path.join(process.cwd(), "content/usmle-study-guide/step-3"),
      ];
    case "npte-pt":
      return [];
  }
}

function guideVisualsDir(id: PublicStudyGuideId): string | null {
  switch (id) {
    case "nclex":
      return path.join(process.cwd(), "public/nclex-study-guide/visuals");
    case "naplex":
      return path.join(process.cwd(), "public/naplex-study-guide/visuals");
    case "pance":
      return path.join(process.cwd(), "public/pance-study-guide/visuals");
    case "aanp-fnp":
      return path.join(process.cwd(), "public/aanp-fnp-study-guide/visuals");
    case "usmle":
      return path.join(process.cwd(), "public/usmle-study-guide/visuals");
    case "npte-pt":
      return null;
  }
}

function loadDirectories(guide: PublicStudyGuide): { markdown: string; faqMarkdown: string } {
  const parts: string[] = [];
  const faqParts: string[] = [];
  for (const dir of guideContentDirs(guide.id)) {
    const files = chapterFiles(dir, guide.filePrefixes);
    for (const name of files) {
      const markdown = readFileSync(path.join(dir, name), "utf8");
      parts.push(markdown);
      if (name.includes("faq")) faqParts.push(markdown);
    }
  }
  return { markdown: parts.join("\n\n"), faqMarkdown: faqParts.join("\n\n") || parts.join("\n\n") };
}

function npteMarkdown(): string {
  const systems = NPTE_PT_BODY_SYSTEMS.map(
    (system) => `- **${system.label}** (${system.weightLabel}). ${system.summary}`
  ).join("\n");
  const tasks = NPTE_PT_TASK_AREAS.map(
    (task) => `- **${task.label}** (${task.weightLabel}). ${task.summary}`
  ).join("\n");
  const domains = NPTE_PT_EXAM_DOMAINS.map(
    (domain) => `- **${domain.label}** (${domain.weightLabel}). ${domain.summary}`
  ).join("\n");
  return `# Free NPTE-PT study guide

This page is a study outline for the physical therapy boards. It follows the FSBPT NPTE-PT content outline used in this product: 225 items, of which 180 are scored. Confirm the current candidate handbook before you sit, because FSBPT can revise ranges. AnyExamEasy is not affiliated with FSBPT, and nothing here is a promise that you will pass.

## How the exam is organized

${domains}

## What the items ask you to do

${tasks}

## Body systems and non-systems

Spend more practice time on the larger ranges. A small category still shows up, so do not skip it.

${systems}

## How to use this outline

Read one system, then answer a short set of scenario questions the same day. Write down the finding that changed your plan, not a list of facts you already knew. Alternate a musculoskeletal week with neuromuscular and cardiovascular-pulmonary work so the larger ranges do not crowd out safety and professional responsibilities.

The question bank, the daily question, and the toolkit sit next to this outline. The outline is the map. The questions are the practice.

## Questions students ask

### How many questions are on the NPTE-PT?

The content outline used here describes 225 items, with 180 scored. The rest are pretest items. You will not be told which items are scored. Check the current FSBPT candidate handbook before test day.

### Does this guide promise a passing result?

No. A study outline and practice questions describe the work. They do not predict your result on the physical therapy boards.

### Do I need an account to read this guide?

No. This page is public. A 5-day free trial, with no card required, opens the question bank when you want to practice against the same outline.
`;
}

export function loadPublicStudyGuide(id: PublicStudyGuideId): LoadedPublicGuide {
  const guide = PUBLIC_STUDY_GUIDES[id];
  const visualsDir = guideVisualsDir(id);
  const source = guide.contentDirs.length
    ? loadDirectories(guide)
    : { markdown: npteMarkdown(), faqMarkdown: npteMarkdown() };
  const faqs = parseFaqs(source.faqMarkdown).slice(0, 12);
  const html = singleH1(renderMarkdown(source.markdown, guide.visualsPublicPrefix, visualsDir));
  const h1 = decodeVisible(/<h1[^>]*>(.*?)<\/h1>/.exec(html)?.[1] ?? guide.title);
  return {
    html,
    h1,
    faqs,
    toc: tocFromHtml(html).slice(0, 24),
    jsonLd: buildJsonLd(guide, h1, faqs),
  };
}

export function loadUsmleStepGuide(stepId: string): LoadedPublicGuide | null {
  const step = USMLE_PUBLIC_STEPS.find((item) => item.id === stepId);
  if (!step) return null;
  const parent = PUBLIC_STUDY_GUIDES.usmle;
  const dir =
    stepId === "step-1"
      ? path.join(process.cwd(), "content/usmle-study-guide/step-1")
      : stepId === "step-2-ck"
        ? path.join(process.cwd(), "content/usmle-study-guide/step-2-ck")
        : stepId === "step-3"
          ? path.join(process.cwd(), "content/usmle-study-guide/step-3")
          : null;
  if (!dir) return null;
  const files = chapterFiles(dir);
  const parts = files.map((name) => readFileSync(path.join(dir, name), "utf8"));
  const faqMarkdown = parts.find((_, index) => files[index]?.includes("faq")) ?? parts.join("\n\n");
  const visualsDir = path.join(process.cwd(), "public/usmle-study-guide/visuals");
  const html = singleH1(renderMarkdown(parts.join("\n\n"), parent.visualsPublicPrefix, visualsDir));
  const h1 = decodeVisible(/<h1[^>]*>(.*?)<\/h1>/.exec(html)?.[1] ?? step.title);
  const faqs = parseFaqs(faqMarkdown).slice(0, 12);
  return {
    html,
    h1,
    faqs,
    toc: tocFromHtml(html).slice(0, 24),
    jsonLd: buildJsonLd(
      { path: step.path, description: step.description, boardLabel: "physician boards" },
      h1,
      faqs
    ),
  };
}
