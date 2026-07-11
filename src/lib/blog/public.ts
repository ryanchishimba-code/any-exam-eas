import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { appBaseUrl } from "@/lib/email/config";
import { MAX_BLOG_POSTS } from "@/lib/blog/limits";

export const BLOG_CACHE_TAG = "blog-posts";

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
  authorName: string | null;
};

export type PublicBlogPost = PublicBlogPostCard & {
  content: string;
  views: number;
  metaTitle: string | null;
  metaDescription: string | null;
  authorImage: string | null;
};

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
  author: { name: string | null } | null;
}): PublicBlogPostCard {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    coverImage: row.coverImage,
    category: row.category,
    tags: row.tags,
    readTime: row.readTime,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    authorName: row.author?.name ?? null,
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
      content: row.content,
      views: row.views,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      authorImage: row.author?.image ?? null,
    };
  },
  ["blog-by-slug"],
  { revalidate: 60, tags: [BLOG_CACHE_TAG] }
);

export async function getPublishedBlogPostBySlug(
  slug: string
): Promise<PublicBlogPost | null> {
  return getPublishedBlogPostBySlugCached(slug);
}

const listRelatedBlogPostsCached = unstable_cache(
  async (slug: string, category: string, limit: number): Promise<PublicBlogPostCard[]> => {
    const rows = await prisma.blogPost.findMany({
      where: {
        published: true,
        deletedAt: null,
        slug: { not: slug },
        category,
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
        author: { select: { name: true } },
      },
      orderBy: [{ publishedAt: "desc" }],
      take: limit,
    });
    return rows.map(toCard);
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
    return rows.map((r) => r.slug);
  },
  ["blog-slugs"],
  { revalidate: 60, tags: [BLOG_CACHE_TAG] }
);

export async function listPublishedBlogSlugs(): Promise<string[]> {
  return listPublishedBlogSlugsCached();
}

export async function incrementBlogViews(slug: string): Promise<void> {
  await prisma.blogPost.updateMany({
    where: { slug, published: true, deletedAt: null },
    data: { views: { increment: 1 } },
  });
}

export function blogPostAbsoluteUrl(slug: string): string {
  return `${appBaseUrl().replace(/\/$/, "")}/blog/${slug}`;
}
