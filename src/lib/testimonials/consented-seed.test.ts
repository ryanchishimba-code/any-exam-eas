import { describe, expect, it } from "vitest";
import {
  CONSENTED_TESTIMONIAL_BATCH_ID,
  CONSENTED_TESTIMONIAL_SEEDS,
  FOUNDER_NOTE,
} from "./consented-seed";

describe("consented testimonial seed", () => {
  it("stores the two owner-supplied quotes and not the founder line", () => {
    expect(CONSENTED_TESTIMONIAL_BATCH_ID).toBe("testimonials-2026-09-27");
    expect(CONSENTED_TESTIMONIAL_SEEDS.map((row) => row.name)).toEqual(["Nathan C.", "Priscilla J."]);
    expect(CONSENTED_TESTIMONIAL_SEEDS[0]?.quote).toBe(
      "The best questions I've found for NCLEX prep."
    );
    expect(CONSENTED_TESTIMONIAL_SEEDS[1]?.quote).toBe(
      "I wish I'd found AnyExamEasy sooner. It would have saved me from wasting money on other prep."
    );
    expect(CONSENTED_TESTIMONIAL_SEEDS.every((row) => row.exam === "NCLEX-RN student")).toBe(true);
    expect(JSON.stringify(CONSENTED_TESTIMONIAL_SEEDS)).not.toMatch(/rating|photoUrl|verified|passed/i);
    expect(FOUNDER_NOTE.quote).toBe("Quality exam prep shouldn't be out of reach.");
    expect(FOUNDER_NOTE.attribution).toBe("Ryan Chishimba, PharmD, Founder");
    expect(CONSENTED_TESTIMONIAL_SEEDS.some((row) => row.quote === FOUNDER_NOTE.quote)).toBe(false);
  });
});
