import { describe, expect, it } from "vitest";
import {
  assertBundleIntegrity,
  catalog,
  createAnatomyBundle,
  createAtlasBundle,
  createCatalogOnlyBundle,
  createSupportiveBundle,
  links,
  regions,
  surfaces,
  teach,
} from "./index";

describe("anatomy systems — catalog (isolated)", () => {
  it("loads and searches structures without other systems", () => {
    const all = catalog.getAllAnatomyStructures();
    expect(all.length).toBeGreaterThanOrEqual(30);
    expect(catalog.getAnatomyStructure("heart")?.name).toBe("Heart");
    expect(catalog.searchAnatomyStructures("cardiac").some((s) => s.id === "heart")).toBe(true);
  });

  it("reports stats", () => {
    const stats = catalog.getAnatomyCatalogStats();
    expect(stats.structureCount).toBe(catalog.getAllAnatomyStructures().length);
    expect(stats.tourCount).toBeGreaterThan(0);
  });

  it("passes content integrity", () => {
    expect(catalog.assertCatalogContentIntegrity()).toEqual([]);
  });
});

describe("anatomy systems — regions (isolated)", () => {
  it("maps every catalog structure to a video region", () => {
    expect(regions.videoRegionProvider.assertIntegrity?.()).toEqual([]);
  });

  it("maps every catalog structure to an atlas region", () => {
    expect(regions.atlasRegionProvider.assertIntegrity?.()).toEqual([]);
  });

  it("resolves seek time for a structure", () => {
    const t = regions.videoRegionProvider.getSeekTimeForStructure?.("heart");
    expect(typeof t).toBe("number");
    expect(t).toBeGreaterThanOrEqual(0);
  });

  it("resolves best atlas view for a structure", () => {
    expect(regions.atlasRegionProvider.getBestViewForStructure?.("heart")).toBe("anterior");
  });
});

describe("anatomy systems — surfaces (isolated)", () => {
  it("defaults to cartoon 3D in production mode", () => {
    const active = surfaces.getActiveAnatomySurface();
    expect(active.id).toBe("cartoon-3d");
    expect(active.hasViewport).toBe(true);
    expect(active.regionProvider).toBeNull();
  });

  it("parses URL surface params", () => {
    expect(surfaces.parseAnatomySurfaceParam("cartoon")).toBe("cartoon-3d");
    expect(surfaces.parseAnatomySurfaceParam("atlas")).toBe("cartoon-3d");
    expect(surfaces.parseAnatomySurfaceParam("catalog")).toBe("none");
    expect(surfaces.parseAnatomySurfaceParam("video")).toBe("cartoon-3d");
  });

  it("redirects deprecated atlas/video surfaces to cartoon 3D", () => {
    expect(surfaces.resolveAnatomySurface("illustrated-atlas").id).toBe("cartoon-3d");
    expect(surfaces.resolveAnatomySurface("reference-video").id).toBe("cartoon-3d");
    expect(surfaces.resolveAnatomySurface("illustrated-atlas").regionProvider).toBeNull();
  });

  it("supports catalog-only surface without viewport", () => {
    const catalogOnly = surfaces.getCatalogOnlySurface();
    expect(catalogOnly.id).toBe("none");
    expect(catalogOnly.hasViewport).toBe(false);
    expect(catalogOnly.regionProvider).toBeNull();
  });
});

describe("anatomy systems — teach (isolated)", () => {
  it("loads tours and quiz independent of viewer", () => {
    expect(teach.ANATOMY_TOURS.length).toBeGreaterThan(0);
    expect(teach.ANATOMY_QUIZ_QUESTIONS.length).toBeGreaterThan(0);
    expect(teach.assertTeachContentIntegrity()).toEqual([]);
  });

  it("runs tour flow without a surface", () => {
    const started = teach.startTeachTour(teach.createInitialTeachState(), "usmle-heart-anatomy");
    expect(started.navigateToStructureId).toBe("heart");
    expect(teach.buildTeachViewModel(started.state).mode).toBe("tour");
  });

  it("scores quiz picks from sidebar-only flow", () => {
    const started = teach.startTeachQuiz(teach.createInitialTeachState());
    const q = teach.buildTeachViewModel(started.state).currentQuiz!;
    const attempt = teach.handleTeachStructureSelect(started.state, q.structureId);
    expect(attempt.quizAttemptHandled).toBe(true);
    expect(attempt.state.quizScore).toBe(1);
  });
});

describe("anatomy systems — links (isolated)", () => {
  it("builds practice hrefs from structure slugs", () => {
    const heart = catalog.getAnatomyStructure("heart");
    expect(heart).toBeDefined();
    const href = links.getPracticeHrefForStructure(heart!, "usmle");
    expect(href).toContain("question-bank");
    expect(href).toContain(heart!.practiceTopicSlug);
  });
});

describe("anatomy systems — compose", () => {
  it("creates supportive bundle with cartoon 3D surface", () => {
    const bundle = createSupportiveBundle();
    expect(bundle.id).toBe("supportive");
    expect(bundle.surface.id).toBe("cartoon-3d");
    expect(bundle.surface.hasViewport).toBe(true);
    expect(bundle.regionProvider).toBeNull();
    expect(assertBundleIntegrity(bundle)).toEqual([]);
  });

  it("aliases deprecated atlas bundle to cartoon 3D", () => {
    const bundle = createAtlasBundle();
    expect(bundle.id).toBe("supportive");
    expect(bundle.surface.id).toBe("cartoon-3d");
    expect(bundle.regionProvider).toBeNull();
    expect(assertBundleIntegrity(bundle)).toEqual([]);
  });

  it("creates catalog-only bundle without regions", () => {
    const bundle = createCatalogOnlyBundle();
    expect(bundle.id).toBe("catalog-only");
    expect(bundle.surface.hasViewport).toBe(false);
    expect(bundle.regionProvider).toBeNull();
    expect(assertBundleIntegrity(bundle)).toEqual([]);
  });

  it("creates custom bundle by surface id", () => {
    expect(createAnatomyBundle("illustrated-atlas").surface.id).toBe("cartoon-3d");
    expect(createAnatomyBundle("none").id).toBe("catalog-only");
  });
});
