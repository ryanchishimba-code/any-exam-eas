import type { MetadataRoute } from "next";
import { listPublishedBlogPosts } from "@/lib/blog/public";
import { qotdPath, todayIsoUtc } from "@/lib/demo/qotd";
import { EXAM_SLUGS } from "@/lib/edtech/exams";
import { MERCH_PATH } from "@/lib/merch/catalog";
import { isMerchPageAvailable } from "@/lib/merch/merch";
import { getSiteUrl } from "@/lib/seo";
import { getExamMarketingSitemapPaths } from "@/lib/seo/marketing-metadata";
import { RESOURCE_ARTICLES } from "@/lib/seo/resources-content";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.85, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/how-questions-are-reviewed", priority: 0.8, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
  { path: "/compare", priority: 0.88, changeFrequency: "weekly" },
  { path: "/toolkit", priority: 0.9, changeFrequency: "weekly" },
  { path: "/daily", priority: 0.88, changeFrequency: "daily" },
  { path: "/signup", priority: 0.8, changeFrequency: "monthly" },
  { path: "/login", priority: 0.5, changeFrequency: "monthly" },
  { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/disclaimer", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/refunds", priority: 0.4, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();
  const today = todayIsoUtc();

  const staticEntries = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const examEntries = getExamMarketingSitemapPaths().map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const examAliasEntries = [
    { path: "/npte", priority: 0.85 },
  ].map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  }));

  const qotdEntries = EXAM_SLUGS.flatMap((exam) => [
    {
      url: `${base}${qotdPath(exam)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${base}${qotdPath(exam, today)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.85,
    },
  ]);

  const resourceEntries = RESOURCE_ARTICLES.map((article) => ({
    url: `${base}/resources/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
  try {
    const posts = await listPublishedBlogPosts();
    for (const post of posts) {
      blogEntries.push({
        url: `${base}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt ?? post.publishedAt ?? now),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch {
    // Build and preview can render the sitemap before the database is reachable.
  }

  const merchEntries = isMerchPageAvailable()
    ? [
        {
          url: `${base}${MERCH_PATH}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.4,
        },
      ]
    : [];

  return [
    ...staticEntries,
    ...examEntries,
    ...examAliasEntries,
    ...qotdEntries,
    ...resourceEntries,
    ...blogEntries,
    ...merchEntries,
  ];
}
