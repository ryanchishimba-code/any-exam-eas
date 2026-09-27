import { describe, expect, it } from "vitest";
import { editorialSnapshot, editorialsMatch } from "@/lib/blog/upgrades/apply";
import { wordsInHtml } from "@/lib/blog/upgrades/html";
import { sortBlogCategories } from "@/lib/blog/categories";
import { BLOG_UPGRADES } from "@/lib/blog/upgrades/posts";
import { TRIAL_OFFER } from "@/lib/blog/upgrades/offer";
import { extractBlogFaqs } from "@/lib/blog/schema";
import { SEO_DESC_MAX, SEO_DESC_MIN, SEO_TITLE_MAX } from "@/lib/seo/meta-budget";

const FORBIDDEN = [
  /guarantee/i,
  /first[- ]try/i,
  /recent passers/i,
  /thousands of (?:students|candidates|nurses)/i,
  /rapid improvement/i,
  /coming soon/i,
  /\$300/,
  /\$800/,
  /47,969/,
  /43,000/,
  /share your experience in the comments/i,
];

describe("blog upgrades", () => {
  it("keeps one primary keyword per live slug", () => {
    expect(BLOG_UPGRADES.map((post) => post.slug)).toEqual([
      "why",
      "strategies",
      "okay",
      "spend-less-pass-easy",
    ]);
    const keywords = BLOG_UPGRADES.map((post) => post.primaryKeyword);
    expect(new Set(keywords).size).toBe(keywords.length);
  });

  it("fits title and description budgets and uses the exact trial line", () => {
    expect(TRIAL_OFFER).toBe("5-day free trial · no payment method required · then $27.99/mo");
    for (const post of BLOG_UPGRADES) {
      expect(post.metaTitle.length, post.slug).toBeLessThanOrEqual(SEO_TITLE_MAX);
      expect(post.title.length, post.slug).toBeLessThanOrEqual(SEO_TITLE_MAX);
      expect(post.metaDescription.length, `${post.slug} desc ${post.metaDescription}`).toBeGreaterThanOrEqual(
        SEO_DESC_MIN
      );
      expect(post.metaDescription.length, post.slug).toBeLessThanOrEqual(SEO_DESC_MAX);
      expect(post.excerpt.length, post.slug).toBeLessThanOrEqual(400);
      expect(post.content).toContain(TRIAL_OFFER);
      expect(post.content).toContain('class="aee-faq"');
      expect(extractBlogFaqs(post.content).length).toBeGreaterThanOrEqual(4);
      expect(wordsInHtml(post.content), post.slug).toBeGreaterThan(900);
      for (const pattern of FORBIDDEN) {
        expect(post.content, `${post.slug} ${pattern}`).not.toMatch(pattern);
        expect(post.title, post.slug).not.toMatch(pattern);
      }
    }
  });

  it("cites a primary source in each exam article", () => {
    const why = BLOG_UPGRADES.find((post) => post.slug === "why");
    const plan = BLOG_UPGRADES.find((post) => post.slug === "strategies");
    const naplex = BLOG_UPGRADES.find((post) => post.slug === "okay");
    expect(why?.content).toContain("ncsbn.org");
    expect(plan?.content).toContain("2026_RN_Test");
    expect(naplex?.content).toContain("nabp.pharmacy");
  });

  it("treats an identical snapshot as unchanged", () => {
    const post = BLOG_UPGRADES[0]!;
    expect(editorialsMatch(editorialSnapshot(post), editorialSnapshot(post))).toBe(true);
    expect(
      editorialsMatch(editorialSnapshot(post), {
        ...editorialSnapshot(post),
        title: "Different",
      })
    ).toBe(false);
  });

  it("orders exam categories with NCLEX first", () => {
    expect(sortBlogCategories(["All boards", "NAPLEX", "NCLEX"])).toEqual([
      "NCLEX",
      "NAPLEX",
      "All boards",
    ]);
  });
});
