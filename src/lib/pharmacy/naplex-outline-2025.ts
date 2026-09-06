/**
 * NABP NAPLEX Content Outline — effective May 1, 2025 (exams on/after that date).
 * Five content domains; Domain 3 is the heaviest (40%).
 *
 * Use these weights for Today / Skill Cell blueprint_weight.
 * Do NOT use the retired 2021 two-area split (67/33).
 * Do NOT apply NCLEX Client Needs weights to NAPLEX.
 * Do NOT mix MPJE law domains into NAPLEX Today.
 */

export type NaplexDomainNumber = 1 | 2 | 3 | 4 | 5;

export type NaplexOutlineDomainId =
  | "naplex-area1-foundations"
  | "naplex-area2-therapeutics"
  | "naplex-area3-treatment-planning"
  | "naplex-area4-safety"
  | "naplex-area5-management";

export type NaplexOutlineDomain = {
  /** 1–5 for UI chips and item tags. */
  domain: NaplexDomainNumber;
  id: NaplexOutlineDomainId;
  label: string;
  /** Integer blueprint weight (sums to 100). */
  blueprintWeight: number;
  weightLabel: string;
  summary: string;
};

/** Official five-domain NAPLEX outline weights (2025). */
export const NAPLEX_OUTLINE_2025: NaplexOutlineDomain[] = [
  {
    domain: 1,
    id: "naplex-area1-foundations",
    label: "Foundational Knowledge for Pharmacy Practice",
    blueprintWeight: 25,
    weightLabel: "25%",
    summary:
      "Pharmacology, PK/PD/PGx, pharmaceutics, compounding, and calculations.",
  },
  {
    domain: 2,
    id: "naplex-area2-therapeutics",
    label: "Medication Use Process",
    blueprintWeight: 25,
    weightLabel: "25%",
    summary:
      "Prescribing, transcribing/documenting, dispensing, administering, and monitoring.",
  },
  {
    domain: 3,
    id: "naplex-area3-treatment-planning",
    label: "Person-Centered Assessment and Treatment Planning",
    blueprintWeight: 40,
    weightLabel: "40%",
    summary:
      "Guideline-based pharmacotherapy, assessment, and treatment planning across disease states.",
  },
  {
    domain: 4,
    id: "naplex-area4-safety",
    label: "Professional Practice",
    blueprintWeight: 5,
    weightLabel: "5%",
    summary: "Ethics, communication, and professional pharmacy practice.",
  },
  {
    domain: 5,
    id: "naplex-area5-management",
    label: "Pharmacy Management and Leadership",
    blueprintWeight: 5,
    weightLabel: "5%",
    summary: "Operations, inventory, leadership, and pharmacy management.",
  },
];

export const NAPLEX_OUTLINE_2025_SOURCE =
  "NABP NAPLEX Content Outline (effective May 1, 2025)";

const BY_ID = new Map(NAPLEX_OUTLINE_2025.map((d) => [d.id, d] as const));
const BY_DOMAIN = new Map(NAPLEX_OUTLINE_2025.map((d) => [d.domain, d] as const));

export function naplexDomainById(id: string): NaplexOutlineDomain | undefined {
  return BY_ID.get(id as NaplexOutlineDomainId);
}

export function naplexDomainByNumber(
  n: number
): NaplexOutlineDomain | undefined {
  return BY_DOMAIN.get(n as NaplexDomainNumber);
}

/** Integer blueprint weight for a domain id (defaults to Domain 3 if unknown). */
export function naplexBlueprintWeight(domainId: string): number {
  return naplexDomainById(domainId)?.blueprintWeight ?? 40;
}

export function isNaplexOutlineDomainId(id: string): id is NaplexOutlineDomainId {
  return BY_ID.has(id as NaplexOutlineDomainId);
}
