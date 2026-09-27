import { sortBlogCategories } from "@/lib/blog/categories";
import { naplexPost } from "@/lib/blog/upgrades/posts/okay";
import { strategiesPost } from "@/lib/blog/upgrades/posts/strategies";
import { subscriptionPost } from "@/lib/blog/upgrades/posts/subscription";
import { whyPost } from "@/lib/blog/upgrades/posts/why";
import type { BlogUpgrade } from "@/lib/blog/upgrades/types";

export { sortBlogCategories };

/** Published slugs only. Never drop a live URL; add a redirect if a slug must change. */
export const BLOG_UPGRADES: BlogUpgrade[] = [
  whyPost,
  strategiesPost,
  naplexPost,
  subscriptionPost,
];

export const BLOG_UPGRADE_VERSION = "2026-09-27-1";

const bySlug = new Map(BLOG_UPGRADES.map((post) => [post.slug, post]));

export function getBlogUpgrade(slug: string): BlogUpgrade | undefined {
  return bySlug.get(slug);
}
