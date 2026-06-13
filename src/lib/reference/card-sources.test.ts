import { describe, expect, it } from "vitest";
import { MEMORY_CARDS } from "./seeds";
import { MEMORY_CARD_SOURCES } from "./card-sources";
import { getRelatedMemoryCards } from "./related-cards";

describe("card-sources", () => {
  it("enriches every published card with a source label", () => {
    for (const card of MEMORY_CARDS) {
      expect(card.sourceLabel?.trim().length).toBeGreaterThan(10);
    }
    expect(Object.keys(MEMORY_CARD_SOURCES).length).toBeGreaterThanOrEqual(MEMORY_CARDS.length);
  });
});

describe("related-cards", () => {
  it("finds same-topic cards for sepsis bundle", () => {
    const card = MEMORY_CARDS.find((c) => c.id === "nclex-sepsis-bundle");
    expect(card).toBeDefined();
    const related = getRelatedMemoryCards(card!, MEMORY_CARDS, 3);
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((c) => c.id !== card!.id)).toBe(true);
  });
});
