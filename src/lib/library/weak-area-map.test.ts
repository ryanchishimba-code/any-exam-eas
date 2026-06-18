import { describe, expect, it } from "vitest";
import { MEMORY_CARDS } from "./seeds";
import { WEAK_AREA_MEMORY_CARD_MAP, getMemoryCardIdsForTopic } from "./weak-area-map";

const ALL_CARD_IDS = new Set(MEMORY_CARDS.map((c) => c.id));

describe("weak-area-map", () => {
  it("maps every entry to existing memory card ids", () => {
    for (const [topic, ids] of Object.entries(WEAK_AREA_MEMORY_CARD_MAP)) {
      expect(ids.length, `topic ${topic} should have cards`).toBeGreaterThan(0);
      for (const id of ids) {
        expect(ALL_CARD_IDS.has(id), `${topic} → ${id}`).toBe(true);
      }
    }
  });

  it("covers review module slugs", () => {
    for (const slug of [
      "heart-failure-gdmt",
      "sepsis-shock",
      "acute-coronary-syndrome",
      "controlled-substances",
    ]) {
      expect(getMemoryCardIdsForTopic(slug).length).toBeGreaterThan(0);
    }
  });

  it("has at least 45 topic keys", () => {
    expect(Object.keys(WEAK_AREA_MEMORY_CARD_MAP).length).toBeGreaterThanOrEqual(45);
  });
});
