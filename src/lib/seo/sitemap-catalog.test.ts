import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { exactRedirectSources } from "@/lib/seo/canonical-redirects";
import {
  INDEXNOW_KEY,
  INDEXNOW_KEY_PATH,
  noindexHeaderMatches,
  noindexHeaderSources,
  robotsAllowsPath,
} from "@/lib/seo/crawl-policy";
import { isGatedStudyGuidePath } from "@/lib/seo/gated-study-guide-paths";
import { PANCE_STUDY_GUIDE_UPDATED } from "@/lib/pance-study-guide/public-guide";
import { contentUpdatedOn } from "@/lib/study-guides/content-updated";
import { studyGuideChapterPaths } from "@/lib/study-guides/load-public-guide";
import { PUBLIC_STUDY_GUIDE_LIST, USMLE_PUBLIC_STEPS } from "@/lib/study-guides/public-catalog";
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

    expect(built.blog.some((url) => url.loc.endsWith("/blog/affordable-nclex-prep"))).toBe(true);
    expect(built.blog.some((url) => url.loc.endsWith("/blog/naplex-study-plan"))).toBe(true);
    expect(built.blog.some((url) => url.loc.endsWith("/blog/strategies"))).toBe(false);
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
    expect(robotsAllowsPath("/nclex-study-guide/02-fundamentals-safety")).toBe(true);
  });

  it("lists every free study guide, step, and chapter on www with a content date", () => {
    const chapters = studyGuideChapterPaths();
    const expected = new Map<string, string>();
    for (const guide of PUBLIC_STUDY_GUIDE_LIST) {
      const dirs = guide.contentDirs.length
        ? [...guide.contentDirs]
        : ["src/lib/exam-prep/npte-pt/content-outline.ts"];
      const lastmod =
        guide.path === "/pance-study-guide"
          ? PANCE_STUDY_GUIDE_UPDATED
          : contentUpdatedOn(dirs, NOW).iso;
      expected.set(guide.path, lastmod);
    }
    for (const step of USMLE_PUBLIC_STEPS) {
      expected.set(step.path, contentUpdatedOn([step.contentDir], NOW).iso);
    }
    for (const chapter of chapters) {
      expected.set(chapter.path, contentUpdatedOn([chapter.contentDir], NOW).iso);
    }

    const guides = built["study-guides"];
    const byPath = new Map(guides.map((url) => [new URL(url.loc).pathname, url]));
    expect(expected.size).toBeGreaterThan(100);
    for (const [path, lastmod] of expected) {
      const url = byPath.get(path);
      expect(url?.loc, path).toBe(`https://www.anyexameasy.com${path}`);
      expect(url?.lastmod, path).toBe(lastmod);
      expect(lastmod, path).not.toBe("2026-11-28");
      expect(isGatedStudyGuidePath(path), path).toBe(false);
      expect(exactRedirectSources(), path).not.toContain(path);
      expect(robotsAllowsPath(path), path).toBe(true);
    }

    const paths = [...byPath.keys()];
    expect(paths).toContain("/usmle-study-guide");
    expect(paths).toContain("/usmle-study-guide/step-1");
    expect(paths).toContain("/usmle-study-guide/step-2-ck");
    expect(paths).toContain("/usmle-study-guide/step-3");
    expect(paths).toContain("/nclex-study-guide/04-cardiac");
    expect(paths).toContain("/naplex-study-guide/05-cardiology");
    expect(paths).toContain("/aanp-fnp-study-guide/04-cardiology");
    expect(paths.some((path) => path.startsWith("/pance-study-guide/"))).toBe(false);
    expect(paths.some((path) => path.startsWith("/nclex/study-guide"))).toBe(false);
    expect(paths.some((path) => path.includes("login") || path.includes("signup"))).toBe(false);

    const index = renderSitemapIndex(built);
    expect(index).toContain("https://www.anyexameasy.com/sitemap/study-guides.xml");
    expect(robots().sitemap).toBe("https://www.anyexameasy.com/sitemap.xml");
    expect(robots().host).toBe("https://www.anyexameasy.com");
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
