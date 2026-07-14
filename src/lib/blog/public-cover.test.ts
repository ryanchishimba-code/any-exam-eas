import { describe, expect, it } from "vitest";
import { publicCoverImageUrl } from "./public";

describe("publicCoverImageUrl", () => {
  it("returns null for empty covers", () => {
    expect(publicCoverImageUrl("post", null)).toBeNull();
    expect(publicCoverImageUrl("post", "  ")).toBeNull();
  });

  it("rewrites data URLs to the cover API", () => {
    expect(publicCoverImageUrl("my-post", "data:image/jpeg;base64,abc")).toBe(
      "/api/blog/my-post/cover"
    );
  });

  it("keeps http(s) covers as-is", () => {
    expect(publicCoverImageUrl("x", "https://cdn.example/cover.jpg")).toBe(
      "https://cdn.example/cover.jpg"
    );
  });
});
