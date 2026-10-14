import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { appBaseUrl } from "@/lib/email/config";
import { MAX_BLOG_POSTS } from "@/lib/blog/limits";
import {
  publicBlogAuthorName,
  publicBlogBody,
  publicBlogExcerpt,
  publicBlogTitle,
} from "@/lib/blog/public-copy";

export const BLOG_CACHE_TAG = "blog-posts";

/** Stored slug → public URL slug. `/blog/strategies` 301s to the public slug. */
const BLOG_PUBLIC_SLUGS: Record<string, string> = {
  strategies: "nclex-study-plan-rn-pn",
};

export function publicBlogSlug(stored: string): string {
  return BLOG_PUBLIC_SLUGS[stored] ?? stored;
}

function storedBlogSlug(slug: string): string {
  const match = Object.entries(BLOG_PUBLIC_SLUGS).find(([, pub]) => pub === slug);
  return match?.[0] ?? slug;
}

export type PublicBlogPostCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  category: string;
  tags: string[];
  readTime: number;
  publishedAt: string | null;
  updatedAt: string | null;
  authorName: string | null;
};

export type PublicBlogPost = PublicBlogPostCard & {
  content: string;
  views: number;
  metaTitle: string | null;
  metaDescription: string | null;
  authorImage: string | null;
};

/** Prefer a cacheable cover URL over inlining multi-MB data: images in HTML. */
export function publicCoverImageUrl(
  slug: string,
  coverImage: string | null | undefined
): string | null {
  const cover = coverImage?.trim();
  if (!cover) return null;
  if (/^https?:\/\//i.test(cover)) return cover;
  if (cover.startsWith("data:")) return `/api/blog/${encodeURIComponent(slug)}/cover`;
  return cover;
}

function toCard(row: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  category: string;
  tags: string[];
  readTime: number;
  publishedAt: Date | null;
  updatedAt: Date;
  author: { name: string | null } | null;
}): PublicBlogPostCard {
  return {
    id: row.id,
    title: publicBlogTitle(row.title),
    slug: publicBlogSlug(row.slug),
    excerpt: publicBlogExcerpt(row.excerpt),
    coverImage: publicCoverImageUrl(row.slug, row.coverImage),
    category: row.category,
    tags: row.tags,
    readTime: row.readTime,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    updatedAt: row.updatedAt.toISOString(),
    authorName: publicBlogAuthorName(row.author?.name),
  };
}

const listPublishedBlogPostsCached = unstable_cache(
  async (category: string | null, limit: number): Promise<PublicBlogPostCard[]> => {
    const rows = await prisma.blogPost.findMany({
      where: {
        published: true,
        deletedAt: null,
        ...(category ? { category } : {}),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        tags: true,
        readTime: true,
        publishedAt: true,
        updatedAt: true,
        author: { select: { name: true } },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
    return rows.map(toCard);
  },
  ["blog-list"],
  { revalidate: 60, tags: [BLOG_CACHE_TAG] }
);

export async function listPublishedBlogPosts(opts?: {
  category?: string;
  limit?: number;
}): Promise<PublicBlogPostCard[]> {
  return listPublishedBlogPostsCached(
    opts?.category ?? null,
    opts?.limit ?? MAX_BLOG_POSTS
  );
}

const getPublishedBlogPostBySlugCached = unstable_cache(
  async (slug: string): Promise<PublicBlogPost | null> => {
    const row = await prisma.blogPost.findFirst({
      where: { slug, published: true, deletedAt: null },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        tags: true,
        readTime: true,
        publishedAt: true,
        updatedAt: true,
        content: true,
        views: true,
        metaTitle: true,
        metaDescription: true,
        author: { select: { name: true, image: true } },
      },
    });
    if (!row) return null;
    return {
      ...toCard(row),
      content: publicBlogBody(row.content),
      views: row.views,
      metaTitle: row.metaTitle ? publicBlogTitle(row.metaTitle) : null,
      metaDescription: row.metaDescription
        ? publicBlogExcerpt(row.metaDescription)
        : null,
      authorImage: row.author?.image ?? null,
    };
  },
  ["blog-by-slug"],
  { revalidate: 60, tags: [BLOG_CACHE_TAG] }
);

export async function getPublishedBlogPostBySlug(
  slug: string
): Promise<PublicBlogPost | null> {
  const direct = await getPublishedBlogPostBySlugCached(slug);
  if (direct) return direct;
  const stored = storedBlogSlug(slug);
  if (stored === slug) return null;
  return getPublishedBlogPostBySlugCached(stored);
}

const listRelatedBlogPostsCached = unstable_cache(
  async (slug: string, category: string, limit: number): Promise<PublicBlogPostCard[]> => {
    const rows = await prisma.blogPost.findMany({
      where: {
        published: true,
        deletedAt: null,
        slug: { notIn: [...new Set([slug, storedBlogSlug(slug)])] },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        tags: true,
        readTime: true,
        publishedAt: true,
        updatedAt: true,
        author: { select: { name: true } },
      },
      orderBy: [{ publishedAt: "desc" }],
      take: MAX_BLOG_POSTS,
    });
    const sameCategory = rows.filter((row) => row.category === category);
    const other = rows.filter((row) => row.category !== category);
    return [...sameCategory, ...other].slice(0, limit).map(toCard);
  },
  ["blog-related"],
  { revalidate: 60, tags: [BLOG_CACHE_TAG] }
);

export async function listRelatedBlogPosts(
  slug: string,
  category: string,
  limit = 3
): Promise<PublicBlogPostCard[]> {
  return listRelatedBlogPostsCached(slug, category, limit);
}

const listPublishedBlogSlugsCached = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await prisma.blogPost.findMany({
      where: { published: true, deletedAt: null },
      select: { slug: true },
      take: MAX_BLOG_POSTS,
    });
    return [...new Set(rows.map((r) => publicBlogSlug(r.slug)))];
  },
  ["blog-slugs"],
  { revalidate: 60, tags: [BLOG_CACHE_TAG] }
);

export async function listPublishedBlogSlugs(): Promise<string[]> {
  return listPublishedBlogSlugsCached();
}

export async function incrementBlogViews(slug: string): Promise<void> {
  for (const target of [...new Set([slug, storedBlogSlug(slug)])]) {
    const result = await prisma.blogPost.updateMany({
      where: { slug: target, published: true, deletedAt: null },
      data: { views: { increment: 1 } },
    });
    if (result.count > 0) return;
  }
}

export function blogPostAbsoluteUrl(slug: string): string {
  return `${appBaseUrl().replace(/\/$/, "")}/blog/${slug}`;
}
