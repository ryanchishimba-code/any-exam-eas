import { describe, expect, it } from "vitest";
import {
  BLOG_BRAND_BYLINE,
  publicBlogAuthorName,
  publicBlogBody,
  publicBlogExcerpt,
  publicBlogTitle,
} from "./public-copy";
import {
  formatExactServeReadyCount,
  getPublishedQuestionStats,
} from "@/lib/marketing/bank-stats";

const publishedTotal = formatExactServeReadyCount(
  getPublishedQuestionStats().totalPublished
);

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

  it("scrubs stale bank totals and 3-day trial language using live published stats", () => {
    expect(publicBlogExcerpt("Start a 3-day trial with 43,000+ questions.")).toBe(
      `Start a 5-day free trial with ${publishedTotal} questions.`
    );
    expect(publicBlogBody("<p>48,775 questions across six boards</p>")).toContain(publishedTotal);
    expect(publicBlogTitle("Spend less, pass easy")).toBe("Study smarter on one plan");
    expect(publicBlogTitle("How to pass NCLEX first try")).toBe("How to prepare for NCLEX");
  });

  it("normalizes comparison-table cells that say 43,000+ and 3 Days", () => {
    const table = `
      <tr><th>Questions</th><td>43,000+</td><td>Varies</td></tr>
      <tr><th>Free Trial</th><td>3 Days</td><td>Limited / None</td></tr>
    `;
    const scrubbed = publicBlogBody(table);
    expect(scrubbed).toContain(publishedTotal);
    expect(scrubbed).not.toMatch(/43,000/);
    expect(scrubbed).toMatch(/5 Days/);
    expect(scrubbed).not.toMatch(/3 Days/);
  });

  it("removes invented named quotes from blog HTML", () => {
    const html = `
      <h3>Students Are Saving Hundreds</h3>
      <p>“I covered NCLEX + NAPLEX in one plan and saved over $400.” — Gerard N.</p>
      <blockquote>The Roadmap made studying so much more efficient. Passed first try. — Prisca M.</blockquote>
    `;
    const scrubbed = publicBlogBody(html);
    expect(scrubbed).toContain("What you can verify");
    expect(scrubbed).not.toMatch(/Gerard N/);
    expect(scrubbed).not.toMatch(/Prisca M/);
    expect(scrubbed).not.toMatch(/Passed first try/);
  });
});
