import { describe, expect, it } from "vitest";
import {
  getAllAnatomyStructures,
  getAnatomyCatalogStats,
  getAnatomyStructure,
  getAnatomyStructuresForMemoryCard,
  getHighYieldStructures,
  groupStructuresBySystem,
  searchAnatomyStructures,
} from "./index";
import { ANATOMY_QUIZ_QUESTIONS, ANATOMY_TOURS, getToursForExam } from "./tours";
import {
  anatomyViewModeUsesLayers,
  isAnatomyViewMode,
  normalizeAnatomyViewMode,
} from "./view-mode";
import { assertModuleCatalogIntegrity } from "./modules/registry";
import { ATLAS_REGIONS, assertAtlasCatalogIntegrity, getBestViewForStructure } from "./atlas";
import { getDefaultTourIdForExam, getFeaturedStructuresForExam } from "./recommendations";

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
    expect(stats.procedureTourCount).toBeGreaterThan(0);
    expect(stats.procedureCount).toBeGreaterThan(50);
    expect(stats.subregionCount).toBeGreaterThan(20);
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

  it("uses interactive atlas view mode only", () => {
    expect(isAnatomyViewMode("interactive")).toBe(true);
    expect(isAnatomyViewMode("model")).toBe(false);
    expect(isAnatomyViewMode("video")).toBe(false);
    expect(isAnatomyViewMode("split")).toBe(false);
    expect(isAnatomyViewMode("bogus")).toBe(false);
    expect(normalizeAnatomyViewMode("model")).toBe("interactive");
    expect(normalizeAnatomyViewMode("video")).toBe("interactive");
    expect(normalizeAnatomyViewMode("interactive")).toBe("interactive");
    expect(anatomyViewModeUsesLayers("interactive")).toBe(true);
  });

  it("maps every structure to a 3D module", () => {
    expect(assertModuleCatalogIntegrity()).toEqual([]);
  });

  it("maps every structure to an atlas region", () => {
    expect(assertAtlasCatalogIntegrity()).toEqual([]);
  });

  it("maps atlas regions to catalog structures", () => {
    for (const region of ATLAS_REGIONS) {
      expect(getAnatomyStructure(region.structureId)).toBeDefined();
    }
    expect(getBestViewForStructure("heart")).toBe("anterior");
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
        if (step.subregionId) {
          expect(getAnatomyStructure(step.subregionId)).toBeDefined();
        }
      }
    }
  });

  it("returns exam-specific featured structures", () => {
    const nclex = getFeaturedStructuresForExam("nclex");
    expect(nclex.some((s) => s.id === "lungs")).toBe(true);
    expect(getDefaultTourIdForExam("usmle")).toBe("usmle-heart-anatomy");
  });

  it("assigns every organ-layer structure to an organ system", () => {
    const organs = getAllAnatomyStructures().filter((s) => s.layer === "organ");
    expect(organs.length).toBeGreaterThanOrEqual(15);
    for (const organ of organs) {
      expect(organ.system).toBeTruthy();
    }
    const systems = new Set(organs.map((s) => s.system));
    expect(systems.has("digestive")).toBe(true);
    expect(systems.has("cardiovascular")).toBe(true);
    expect(systems.has("respiratory")).toBe(true);
    expect(systems.has("urinary")).toBe(true);
    expect(systems.has("endocrine")).toBe(true);
    expect(systems.has("nervous")).toBe(true);
    expect(systems.has("lymphatic")).toBe(true);
  });

  it("includes abdomen digestive organs with correct system", () => {
    for (const id of ["small-intestine", "colon", "duodenum", "appendix", "liver", "stomach"]) {
      const s = getAnatomyStructure(id);
      expect(s?.layer).toBe("organ");
      expect(s?.system).toBe("digestive");
    }
  });

  it("groups structures by organ system in canonical order", () => {
    const grouped = groupStructuresBySystem(getAllAnatomyStructures());
    expect(grouped.length).toBeGreaterThanOrEqual(8);
    expect(grouped[0]!.system).toBe("skeletal");
    const digestive = grouped.find((g) => g.system === "digestive");
    expect(digestive?.structures.some((s) => s.id === "colon")).toBe(true);
    expect(digestive?.structures.some((s) => s.id === "small-intestine")).toBe(true);
  });
});
