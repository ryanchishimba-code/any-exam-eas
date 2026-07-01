/** Item presentation types — mirrors QuestionBankItem.itemType column. */
export type ExamItemType =
  | "mcq"
  | "k_type"
  | "vignette"
  | "ngn_bowtie"
  | "ngn_matrix"
  | "ngn_highlight"
  | "case_study"
  | "case_based"
  | "select_all"
  | "ordered_response"
  | "constructed_response"
  | "drag_drop"
  | "exhibit"
  | "sequential"
  | "abstract"
  | "drug_ad"
  | "ethics"
  | "biostats"
  | "ccs_prompt";

export type ExamReference = {
  label: string;
  url?: string;
  citation?: string;
};

/** Blueprint domains aligned to 2025–2026 exam outlines. */
export type BlueprintDomain =
  | "usmle-clinical-reasoning"
  | "usmle-ethics"
  | "usmle-biostats"
  | "naplex-area1-foundations"
  | "naplex-area2-therapeutics"
  | "naplex-area3-treatment-planning"
  | "naplex-area4-safety"
  | "naplex-area5-management"
  | "naplex-2026-pharmacotherapy"
  | "naplex-2026-patient-centered-care"
  | "naplex-2026-pharmacist-tasks"
  | "naplex-2026-medication-dispensing"
  | "naplex-2026-drug-information"
  | "naplex-2026-health-wellness"
  | "nclex-safe-care"
  | "nclex-health-promotion"
  | "nclex-psychosocial"
  | "nclex-physiological"
  | "mpje-jurisprudence"
  | "umpje-uniform"
  | "aanp-assess"
  | "aanp-diagnose"
  | "aanp-plan"
  | "aanp-evaluate";

export type { ExamFieldId } from "@/lib/subjects/field-ids";
