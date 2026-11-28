import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { exactRedirectSources } from "@/lib/seo/canonical-redirects";
import {
  INDEXNOW_KEY,
  INDEXNOW_KEY_PATH,
  noindexHeaderMatches,
  noindexHeaderSources,
  robotsAllowsPath,
} from "@/lib/seo/crawl-policy";
import { RESOURCE_ARTICLES } from "@/lib/seo/resources-content";
import {
  SITEMAP_IDS,
  allSitemapUrls,
  buildSitemapGroups,
  isPublishableSitemapUrl,
  renderSitemapIndex,
  renderUrlSet,
} from "@/lib/seo/sitemap-catalog";

const NOW = new Date("2026-11-28T00:30:00.000Z");

function groups() {
  return buildSitemapGroups({
    now: NOW,
    posts: [
      {
        slug: "nclex-study-plan-rn-pn",
        publishedAt: "2026-04-02",
        updatedAt: "2026-08-19T15:00:00.000Z",
      },
      {
        slug: "strategies",
        publishedAt: "2026-01-01",
        updatedAt: "2026-01-02",
      },
    ],
  });
}

describe("sitemap catalog", () => {
  const built = groups();
  const urls = allSitemapUrls(built);

  it("splits an index into pages, study guides, drugs, and blog", () => {
    const index = renderSitemapIndex(built);
    expect(SITEMAP_IDS).toEqual(["pages", "study-guides", "drugs", "blog"]);
    for (const id of SITEMAP_IDS) {
      expect(built[id].length).toBeGreaterThan(0);
      expect(index).toContain(`https://www.anyexameasy.com/sitemap/${id}.xml`);
    }
    expect(index).not.toContain("<priority>");
    expect(index).not.toContain("<changefreq>");
  });

  it("lists only canonical www URLs and omits priority and changefreq", () => {
    const xml = renderUrlSet(urls);
    expect(xml).not.toContain("<priority>");
    expect(xml).not.toContain("<changefreq>");
    for (const url of urls) {
      expect(url.loc.startsWith("https://www.anyexameasy.com")).toBe(true);
      expect(url.loc).not.toContain("?");
      expect(url.loc.endsWith("/")).toBe(false);
      expect(isPublishableSitemapUrl(url.loc)).toBe(true);
      expect(robotsAllowsPath(new URL(url.loc).pathname)).toBe(true);
    }
  });

  it("drops redirects, noindex readers, and query-string drug states", () => {
    const paths = urls.map((url) => new URL(url.loc).pathname);
    for (const source of exactRedirectSources()) {
      expect(paths).not.toContain(source);
    }
    expect(paths).not.toContain("/mpje");
    expect(paths).not.toContain("/usmle/step-1");
    expect(paths).not.toContain("/nclex/study-guide");
    expect(paths).not.toContain("/login");
    expect(paths).not.toContain("/signup");
    expect(paths).not.toContain("/dashboard");
    expect(paths).not.toContain("/checkout");
    expect(paths.some((path) => path.startsWith("/api"))).toBe(false);
    expect(paths.some((path) => path.includes("?"))).toBe(false);
    expect(paths.filter((path) => path === "/study/drugs300")).toEqual(["/study/drugs300"]);
  });

  it("uses content dates and not a build timestamp", () => {
    const home = built.pages.find((url) => url.loc === "https://www.anyexameasy.com");
    expect(home?.lastmod).toBeUndefined();

    const guide = built["study-guides"].find((url) => url.loc.endsWith("/pance-study-guide"));
    expect(guide?.lastmod).toBe("2026-10-24");

    const article = RESOURCE_ARTICLES[0];
    expect(article).toBeTruthy();
    const resource = built["study-guides"].find((url) =>
      url.loc.endsWith(`/resources/${article!.slug}`)
    );
    expect(resource?.lastmod).toBe(article!.updatedAt.slice(0, 10));

    const post = built.blog.find((url) => url.loc.endsWith("/blog/nclex-study-plan-rn-pn"));
    expect(post?.lastmod).toBe("2026-08-19");

    const dated = built.pages.find((url) => url.loc.includes("/crossword/nclex/"));
    expect(dated?.lastmod).toBe(dated?.loc.split("/").at(-1));
    expect(JSON.stringify(urls)).not.toContain(NOW.toISOString());
  });

  it("includes the public hubs that were missing from the old single sitemap", () => {
    const paths = urls.map((url) => new URL(url.loc).pathname);
    for (const path of [
      "/nclex",
      "/usmle",
      "/naplex",
      "/pance",
      "/aanp-fnp",
      "/npte-pt",
      "/pricing",
      "/free-practice-questions",
      "/free-guides",
      "/pance-study-guide",
      "/community",
      "/employers",
      "/anatomy",
      "/anatomy/catalog",
      "/study/drugs300",
      "/blog",
    ]) {
      expect(paths, path).toContain(path);
    }
  });

  it("does not mark public tool URLs noindex in the header list", () => {
    const sources = noindexHeaderSources();
    for (const path of ["/study/drugs300", "/anatomy", "/anatomy/catalog", "/nclex", "/pricing"]) {
      expect(sources.some((source) => noindexHeaderMatches(source, path))).toBe(false);
    }
    expect(sources.some((source) => noindexHeaderMatches(source, "/nclex/study-guide"))).toBe(true);
    expect(sources.some((source) => noindexHeaderMatches(source, "/dashboard"))).toBe(true);
    expect(robotsAllowsPath("/nclex/study-guide")).toBe(false);
    expect(robotsAllowsPath("/auth/login")).toBe(false);
    expect(robotsAllowsPath("/api/health")).toBe(false);
    expect(robotsAllowsPath("/nclex")).toBe(true);
    expect(robotsAllowsPath("/naplex")).toBe(true);
  });
});

describe("llms.txt and IndexNow key", () => {
  it("points AI crawlers at real public URLs and hosts the IndexNow key", () => {
    const llms = readFileSync("public/llms.txt", "utf8");
    expect(llms).toContain("# AnyExamEasy");
    expect(llms).toContain("https://www.anyexameasy.com/sitemap.xml");
    expect(llms).toContain("https://www.anyexameasy.com/nclex");
    expect(llms).toContain("https://www.anyexameasy.com/usmle");
    expect(llms).not.toMatch(/uworld|archer|kaplan|rxprep/i);
    const keyFile = readFileSync(`public${INDEXNOW_KEY_PATH}`, "utf8").trim();
    expect(keyFile).toBe(INDEXNOW_KEY);
  });
});
