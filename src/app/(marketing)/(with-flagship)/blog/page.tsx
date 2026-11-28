import { Suspense } from "react";
import type { Metadata } from "next";
import { BlogIndexBody, BlogIndexFiltered } from "@/components/blog/BlogIndexBody";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { publicBreadcrumbJsonLd } from "@/lib/seo/public-schema";
import { BLOG_UPGRADES } from "@/lib/blog/upgrades/posts";
import { listPublishedBlogPosts, publicBlogSlug, type PublicBlogPostCard } from "@/lib/blog/public";
import { blogIndexJsonLd } from "@/lib/blog/schema";
import { BLOG_INDEX_DESCRIPTION, BLOG_INDEX_TITLE } from "@/lib/blog/index-meta";
import { MAX_BLOG_POSTS } from "@/lib/blog/limits";

/**
 * ISR. `?category=` is read in the client so this page is not forced dynamic.
 * The cached HTML is the full list (the canonical URL). A category query
 * filters after hydration.
 */
export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: BLOG_INDEX_TITLE },
  description: BLOG_INDEX_DESCRIPTION,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/feed.xml" },
  },
  openGraph: {
    title: BLOG_INDEX_TITLE,
    description: BLOG_INDEX_DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: BLOG_INDEX_TITLE,
    description: BLOG_INDEX_DESCRIPTION,
  },
};

function withUpgradePosts(posts: PublicBlogPostCard[]): PublicBlogPostCard[] {
  const seen = new Set(posts.map((post) => post.slug));
  const extras: PublicBlogPostCard[] = BLOG_UPGRADES.filter(
    (post) => !seen.has(publicBlogSlug(post.slug))
  ).map((post) => ({
    id: `upgrade-${post.slug}`,
    title: post.title,
    slug: publicBlogSlug(post.slug),
    excerpt: post.excerpt,
    coverImage: null,
    category: post.category,
    tags: post.tags,
    readTime: post.readTime,
    publishedAt: null,
    updatedAt: null,
    authorName: "AnyExamEasy",
  }));
  return [...posts, ...extras];
}

export default async function BlogIndexPage() {
  let posts: PublicBlogPostCard[] = [];
  try {
    posts = await listPublishedBlogPosts({ limit: MAX_BLOG_POSTS });
  } catch {
    posts = [];
  }
  posts = withUpgradePosts(posts);

  return (
    <>
      <JsonLdScript data={blogIndexJsonLd(posts)} />
      <JsonLdScript data={publicBreadcrumbJsonLd([{ name: "Blog", path: "/blog" }])} />
      <Suspense fallback={<BlogIndexBody posts={posts} category={null} />}>
        <BlogIndexFiltered posts={posts} />
      </Suspense>
    </>
  );
}
