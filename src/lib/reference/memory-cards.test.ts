import { describe, expect, it } from "vitest";
import { assertMemoryCardLibraryQuality } from "./card-quality";
import {
  getMemoryCardIdsForTopic,
  getRecommendedMemoryCards,
  getCardsForTopicKey,
  queryMemoryCards,
} from "./memory-cards";
import { MEMORY_CARDS } from "./seeds";
import { REVIEW_MODULE_CONTENT_BY_SLUG } from "@/lib/edtech/review-modules/content";

describe("memory-cards", () => {
  it("passes library quality gate for all cards", () => {
    expect(() => assertMemoryCardLibraryQuality(MEMORY_CARDS)).not.toThrow();
  });
  it("filters by search query across title and tags", () => {
    const naplex = MEMORY_CARDS.filter((c) => c.examSlug === "naplex");
    const hits = queryMemoryCards(naplex, { query: "GDMT" });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((c) => c.examSlug === "naplex")).toBe(true);
  });

  it("returns recommended cards for weak-area topic keys", () => {
    const nclex = MEMORY_CARDS.filter((c) => c.examSlug === "nclex");
    const rec = getRecommendedMemoryCards(nclex, "delegation");
    expect(rec.length).toBeGreaterThanOrEqual(3);
    expect(rec.every((c) => c.examSlug === "nclex")).toBe(true);
  });

  it("falls back to topic label slug when weak-area map has no entry", () => {
    const naplex = MEMORY_CARDS.filter((c) => c.examSlug === "naplex");
    const hits = getCardsForTopicKey(naplex, "diuretics");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((c) => c.id === "naplex-loop-diuretics")).toBe(true);
  });

  it("maps weak-area keys to existing card ids", () => {
    const ids = getMemoryCardIdsForTopic("federal-law");
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      expect(MEMORY_CARDS.some((c) => c.id === id)).toBe(true);
    }
  });

  it("maps review module slugs to cards", () => {
    const ids = getMemoryCardIdsForTopic("heart-failure-gdmt");
    expect(ids.length).toBeGreaterThanOrEqual(4);
  });

  it("has unique memory card ids", () => {
    const ids = MEMORY_CARDS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(57);
  });

  it("links reviewModuleSlug to known modules when set", () => {
    const slugs = MEMORY_CARDS.map((c) => c.reviewModuleSlug).filter(Boolean) as string[];
    for (const slug of slugs) {
      expect(REVIEW_MODULE_CONTENT_BY_SLUG[slug]).toBeDefined();
    }
  });
});
