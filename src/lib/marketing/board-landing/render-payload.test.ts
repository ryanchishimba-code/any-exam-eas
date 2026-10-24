import { describe, expect, it } from "vitest";
import {
  boardLandingRenderModel,
  hubBoardLandingRenderModel,
  naplexBoardLandingRenderModel,
  trimLandingSample,
} from "./render-payload";
import { buildNaplexLandingModel } from "./naplex";
import { buildHubLandingModel } from "./hub-model";
import { boardQuestionUnits } from "@/lib/counts";

describe("boardLandingRenderModel", () => {
  it("drops JSON-LD and lean-dead fields from the flight payload", () => {
    const full = buildNaplexLandingModel({
      degraded: false,
      units: boardQuestionUnits({
        slug: "naplex",
        bankItems: 80,
        formats: { mcq: 80, ngn: 0, case: 0 },
      }),
      bankTypes: { vignette: 40 },
      sample: null,
      testimonials: [],
    });
    const render = boardLandingRenderModel(full, {
      naplexDonut: { liveQuestionCount: 80, includeQuickBite: true, includeItemTypes: true },
    });
    expect(render.lean).toBe(true);
    expect("jsonLd" in (render as object)).toBe(false);
    expect("visuals" in (render as object)).toBe(false);
    expect("heroChips" in (render as object)).toBe(false);
    expect(render.naplexDonut?.liveQuestionCount).toBe(80);
    expect(JSON.stringify(render).length).toBeLessThan(JSON.stringify(full).length);
  });

  it("strips inline samples and trims FAQs for the NAPLEX hub layout", () => {
    const full = buildNaplexLandingModel({
      degraded: false,
      units: boardQuestionUnits({
        slug: "naplex",
        bankItems: 80,
        formats: { mcq: 80, ngn: 0, case: 0 },
      }),
      bankTypes: { vignette: 40 },
      sample: null,
      testimonials: [],
    });
    const render = naplexBoardLandingRenderModel(full, {
      liveQuestionCount: 80,
      includeQuickBite: true,
      includeItemTypes: true,
    });
    expect(render.layout).toBe("naplex");
    expect(render.sample).toBeNull();
    expect(render.faqs.length).toBeLessThanOrEqual(4);
    expect(render.seeQuestionsHref).toBe("/practice/naplex");
    expect(render.painPoints.length).toBeGreaterThan(0);
    expect(render.priceChart.bars.length).toBeGreaterThan(0);
  });
});

describe("hubBoardLandingRenderModel", () => {
  it("strips inline samples and links See questions to practice", () => {
    const full = buildHubLandingModel({
      examKey: "pance",
      degraded: false,
      units: boardQuestionUnits({
        slug: "pance",
        bankItems: 200,
        formats: { mcq: 200, ngn: 0, case: 0 },
      }),
    });
    const render = hubBoardLandingRenderModel(full, {
      examKey: "pance",
      hubDonut: {
        examKey: "pance",
        liveQuestionCount: 200,
        includeStudyGuide: false,
        includeAllUsmleSteps: false,
      },
      liveBarRows: [{ id: "vignette", label: "Vignettes", count: 200 }],
    });
    expect(render.layout).toBe("pance");
    expect(render.sample).toBeNull();
    expect(render.seeQuestionsHref).toBe("/practice/pance");
    expect(render.liveBarRows).toHaveLength(1);
    expect(render.faqs.length).toBeLessThanOrEqual(4);
  });
});

describe("trimLandingSample", () => {
  it("shortens long rationales for landing HTML", () => {
    const trimmed = trimLandingSample({
      id: "x",
      stem: "Stem",
      rationale: "x".repeat(200),
      sources: ["a", "b", "c"],
      options: [{ id: "a", text: "A", correct: true, rationale: "y".repeat(200) }],
    });
    expect(trimmed?.rationale.length).toBeLessThanOrEqual(140);
    expect(trimmed?.options[0]?.rationale?.length).toBeLessThanOrEqual(140);
    expect(trimmed?.sources).toHaveLength(2);
  });
});
