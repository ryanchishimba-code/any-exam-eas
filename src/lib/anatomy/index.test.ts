import { describe, expect, it } from "vitest";
import {
  getAllAnatomyStructures,
  getAnatomyCatalogStats,
  getAnatomyStructure,
  getAnatomyStructuresForMemoryCard,
  getHighYieldStructures,
  searchAnatomyStructures,
} from "./index";
import { ANATOMY_QUIZ_QUESTIONS, ANATOMY_TOURS, getToursForExam } from "./tours";
import { anatomyViewModeUsesLayers, isAnatomyViewMode } from "./view-mode";

describe("anatomy helpers", () => {
  it("loads curated structure catalog", () => {
    const all = getAllAnatomyStructures();
    expect(all.length).toBeGreaterThanOrEqual(30);
    expect(getAnatomyStructure("heart")?.name).toBe("Heart");
    expect(getAnatomyStructure("pancreas")?.system).toBe("digestive");
    expect(getAnatomyStructure("prostate")?.system).toBe("urinary");
  });

  it("reports catalog stats", () => {
    const stats = getAnatomyCatalogStats();
    expect(stats.structureCount).toBe(getAllAnatomyStructures().length);
    expect(stats.tourCount).toBe(ANATOMY_TOURS.length);
    expect(stats.quizCount).toBe(ANATOMY_QUIZ_QUESTIONS.length);
    expect(stats.highYieldCount).toBeGreaterThan(20);
    expect(stats.systemCounts.cardiovascular).toBeGreaterThanOrEqual(2);
  });

  it("filters high-yield structures", () => {
    const hy = getHighYieldStructures();
    expect(hy.every((s) => s.highYield)).toBe(true);
    expect(hy.some((s) => s.id === "heart")).toBe(true);
  });

  it("searches by keyword and system", () => {
    const cardiac = searchAnatomyStructures("cardiac");
    expect(cardiac.some((s) => s.id === "heart")).toBe(true);

    const nervous = searchAnatomyStructures("", { system: "nervous" });
    expect(nervous.every((s) => s.system === "nervous")).toBe(true);
  });

  it("reverse-links memory cards to structures", () => {
    const linked = getAnatomyStructuresForMemoryCard("usmle-stemi-path");
    expect(linked.some((s) => s.id === "heart")).toBe(true);
  });

  it("sorts tours by exam relevance", () => {
    const usmleTours = getToursForExam("usmle");
    expect(usmleTours[0]?.id).toBe("usmle-heart-anatomy");

    const nclexTours = getToursForExam("nclex");
    expect(nclexTours[0]?.id).toBe("nclex-respiratory-basics");
  });

  it("validates anatomy view modes and layer usage", () => {
    expect(isAnatomyViewMode("reference")).toBe(true);
    expect(isAnatomyViewMode("interactive")).toBe(true);
    expect(isAnatomyViewMode("split")).toBe(true);
    expect(isAnatomyViewMode("bogus")).toBe(false);

    expect(anatomyViewModeUsesLayers("reference")).toBe(false);
    expect(anatomyViewModeUsesLayers("interactive")).toBe(true);
    expect(anatomyViewModeUsesLayers("split")).toBe(true);
  });

  it("maps every quiz question to a valid structure", () => {
    for (const q of ANATOMY_QUIZ_QUESTIONS) {
      expect(getAnatomyStructure(q.structureId)).toBeDefined();
      for (const d of q.distractorIds ?? []) {
        expect(getAnatomyStructure(d)).toBeDefined();
      }
    }
  });

  it("maps every tour step to a valid structure", () => {
    for (const tour of ANATOMY_TOURS) {
      for (const step of tour.steps) {
        expect(getAnatomyStructure(step.structureId)).toBeDefined();
      }
    }
  });
});
