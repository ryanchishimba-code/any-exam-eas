import { describe, expect, it } from "vitest";
import { getPinnedMemoryCardIds, PINNED_MEMORY_CARD_IDS } from "./pinned-essentials";
import { MEMORY_CARDS } from "./seeds";

describe("pinned-essentials", () => {
  it("has pinned cards for every exam", () => {
    for (const slug of ["nclex", "usmle", "naplex", "pance", "aanp-fnp", "npte-pt"] as const) {
      const ids = getPinnedMemoryCardIds(slug);
      expect(ids.length).toBeGreaterThanOrEqual(3);
      for (const id of ids) {
        expect(MEMORY_CARDS.some((c) => c.id === id && c.examSlug === slug)).toBe(true);
      }
    }
  });

  it("exports stable pin map", () => {
    expect(PINNED_MEMORY_CARD_IDS.usmle).toContain("usmle-stemi-path");
  });
});
