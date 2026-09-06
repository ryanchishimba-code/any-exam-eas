/**
 * Official NABP / NAPLEX links for the Toolkit NAPLEX section.
 * Independent study aid — not affiliated with NABP or the boards of pharmacy.
 */

export type OfficialLink = {
  label: string;
  href: string;
  description?: string;
};

export const NAPLEX_OFFICIAL_LINKS: OfficialLink[] = [
  {
    label: "NAPLEX Content Outline (PDF)",
    href: "https://nabp.pharmacy/wp-content/uploads/NAPLEX-Content-Outline.pdf",
    description: "Official five-domain outline effective May 1, 2025",
  },
  {
    label: "NAPLEX competency statements",
    href: "https://nabp.pharmacy/programs/examinations/naplex/competency-statements/",
  },
  {
    label: "Take the NAPLEX exam",
    href: "https://nabp.pharmacy/programs/examinations/naplex/take-the-naplex-exam/",
    description: "Registration, eligibility, and Pre-NAPLEX practice product",
  },
  {
    label: "Breaking down the NAPLEX Content Outline",
    href: "https://nabp.pharmacy/news/blog/breaking-down-the-naplex-content-outline/",
  },
  {
    label: "Forward-focused format change",
    href: "https://nabp.pharmacy/news/blog/the-naplex-content-outline-a-forward-focused-format-change/",
  },
  {
    label: "NAPLEX program hub",
    href: "https://nabp.pharmacy/programs/examinations/naplex/",
  },
];

/** NABP’s own practice product — link only; do not scrape. */
export const NAPLEX_PRE_NAPLEX_LINK: OfficialLink = {
  label: "Pre-NAPLEX (NABP practice exam)",
  href: "https://nabp.pharmacy/programs/examinations/naplex/take-the-naplex-exam/",
  description: "Official NABP practice product from the take-the-exam page",
};

export const NAPLEX_EXAM_FACTS = {
  questions: "225 questions",
  duration: "6 hours",
  format: "Fixed-form computer exam",
  result: "Pass/fail",
  attempts: "5 attempts",
  attributedTo: "NABP",
} as const;

export const NAPLEX_OFFICIAL_LINKS_DISCLAIMER =
  "AnyExamEasy is an independent study platform and is not affiliated with, endorsed by, or sponsored by NABP or the boards of pharmacy. Always read the official NAPLEX Content Outline and candidate materials before your sitting.";
