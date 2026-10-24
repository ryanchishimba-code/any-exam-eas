/** Owner-supplied quotes. Consent is recorded by the seed; DB apply is owner-run only. */
export const CONSENTED_TESTIMONIAL_BATCH_ID = "testimonials-2026-09-27";

export const CONSENTED_TESTIMONIAL_BATCH_ID_2026_10_24 = "testimonials-2026-10-24";

export type ConsentedTestimonialSeed = {
  id: string;
  name: string;
  exam: string;
  quote: string;
  sortOrder: number;
  batchId: string;
  /** ISO date string for consentedAt when applied to the database. */
  consentedAt: string;
  /** Homepage proof strip only — board landings always use the full seed list. */
  showOnHome?: boolean;
};

export const CONSENTED_TESTIMONIAL_SEEDS: readonly ConsentedTestimonialSeed[] = [
  {
    id: "seed_testimonials_2026_09_27_nathan",
    batchId: CONSENTED_TESTIMONIAL_BATCH_ID,
    consentedAt: "2026-09-27T00:00:00.000Z",
    name: "Nathan C.",
    exam: "NCLEX-RN student",
    quote: "The best questions I've found for NCLEX prep.",
    sortOrder: 1,
    showOnHome: true,
  },
  {
    id: "seed_testimonials_2026_09_27_priscilla",
    batchId: CONSENTED_TESTIMONIAL_BATCH_ID,
    consentedAt: "2026-09-27T00:00:00.000Z",
    name: "Priscilla J.",
    exam: "NCLEX-RN student",
    quote:
      "I wish I'd found AnyExamEasy sooner. It would have saved me from wasting money on other prep.",
    sortOrder: 2,
    showOnHome: true,
  },
  {
    id: "seed_testimonials_2026_10_24_steven",
    batchId: CONSENTED_TESTIMONIAL_BATCH_ID_2026_10_24,
    consentedAt: "2026-10-24T00:00:00.000Z",
    name: "Steven",
    exam: "NAPLEX student",
    quote: "Easy to study and amazing prep.",
    sortOrder: 1,
    showOnHome: false,
  },
  {
    id: "seed_testimonials_2026_10_24_mag_b",
    batchId: CONSENTED_TESTIMONIAL_BATCH_ID_2026_10_24,
    consentedAt: "2026-10-24T00:00:00.000Z",
    name: "Mag B.",
    exam: "AANP FNP student",
    quote: "I couldn't believe the price for everything I got.",
    sortOrder: 2,
    showOnHome: false,
  },
  {
    id: "seed_testimonials_2026_10_24_frank_c",
    batchId: CONSENTED_TESTIMONIAL_BATCH_ID_2026_10_24,
    consentedAt: "2026-10-24T00:00:00.000Z",
    name: "Frank C.",
    exam: "NAPLEX student",
    quote: "The drug cards were a game changer.",
    sortOrder: 3,
    showOnHome: false,
  },
];

export const CONSENTED_TESTIMONIAL_BATCH_IDS = [
  CONSENTED_TESTIMONIAL_BATCH_ID,
  CONSENTED_TESTIMONIAL_BATCH_ID_2026_10_24,
] as const;

export function consentedSeedsForBatch(batchId: string): ConsentedTestimonialSeed[] {
  return CONSENTED_TESTIMONIAL_SEEDS.filter((row) => row.batchId === batchId);
}

export const FOUNDER_NOTE = {
  kicker: "From our founder",
  quote: "Quality exam prep shouldn't be out of reach.",
  attribution: "Ryan Chishimba, PharmD, Founder",
} as const;
