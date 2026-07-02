/**
 * NCCPA PANCE Content Blueprint — current for 2026.
 * Two dimensions: Task Areas (how PAs apply knowledge) and Knowledge & Skill Areas (organ systems).
 *
 * Used for Roadmaps, generation prompts, toolkit copy, and blueprint high-yield tags.
 */

export type PanceTaskAreaId =
  | "history-physical"
  | "diagnosis"
  | "labs"
  | "prevention"
  | "intervention"
  | "pharmacotherapy"
  | "foundational"
  | "professional";

export type PanceKnowledgeAreaId =
  | "cardiovascular"
  | "pulmonary"
  | "gastrointestinal"
  | "musculoskeletal"
  | "eent"
  | "reproductive"
  | "endocrine"
  | "genitourinary"
  | "neurologic"
  | "psychiatry"
  | "dermatologic"
  | "hematologic"
  | "infectious-diseases"
  | "other";

export type PanceTaskArea = {
  id: PanceTaskAreaId;
  label: string;
  weight: number;
  weightLabel: string;
  summary: string;
};

export type PanceKnowledgeArea = {
  id: PanceKnowledgeAreaId;
  label: string;
  weight: number;
  weightLabel: string;
  summary: string;
  topics: string[];
  highYieldTopics: string[];
  /** Subject IDs used for question tagging and bank quotas. */
  subjectIds: string[];
};

/** NCCPA task areas — how physician assistants apply medical knowledge on the exam. */
export const PANCE_TASK_AREAS: PanceTaskArea[] = [
  {
    id: "history-physical",
    label: "History Taking & Performing Physical Examination",
    weight: 0.16,
    weightLabel: "16%",
    summary: "Focused history, exam maneuvers, and findings that narrow the differential.",
  },
  {
    id: "diagnosis",
    label: "Formulating Most Likely Diagnosis",
    weight: 0.18,
    weightLabel: "18%",
    summary: "Single-best diagnosis from vignette data — highest-weight task area.",
  },
  {
    id: "labs",
    label: "Using Diagnostic & Laboratory Studies",
    weight: 0.1,
    weightLabel: "10%",
    summary: "Initial and follow-up testing — labs, imaging, and interpretation.",
  },
  {
    id: "prevention",
    label: "Health Maintenance",
    weight: 0.11,
    weightLabel: "11%",
    summary: "Screening, immunizations, counseling, and preventive care across the lifespan.",
  },
  {
    id: "intervention",
    label: "Clinical Intervention",
    weight: 0.16,
    weightLabel: "16%",
    summary: "Next step in management — procedures, referrals, stabilization, and non-pharmacologic care.",
  },
  {
    id: "pharmacotherapy",
    label: "Pharmaceutical Therapeutics",
    weight: 0.15,
    weightLabel: "15%",
    summary: "First-line therapy, dose adjustment, contraindications, monitoring, and adverse effects.",
  },
  {
    id: "foundational",
    label: "Applying Basic Science Concepts",
    weight: 0.08,
    weightLabel: "8%",
    summary: "Pathophysiology, anatomy, microbiology, and mechanism linking science to clinical decisions.",
  },
  {
    id: "professional",
    label: "Professional Practice",
    weight: 0.06,
    weightLabel: "6%",
    summary: "Ethics, consent, scope of practice, documentation, and patient safety.",
  },
];

/** NCCPA organ-system / knowledge areas with approximate exam weights (2026). */
export const PANCE_KNOWLEDGE_AREAS: PanceKnowledgeArea[] = [
  {
    id: "cardiovascular",
    label: "Cardiovascular",
    weight: 0.13,
    weightLabel: "13%",
    summary: "Highest-yield system — HTN, ACS, heart failure, arrhythmias, and vascular disease.",
    topics: [
      "Hypertension & hypertensive crisis",
      "Coronary artery disease / acute coronary syndrome",
      "Heart failure",
      "Dysrhythmias (AFib, SVT, ventricular)",
      "Valvular heart disease",
      "Peripheral artery disease & venous thromboembolism",
      "Hyperlipidemia",
    ],
    highYieldTopics: [
      "hypertension",
      "ACS",
      "heart failure",
      "AFib",
      "hyperlipidemia",
      "PE/DVT",
      "valvular disease",
    ],
    subjectIds: ["cardiovascular"],
  },
  {
    id: "pulmonary",
    label: "Pulmonary",
    weight: 0.1,
    weightLabel: "10%",
    summary: "Asthma, COPD, pneumonia, PE, pleural disease, and lung cancer workup.",
    topics: [
      "Asthma & COPD",
      "Pneumonia (community-acquired, atypical)",
      "Pulmonary embolism",
      "Pleural effusion & pneumothorax",
      "Lung cancer & solitary pulmonary nodule",
      "Tuberculosis",
    ],
    highYieldTopics: ["asthma", "COPD", "pneumonia", "PE", "pneumothorax", "TB"],
    subjectIds: ["pulmonary"],
  },
  {
    id: "gastrointestinal",
    label: "Gastrointestinal / Nutritional",
    weight: 0.09,
    weightLabel: "9%",
    summary: "Upper and lower GI disease, liver, pancreas, nutrition, and cancer screening.",
    topics: [
      "GERD & peptic ulcer disease",
      "Inflammatory bowel disease (Crohn's vs ulcerative colitis)",
      "Irritable bowel syndrome",
      "Acute abdomen (appendicitis, diverticulitis, pancreatitis)",
      "Hepatitis & cirrhosis",
      "Colorectal cancer screening",
      "Malnutrition & obesity",
    ],
    highYieldTopics: ["GERD", "IBD", "pancreatitis", "hepatitis", "GI bleed", "CRC screening"],
    subjectIds: ["gastrointestinal"],
  },
  {
    id: "musculoskeletal",
    label: "Musculoskeletal",
    weight: 0.09,
    weightLabel: "9%",
    summary: "Arthritis, back pain, fractures, soft-tissue injury, and osteoporosis.",
    topics: [
      "Osteoarthritis & rheumatoid arthritis",
      "Low back pain & spinal stenosis",
      "Fractures & dislocations",
      "Tendinopathies & bursitis",
      "Gout & pseudogout",
      "Osteoporosis",
    ],
    highYieldTopics: ["osteoarthritis", "low back pain", "fractures", "gout", "osteoporosis"],
    subjectIds: ["musculoskeletal"],
  },
  {
    id: "eent",
    label: "Eyes, Ears, Nose & Throat (EENT)",
    weight: 0.07,
    weightLabel: "7%",
    summary: "Otitis, sinusitis, red eye, glaucoma, hearing loss, and vertigo.",
    topics: [
      "Otitis media & externa",
      "Sinusitis & pharyngitis",
      "Allergic rhinitis & conjunctivitis",
      "Glaucoma & cataracts",
      "Hearing loss & vertigo",
    ],
    highYieldTopics: ["otitis", "sinusitis", "pharyngitis", "glaucoma", "vertigo"],
    subjectIds: ["eent"],
  },
  {
    id: "reproductive",
    label: "Reproductive",
    weight: 0.07,
    weightLabel: "7%",
    summary: "Prenatal care, contraception, menstrual disorders, and women's health.",
    topics: [
      "Prenatal care & common pregnancy complications",
      "Contraception & infertility",
      "Menstrual disorders & menopause",
    ],
    highYieldTopics: ["prenatal care", "contraception", "pregnancy complications", "menopause"],
    subjectIds: ["reproductive"],
  },
  {
    id: "endocrine",
    label: "Endocrine",
    weight: 0.07,
    weightLabel: "7%",
    summary: "Diabetes, thyroid, adrenal/pituitary disorders, and metabolic syndrome.",
    topics: [
      "Diabetes mellitus (type 1 & 2) & complications",
      "Thyroid disorders",
      "Adrenal & pituitary disorders",
      "Metabolic syndrome",
    ],
    highYieldTopics: ["diabetes", "DKA", "thyroid", "hypoglycemia", "metabolic syndrome"],
    subjectIds: ["endocrine"],
  },
  {
    id: "genitourinary",
    label: "Genitourinary",
    weight: 0.06,
    weightLabel: "6%",
    summary: "UTI, BPH, prostate cancer, renal disease, electrolytes, and STIs.",
    topics: [
      "Benign prostatic hyperplasia & prostate cancer",
      "Urinary tract infections & pyelonephritis",
      "STI evaluation & treatment",
      "AKI, CKD, electrolytes, and acid-base",
    ],
    highYieldTopics: ["UTI", "BPH", "prostate cancer", "AKI", "STI", "nephrolithiasis"],
    subjectIds: ["genitourinary", "renal"],
  },
  {
    id: "neurologic",
    label: "Neurologic",
    weight: 0.06,
    weightLabel: "6%",
    summary: "Headache, stroke, seizure, demyelinating disease, and dementia.",
    topics: [
      "Headache disorders (migraine, tension)",
      "Stroke & TIA",
      "Seizure disorders",
      "Multiple sclerosis & Parkinson's",
      "Dementia",
    ],
    highYieldTopics: ["stroke", "TIA", "seizure", "migraine", "MS", "dementia"],
    subjectIds: ["neurologic"],
  },
  {
    id: "psychiatry",
    label: "Psychiatric / Behavioral",
    weight: 0.06,
    weightLabel: "6%",
    summary: "Mood, anxiety, psychosis, substance use, ADHD, and suicide risk.",
    topics: [
      "Depression & anxiety",
      "Bipolar disorder & schizophrenia",
      "Substance use disorders",
      "ADHD",
      "Suicide risk assessment",
    ],
    highYieldTopics: ["depression", "anxiety", "bipolar", "substance use", "suicide risk", "ADHD"],
    subjectIds: ["psychiatry"],
  },
  {
    id: "dermatologic",
    label: "Dermatologic",
    weight: 0.05,
    weightLabel: "5%",
    summary: "Common rashes, acne, rosacea, skin cancer, and cutaneous infections.",
    topics: [
      "Common rashes (eczema, psoriasis, contact dermatitis)",
      "Acne & rosacea",
      "Skin cancer (melanoma, basal/squamous cell)",
      "Infections (herpes, cellulitis, tinea)",
    ],
    highYieldTopics: ["eczema", "psoriasis", "melanoma", "cellulitis", "contact dermatitis"],
    subjectIds: ["dermatologic"],
  },
  {
    id: "hematologic",
    label: "Hematologic",
    weight: 0.05,
    weightLabel: "5%",
    summary: "Anemias, coagulopathies, and transfusion-related decisions.",
    topics: [
      "Anemias & coagulopathies",
      "Bleeding disorders & anticoagulation complications",
    ],
    highYieldTopics: ["anemia", "coagulopathy", "thrombocytopenia", "DIC"],
    subjectIds: ["hematologic"],
  },
  {
    id: "infectious-diseases",
    label: "Infectious Diseases",
    weight: 0.05,
    weightLabel: "5%",
    summary: "Antibiotic selection, HIV, vaccinations, and sepsis.",
    topics: [
      "Antibiotic selection",
      "HIV & common opportunistic infections",
      "Vaccinations",
      "Sepsis & systemic inflammatory response",
    ],
    highYieldTopics: ["antibiotic selection", "HIV", "sepsis", "vaccinations", "meningitis"],
    subjectIds: ["infectious-diseases"],
  },
  {
    id: "other",
    label: "Other (Pediatrics, Emergency Medicine, Professional Practice)",
    weight: 0.15,
    weightLabel: "~15%",
    summary:
      "Pediatrics, emergency stabilization, procedures, ethics, and cross-cutting primary care topics.",
    topics: [
      "Pediatric presentations & well-child care",
      "Emergency medicine — stabilization & referral",
      "Common PA procedures (indications)",
      "Professional practice — ethics, consent, scope, documentation",
      "Geriatric considerations",
    ],
    highYieldTopics: [
      "pediatrics",
      "emergency stabilization",
      "procedures",
      "ethics",
      "consent",
      "geriatrics",
    ],
    subjectIds: ["professional-practice"],
  },
];

/** Map legacy bank category slugs to current blueprint knowledge areas. */
export const PANCE_LEGACY_CONTENT_ALIASES: Partial<
  Record<string, PanceKnowledgeAreaId>
> = {
  renal: "genitourinary",
  "professional-practice": "other",
};

/** Cross-system high-yield focus for study planning and marketing copy. */
export const PANCE_HIGH_YIELD_FOCUS_AREAS = [
  "Pharmacology — indications, contraindications, monitoring, and adverse effects across systems",
  "Clinical guidelines — apply current standards (ACC/AHA, IDSA, ADA, GOLD, etc.)",
  "Preventive medicine & health maintenance",
  "Pediatric & geriatric considerations",
  "Emergency medicine — stabilization and referral",
  "Cardiovascular & pulmonary — highest-weight organ systems",
] as const;

/** Product capabilities aligned to PANCE prep needs. */
export const PANCE_PLATFORM_STUDY_FEATURES = [
  "Clinical vignettes — “A 45-year-old presents with…” board-style stems",
  "Integrated pharmacology across all organ systems",
  "Pediatrics and women's health emphasis in mixed blocks",
  "Task-area practice — diagnosis, pharmacotherapy, labs, and health maintenance modes",
  "AI-generated differential diagnosis and next-step management items",
  "Roadmap tracking by NCCPA knowledge area and task area",
] as const;

export const PANCE_OUTLINE_SOURCE =
  "NCCPA PANCE Content Blueprint (current for 2026) — 300 questions, 5 hours";

export function getPanceKnowledgeArea(
  id: PanceKnowledgeAreaId
): PanceKnowledgeArea | undefined {
  return PANCE_KNOWLEDGE_AREAS.find((d) => d.id === id);
}

export function getPanceTaskArea(id: PanceTaskAreaId): PanceTaskArea | undefined {
  return PANCE_TASK_AREAS.find((t) => t.id === id);
}

/** Normalize legacy content category slugs to current blueprint IDs. */
export function normalizePanceContentCategory(category: string): PanceKnowledgeAreaId {
  const alias = PANCE_LEGACY_CONTENT_ALIASES[category];
  if (alias) return alias;
  const match = PANCE_KNOWLEDGE_AREAS.find((d) => d.id === category);
  if (match) return match.id;
  return "other";
}
