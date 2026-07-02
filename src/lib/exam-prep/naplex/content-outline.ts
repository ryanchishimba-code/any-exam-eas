/**
 * NABP NAPLEX Content Outline — effective May 1, 2025 onward.
 * Five content domains; Domain 3 is the heaviest (~40%).
 *
 * Used for Roadmaps, generation prompts, toolkit copy, and blueprint high-yield tags.
 */

export type NaplexContentDomainId =
  | "naplex-area1-foundations"
  | "naplex-area2-therapeutics"
  | "naplex-area3-treatment-planning"
  | "naplex-area4-safety"
  | "naplex-area5-management";

export type NaplexContentDomain = {
  id: NaplexContentDomainId;
  label: string;
  weight: number;
  weightLabel: string;
  summary: string;
  topics: string[];
  highYieldTopics: string[];
};

/** Official five-domain NAPLEX outline (2025/2026). */
export const NAPLEX_CONTENT_OUTLINE: NaplexContentDomain[] = [
  {
    id: "naplex-area1-foundations",
    label: "Foundational Knowledge for Pharmacy Practice",
    weight: 0.25,
    weightLabel: "~25%",
    summary:
      "Calculations, PK/PD, pharmaceutics, pharmacology basics, biostatistics, and drug information foundations.",
    topics: [
      "Pharmaceutical calculations (alligation, dosing, IV rates, compounding, NNT, ARR)",
      "Pharmacokinetics & pharmacodynamics (half-life, bioavailability, Vd, clearance)",
      "Drug metabolism & interactions (CYP enzymes, transporters)",
      "Medicinal chemistry & structure-activity relationships",
      "Pharmaceutics & compounding (sterile vs non-sterile, stability, excipients)",
      "Pharmacology basics (receptors, agonists/antagonists)",
      "Toxicology & antidote management",
      "Pharmacogenomics",
      "Biostatistics & study design interpretation",
    ],
    highYieldTopics: [
      "calculations",
      "PK/PD",
      "CYP interactions",
      "compounding",
      "NNT/ARR",
      "pharmaceutics",
      "toxicology antidotes",
      "pharmacogenomics",
    ],
  },
  {
    id: "naplex-area2-therapeutics",
    label: "Medication Use Process",
    weight: 0.25,
    weightLabel: "~25%",
    summary:
      "Prescribing through monitoring — safety, dispensing, administration, TDM, adherence, and drug information.",
    topics: [
      "Medication safety & error prevention (ISMP high-alert meds, LASA)",
      "Prescription processing & verification",
      "Dispensing procedures (labeling, auxiliary labels)",
      "Administration techniques & devices (inhalers, injections, patches)",
      "Therapeutic drug monitoring (vancomycin, aminoglycosides, digoxin)",
      "Adherence assessment & barriers",
      "Medication reconciliation",
      "Drug information resources & literature evaluation",
    ],
    highYieldTopics: [
      "medication safety",
      "dispensing verification",
      "TDM",
      "adherence",
      "medication reconciliation",
      "ISMP high-alert",
      "drug information",
      "administration devices",
    ],
  },
  {
    id: "naplex-area3-treatment-planning",
    label: "Person-Centered Assessment & Treatment Planning",
    weight: 0.4,
    weightLabel: "~40%",
    summary:
      "Highest-yield domain — guideline-based pharmacotherapy across major disease states and special populations.",
    topics: [
      "Cardiovascular (HTN, HF, dyslipidemia, anticoagulation, ACS/MI, stroke prevention)",
      "Infectious diseases (antibiotic spectrum, stewardship, MRSA/Pseudomonas, HIV, vaccines)",
      "Endocrine (diabetes ADA guidelines, thyroid, adrenal/steroids)",
      "Respiratory (asthma/COPD GINA/GOLD, pneumonia CAP/HAP)",
      "Gastrointestinal (GERD, PUD, IBD, constipation/diarrhea, liver/cirrhosis)",
      "Renal (CKD dosing, AKI, dialysis, anemia management)",
      "Oncology supportive care & chemo toxicities",
      "Neurology/psychiatry (epilepsy, migraine, Parkinson's, depression, psychosis, dementia)",
      "Women's & men's health (contraception, HRT, BPH, ED)",
      "Pediatrics & geriatrics (dosing, immunizations, BEERS)",
    ],
    highYieldTopics: [
      "hypertension guidelines",
      "heart failure GDMT",
      "diabetes pharmacotherapy",
      "anticoagulation DOACs",
      "antibiotic stewardship",
      "immunizations",
      "asthma COPD inhalers",
      "renal dose adjustment",
      "psychotropic monitoring",
      "special populations",
    ],
  },
  {
    id: "naplex-area4-safety",
    label: "Professional Practice",
    weight: 0.05,
    weightLabel: "Professional practice",
    summary: "Ethics, law, counseling, cultural competency, and public health.",
    topics: [
      "Ethical & legal standards (HIPAA, controlled substances, scope of practice)",
      "Patient counseling & communication (teach-back method)",
      "Cultural competency & health equity",
      "Public health & emergency preparedness",
      "Research ethics & IRB",
    ],
    highYieldTopics: [
      "HIPAA",
      "controlled substances",
      "patient counseling",
      "ethics",
      "health equity",
      "error reporting",
    ],
  },
  {
    id: "naplex-area5-management",
    label: "Pharmacy Management & Leadership",
    weight: 0.05,
    weightLabel: "Management & leadership",
    summary: "Operations, formulary, quality, billing, and regulatory compliance.",
    topics: [
      "Inventory management & drug shortages",
      "Formulary management & cost-effectiveness",
      "Pharmacy operations & workflow",
      "Quality assurance & accreditation (USP <797>, <795>)",
      "Human resources & leadership principles",
      "Billing, reimbursement & insurance",
      "Regulatory compliance (DEA, FDA, state boards)",
    ],
    highYieldTopics: [
      "inventory",
      "formulary",
      "USP compounding",
      "quality improvement",
      "DEA compliance",
      "reimbursement",
    ],
  },
];

/** Cross-domain high-yield focus for study planning and marketing copy. */
export const NAPLEX_HIGH_YIELD_FOCUS_AREAS = [
  "Calculations — daily practice essential",
  "Infectious disease & antibiotics — spectrum, MOA, resistance",
  "Cardiovascular & diabetes — guidelines & first-line therapies",
  "Anticoagulation & drug interactions",
  "Immunizations — schedules & special populations",
  "Pharmacokinetics & renal/hepatic dosing",
] as const;

/** Product capabilities aligned to NAPLEX prep needs. */
export const NAPLEX_PLATFORM_STUDY_FEATURES = [
  "Case-based patient scenarios with multi-step therapy decisions",
  "Dedicated calculations practice with board-style math items",
  "Drug comparison tables and class pearls",
  "Guideline summaries (ADA, ACC/AHA, IDSA, GINA/GOLD, etc.)",
  "Adaptive quizzes targeting weak blueprint domains on your Roadmap",
] as const;

export const NAPLEX_OUTLINE_SOURCE =
  "NABP NAPLEX Content Outline (effective May 1, 2025)";

export function getNaplexContentDomain(id: NaplexContentDomainId): NaplexContentDomain | undefined {
  return NAPLEX_CONTENT_OUTLINE.find((d) => d.id === id);
}
