#!/usr/bin/env npx tsx
/**
 * Offline SEO metadata budget audit (+ optional production HTML crawl).
 *
 * Usage:
 *   npx tsx scripts/audit-seo-metadata.mts
 *   npx tsx scripts/audit-seo-metadata.mts --crawl https://www.anyexameasy.com
 */
import { buildHomeMetadata } from "../src/lib/seo";
import {
  buildAboutMetadata,
  buildCompareMetadata,
  buildExamMetadata,
  buildPricingMetadata,
  buildResourceArticleMetadata,
  buildToolkitHubMetadata,
} from "../src/lib/seo/marketing-metadata";
import { EXAM_SEO_KEYS } from "../src/lib/seo/exam-config";
import { RESOURCE_ARTICLES } from "../src/lib/seo/resources-content";
import {
  SEO_DESC_MAX,
  SEO_DESC_MIN,
  SEO_TITLE_MAX,
  validateMetaDescription,
  validateMetaTitle,
} from "../src/lib/seo/meta-budget";
import type { Metadata } from "next";

type Row = {
  path: string;
  title: string;
  description: string;
  canonical: string | null;
  source: "builder" | "crawl";
};

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
  return "";
}

function collectBuilderRows(): Row[] {
  const rows: Row[] = [
    { path: "/", ...metaFields(buildHomeMetadata()), source: "builder" },
    { path: "/about", ...metaFields(buildAboutMetadata()), source: "builder" },
    { path: "/toolkit", ...metaFields(buildToolkitHubMetadata()), source: "builder" },
    { path: "/pricing", ...metaFields(buildPricingMetadata()), source: "builder" },
    { path: "/compare", ...metaFields(buildCompareMetadata()), source: "builder" },
  ];

  for (const key of EXAM_SEO_KEYS) {
    const meta = buildExamMetadata(key);
    const path = key === "aanp-fnp" ? "/aanp-fnp" : key === "npte-pt" ? "/npte-pt" : `/${key}`;
    rows.push({ path, ...metaFields(meta), source: "builder" });
  }

  for (const article of RESOURCE_ARTICLES) {
    rows.push({
      path: `/resources/${article.slug}`,
      ...metaFields(buildResourceArticleMetadata(article)),
      source: "builder",
    });
  }

  return rows;
}

function metaFields(meta: Metadata): Omit<Row, "path" | "source"> {
  return {
    title: readTitle(meta),
    description: readDescription(meta),
    canonical: readCanonical(meta) || null,
  };
}

function auditRows(rows: Row[]) {
  const issues: string[] = [];
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();

  for (const row of rows) {
    const titleIssue = validateMetaTitle(row.title);
    if (titleIssue) {
      issues.push(`${row.path}: title_long_or_short (${row.title.length}) — ${row.title}`);
    } else if (row.title.length > SEO_TITLE_MAX) {
      issues.push(`${row.path}: title_long (${row.title.length})`);
    }

    const descIssue = validateMetaDescription(row.description);
    if (descIssue) {
      const kind =
        row.description.length > SEO_DESC_MAX
          ? "desc_long"
          : row.description.length < SEO_DESC_MIN
            ? "desc_short"
            : "desc_invalid";
      issues.push(`${row.path}: ${kind} (${row.description.length}) — ${row.description}`);
    }

    if (!row.canonical) {
      issues.push(`${row.path}: missing_canonical`);
    }

    const prevTitle = titles.get(row.title);
    if (prevTitle) issues.push(`${row.path}: duplicate_title (also ${prevTitle})`);
    else titles.set(row.title, row.path);

    const prevDesc = descriptions.get(row.description);
    if (prevDesc) issues.push(`${row.path}: duplicate_description (also ${prevDesc})`);
    else descriptions.set(row.description, row.path);
  }

  return issues;
}

function extractTag(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m?.[1]?.trim() ?? null;
}

/** Decode common HTML entities so length matches what crawlers index. */
function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

async function crawlProduction(baseUrl: string): Promise<Row[]> {
  const paths = [
    "/",
    "/about",
    "/toolkit",
    "/pricing",
    "/compare",
    "/nclex",
    "/usmle",
    "/naplex",
    "/pance",
    "/aanp-fnp",
    "/npte-pt",
    "/blog",
    "/feedback",
    "/login",
    "/signup",
    "/legal/privacy",
    "/legal/terms",
    "/legal/disclaimer",
    ...RESOURCE_ARTICLES.map((a) => `/resources/${a.slug}`),
  ];

  const rows: Row[] = [];
  for (const path of paths) {
    const url = new URL(path, baseUrl).toString();
    const res = await fetch(url, {
      headers: { "user-agent": "AnyExamEasy-seo-metadata-audit/1.0" },
      redirect: "follow",
    });
    const html = await res.text();
    const title = decodeHtmlEntities(extractTag(html, /<title[^>]*>([^<]*)<\/title>/i) ?? "");
    const description = decodeHtmlEntities(
      extractTag(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ??
        extractTag(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i) ??
        ""
    );
    const canonical =
      extractTag(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ??
      extractTag(html, /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);

    rows.push({ path, title, description, canonical, source: "crawl" });
    console.log(`crawled ${path} → title=${title.length} desc=${description.length} canonical=${canonical ? "yes" : "no"}`);
  }
  return rows;
}

async function main() {
  const crawlIdx = process.argv.indexOf("--crawl");
  const crawlBase = crawlIdx >= 0 ? process.argv[crawlIdx + 1] : null;

  console.log("== Offline builder audit ==");
  const builderRows = collectBuilderRows();
  const builderIssues = auditRows(builderRows);
  console.log(`Checked ${builderRows.length} builder URLs`);
  if (builderIssues.length) {
    console.error("FAIL builder audit:");
    for (const issue of builderIssues) console.error(`  - ${issue}`);
    process.exitCode = 1;
  } else {
    console.log("PASS builder audit (title ≤60, desc 140–160, canonical present, unique)");
  }

  if (crawlBase) {
    console.log(`\n== Production crawl (${crawlBase}) ==`);
    const crawlRows = await crawlProduction(crawlBase.replace(/\/$/, ""));
    const crawlIssues = auditRows(crawlRows);
    console.log(`Checked ${crawlRows.length} live URLs`);
    if (crawlIssues.length) {
      console.error("FAIL crawl audit:");
      for (const issue of crawlIssues) console.error(`  - ${issue}`);
      process.exitCode = 1;
    } else {
      console.log("PASS crawl audit");
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
