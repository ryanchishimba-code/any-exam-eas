import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import {
  NPTE_PT_BODY_SYSTEMS,
  NPTE_PT_EXAM_DOMAINS,
  NPTE_PT_TASK_AREAS,
} from "@/lib/exam-prep/npte-pt/content-outline";
import { readImageSize } from "@/lib/nclex-study-guide/image-dimensions";
import { markdownToSimpleHtml } from "@/lib/nclex-study-guide/markdown";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import { publicLearningResourceNode } from "@/lib/seo/public-schema";
import { organizationRef } from "@/lib/seo/brand-entity";
import {
  PUBLIC_STUDY_GUIDES,
  USMLE_PUBLIC_STEPS,
  type PublicStudyGuideId,
} from "@/lib/study-guides/public-catalog";
import { presentGuideHtml } from "@/lib/study-guides/present-html";
import { GUIDE_SEO, STEP_SEO } from "@/lib/study-guides/seo-copy";

export type PublicGuideFaq = { question: string; answer: string };

/**
 * Manuscript bytes on one URL's source. NCLEX (537 KB) and NAPLEX (212 KB)
 * were 1.33 MB and 1.04 MB of HTML. PANCE (152 KB) was 685 KB, under the line.
 */
export const PUBLIC_GUIDE_SPLIT_BYTES = 200_000;

/** Visible guide HTML on one URL. Split pages stay under the size that passed 1 MB. */
export const PUBLIC_GUIDE_BODY_BUDGET = 250_000;

export type PublicGuideTocItem = { id: string; text: string };

export type LoadedPublicGuide = {
  html: string;
  h1: string;
  faqs: PublicGuideFaq[];
  toc: PublicGuideTocItem[];
  jsonLd: Record<string, unknown>;
};

export type PublicGuideChapter = {
  slug: string;
  title: string;
  html: string;
  excerpt: string;
  words: number;
};

export type PublicGuideOutline = {
  slug: string;
  title: string;
  excerpt: string;
  words: number;
};

export type UsmleHubCard = {
  id: string;
  href: string;
  label: string;
  summary: string;
  chapters: { href: string; title: string }[];
};

export type PublishedGuide =
  | { mode: "single"; page: LoadedPublicGuide }
  | { mode: "chapters"; chapters: PublicGuideOutline[]; minutes: number }
  | { mode: "hub"; cards: UsmleHubCard[]; minutes: number };

export type PublishedStep =
  | { mode: "single"; page: LoadedPublicGuide }
  | { mode: "chapters"; chapters: PublicGuideOutline[]; minutes: number };

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
      author: organizationRef(),
      publisher: organizationRef(),
    },
    publicLearningResourceNode({
      name: h1,
      description: guide.description,
      path: guide.path,
      learningResourceType: "Study guide",
    }),
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

function imageFileFor(src: string, visualsDir: string | null): string | null {
  const fileName = src.split("/").pop();
  if (!fileName) return null;
  const step = /\/usmle-study-guide\/(step-[^/]+)\/visuals\//.exec(src)?.[1];
  if (step) return path.join(process.cwd(), "public/usmle-study-guide", step, "visuals", fileName);
  if (!visualsDir) return null;
  return path.join(visualsDir, fileName);
}

function renderMarkdown(markdown: string, visualsPrefix: string, visualsDir: string | null): string {
  const rewritten = markdown.replace(/\]\(visuals\//g, `](${visualsPrefix}`);
  return markdownToSimpleHtml(rewritten, {
    imageSize: (src) => {
      const file = imageFileFor(src, visualsDir);
      return file ? readImageSize(file) : undefined;
    },
  });
}

function chapterTitle(markdown: string, fileName: string): string {
  const heading = /^#\s+(.+)$/m.exec(markdown)?.[1]?.trim() ?? fileName.replace(/\.md$/, "");
  return heading
    .replace(/^Chapter\s+\d+\s*[—–:-]\s*/i, "")
    .replace(/\s*\(Part\s+[IVX0-9]+\)\s*/gi, " ")
    .replace(/\s*\(plain english\)\s*/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function excerptFromMarkdown(markdown: string): string {
  const paragraphs: string[] = [];
  let buffer: string[] = [];
  const flush = () => {
    const text = buffer.join(" ").replace(/\s+/g, " ").trim();
    buffer = [];
    if (!text || text.startsWith("#") || text.startsWith(">") || text.startsWith("!") || text.startsWith("|")) {
      return;
    }
    if (text.startsWith("<!--") || text === "---") return;
    paragraphs.push(text.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"));
  };
  for (const line of markdown.replace(/\r\n/g, "\n").split("\n")) {
    if (!line.trim()) {
      flush();
      continue;
    }
    if (/^(#|>|```)/.test(line.trim())) {
      flush();
      continue;
    }
    buffer.push(line.trim());
  }
  flush();
  const text = paragraphs.find((paragraph) => paragraph.length > 40) ?? paragraphs[0] ?? "";
  if (text.length <= 180) return text;
  return `${text.slice(0, 177).replace(/\s+\S*$/, "")}…`;
}

/** Literal paths so the file tracer keeps each function off the rest of the repo. */
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

const boardOutlineCache = new Map<PublicStudyGuideId, PublicGuideOutline[]>();
const stepOutlineCache = new Map<string, PublicGuideOutline[]>();

function outlineFromMarkdown(name: string, markdown: string): PublicGuideOutline {
  return {
    slug: name.replace(/\.md$/, ""),
    title: chapterTitle(markdown, name),
    excerpt: excerptFromMarkdown(markdown),
    words: markdown.split(/\s+/).filter(Boolean).length,
  };
}

function outlineFromDir(dir: string): PublicGuideOutline[] {
  return chapterFiles(dir).map((name) => outlineFromMarkdown(name, readFileSync(path.join(dir, name), "utf8")));
}

function directoryBytes(dir: string): number {
  return chapterFiles(dir).reduce((total, name) => total + statSync(path.join(dir, name)).size, 0);
}

function boardOutline(id: PublicStudyGuideId): PublicGuideOutline[] {
  const cached = boardOutlineCache.get(id);
  if (cached) return cached;
  const outline = guideContentDirs(id).flatMap((dir) => outlineFromDir(dir));
  boardOutlineCache.set(id, outline);
  return outline;
}

function boardShouldSplit(id: PublicStudyGuideId): boolean {
  return guideContentDirs(id).reduce((total, dir) => total + directoryBytes(dir), 0) > PUBLIC_GUIDE_SPLIT_BYTES;
}

function stepContentDir(stepId: string): string | null {
  if (stepId === "step-1") return path.join(process.cwd(), "content/usmle-study-guide/step-1");
  if (stepId === "step-2-ck") return path.join(process.cwd(), "content/usmle-study-guide/step-2-ck");
  if (stepId === "step-3") return path.join(process.cwd(), "content/usmle-study-guide/step-3");
  return null;
}

function stepOutline(stepId: string): PublicGuideOutline[] | null {
  const cached = stepOutlineCache.get(stepId);
  if (cached) return cached;
  const dir = stepContentDir(stepId);
  if (!dir) return null;
  const outline = outlineFromDir(dir);
  stepOutlineCache.set(stepId, outline);
  return outline;
}

function stepShouldSplit(stepId: string): boolean {
  const dir = stepContentDir(stepId);
  if (!dir) return false;
  return directoryBytes(dir) > PUBLIC_GUIDE_SPLIT_BYTES;
}

function renderNamedChapter(
  dir: string,
  slug: string,
  visualsPrefix: string,
  visualsDir: string | null
): PublicGuideChapter | null {
  const name = `${slug}.md`;
  const file = path.join(dir, name);
  if (!chapterFiles(dir).includes(name)) return null;
  const markdown = readFileSync(file, "utf8");
  const outline = outlineFromMarkdown(name, markdown);
  return {
    ...outline,
    html: renderMarkdown(markdown, visualsPrefix, visualsDir),
  };
}

function minutesFor(chapters: PublicGuideOutline[]): number {
  const words = chapters.reduce((total, chapter) => total + chapter.words, 0);
  return Math.max(1, Math.round(words / 200));
}

function renderedChapters(id: PublicStudyGuideId): PublicGuideChapter[] {
  const guide = PUBLIC_STUDY_GUIDES[id];
  const visualsDir = guideVisualsDir(id);
  return guideContentDirs(id).flatMap((dir) =>
    chapterFiles(dir).map((name) => {
      const markdown = readFileSync(path.join(dir, name), "utf8");
      return {
        ...outlineFromMarkdown(name, markdown),
        html: renderMarkdown(markdown, guide.visualsPublicPrefix, visualsDir),
      };
    })
  );
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
  if (id === "usmle") {
    const html = singleH1(
      renderMarkdown(
        "# USMLE study guide\n\nStep 1, Step 2 Clinical Knowledge, and Step 3 each open as their own free book. No login is required.",
        guide.visualsPublicPrefix,
        null
      )
    );
    const h1 = decodeVisible(/<h1[^>]*>(.*?)<\/h1>/.exec(html)?.[1] ?? guide.title);
    return { html, h1, faqs: [], toc: [], jsonLd: buildJsonLd(guide, h1, []) };
  }
  const visualsDir = guideVisualsDir(id);
  const rendered = guide.contentDirs.length ? renderedChapters(id) : [];
  const faqs = guide.contentDirs.length
    ? []
    : parseFaqs(npteMarkdown()).slice(0, 12);
  const html = guide.contentDirs.length
    ? singleH1(rendered.map((chapter) => chapter.html).join("\n"))
    : singleH1(renderMarkdown(npteMarkdown(), guide.visualsPublicPrefix, visualsDir));
  const h1 = decodeVisible(/<h1[^>]*>(.*?)<\/h1>/.exec(html)?.[1] ?? guide.title);
  return {
    html,
    h1,
    faqs,
    toc: tocFromHtml(html).slice(0, 24),
    jsonLd: buildJsonLd(guide, h1, faqs),
  };
}

export function publishGuide(id: PublicStudyGuideId): PublishedGuide {
  if (id === "usmle") {
    const hub = loadUsmleHub();
    return { mode: "hub", cards: hub.cards, minutes: hub.minutes };
  }
  const guide = PUBLIC_STUDY_GUIDES[id];
  if (!guide.contentDirs.length || !boardShouldSplit(id)) {
    return { mode: "single", page: loadPublicStudyGuide(id) };
  }
  const chapters = boardOutline(id);
  return { mode: "chapters", chapters, minutes: minutesFor(chapters) };
}

export function loadUsmleHub(): { cards: UsmleHubCard[]; minutes: number } {
  let words = 0;
  const cards = USMLE_PUBLIC_STEPS.map((step) => {
    const chapters = stepOutline(step.id) ?? [];
    words += chapters.reduce((total, chapter) => total + chapter.words, 0);
    const split = stepShouldSplit(step.id);
    return {
      id: step.id,
      href: step.path,
      label: step.label,
      summary: STEP_SEO[step.id]?.answers[0]?.answer ?? step.description,
      chapters: split
        ? chapters.map((chapter) => ({ href: `${step.path}/${chapter.slug}`, title: chapter.title }))
        : [],
    };
  });
  return { cards, minutes: Math.max(1, Math.round(words / 200)) };
}

export function publishUsmleStep(stepId: string): PublishedStep | null {
  const chapters = stepOutline(stepId);
  if (!chapters) return null;
  if (stepShouldSplit(stepId)) {
    return { mode: "chapters", chapters, minutes: minutesFor(chapters) };
  }
  const page = loadUsmleStepGuide(stepId);
  if (!page) return null;
  return { mode: "single", page };
}

export function boardChapterAt(id: PublicStudyGuideId, slug: string) {
  const published = publishGuide(id);
  if (published.mode !== "chapters") return null;
  const index = published.chapters.findIndex((chapter) => chapter.slug === slug);
  const guide = PUBLIC_STUDY_GUIDES[id];
  const dir = guideContentDirs(id)[0];
  if (index < 0 || !dir) return null;
  const chapter = renderNamedChapter(dir, slug, guide.visualsPublicPrefix, guideVisualsDir(id));
  if (!chapter) return null;
  return {
    chapter,
    prev: published.chapters[index - 1] ?? null,
    next: published.chapters[index + 1] ?? null,
  };
}

export function usmleChapterAt(stepId: string, slug: string) {
  const published = publishUsmleStep(stepId);
  const dir = stepContentDir(stepId);
  if (!published || published.mode !== "chapters" || !dir) return null;
  const index = published.chapters.findIndex((chapter) => chapter.slug === slug);
  if (index < 0) return null;
  const chapter = renderNamedChapter(
    dir,
    slug,
    `/usmle-study-guide/${stepId}/visuals/`,
    path.join(process.cwd(), "public/usmle-study-guide", stepId, "visuals")
  );
  if (!chapter) return null;
  return {
    chapter,
    prev: published.chapters[index - 1] ?? null,
    next: published.chapters[index + 1] ?? null,
  };
}

export type GuideSizeRow = { path: string; bodyBytes: number; kind: "single" | "index" | "chapter" | "hub" };

/** Body HTML each public URL actually emits. Chapter indexes count titles and excerpts, not the books. */
export function guideSizeReport(): GuideSizeRow[] {
  const rows: GuideSizeRow[] = [];
  for (const id of Object.keys(PUBLIC_STUDY_GUIDES) as PublicStudyGuideId[]) {
    const guide = PUBLIC_STUDY_GUIDES[id];
    const published = publishGuide(id);
    const query = GUIDE_SEO[id]?.query ?? guide.title;
    if (published.mode === "hub") {
      const bytes = published.cards.reduce(
        (total, card) =>
          total + card.summary.length + card.chapters.reduce((sum, chapter) => sum + chapter.title.length, 0),
        0
      );
      rows.push({ path: guide.path, bodyBytes: bytes, kind: "hub" });
      continue;
    }
    if (published.mode === "single") {
      rows.push({
        path: guide.path,
        bodyBytes: presentGuideHtml(published.page.html, query).length,
        kind: "single",
      });
      continue;
    }
    rows.push({
      path: guide.path,
      bodyBytes: published.chapters.reduce((total, chapter) => total + chapter.title.length + chapter.excerpt.length, 0),
      kind: "index",
    });
    for (const chapter of published.chapters) {
      const located = boardChapterAt(id, chapter.slug);
      rows.push({
        path: `${guide.path}/${chapter.slug}`,
        bodyBytes: located ? presentGuideHtml(located.chapter.html, query).length : 0,
        kind: "chapter",
      });
    }
  }
  for (const step of USMLE_PUBLIC_STEPS) {
    const published = publishUsmleStep(step.id);
    if (!published) continue;
    const query = STEP_SEO[step.id]?.query ?? step.title;
    if (published.mode === "single") {
      rows.push({ path: step.path, bodyBytes: presentGuideHtml(published.page.html, query).length, kind: "single" });
      continue;
    }
    rows.push({
      path: step.path,
      bodyBytes: published.chapters.reduce((total, chapter) => total + chapter.title.length + chapter.excerpt.length, 0),
      kind: "index",
    });
    for (const chapter of published.chapters) {
      const located = usmleChapterAt(step.id, chapter.slug);
      rows.push({
        path: `${step.path}/${chapter.slug}`,
        bodyBytes: located ? presentGuideHtml(located.chapter.html, query).length : 0,
        kind: "chapter",
      });
    }
  }
  return rows;
}

export function loadUsmleStepGuide(stepId: string): LoadedPublicGuide | null {
  const step = USMLE_PUBLIC_STEPS.find((item) => item.id === stepId);
  const dir = stepContentDir(stepId);
  if (!step || !dir) return null;
  const visualsPrefix = `/usmle-study-guide/${stepId}/visuals/`;
  const visualsDir = path.join(process.cwd(), "public/usmle-study-guide", stepId, "visuals");
  const html = singleH1(
    chapterFiles(dir)
      .map((name) => renderMarkdown(readFileSync(path.join(dir, name), "utf8"), visualsPrefix, visualsDir))
      .join("\n")
  );
  const h1 = decodeVisible(/<h1[^>]*>(.*?)<\/h1>/.exec(html)?.[1] ?? step.title);
  return {
    html,
    h1,
    faqs: [],
    toc: tocFromHtml(html).slice(0, 24),
    jsonLd: buildJsonLd(
      { path: step.path, description: step.description, boardLabel: "physician boards" },
      h1,
      []
    ),
  };
}

/** Chapter URLs for guides whose single page would pass 1 MB. Paths stay in the sitemap. */
export function studyGuideChapterPaths(): { path: string; contentDir: string }[] {
  const paths: { path: string; contentDir: string }[] = [];
  for (const id of ["nclex", "naplex", "pance", "aanp-fnp"] as const) {
    if (!boardShouldSplit(id)) continue;
    const guide = PUBLIC_STUDY_GUIDES[id];
    const contentDir = guide.contentDirs[0];
    if (!contentDir) continue;
    for (const chapter of boardOutline(id)) {
      paths.push({ path: `${guide.path}/${chapter.slug}`, contentDir });
    }
  }
  for (const step of USMLE_PUBLIC_STEPS) {
    if (!stepShouldSplit(step.id)) continue;
    for (const chapter of stepOutline(step.id) ?? []) {
      paths.push({ path: `${step.path}/${chapter.slug}`, contentDir: step.contentDir });
    }
  }
  return paths;
}
