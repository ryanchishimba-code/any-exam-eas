import { createHash } from "node:crypto";
import { BLOG_UPGRADE_VERSION } from "@/lib/blog/upgrades/posts";
import type { BlogUpgrade } from "@/lib/blog/upgrades/types";

/** Editorial fields the upgrade replaces. Identity, cover, and view counts stay. */
export type BlogEditorialSnapshot = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readTime: number;
  metaTitle: string | null;
  metaDescription: string | null;
};

export function editorialSnapshot(post: BlogUpgrade): BlogEditorialSnapshot {
  return {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    tags: [...post.tags],
    readTime: post.readTime,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
  };
}

export function editorialHash(snapshot: BlogEditorialSnapshot): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        version: BLOG_UPGRADE_VERSION,
        ...snapshot,
        tags: [...snapshot.tags],
      })
    )
    .digest("hex");
}

export function editorialsMatch(current: BlogEditorialSnapshot, next: BlogEditorialSnapshot): boolean {
  return (
    current.title === next.title &&
    current.excerpt === next.excerpt &&
    current.content === next.content &&
    current.category === next.category &&
    current.readTime === next.readTime &&
    (current.metaTitle ?? "") === (next.metaTitle ?? "") &&
    (current.metaDescription ?? "") === (next.metaDescription ?? "") &&
    current.tags.join("\0") === next.tags.join("\0")
  );
}

export const BLOG_UPGRADE_CONFIRM = "apply-blog-2026-09-27";
