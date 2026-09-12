import { describe, expect, it } from "vitest";
import {
  BLOG_BRAND_BYLINE,
  publicBlogAuthorName,
  publicBlogBody,
  publicBlogExcerpt,
  publicBlogTitle,
} from "./public-copy";

describe("public blog copy", () => {
  it("replaces placeholder authors", () => {
    expect(publicBlogAuthorName("Dev User")).toBe(BLOG_BRAND_BYLINE);
    expect(publicBlogAuthorName("dev user")).toBe(BLOG_BRAND_BYLINE);
    expect(publicBlogAuthorName(null)).toBe(BLOG_BRAND_BYLINE);
    expect(publicBlogAuthorName("Ryan Chishimba")).toBe("Ryan Chishimba");
  });

  it("scrubs guaranteed-pass titles without inventing rates", () => {
    expect(publicBlogTitle("First-Time Pass Guaranteed")).toBe("First-Time Pass Strategy");
    expect(publicBlogTitle("NCLEX Pass Guaranteed in 2026")).toBe("NCLEX Pass-Focused Prep in 2026");
    expect(publicBlogExcerpt("We guarantee you'll pass.")).not.toMatch(/guarantee/i);
    expect(publicBlogBody("<p>Guaranteed to pass if you subscribe</p>")).not.toMatch(
      /guaranteed to pass/i
    );
  });
});
