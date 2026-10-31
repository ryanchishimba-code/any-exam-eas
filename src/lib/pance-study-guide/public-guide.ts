import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { readImageSize } from "@/lib/nclex-study-guide/image-dimensions";
import { markdownToSimpleHtml } from "@/lib/nclex-study-guide/markdown";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const PANCE_STUDY_GUIDE_PATH = "/pance-study-guide";

export const PANCE_STUDY_GUIDE_TITLE = "Free PANCE Study Guide (2026): NCCPA Blueprint";

export const PANCE_STUDY_GUIDE_DESCRIPTION =
  "Free PANCE study guide for the NCCPA blueprint: 300 questions in five blocks, a $550 application fee, passing score 350, and study plans. Independent of NCCPA.";

const CONTENT_DIR = path.join(process.cwd(), "content/pance-study-guide");
const VISUALS_DIR = path.join(process.cwd(), "public/pance-study-guide/visuals");

export type PanceFaq = { question: string; answer: string };

export type PanceStudyGuidePage = {
  html: string;
  h1: string;
  faqs: PanceFaq[];
  jsonLd: Record<string, unknown>;
};

function chapterFiles(): string[] {
  return readdirSync(CONTENT_DIR)
    .filter((name) => /^\d{2}-.+\.md$/.test(name))
    .sort();
}

/**
 * Paid depth is wrapped in these markers. The public teaser keeps the
 * manuscript outside them. The gated reader ingests the full file.
 */
export function stripPremiumBlocks(markdown: string): string {
  return markdown.replace(/<!--\s*premium\s*-->[\s\S]*?<!--\s*\/premium\s*-->/g, "\n");
}

function rewriteVisuals(markdown: string): string {
  return markdown.replace(/\]\(visuals\//g, "](/pance-study-guide/visuals/");
}

/** Keep the manuscript's opening title as the only H1. Later chapter titles become H2. */
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
    .trim();
}

function parseFaqs(markdown: string): PanceFaq[] {
  const faqs: PanceFaq[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    const heading = /^###\s+(.+)$/.exec(lines[i]?.trim() ?? "");
    if (!heading) continue;
    const answer: string[] = [];
    i += 1;
    while (i < lines.length && !(lines[i] ?? "").trim().startsWith("#")) {
      const line = (lines[i] ?? "").trim();
      if (line && line !== "---") answer.push(line);
      i += 1;
    }
    i -= 1;
    const text = answer.join(" ").trim();
    if (text) faqs.push({ question: heading[1]!.trim(), answer: text });
  }
  return faqs;
}

function buildJsonLd(h1: string, faqs: PanceFaq[]): Record<string, unknown> {
  const pageUrl = absoluteUrl(PANCE_STUDY_GUIDE_PATH);
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site },
          { "@type": "ListItem", position: 2, name: "PANCE Study Guide", item: pageUrl },
        ],
      },
      {
        "@type": "Article",
        headline: h1,
        description: PANCE_STUDY_GUIDE_DESCRIPTION,
        dateModified: "2026-10-24",
        mainEntityOfPage: pageUrl,
        author: { "@type": "Organization", name: SITE_NAME },
        publisher: { "@type": "Organization", name: SITE_NAME },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

export function loadPanceStudyGuidePage(): PanceStudyGuidePage {
  const files = chapterFiles();
  const parts = files.map((name) =>
    stripPremiumBlocks(readFileSync(path.join(CONTENT_DIR, name), "utf8"))
  );
  const faqFile = parts.find((_, index) => files[index] === "20-faq.md") ?? "";
  const faqs = parseFaqs(faqFile);
  const html = singleH1(
    markdownToSimpleHtml(rewriteVisuals(parts.join("\n\n")), {
      imageSize: (src) => {
        const fileName = src.split("/").pop();
        if (!fileName) return undefined;
        return readImageSize(path.join(VISUALS_DIR, fileName));
      },
    })
  );
  const h1 = decodeVisible(/<h1[^>]*>(.*?)<\/h1>/.exec(html)?.[1] ?? "");
  return { html, h1, faqs, jsonLd: buildJsonLd(h1, faqs) };
}
