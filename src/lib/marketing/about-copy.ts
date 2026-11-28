/** One H1: brand, exam-prep intent, and founder intent. No pass claim. */
export const ABOUT_HERO_HEADLINE = "AnyExamEasy exam prep from the founder";

export const ABOUT_HERO_LEAD = "AnyExamEasy";

export const ABOUT_HERO_ACCENT = "exam prep from the founder";

/** Pull quote lifted from the founder story. The paragraph keeps the sentence too. */
export const ABOUT_PULL_QUOTE = "This is my gift to my former self.";

export const ABOUT_AFFILIATION =
  "AnyExamEasy is not affiliated with NABP, NCSBN, or any official exam body.";

export const ABOUT_FOUNDER = {
  name: "Ryan Chishimba, PharmD, RPh",
  jobTitle: "Founder and Pharmacy Manager",
} as const;

/** Features Ryan named that the product already ships. */
export const ABOUT_PRODUCT_FEATURES = [
  "Adaptive Roadmap that focuses you on weak areas",
  "Deep Dives opened straight from missed questions",
  "Full-length exam simulations",
  "Rationales with sources, built to show you why an answer is right",
  "One plan covering six boards: NAPLEX, NCLEX, and more",
] as const;

export const ABOUT_REVIEWERS = [
  {
    id: "pharmacy" as const,
    name: ABOUT_FOUNDER.name,
    body: "Pharmacy and NAPLEX. Pharmacy Manager; built the platform and its pharmacy content.",
  },
  {
    id: "nursing" as const,
    name: "Ileen Chishimba, RN",
    body: "Nursing and NCLEX. Registered nurse; reviews nursing and clinical content.",
  },
] as const;

export const ABOUT_REVIEW_CAVEAT = "Not every item receives individual clinician review.";

/**
 * Founder story in Ryan's words. The monthly price is passed in from
 * `formatMonthlyPrice` so the sentence cannot drift from billing.
 */
export function founderStoryParagraphs(monthlyPrice: string): readonly string[] {
  return [
    "I failed my first NAPLEX attempt, then borrowed money to buy another course and retake it. Practice is what got me through.",
    "Students who need the most help are often the ones priced out. AnyExamEasy is the practice I wish I could have afforded.",
    `At ${monthlyPrice} a month, that's the break-even point for the material we supply. ${ABOUT_PULL_QUOTE}`,
    "Questions are AI-assisted, and not every item is individually reviewed by a clinician.",
  ];
}
