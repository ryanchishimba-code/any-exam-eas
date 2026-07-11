import { describe, expect, it } from "vitest";
import {
  estimateReadTimeMinutes,
  slugifyTitle,
  createBlogPostSchema,
} from "./blog-validators";

describe("blog-validators", () => {
  it("slugifies titles", () => {
    expect(slugifyTitle("NCLEX Prioritization Tips!")).toBe("nclex-prioritization-tips");
  });

  it("estimates read time", () => {
    const html = `<p>${"word ".repeat(400)}</p>`;
    expect(estimateReadTimeMinutes(html)).toBe(2);
  });

  it("parses comma tags", () => {
    const parsed = createBlogPostSchema.parse({
      title: "A solid blog title here",
      tags: "nclex, usmle, study tips",
    });
    expect(parsed.tags).toEqual(["nclex", "usmle", "study tips"]);
  });
});
