import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { gatedStudyGuidePaths, isGatedStudyGuidePath } from "@/lib/seo/gated-study-guide-paths";

describe("login-gated study guides stay out of the sitemap", () => {
  it("matches reader routes and leaves the public PANCE page alone", () => {
    expect(gatedStudyGuidePaths()).toEqual(
      expect.arrayContaining([
        "/nclex/study-guide",
        "/naplex/study-guide",
        "/aanp-fnp/study-guide",
        "/pance/study-guide",
      ])
    );
    expect(isGatedStudyGuidePath("https://www.anyexameasy.com/nclex/study-guide/cardiac")).toBe(true);
    expect(isGatedStudyGuidePath("/pance/study-guide")).toBe(true);
    expect(isGatedStudyGuidePath("/pance-study-guide")).toBe(false);
    expect(isGatedStudyGuidePath("/naplex")).toBe(false);
  });

  it("is applied by the sitemap and disallowed for crawlers", () => {
    const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
    const robots = readFileSync("src/app/robots.ts", "utf8");
    expect(sitemap).toContain("isGatedStudyGuidePath");
    expect(sitemap).toContain('path: "/pance-study-guide"');
    expect(robots).toContain("gatedStudyGuidePaths");
  });
});
