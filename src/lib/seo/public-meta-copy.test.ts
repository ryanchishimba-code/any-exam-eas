import type { Metadata } from "next";
import { describe, expect, it } from "vitest";
import { BLOG_INDEX_DESCRIPTION, BLOG_INDEX_TITLE } from "@/lib/blog/index-meta";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { QOTD_EXAM_DESCRIPTIONS, QOTD_HUB_TITLE, qotdDatedTitle, qotdExamMetaDescription, qotdExamTitle, qotdMetaDescription } from "@/lib/demo/qotd-titles";
import { QOTD_BY_EXAM } from "@/lib/demo/qotd";
import { DRUGS_PAGE_DESCRIPTION, DRUGS_PAGE_TITLE } from "@/lib/drugs300/public-index";
import { boardHeroMarketingCopy } from "@/lib/marketing/board-landing/board-hero-marketing";
import { boardLandingMetaTitle } from "@/lib/marketing/board-landing/board-landing-copy";
import { buildHubLandingMetadata } from "@/lib/marketing/board-landing/hub-model";
import { nclexMetaDescription, nclexMetaTitle } from "@/lib/marketing/board-landing/model";
import { naplexMetaDescription, naplexMetaTitle } from "@/lib/marketing/board-landing/naplex";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { PRO_MONTHLY_PRICE_USD } from "@/lib/pricing-defaults";
import { buildHomeMetadata } from "@/lib/seo";
import { buildPricingMetadata } from "@/lib/seo/marketing-metadata";
import { SEO_DESC_MAX, SEO_DESC_MIN, SEO_TITLE_MAX, validateMetaDescription, validateMetaTitle } from "@/lib/seo/meta-budget";
import { BRAND_DESCRIPTION } from "@/lib/seo/brand-entity";
import { PUBLIC_STUDY_GUIDES, USMLE_PUBLIC_STEPS } from "@/lib/study-guides/public-catalog";

function readTitle(meta: Metadata): string {
  const title = meta.title;
  if (typeof title === "string") return `${title} | AnyExamEasy`;
  if (title && typeof title === "object" && "absolute" in title && title.absolute) {
    return String(title.absolute);
  }
  return "";
}

function readDescription(meta: Metadata): string {
  return typeof meta.description === "string" ? meta.description : "";
}

const PAGES: { path: string; title: string; description: string }[] = [
  {
    path: "/",
    title: "NCLEX, NAPLEX, PANCE & USMLE Practice Questions",
    description:
      "Practice questions with a rationale for every option: NCLEX, USMLE, NAPLEX, PANCE, AANP FNP and NPTE-PT. Try free questions, then a 5-day free trial.",
  },
  {
    path: "/nclex",
    title: "NCLEX-RN Practice Questions with Rationales | AnyExamEasy",
    description:
      "NCLEX-RN practice questions with a rationale for every choice, Next Gen NCLEX case studies and a plan built on the NCSBN test plan. Try free questions.",
  },
  {
    path: "/usmle",
    title: "USMLE Question Bank for Steps 1, 2 CK, 3 | AnyExamEasy",
    description:
      "USMLE practice questions for Step 1, Step 2 CK and Step 3: step-style vignettes, explanations for every choice and timed practice exams in one qbank.",
  },
  {
    path: "/naplex",
    title: "NAPLEX Practice Questions & Calculations | AnyExamEasy",
    description:
      "NAPLEX practice questions for the calculations and the drugs: pharmacy calculations, patient cases, flashcards and worked explanations. Try free questions.",
  },
  {
    path: "/pance",
    title: "PANCE Question Bank & 2026 Blueprint | AnyExamEasy",
    description:
      "PANCE question bank for the NCCPA blueprint used in 2026: vignettes, flashcards, a study guide, and timed exams. Cardiovascular is 11%. Try free.",
  },
  {
    path: "/aanp-fnp",
    title: "AANP FNP Practice Questions & Exam Prep | AnyExamEasy",
    description:
      "AANP FNP practice questions across the lifespan: family nurse practitioner vignettes, flashcards, a study guide and timed exams. Start with free questions.",
  },
  {
    path: "/npte-pt",
    title: "NPTE-PT Practice Questions with Explanations | AnyExamEasy",
    description:
      "NPTE-PT practice questions with an explanation for each choice: physical therapy scenarios, timed practice exams and 3D anatomy review. Try free questions.",
  },
  {
    path: "/pricing",
    title: "Pricing: One Plan for 6 Board Exams | AnyExamEasy",
    description:
      "One Pro plan for NCLEX, USMLE, NAPLEX, PANCE, AANP FNP and NPTE-PT at $27.99/mo. Questions, Roadmap and Deep Dives. Start a 5-day free trial.",
  },
  {
    path: "/study/drugs300",
    title: DRUGS_PAGE_TITLE,
    description: DRUGS_PAGE_DESCRIPTION,
  },
  {
    path: "/blog",
    title: BLOG_INDEX_TITLE,
    description: BLOG_INDEX_DESCRIPTION,
  },
];

describe("rewritten public titles and descriptions", () => {
  it("matches the approved copy and stays inside the meta budget", () => {
    expect(PRO_MONTHLY_PRICE_USD).toBe(27.99);
    expect(TRIAL_DAYS).toBe(5);

    const home = buildHomeMetadata();
    const hubs = {
      "/": home,
      "/nclex": { title: { absolute: nclexMetaTitle() }, description: nclexMetaDescription() },
      "/naplex": { title: { absolute: naplexMetaTitle() }, description: naplexMetaDescription() },
      "/usmle": buildHubLandingMetadata("usmle"),
      "/pance": buildHubLandingMetadata("pance"),
      "/aanp-fnp": buildHubLandingMetadata("aanp-fnp"),
      "/npte-pt": buildHubLandingMetadata("npte-pt"),
      "/pricing": buildPricingMetadata("34,500+"),
      "/pricing-fallback": buildPricingMetadata(),
    } as const;

    expect(readTitle(hubs["/"])).toBe(PAGES[0]!.title);
    expect(readDescription(hubs["/"])).toBe(PAGES[0]!.description);
    expect(hubs["/"].openGraph?.title).toBe(PAGES[0]!.title);
    expect(hubs["/"].twitter?.title).toBe(PAGES[0]!.title);

    for (const page of PAGES) {
      expect(validateMetaTitle(page.title), page.path).toBeNull();
      expect(validateMetaDescription(page.description), page.path).toBeNull();
      expect(page.title.length).toBeLessThanOrEqual(SEO_TITLE_MAX);
      expect(page.description.length).toBeGreaterThanOrEqual(SEO_DESC_MIN);
      expect(page.description.length).toBeLessThanOrEqual(SEO_DESC_MAX);
      expect(page.title.split(/AnyExamEasy/i).length - 1).toBeLessThanOrEqual(1);
      expect(page.description).not.toMatch(/uworld|archer|kaplan|rxprep|amboss/i);
      expect(page.description).not.toMatch(/\bpass\b/i);
    }

    expect(nclexMetaTitle()).toBe(PAGES.find((page) => page.path === "/nclex")!.title);
    expect(nclexMetaDescription()).toBe(PAGES.find((page) => page.path === "/nclex")!.description);
    expect(naplexMetaTitle()).toBe(PAGES.find((page) => page.path === "/naplex")!.title);
    expect(readTitle(hubs["/usmle"])).toBe(PAGES.find((page) => page.path === "/usmle")!.title);
    expect(readDescription(hubs["/pance"])).toBe(PAGES.find((page) => page.path === "/pance")!.description);
    expect(readTitle(hubs["/pricing"])).toBe(PAGES.find((page) => page.path === "/pricing")!.title);
    expect(readDescription(hubs["/pricing"])).toBe(PAGES.find((page) => page.path === "/pricing")!.description);
    expect(readDescription(hubs["/pricing-fallback"])).toBe(PAGES.find((page) => page.path === "/pricing")!.description);
    expect(hubs["/pricing"].openGraph?.title).toBe(hubs["/pricing"].title && readTitle(hubs["/pricing"]));
    expect(hubs["/usmle"].twitter?.title).toBe(readTitle(hubs["/usmle"]));

    expect(boardLandingMetaTitle("NCLEX-RN")).not.toBe(boardHeroMarketingCopy("nclex").headline);
    expect(boardLandingMetaTitle("NAPLEX")).not.toBe(boardHeroMarketingCopy("naplex").headline);
  });

  it("keeps the rewritten titles unique against the public study guides", () => {
    const titles = new Set(PAGES.map((page) => page.title));
    for (const guide of Object.values(PUBLIC_STUDY_GUIDES)) {
      expect(titles.has(guide.title), guide.path).toBe(false);
      expect(validateMetaTitle(guide.title), guide.path).toBeNull();
      expect((guide.title.match(/AnyExamEasy/g) ?? []).length).toBeLessThanOrEqual(1);
    }
    for (const step of USMLE_PUBLIC_STEPS) {
      expect(titles.has(step.title), step.path).toBe(false);
      expect(validateMetaTitle(step.title), step.path).toBeNull();
    }
  });

  it("keeps question-of-the-day titles unique, branded once, and within 60 characters", () => {
    const titles = [QOTD_HUB_TITLE];
    for (const slug of EXAM_SLUGS) {
      const name = EXAM_CATALOG[slug].shortName;
      titles.push(qotdExamTitle(name));
      titles.push(qotdDatedTitle(name, "2026-11-28"));
    }
    expect(new Set(titles).size).toBe(titles.length);
    for (const items of Object.values(QOTD_BY_EXAM)) {
      for (const item of items) {
        const description = qotdMetaDescription(item.examLabel, item.stem);
        expect(description.length, description).toBeGreaterThanOrEqual(SEO_DESC_MIN);
        expect(description.length, description).toBeLessThanOrEqual(SEO_DESC_MAX);
        expect(description).toContain(item.examLabel);
        expect(description).toContain("5-day free trial");
      }
    }
    expect(BRAND_DESCRIPTION.length).toBeGreaterThanOrEqual(SEO_DESC_MIN);
    expect(BRAND_DESCRIPTION.length).toBeLessThanOrEqual(SEO_DESC_MAX);
    for (const title of titles) {
      expect(title.length, title).toBeLessThanOrEqual(SEO_TITLE_MAX);
      expect(title.match(/AnyExamEasy/g)).toEqual(["AnyExamEasy"]);
    }
  });

  it("uses evergreen 140–160 character descriptions on /daily/{board} pages", () => {
    expect(new Set(Object.keys(QOTD_EXAM_DESCRIPTIONS)).size).toBe(EXAM_SLUGS.length);
    const descriptions = new Set<string>();
    for (const slug of EXAM_SLUGS) {
      const description = qotdExamMetaDescription(slug);
      const name = EXAM_CATALOG[slug].shortName;
      expect(description, slug).toBe(QOTD_EXAM_DESCRIPTIONS[slug]);
      expect(validateMetaDescription(description), slug).toBeNull();
      expect(description.length, `${slug}: ${description}`).toBeGreaterThanOrEqual(SEO_DESC_MIN);
      expect(description.length, `${slug}: ${description}`).toBeLessThanOrEqual(SEO_DESC_MAX);
      expect(description).toContain(name);
      expect(description.toLowerCase()).toContain("question of the day");
      expect(description).toContain("5-day free trial");
      expect(description).not.toMatch(/uworld|archer|kaplan|rxprep|amboss/i);
      expect(description).not.toMatch(/\bpass\b/i);
      for (const item of QOTD_BY_EXAM[slug]) {
        expect(description.includes(item.stem), `${slug} leaked stem`).toBe(false);
      }
      descriptions.add(description);
    }
    expect(descriptions.size).toBe(EXAM_SLUGS.length);
  });
});
