import { listPublishedBlogPosts } from "@/lib/blog/public";
import {
  buildSitemapGroups,
  isSitemapId,
  renderSitemapIndex,
  renderUrlSet,
  type SitemapId,
} from "@/lib/seo/sitemap-catalog";

export const SITEMAP_XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
} as const;

async function publishedPosts() {
  try {
    return await listPublishedBlogPosts();
  } catch {
    // Preview and build can render the sitemap before the database is reachable.
    return [];
  }
}

export async function sitemapIndexResponse(): Promise<Response> {
  const posts = await publishedPosts();
  const xml = renderSitemapIndex(buildSitemapGroups({ posts, now: new Date() }));
  return new Response(xml, { headers: SITEMAP_XML_HEADERS });
}

export async function sitemapFileResponse(rawId: string): Promise<Response> {
  const id = rawId.replace(/\.xml$/, "");
  if (!isSitemapId(id)) {
    return new Response("Not found", { status: 404 });
  }
  const posts = id === "blog" ? await publishedPosts() : [];
  const xml = renderUrlSet(buildSitemapGroups({ posts, now: new Date() })[id as SitemapId]);
  return new Response(xml, { headers: SITEMAP_XML_HEADERS });
}
