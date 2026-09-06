/**
 * Official NCSBN / NCLEX / Pearson VUE links for the Toolkit NCLEX section.
 * Independent study aid — not affiliated with NCSBN.
 */

export type OfficialLink = {
  label: string;
  href: string;
  description?: string;
};

export const NCLEX_OFFICIAL_LINKS: OfficialLink[] = [
  {
    label: "NCSBN exam test plans hub",
    href: "https://www.ncsbn.org/exams/testplans.page",
    description: "Official test-plan landing page",
  },
  {
    label: "2026 NCLEX-RN Test Plan (PDF)",
    href: "https://www.ncsbn.org/public-files/2026_RN_Test-Plan_English-F.pdf",
  },
  {
    label: "2026 NCLEX-PN Test Plan",
    href: "https://www.ncsbn.org/publications/2026-nclex-pn-test-plan",
  },
  {
    label: "NCLEX.com test plans",
    href: "https://www.nclex.com/test-plans.page",
  },
  {
    label: "NCLEX Candidate Bulletin (April 2026 PDF)",
    href: "https://www.ncsbn.org/public-files/NCLEX_Examination_Candidate_Bulletin_April_2026.pdf",
  },
  {
    label: "NCLEX.com",
    href: "https://www.nclex.com",
  },
  {
    label: "Pearson VUE — NCLEX",
    href: "https://www.pearsonvue.com/us/en/nclex.html",
    description: "Scheduling and test-center info",
  },
];

export const NCLEX_OFFICIAL_LINKS_DISCLAIMER =
  "AnyExamEasy is an independent study platform and is not affiliated with, endorsed by, or sponsored by NCSBN. Always read the official NCSBN test plans and candidate bulletin before your sitting.";
