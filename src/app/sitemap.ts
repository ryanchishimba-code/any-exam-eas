import type { MetadataRoute } from "next";
import { qotdPath, todayIsoUtc } from "@/lib/demo/qotd";
import { EXAM_SLUGS } from "@/lib/edtech/exams";
import { getSiteUrl } from "@/lib/seo";
import { getExamMarketingSitemapPaths } from "@/lib/seo/marketing-metadata";
import { RESOURCE_ARTICLES } from "@/lib/seo/resources-content";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.85, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
  { path: "/compare", priority: 0.88, changeFrequency: "weekly" },
  { path: "/toolkit", priority: 0.9, changeFrequency: "weekly" },
  { path: "/daily", priority: 0.88, changeFrequency: "daily" },
  { path: "/signup", priority: 0.8, changeFrequency: "monthly" },
  { path: "/login", priority: 0.5, changeFrequency: "monthly" },
  { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/disclaimer", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
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

  return [
    ...staticEntries,
    ...examEntries,
    ...examAliasEntries,
    ...qotdEntries,
    ...resourceEntries,
  ];
}
