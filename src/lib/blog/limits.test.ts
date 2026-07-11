import { describe, expect, it } from "vitest";
import { BlogPostLimitError, MAX_BLOG_POSTS } from "./limits";

describe("blog limits", () => {
  it("caps active posts at 4", () => {
    expect(MAX_BLOG_POSTS).toBe(4);
  });

  it("exposes a clear limit error", () => {
    const err = new BlogPostLimitError();
    expect(err.code).toBe("BLOG_POST_LIMIT");
    expect(err.message).toMatch(/up to 4 blog posts/i);
  });
});
