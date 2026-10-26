/** About hero headline. Ryan's line. No pass claim. */
export const ABOUT_HERO_HEADLINE = "Quality exam prep shouldn't be out of reach.";

export const ABOUT_HERO_LEAD = "Quality exam prep";

export const ABOUT_HERO_ACCENT = "shouldn't be out of reach.";

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
    "A few years ago, I was a pharmacy graduate facing two job offers — and I'd just failed my first attempt at the NAPLEX. I needed to retake it, but I'd run out of the free trial my school offered and had to buy access. I wasn't working, so I borrowed money from family. Four to five hundred dollars just to restudy and register.",
    "The first time around, I didn't do well because I was working and doing whatever it took to survive. I had no time to dedicate. This time, I said I'm going to focus solely on practicing until I get this right. And I did.",
    "What struck me then: students who don't have money need extra help the most, and they're the ones priced out. That's where AnyExamEasy was born. My goal is to democratize high-quality practice — the kind I couldn't afford — and make it available to any student, whether you have a lot of money or a little.",
    `At ${monthlyPrice} a month, that's the break-even point for the premium material and platform we supply. ${ABOUT_PULL_QUOTE} I wish I'd had this. I wish somebody had done this.`,
    "To make sure it meets the bar I've set, I've partnered with clinicians — RNs, PTs, MDs — to curate the content alongside my own pharmacy expertise.",
  ];
}
