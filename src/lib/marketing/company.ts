import { LEGAL_ENTITY } from "@/lib/legal";
import type { ExamSeoKey } from "@/lib/seo/exam-config";

/**
 * Public company identity. Named reviewers live in `CLINICAL_REVIEWERS` below.
 */
export const COMPANY_PUBLIC = {
  legalName: LEGAL_ENTITY.companyName,
  productName: LEGAL_ENTITY.productName,
  supportEmail: LEGAL_ENTITY.supportEmail,
  supportPhone: LEGAL_ENTITY.supportPhone,
} as const;

export type ClinicalReviewer = {
  id: "pharmacy" | "nursing";
  /** Exact public label: name, credential. */
  displayName: string;
  initials: string;
  /** Name, credential, and role only. No biography. */
  role: string;
  /** Person JSON-LD jobTitle. Scope stays inside this title. */
  jobTitle: string;
  /** Boards where this person is the named reviewer. */
  examKeys: readonly ExamSeoKey[];
  avatar: { background: string; color: string };
};

/**
 * Public clinical reviewers. Edit this list to change who is named.
 * Credentials limit the boards: pharmacy and nursing only.
 */
export const CLINICAL_REVIEWERS: readonly ClinicalReviewer[] = [
  {
    id: "pharmacy",
    displayName: "Ryan Chishimba, PharmD",
    initials: "RC",
    role: "Leads pharmacy content review (NAPLEX and pharmacology).",
    jobTitle: "Pharmacy content review lead (NAPLEX and pharmacology)",
    examKeys: ["naplex"],
    avatar: { background: "#1e3a5f", color: "#0d9488" },
  },
  {
    id: "nursing",
    displayName: "Ileen Chishimba, RN",
    initials: "IC",
    role: "Leads nursing content review (NCLEX-RN/PN). This is an ongoing role.",
    jobTitle: "Nursing content review lead (NCLEX-RN/PN)",
    examKeys: ["nclex"],
    avatar: { background: "#0d9488", color: "#1e3a5f" },
  },
];

/** Boards that use outline mapping and the quality gate, with no named subject expert. */
export const BOARDS_REVIEWED_BY_PROCESS =
  "USMLE, PANCE, NPTE-PT, and AANP FNP questions are mapped to the official content outline and pass the quality gate.";

export const BOARD_PROCESS_LINE =
  "Questions on this board are mapped to the official content outline and pass the quality gate before students see them.";

export function clinicalReviewerForExam(examKey: ExamSeoKey): ClinicalReviewer | null {
  return CLINICAL_REVIEWERS.find((reviewer) => reviewer.examKeys.includes(examKey)) ?? null;
}

/** Person nodes: name and jobTitle only. */
export function clinicalReviewerPersonNodes(): Array<{
  "@type": "Person";
  name: string;
  jobTitle: string;
}> {
  return CLINICAL_REVIEWERS.map((reviewer) => ({
    "@type": "Person",
    name: reviewer.displayName,
    jobTitle: reviewer.jobTitle,
  }));
}

export function buildClinicalReviewerJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": clinicalReviewerPersonNodes(),
  };
}
