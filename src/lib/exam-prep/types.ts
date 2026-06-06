/** Item presentation types — mirrors QuestionBankItem.itemType column. */
export type ExamItemType =
  | "mcq"
  | "vignette"
  | "ngn_bowtie"
  | "ngn_matrix"
  | "ngn_highlight"
  | "case_study"
  | "select_all"
  | "ordered_response";

export type ExamReference = {
  label: string;
  url?: string;
  citation?: string;
};

/** Blueprint domains aligned to 2025–2026 exam outlines. */
export type BlueprintDomain =
  | "usmle-clinical-reasoning"
  | "usmle-ethics"
  | "naplex-area1-foundations"
  | "naplex-area2-therapeutics"
  | "naplex-area3-treatment-planning"
  | "naplex-area4-safety"
  | "naplex-area5-management"
  | "nclex-safe-care"
  | "nclex-health-promotion"
  | "nclex-psychosocial"
  | "nclex-physiological"
  | "mpje-jurisprudence"
  | "umpje-uniform";

export type ExamFieldId = "nursing" | "usmle-step-1" | "pharmacy" | "mpje";
