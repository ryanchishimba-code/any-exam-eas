import type { MetadataRoute } from "next";
import { CROSSWORD_BOARDS } from "@/lib/crossword/boards";
import {
  crosswordBoardPath,
  crosswordDatedPath,
  crosswordHubPath,
  recentArchiveDates,
  todayIsoCentral,
} from "@/lib/crossword/schedule";
import { EXAM_SLUGS } from "@/lib/edtech/exams";
import { qotdPath } from "@/lib/demo/qotd-public";
import { PANCE_STUDY_GUIDE_PATH, PANCE_STUDY_GUIDE_UPDATED } from "@/lib/pance-study-guide/public-guide";
import { contentUpdatedOn } from "@/lib/study-guides/content-updated";
import { studyGuideChapterPaths } from "@/lib/study-guides/load-public-guide";
import { PUBLIC_STUDY_GUIDE_LIST, USMLE_PUBLIC_STEPS } from "@/lib/study-guides/public-catalog";
import { CANONICAL_ORIGIN, isNonIndexablePath, normalizePath } from "@/lib/seo/crawl-policy";
import { isGatedStudyGuidePath } from "@/lib/seo/gated-study-guide-paths";
import { getExamMarketingSitemapPaths } from "@/lib/seo/marketing-metadata";
import { publicBlogSlug } from "@/lib/blog/public-slugs";
import { BLOG_UPGRADES, BLOG_UPGRADE_VERSION } from "@/lib/blog/upgrades/posts";
import { RESOURCE_ARTICLES } from "@/lib/seo/resources-content";

export const SITEMAP_IDS = ["pages", "study-guides", "drugs", "blog"] as const;

export type SitemapId = (typeof SITEMAP_IDS)[number];

export type SitemapUrl = {
  loc: string;
  /** YYYY-MM-DD from the content itself. Omitted when no content date exists. */
  lastmod?: string;
};

export type SitemapBlogPost = {
  slug: string;
  updatedAt?: string | null;
  publishedAt?: string | null;
};

const PAGE_PATHS = [
  "/",
  "/about",
  "/faq",
  "/how-to-pass",
  "/contact",
  "/how-questions-are-reviewed",
  "/free-practice-questions",
  "/pricing",
  "/compare",
  "/toolkit",
  "/community",
  "/employers",
  "/anatomy",
  "/anatomy/catalog",
  "/legal/terms",
  "/legal/privacy",
  "/legal/disclaimer",
  "/legal/refunds",
] as const;

const STUDY_GUIDE_PATHS = ["/free-guides"] as const;

export function canonicalLoc(path: string): string {
  const normalized = normalizePath(path);
  if (normalized === "/") return CANONICAL_ORIGIN;
  return `${CANONICAL_ORIGIN}${normalized}`;
}

export function contentDate(value: string | Date | null | undefined): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return undefined;
    return value.toISOString().slice(0, 10);
  }
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value.trim());
  return match?.[1];
}

export function buildSitemapGroups(input: {
  posts?: SitemapBlogPost[];
  now?: Date;
}): Record<SitemapId, SitemapUrl[]> {
  const now = input.now ?? new Date();
  const today = todayIsoCentral(now);
  const pages: SitemapUrl[] = [
    ...PAGE_PATHS.map((path) => entry(path)),
    ...getExamMarketingSitemapPaths().map((path) => entry(path)),
    entry("/daily", today),
    entry(crosswordHubPath(), today),
    ...EXAM_SLUGS.flatMap((exam) => [
      entry(qotdPath(exam), today),
      entry(qotdPath(exam, today), today),
    ]),
    ...CROSSWORD_BOARDS.flatMap((board) => [
      entry(crosswordBoardPath(board), today),
      ...recentArchiveDates(30, now).map((date) => entry(crosswordDatedPath(board, date), date)),
    ]),
  ];

  const studyGuides: SitemapUrl[] = [
    ...STUDY_GUIDE_PATHS.map((path) => entry(path)),
    ...PUBLIC_STUDY_GUIDE_LIST.map((guide) => {
      if (guide.path === PANCE_STUDY_GUIDE_PATH) {
        return entry(guide.path, PANCE_STUDY_GUIDE_UPDATED);
      }
      const dirs = guide.contentDirs.length
        ? [...guide.contentDirs]
        : ["src/lib/exam-prep/npte-pt/content-outline.ts"];
      return entry(guide.path, contentUpdatedOn(dirs, now).iso);
    }),
    ...USMLE_PUBLIC_STEPS.map((step) =>
      entry(step.path, contentUpdatedOn([step.contentDir], now).iso)
    ),
    ...studyGuideChapterPaths().map((chapter) =>
      entry(chapter.path, contentUpdatedOn([chapter.contentDir], now).iso)
    ),
    ...RESOURCE_ARTICLES.map((article) =>
      entry(`/resources/${article.slug}`, article.updatedAt)
    ),
  ];

  const drugs: SitemapUrl[] = [entry("/study/drugs300")];

  const posts = input.posts ?? [];
  const upgradeDate = contentDate(BLOG_UPGRADE_VERSION);
  const bySlug = new Map<string, SitemapUrl>();
  for (const upgrade of BLOG_UPGRADES) {
    const slug = publicBlogSlug(upgrade.slug);
    bySlug.set(slug, entry(`/blog/${slug}`, upgradeDate));
  }
  for (const post of posts) {
    const raw = post.slug.trim();
    const slug = publicBlogSlug(raw);
    if (!slug || slug.includes("/") || slug.includes("?")) continue;
    const alias = slug !== raw;
    if (alias && bySlug.has(slug)) continue;
    const lastmod = contentDate(post.updatedAt) ?? contentDate(post.publishedAt) ?? upgradeDate;
    bySlug.set(slug, entry(`/blog/${slug}`, lastmod));
  }
  const blogPosts = [...bySlug.values()];
  const blogLastmod = blogPosts
    .map((item) => item.lastmod)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);
  const blog: SitemapUrl[] = [entry("/blog", blogLastmod), ...blogPosts];

  return {
    pages: uniqueIndexable(pages),
    "study-guides": uniqueIndexable(studyGuides),
    drugs: uniqueIndexable(drugs),
    blog: uniqueIndexable(blog),
  };
}

export function allSitemapUrls(groups: Record<SitemapId, SitemapUrl[]>): SitemapUrl[] {
  return SITEMAP_IDS.flatMap((id) => groups[id]);
}

export function toMetadataEntries(urls: SitemapUrl[]): MetadataRoute.Sitemap {
  return urls.map((url) =>
    url.lastmod ? { url: url.loc, lastModified: url.lastmod } : { url: url.loc }
  );
}

export function renderUrlSet(urls: SitemapUrl[]): string {
  const body = urls
    .map((url) => {
      const lastmod = url.lastmod ? `<lastmod>${escapeXml(url.lastmod)}</lastmod>` : "";
      return `<url><loc>${escapeXml(url.loc)}</loc>${lastmod}</url>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>\n`;
}

export function renderSitemapIndex(groups: Record<SitemapId, SitemapUrl[]>): string {
  const body = SITEMAP_IDS.map((id) => {
    const latest = groups[id]
      .map((url) => url.lastmod)
      .filter((value): value is string => Boolean(value))
      .sort()
      .at(-1);
    const lastmod = latest ? `<lastmod>${escapeXml(latest)}</lastmod>` : "";
    const loc = `${CANONICAL_ORIGIN}/sitemap/${id}.xml`;
    return `<sitemap><loc>${escapeXml(loc)}</loc>${lastmod}</sitemap>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>\n`;
}

export function isSitemapId(value: string): value is SitemapId {
  return (SITEMAP_IDS as readonly string[]).includes(value);
}

function entry(path: string, lastmod?: string | null): SitemapUrl {
  const dated = contentDate(lastmod ?? undefined);
  return dated ? { loc: canonicalLoc(path), lastmod: dated } : { loc: canonicalLoc(path) };
}

function uniqueIndexable(urls: SitemapUrl[]): SitemapUrl[] {
  const seen = new Set<string>();
  const kept: SitemapUrl[] = [];
  for (const url of urls) {
    if (!isPublishableSitemapUrl(url.loc)) continue;
    if (seen.has(url.loc)) continue;
    seen.add(url.loc);
    kept.push(url);
  }
  return kept;
}

export function isPublishableSitemapUrl(loc: string): boolean {
  let url: URL;
  try {
    url = new URL(loc);
  } catch {
    return false;
  }
  if (url.origin !== CANONICAL_ORIGIN) return false;
  if (url.search || url.hash) return false;
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) return false;
  const path = normalizePath(url.pathname);
  if (isNonIndexablePath(path)) return false;
  if (isGatedStudyGuidePath(path)) return false;
  return true;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
