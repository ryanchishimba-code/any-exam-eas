/**
 * Official NCSBN / NCLEX links for the Toolkit NCLEX section.
 * Independent study aid — documents belong to the boards.
 */

export type OfficialLink = {
  label: string;
  href: string;
  description?: string;
};

export const NCLEX_OFFICIAL_LINKS: OfficialLink[] = [
  {
    label: "NCSBN exam test plans",
    href: "https://www.ncsbn.org/exams/testplans.page",
  },
  {
    label: "2026 NCLEX-RN Test Plan (PDF)",
    href: "https://www.ncsbn.org/public-files/2026_RN_Test-Plan_English-F.pdf",
  },
  {
    label: "NCLEX Candidate Bulletin (April 2026 PDF)",
    href: "https://www.ncsbn.org/public-files/NCLEX_Examination_Candidate_Bulletin_April_2026.pdf",
  },
  {
    label: "NCLEX.com",
    href: "https://www.nclex.com",
  },
];

export const NCLEX_OFFICIAL_LINKS_DISCLAIMER =
  "Independent. These documents belong to NCSBN / the boards — we are not affiliated with them.";
