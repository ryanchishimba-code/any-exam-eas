import { describe, expect, it } from "vitest";
import {
  getAnatomyStructuresForMemoryCardIds,
  getAnatomyStructuresForTopicSlug,
} from "./topic-links";

describe("anatomy topic-links", () => {
  it("maps cardiovascular topics to heart-related structures", () => {
    const hits = getAnatomyStructuresForTopicSlug("cardiovascular");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((s) => s.id === "heart")).toBe(true);
  });

  it("maps ACS review module slug via practiceTopicSlug alias", () => {
    const hits = getAnatomyStructuresForTopicSlug("acute-coronary-syndrome");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((s) => s.id === "heart" || s.id === "aorta")).toBe(true);
  });

  it("boosts structures sharing memory cards with the topic", () => {
    const hits = getAnatomyStructuresForTopicSlug("cardiology", {
      memoryCardIds: ["usmle-stemi-path"],
    });
    expect(hits[0]?.id).toBe("heart");
  });

  it("resolves structures from memory card ids", () => {
    const hits = getAnatomyStructuresForMemoryCardIds(["usmle-stroke-tpa"]);
    expect(hits.some((s) => s.id === "brain")).toBe(true);
  });

  it("prefers explicit structureIds on memory cards", () => {
    const hits = getAnatomyStructuresForMemoryCardIds(["pance-copd-exacerbation"], {
      structureIds: ["lungs", "trachea"],
    });
    expect(hits.map((s) => s.id)).toEqual(["lungs", "trachea"]);
  });
});
