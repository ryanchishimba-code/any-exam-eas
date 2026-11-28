/** Stored slug → public URL slug. The old paths 301 to these. */
export const BLOG_PUBLIC_SLUGS = {
  strategies: "nclex-study-plan-rn-pn",
  why: "affordable-nclex-prep",
  okay: "naplex-study-plan",
} as const;

export function publicBlogSlug(stored: string): string {
  return BLOG_PUBLIC_SLUGS[stored as keyof typeof BLOG_PUBLIC_SLUGS] ?? stored;
}
