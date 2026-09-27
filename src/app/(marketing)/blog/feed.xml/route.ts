import { listPublishedBlogPosts } from "@/lib/blog/public";
import { getSiteUrl } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const revalidate = 60;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET(): Promise<Response> {
  const base = getSiteUrl();
  let items = "";
  try {
    const posts = await listPublishedBlogPosts();
    items = posts
      .map((post) => {
        const link = `${base}/blog/${post.slug}`;
        const when = post.updatedAt ?? post.publishedAt;
        return `<item>
          <title>${escapeXml(post.title)}</title>
          <link>${escapeXml(link)}</link>
          <guid>${escapeXml(link)}</guid>
          <pubDate>${when ? new Date(when).toUTCString() : new Date().toUTCString()}</pubDate>
          <category>${escapeXml(post.category)}</category>
          <description>${escapeXml(post.excerpt || post.title)}</description>
        </item>`;
      })
      .join("");
  } catch {
    items = "";
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`${SITE_NAME} blog`)}</title>
    <link>${escapeXml(`${base}/blog`)}</link>
    <description>${escapeXml("Study plans and exam guides for NCLEX, NAPLEX, USMLE, PANCE, AANP FNP, and NPTE-PT.")}</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
