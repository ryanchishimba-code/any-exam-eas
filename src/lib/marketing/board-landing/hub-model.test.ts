import { describe, expect, it } from "vitest";
import { boardQuestionUnits } from "@/lib/counts";
import { buildHubLandingModel } from "./hub-model";
import { SEO_TITLE_MAX } from "@/lib/seo/meta-budget";
import { buildHubLandingMetadata } from "./hub-model";

const BANNED = /uworld|archer|kaplan|rxprep|amboss/i;

describe("hub board landing model", () => {
  it("builds a lean USMLE page with hero offer and FAQ schema", () => {
    const model = buildHubLandingModel({
      examKey: "usmle",
      degraded: false,
      units: boardQuestionUnits({
        slug: "usmle",
        bankItems: 500,
        formats: { mcq: 500, ngn: 0, case: 0 },
        clinical: { standaloneNgn: 0, caseStudies: 0, caseItems: 0 },
      }),
      sample: null,
      usmleStepCounts: { step1: 100, step2: 200, step3: 50 },
    });
    const serialized = JSON.stringify(model);
    expect(serialized).not.toMatch(BANNED);
    expect(model.heroOffer?.proPrice).toMatch(/\$27\.99\/mo/);
    expect(model.heroChips).toHaveLength(3);
    expect(model.features.some((card) => card.id === "anatomy-explorer")).toBe(true);
    expect(model.faqs.length).toBeGreaterThanOrEqual(4);
    expect(serialized).toMatch(/FAQPage/);
  });

  it("keeps hub metadata inside SEO budget", () => {
    const meta = buildHubLandingMetadata("pance");
    const title = typeof meta.title === "object" ? meta.title?.absolute : meta.title;
    expect(String(title).length).toBeLessThanOrEqual(SEO_TITLE_MAX);
  });
});
