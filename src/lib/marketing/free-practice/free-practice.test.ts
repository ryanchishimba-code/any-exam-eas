import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { KEY_WRONG_ITEM_IDS } from "@/lib/exam-prep/reviewed-key-queue";
import {
  FREE_PRACTICE_BOARDS,
  FREE_PRACTICE_CTA_LABEL,
  FREE_PRACTICE_DESCRIPTION,
  FREE_PRACTICE_H1,
  FREE_PRACTICE_TITLE,
  buildFreePracticeJsonLd,
  questionsForBoard,
} from "@/lib/marketing/free-practice/catalog";
import { metaDescriptionLength, metaTitleLength, SEO_DESC_MAX, SEO_DESC_MIN, SEO_TITLE_MAX } from "@/lib/seo/meta-budget";

const PAGE = readFileSync("src/app/(marketing)/free-practice-questions/page.tsx", "utf8");
const SITEMAP = readFileSync("src/app/sitemap.ts", "utf8");
const NAV = readFileSync("src/components/Navigation.tsx", "utf8");
const FOOTER = readFileSync("src/components/Footer.tsx", "utf8");

describe("free practice questions page", () => {
  it("uses one crawlable page with ten questions per board", () => {
    expect(PAGE).toContain('dynamic = "force-static"');
    expect(PAGE).toContain("<details");
    expect(PAGE).toContain("<summary>Show answer and rationale</summary>");
    expect(PAGE).not.toContain("use client");
    for (const board of FREE_PRACTICE_BOARDS) {
      expect(questionsForBoard(board.slug)).toHaveLength(10);
      expect(PAGE).toContain(`id={board.slug}`);
      expect(board.h2).toMatch(new RegExp(`Free ${board.label} practice questions`));
    }
    expect(FREE_PRACTICE_H1).toMatch(/free practice questions/i);
    expect(FREE_PRACTICE_TITLE.toLowerCase()).toContain("free");
    expect(FREE_PRACTICE_TITLE.toLowerCase()).toContain("practice questions");
    expect(FREE_PRACTICE_DESCRIPTION.toLowerCase()).toContain("free nclex practice questions");
    expect(FREE_PRACTICE_DESCRIPTION.toLowerCase()).toContain("free naplex practice questions");
    expect(metaTitleLength(FREE_PRACTICE_TITLE)).toBeLessThanOrEqual(SEO_TITLE_MAX);
    expect(metaDescriptionLength(FREE_PRACTICE_DESCRIPTION)).toBeGreaterThanOrEqual(SEO_DESC_MIN);
    expect(metaDescriptionLength(FREE_PRACTICE_DESCRIPTION)).toBeLessThanOrEqual(SEO_DESC_MAX);
  });

  it("keeps answers in the seed and out of the hidden-id list", () => {
    const hidden = new Set(KEY_WRONG_ITEM_IDS);
    const ids = new Set<string>();
    for (const board of FREE_PRACTICE_BOARDS) {
      for (const question of questionsForBoard(board.slug)) {
        expect(hidden.has(question.id)).toBe(false);
        expect(ids.has(question.id)).toBe(false);
        ids.add(question.id);
        expect(question.options).toContain(question.answer);
        expect(question.rationale.length).toBeGreaterThan(300);
        expect(question.stem.toLowerCase()).not.toMatch(/uworld|kaplan|nursing\.com|archer review/);
        expect(question.difficulty).toBeGreaterThanOrEqual(3);
        expect(question.difficulty).toBeLessThanOrEqual(5);
      }
    }
    expect(ids.size).toBe(60);
  });

  it("publishes FAQ, breadcrumb, and quiz structured data", () => {
    const graph = buildFreePracticeJsonLd()["@graph"] as Array<Record<string, unknown>>;
    expect(graph.some((node) => node["@type"] === "FAQPage")).toBe(true);
    expect(graph.some((node) => node["@type"] === "BreadcrumbList")).toBe(true);
    const quizzes = graph.filter((node) => node["@type"] === "Quiz");
    expect(quizzes).toHaveLength(6);
    expect(JSON.stringify(graph)).not.toMatch(/uworld|kaplan/i);
  });

  it("is public in the sitemap, nav, and footer", () => {
    expect(SITEMAP).toContain('path: "/free-practice-questions"');
    expect(NAV).toContain('href: "/free-practice-questions"');
    expect(NAV).toContain("Free practice questions");
    expect(FOOTER).toContain('href: "/free-practice-questions"');
    expect(FREE_PRACTICE_CTA_LABEL).toBe("Start free trial, no card required");
    expect(PAGE).toContain("FREE_PRACTICE_CTA_LABEL");
    expect(PAGE).toContain("AnyExamEasy");
    expect(PAGE).not.toMatch(/Any Exam Easy/);
    expect(PAGE).toContain('landingOgImage("home")');
    expect(PAGE).toContain("images: [FREE_PRACTICE_SHARE_IMAGE]");
    expect(PAGE).toContain("images: [FREE_PRACTICE_SHARE_IMAGE.url]");
    expect(FOOTER).not.toContain("formatPricingCheckoutTrialOffer");
    expect(FOOTER).not.toMatch(/\$\d/);
  });
});
