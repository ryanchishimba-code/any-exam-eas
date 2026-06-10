import { describe, expect, it } from "vitest";
import {
  getAllAnatomyStructures,
  getAnatomyStructure,
  getAnatomyStructuresForMemoryCard,
  getHighYieldStructures,
  searchAnatomyStructures,
} from "./index";
import { getToursForExam } from "./tours";
import { anatomyViewModeUsesLayers, isAnatomyViewMode } from "./view-mode";

describe("anatomy helpers", () => {
  it("loads curated structure catalog", () => {
    const all = getAllAnatomyStructures();
    expect(all.length).toBeGreaterThanOrEqual(10);
    expect(getAnatomyStructure("heart")?.name).toBe("Heart");
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
});
