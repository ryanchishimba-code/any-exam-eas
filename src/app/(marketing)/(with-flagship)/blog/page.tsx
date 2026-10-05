import { Suspense } from "react";
import type { Metadata } from "next";
import { BlogIndexBody, BlogIndexFiltered } from "@/components/blog/BlogIndexBody";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { listPublishedBlogPosts, type PublicBlogPostCard } from "@/lib/blog/public";
import { blogIndexJsonLd } from "@/lib/blog/schema";
import { MAX_BLOG_POSTS } from "@/lib/blog/limits";

/**
 * ISR. `?category=` is read in the client so this page is not forced dynamic.
 * The cached HTML is the full list (the canonical URL). A category query
 * filters after hydration.
 */
export const revalidate = 60;

const BLOG_TITLE = "Board Exam Prep Blog — Study Tips & Guides";
const BLOG_DESCRIPTION =
  "Study plans for NCLEX, NAPLEX, USMLE, PANCE, FNP, and NPTE. Official exam rules, practice habits, and what one subscription includes. Updated 2026.";

export const metadata: Metadata = {
  title: { absolute: BLOG_TITLE },
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/feed.xml" },
  },
  openGraph: {
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
  },
};

export default async function BlogIndexPage() {
  let posts: PublicBlogPostCard[] = [];
  try {
    posts = await listPublishedBlogPosts({ limit: MAX_BLOG_POSTS });
  } catch {
    posts = [];
  }

  return (
    <>
      <JsonLdScript data={blogIndexJsonLd(posts)} />
      <Suspense fallback={<BlogIndexBody posts={posts} category={null} />}>
        <BlogIndexFiltered posts={posts} />
      </Suspense>
    </>
  );
}
