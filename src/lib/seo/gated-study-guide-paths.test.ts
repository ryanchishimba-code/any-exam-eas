import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { gatedStudyGuidePaths, isGatedStudyGuidePath } from "@/lib/seo/gated-study-guide-paths";
import { allSitemapUrls, buildSitemapGroups } from "@/lib/seo/sitemap-catalog";

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
    const urls = allSitemapUrls(buildSitemapGroups({ posts: [], now: new Date("2026-11-28T00:30:00.000Z") })).map(
      (url) => new URL(url.loc).pathname
    );
    const robots = readFileSync("src/app/robots.ts", "utf8");
    expect(urls).toContain("/pance-study-guide");
    expect(urls).toContain("/nclex-study-guide");
    expect(urls).toContain("/free-guides");
    expect(urls.some((path) => path.includes("login") || path.includes("signup") || path.includes("forgot-password"))).toBe(
      false
    );
    expect(urls.some((path) => path.startsWith("/nclex/study-guide"))).toBe(false);
    expect(robots).not.toContain("/nclex-study-guide");
    expect(robots).not.toContain("/pance-study-guide");
    expect(robots).toContain("https://www.anyexameasy.com/sitemap.xml");
  });
});
