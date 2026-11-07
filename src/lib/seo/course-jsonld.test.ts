import { describe, expect, it } from "vitest";
import { boardQuestionUnits } from "@/lib/counts";
import { buildHubLandingModel } from "@/lib/marketing/board-landing/hub-model";
import { buildNclexLandingModel } from "@/lib/marketing/board-landing/model";
import { buildNaplexLandingModel } from "@/lib/marketing/board-landing/naplex";
import { buildHomeJsonLd } from "@/lib/seo";
import {
  COURSE_DESCRIPTION_MAX,
  findCourseSchemaIssues,
  GOOGLE_COURSE_MODES,
  GOOGLE_COURSE_OFFER_CATEGORIES,
  SCHEMA_BRAND_NAME,
} from "@/lib/seo/course-jsonld";
import { buildExamJsonLd, buildPricingJsonLd } from "@/lib/seo/marketing-metadata";

function courseNodes(data: Record<string, unknown>): Record<string, unknown>[] {
  const graph = data["@graph"];
  const nodes = Array.isArray(graph) ? graph : [data];
  return nodes.filter(
    (node): node is Record<string, unknown> =>
      !!node && typeof node === "object" && (node as Record<string, unknown>)["@type"] === "Course"
  );
}

describe("Course JSON-LD replaces Product", () => {
  const pages: Array<{ path: string; data: Record<string, unknown>; courseName: string }> = [
    {
      path: "/",
      data: buildHomeJsonLd("1,200 active questions"),
      courseName: `${SCHEMA_BRAND_NAME} Pro — Multi-Exam Board Prep`,
    },
    {
      path: "/pricing",
      data: buildPricingJsonLd("1,200 active questions"),
      courseName: `${SCHEMA_BRAND_NAME} Pro — All 6 Board Exams`,
    },
    {
      path: "/nclex",
      data: buildNclexLandingModel({
        degraded: false,
        units: boardQuestionUnits({
          slug: "nclex",
          bankItems: 100,
          formats: { mcq: 80, ngn: 20, case: 0 },
        }),
        bankTypes: {},
        sample: null,
        testimonials: [],
      }).jsonLd,
      courseName: `${SCHEMA_BRAND_NAME} NCLEX-RN Board Prep`,
    },
    {
      path: "/naplex",
      data: buildNaplexLandingModel({
        degraded: false,
        units: boardQuestionUnits({
          slug: "naplex",
          bankItems: 80,
          formats: { mcq: 80, ngn: 0, case: 0 },
        }),
        bankTypes: {},
        sample: null,
        testimonials: [],
      }).jsonLd,
      courseName: `${SCHEMA_BRAND_NAME} NAPLEX Board Prep`,
    },
    ...(["usmle", "pance", "aanp-fnp", "npte-pt"] as const).map((examKey) => {
      const labels = {
        usmle: "USMLE",
        pance: "PANCE",
        "aanp-fnp": "AANP FNP",
        "npte-pt": "NPTE-PT",
      } as const;
      return {
        path: `/${examKey}`,
        data: buildHubLandingModel({
          examKey,
          degraded: false,
          units: boardQuestionUnits({
            slug: examKey,
            bankItems: 40,
            formats: { mcq: 40, ngn: 0, case: 0 },
          }),
        }).jsonLd,
        courseName: `${SCHEMA_BRAND_NAME} ${labels[examKey]} Board Prep`,
      };
    }),
  ];

  it("covers the home page, pricing, and every board hub", () => {
    expect(pages.map((page) => page.path)).toEqual([
      "/",
      "/pricing",
      "/nclex",
      "/naplex",
      "/usmle",
      "/pance",
      "/aanp-fnp",
      "/npte-pt",
    ]);
  });

  it("matches schema.org Course and Google Course offer, provider, and courseMode rules", () => {
    expect(GOOGLE_COURSE_OFFER_CATEGORIES).toContain("Subscription");
    expect(GOOGLE_COURSE_MODES).toContain("Online");

    for (const page of pages) {
      const issues = findCourseSchemaIssues(page.data);
      expect(issues, page.path).toEqual([]);
      const course = courseNodes(page.data)[0];
      expect(course?.name, page.path).toBe(page.courseName);
      expect(String(course?.description).length, page.path).toBeLessThanOrEqual(COURSE_DESCRIPTION_MAX);
      const provider = course?.provider as { name?: string };
      expect(provider.name, page.path).toBe(SCHEMA_BRAND_NAME);
      const serialized = JSON.stringify(page.data);
      expect(serialized, page.path).not.toMatch(/"@type":"Product"/);
      expect(serialized, page.path).not.toMatch(/aggregateRating|reviewCount|ratingValue|ratingCount/);
    }
  });

  it("keeps the shared exam Course builder on the same contract", () => {
    for (const key of ["nclex", "usmle", "naplex", "pance", "aanp-fnp", "npte-pt"] as const) {
      const data = buildExamJsonLd(key);
      expect(findCourseSchemaIssues(data), key).toEqual([]);
    }
  });
});
