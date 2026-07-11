/** Soft product cap — keep the public blog focused and easy to scan. */
export const MAX_BLOG_POSTS = 4;

export class BlogPostLimitError extends Error {
  readonly code = "BLOG_POST_LIMIT" as const;

  constructor(limit = MAX_BLOG_POSTS) {
    super(`You can have up to ${limit} blog posts. Delete one to add another.`);
    this.name = "BlogPostLimitError";
  }
}
