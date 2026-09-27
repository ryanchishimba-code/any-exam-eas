/** Owner-supplied quotes. Consent is recorded by the seed, which is not applied in the PR. */
export const CONSENTED_TESTIMONIAL_BATCH_ID = "testimonials-2026-09-27";

export type ConsentedTestimonialSeed = {
  id: string;
  name: string;
  exam: string;
  quote: string;
  sortOrder: number;
};

export const CONSENTED_TESTIMONIAL_SEEDS: readonly ConsentedTestimonialSeed[] = [
  {
    id: "seed_testimonials_2026_09_27_nathan",
    name: "Nathan C.",
    exam: "NCLEX-RN student",
    quote: "The best questions I've found for NCLEX prep.",
    sortOrder: 1,
  },
  {
    id: "seed_testimonials_2026_09_27_priscilla",
    name: "Priscilla J.",
    exam: "NCLEX-RN student",
    quote:
      "I wish I'd found AnyExamEasy sooner. It would have saved me from wasting money on other prep.",
    sortOrder: 2,
  },
];

export const FOUNDER_NOTE = {
  kicker: "From our founder",
  quote: "Quality exam prep shouldn't be out of reach.",
  attribution: "Ryan Chishimba, PharmD, Founder",
} as const;
