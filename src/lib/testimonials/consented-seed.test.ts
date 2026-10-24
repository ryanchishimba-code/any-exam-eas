import { describe, expect, it } from "vitest";
import {
  CONSENTED_TESTIMONIAL_BATCH_ID,
  CONSENTED_TESTIMONIAL_BATCH_ID_2026_10_24,
  CONSENTED_TESTIMONIAL_SEEDS,
  FOUNDER_NOTE,
  consentedSeedsForBatch,
} from "./consented-seed";

describe("consented testimonial seed", () => {
  it("stores NCLEX home quotes separately from board-only seeds", () => {
    expect(CONSENTED_TESTIMONIAL_BATCH_ID).toBe("testimonials-2026-09-27");
    const home = CONSENTED_TESTIMONIAL_SEEDS.filter((row) => row.showOnHome !== false);
    expect(home.map((row) => row.name)).toEqual(["Nathan C.", "Priscilla J."]);
    expect(home.every((row) => row.exam === "NCLEX-RN student")).toBe(true);
    expect(home[0]?.quote).toBe("The best questions I've found for NCLEX prep.");
    expect(home[1]?.quote).toBe(
      "I wish I'd found AnyExamEasy sooner. It would have saved me from wasting money on other prep."
    );
  });

  it("stores the Oct 2026 board-only batch with exact owner strings", () => {
    const batch = consentedSeedsForBatch(CONSENTED_TESTIMONIAL_BATCH_ID_2026_10_24);
    expect(batch.map((row) => row.name)).toEqual(["Steven", "Mag B.", "Frank C."]);
    expect(batch.map((row) => row.quote)).toEqual([
      "Easy to study and amazing prep.",
      "I couldn't believe the price for everything I got.",
      "The drug cards were a game changer.",
    ]);
    expect(batch.every((row) => row.showOnHome === false)).toBe(true);
  });

  it("does not mix founder copy into student seeds", () => {
    expect(JSON.stringify(CONSENTED_TESTIMONIAL_SEEDS)).not.toMatch(/rating|photoUrl|verified|passed/i);
    expect(FOUNDER_NOTE.quote).toBe("Quality exam prep shouldn't be out of reach.");
    expect(CONSENTED_TESTIMONIAL_SEEDS.some((row) => row.quote === FOUNDER_NOTE.quote)).toBe(false);
  });
});
