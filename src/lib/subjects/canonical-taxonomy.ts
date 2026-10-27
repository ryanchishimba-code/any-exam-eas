/**
 * Cross-exam canonical taxonomy.
 *
 * Per-field `subjectId`s are field-scoped and divergent (`cardiology` on USMLE,
 * `cardiovascular` on PANCE/FNP, `cardiovascular-pulmonary` on NPTE). This module
 * defines a single shared vocabulary of canonical topics and a crosswalk that maps
 * every registered `(fieldId, subjectId)` to one canonical topic.
 *
 * Two consumers:
 *  1. Smart filtering — "show me Cardiovascular across every exam" resolves through
 *     {@link getFieldSubjectsForCanonical}.
 *  2. Quality auditing — content-vs-label validation uses the canonical topic
 *     (and its keywords) to detect mislabeled items
 *     (see scripts/audit-subject-content-match.ts).
 *
 * Coverage is enforced by canonical-taxonomy.test.ts, which fails if any registered
 * subject id is missing from the crosswalk or maps to an unknown canonical id.
 */

import { normalizeFieldId } from "./field-ids";

export type CanonicalDomainKind =
  | "basic-science"
  | "organ-system"
  | "population"
  | "process"
  | "practice";

export type CanonicalTopic = {
  id: string;
  label: string;
  kind: CanonicalDomainKind;
  /**
   * Whether the topic has distinctive clinical/scientific content keywords.
   * Process/practice axes (e.g. "Assess", "Pharmacy Law") are NOT content-bearing
   * and are skipped by the content-mismatch auditor to avoid false positives.
   */
  contentBearing: boolean;
  /** Lowercased signal terms for heuristic content classification. */
  keywords: string[];
};

export const CANONICAL_TOPICS: CanonicalTopic[] = [
  // ── Basic sciences ────────────────────────────────────────────────────────
  { id: "anatomy", label: "Anatomy", kind: "basic-science", contentBearing: true,
    keywords: ["anatomy", "embryology", "histology", "ligament", "tendon", "fascia", "innervation", "gross anatomy"] },
  { id: "physiology", label: "Physiology", kind: "basic-science", contentBearing: true,
    keywords: ["physiology", "homeostasis", "membrane potential", "action potential", "frank-starling", "reabsorption", "secretion", "starling"] },
  { id: "pathology", label: "Pathology", kind: "basic-science", contentBearing: true,
    keywords: ["pathology", "neoplasia", "necrosis", "infarct", "inflammation", "dysplasia", "metaplasia", "apoptosis", "anaplasia"] },
  { id: "pharmacology", label: "Pharmacology", kind: "basic-science", contentBearing: true,
    keywords: ["mechanism of action", "receptor", "agonist", "antagonist", "half-life", "pharmacokinetic", "pharmacodynamic", "adverse effect", "contraindication", "drug class"] },
  { id: "biochemistry", label: "Biochemistry", kind: "basic-science", contentBearing: true,
    keywords: ["glycolysis", "enzyme", "metabolic pathway", "urea cycle", "amino acid", "glycogen", "krebs", "citric acid cycle", "inborn error"] },
  { id: "microbiology-immunology", label: "Microbiology & Immunology", kind: "basic-science", contentBearing: true,
    keywords: ["bacteria", "virus", "fungal", "parasite", "gram-positive", "gram-negative", "antibody", "hypersensitivity", "vaccine", "immune", "pathogen"] },

  // ── Organ systems ─────────────────────────────────────────────────────────
  { id: "cardiovascular", label: "Cardiovascular", kind: "organ-system", contentBearing: true,
    keywords: ["heart", "cardiac", "ecg", "myocardial", "arrhythmia", "hypertension", "heart failure", "murmur", "coronary", "angina", "statin"] },
  { id: "pulmonary", label: "Pulmonary", kind: "organ-system", contentBearing: true,
    keywords: ["lung", "respiratory", "asthma", "copd", "pneumonia", "dyspnea", "abg", "ventilation", "pulmonary embolism", "airway"] },
  { id: "renal-genitourinary", label: "Renal & Genitourinary", kind: "organ-system", contentBearing: true,
    keywords: ["kidney", "renal", "nephro", "glomerular", "electrolyte", "dialysis", "uti", "urinary", "bph", "nephrolithiasis", "incontinence"] },
  { id: "neurology", label: "Neurology", kind: "organ-system", contentBearing: true,
    keywords: ["stroke", "seizure", "neuropathy", "cranial nerve", "meningitis", "parkinson", "multiple sclerosis", "headache", "spinal cord", "tbi"] },
  { id: "gastrointestinal", label: "Gastrointestinal", kind: "organ-system", contentBearing: true,
    keywords: ["liver", "hepatic", "pancreatitis", "ibd", "gerd", "bowel", "gastrointestinal", "cirrhosis", "colitis", "biliary"] },
  { id: "endocrine-metabolic", label: "Endocrine & Metabolic", kind: "organ-system", contentBearing: true,
    keywords: ["diabetes", "insulin", "thyroid", "adrenal", "cortisol", "dka", "hormone", "metabolic syndrome", "osteoporosis", "pituitary"] },
  { id: "musculoskeletal", label: "Musculoskeletal", kind: "organ-system", contentBearing: true,
    keywords: ["fracture", "arthritis", "joint", "orthopedic", "back pain", "gout", "rotator cuff", "tendinopathy", "sprain", "rehab"] },
  { id: "reproductive-womens-health", label: "Reproductive & Women's Health", kind: "organ-system", contentBearing: true,
    keywords: ["pregnancy", "labor", "contraception", "preeclampsia", "menopause", "prenatal", "gynecolog", "obstetric", "postpartum", "cervical"] },
  { id: "psychiatry-behavioral", label: "Psychiatry & Behavioral Health", kind: "organ-system", contentBearing: true,
    keywords: ["depression", "anxiety", "schizophrenia", "bipolar", "ssri", "psychosis", "substance use", "suicide", "antipsychotic", "withdrawal"] },
  { id: "hematology-oncology", label: "Hematology & Oncology", kind: "organ-system", contentBearing: true,
    keywords: ["anemia", "leukemia", "lymphoma", "coagulation", "chemotherapy", "neutropenia", "thrombocytopenia", "cancer", "myeloma", "bleeding disorder"] },
  { id: "infectious-disease", label: "Infectious Disease", kind: "organ-system", contentBearing: true,
    keywords: ["infection", "sepsis", "antibiotic", "hiv", "tuberculosis", "meningitis", "antimicrobial", "mrsa", "antiviral", "prophylaxis"] },
  { id: "dermatology", label: "Dermatology", kind: "organ-system", contentBearing: true,
    keywords: ["rash", "skin", "cellulitis", "melanoma", "psoriasis", "dermatitis", "eczema", "lesion", "drug eruption"] },
  { id: "eent", label: "Eyes, Ears, Nose & Throat", kind: "organ-system", contentBearing: true,
    keywords: ["eye", "ear", "sinus", "pharyngitis", "otitis", "vertigo", "glaucoma", "hearing", "conjunctivitis", "epistaxis"] },
  { id: "integumentary", label: "Integumentary", kind: "organ-system", contentBearing: true,
    keywords: ["wound", "pressure injury", "pressure ulcer", "burn", "skin integrity", "dressing", "debridement"] },
  { id: "lymphatic", label: "Lymphatic", kind: "organ-system", contentBearing: true,
    keywords: ["lymphedema", "lymphatic", "compression", "decongestive", "lymph node"] },

  // ── Populations & acute care ──────────────────────────────────────────────
  { id: "pediatrics", label: "Pediatrics", kind: "population", contentBearing: true,
    keywords: ["pediatric", "child", "infant", "neonatal", "immunization", "growth chart", "developmental milestone", "adolescent"] },
  { id: "geriatrics", label: "Geriatrics", kind: "population", contentBearing: true,
    keywords: ["geriatric", "older adult", "polypharmacy", "falls", "dementia", "frailty", "delirium", "beers"] },
  { id: "emergency-acute-care", label: "Emergency & Acute Care", kind: "population", contentBearing: true,
    keywords: ["trauma", "shock", "acls", "anaphylaxis", "resuscitation", "emergency", "code", "acute"] },
  { id: "internal-medicine", label: "Internal / Multisystem Medicine", kind: "population", contentBearing: false,
    keywords: ["multisystem", "chronic disease", "comorbidity", "preventive care"] },

  // ── Process axes (not content-bearing) ────────────────────────────────────
  { id: "clinical-assessment", label: "Clinical Assessment", kind: "process", contentBearing: false,
    keywords: ["history", "physical exam", "assessment", "screening", "review of systems"] },
  { id: "diagnosis-reasoning", label: "Diagnosis & Clinical Reasoning", kind: "process", contentBearing: false,
    keywords: ["differential", "most likely diagnosis", "interpretation", "clinical reasoning"] },
  { id: "treatment-planning", label: "Treatment Planning", kind: "process", contentBearing: false,
    keywords: ["treatment", "management", "first-line", "prescribe", "referral", "plan"] },
  { id: "diagnostics-monitoring", label: "Diagnostics & Monitoring", kind: "process", contentBearing: false,
    keywords: ["diagnostic test", "monitoring", "follow-up", "outcomes", "lab", "complication"] },
  { id: "health-promotion", label: "Health Promotion", kind: "process", contentBearing: false,
    keywords: ["health promotion", "screening", "wellness", "prevention", "teaching"] },

  // ── Practice / professional axes (not content-bearing) ────────────────────
  { id: "patient-safety-management", label: "Patient Safety & Care Management", kind: "practice", contentBearing: false,
    keywords: ["prioritize", "delegate", "safety", "infection control", "precautions", "scope of practice", "body mechanics"] },
  { id: "patient-education-counseling", label: "Patient Education & Counseling", kind: "practice", contentBearing: false,
    keywords: ["counseling", "adherence", "education", "teaching", "communication"] },
  { id: "professional-ethics-law", label: "Professional Ethics & Law", kind: "practice", contentBearing: false,
    keywords: ["ethics", "informed consent", "law", "controlled substance", "documentation", "confidentiality", "hipaa"] },
  { id: "research-evidence", label: "Research & Evidence-Based Practice", kind: "practice", contentBearing: false,
    keywords: ["sensitivity", "specificity", "study design", "outcome measure", "evidence", "statistic"] },
  { id: "nursing-fundamentals", label: "Nursing Fundamentals & Comfort", kind: "practice", contentBearing: false,
    keywords: ["fundamentals", "vital signs", "comfort", "nutrition", "mobility", "hygiene", "elimination"] },
  { id: "pharmacy-practice", label: "Pharmacy Practice & Calculations", kind: "practice", contentBearing: false,
    keywords: ["dosage form", "compounding", "calculation", "alligation", "self-care", "otc", "dispensing"] },
  { id: "rehab-practice", label: "Rehabilitation Practice", kind: "practice", contentBearing: false,
    keywords: ["modality", "ultrasound", "tens", "orthotic", "prosthetic", "wheelchair", "exercise prescription"] },
];

const TOPIC_BY_ID = new Map(CANONICAL_TOPICS.map((t) => [t.id, t]));

/**
 * Crosswalk: fieldId -> subjectId -> canonical topic id.
 * USMLE Step 3 shares Step 2's clinical subject list.
 */
const USMLE_STEP1_MAP: Record<string, string> = {
  anatomy: "anatomy",
  physiology: "physiology",
  pathology: "pathology",
  pharmacology: "pharmacology",
  biochemistry: "biochemistry",
  microbiology: "microbiology-immunology",
};

const USMLE_CLINICAL_MAP: Record<string, string> = {
  cardiology: "cardiovascular",
  pulmonology: "pulmonary",
  nephrology: "renal-genitourinary",
  neurology: "neurology",
  "internal-medicine": "internal-medicine",
  pediatrics: "pediatrics",
  obgyn: "reproductive-womens-health",
  psychiatry: "psychiatry-behavioral",
  "emergency-medicine": "emergency-acute-care",
};

export const SUBJECT_CROSSWALK: Record<string, Record<string, string>> = {
  "usmle-step-1": USMLE_STEP1_MAP,
  "usmle-step-2": USMLE_CLINICAL_MAP,
  "usmle-step-3": USMLE_CLINICAL_MAP,

  nursing: {
    "management-of-care": "patient-safety-management",
    "safety-infection": "patient-safety-management",
    "health-promotion": "health-promotion",
    psychosocial: "psychiatry-behavioral",
    "pharmacology-nursing": "pharmacology",
    "basic-care-comfort": "nursing-fundamentals",
    "reduction-risk": "diagnostics-monitoring",
    "physiological-adaptation": "internal-medicine",
    fundamentals: "nursing-fundamentals",
    "med-surg": "internal-medicine",
    "maternal-child": "reproductive-womens-health",
    "pediatrics-nursing": "pediatrics",
  },

  pharmacy: {
    pharmacokinetics: "pharmacology",
    pharmacology: "pharmacology",
    pharmaceutics: "pharmacy-practice",
    "compounding-calculations": "pharmacy-practice",
    "cardiovascular-rx": "cardiovascular",
    "infectious-disease-rx": "infectious-disease",
    "endocrine-rx": "endocrine-metabolic",
    "cns-rx": "psychiatry-behavioral",
    "oncology-rx": "hematology-oncology",
    "otc-self-care": "pharmacy-practice",
    "patient-counseling": "patient-education-counseling",
    "pharmacy-law": "professional-ethics-law",
  },

  pance: {
    cardiovascular: "cardiovascular",
    pulmonary: "pulmonary",
    gastrointestinal: "gastrointestinal",
    musculoskeletal: "musculoskeletal",
    "infectious-diseases": "infectious-disease",
    neurologic: "neurology",
    psychiatry: "psychiatry-behavioral",
    reproductive: "reproductive-womens-health",
    endocrine: "endocrine-metabolic",
    eent: "eent",
    hematologic: "hematology-oncology",
    renal: "renal-genitourinary",
    dermatologic: "dermatology",
    genitourinary: "renal-genitourinary",
    "professional-practice": "professional-ethics-law",
  },

  "aanp-fnp": {
    assess: "clinical-assessment",
    diagnose: "diagnosis-reasoning",
    plan: "treatment-planning",
    evaluate: "diagnostics-monitoring",
    cardiovascular: "cardiovascular",
    pulmonary: "pulmonary",
    endocrine: "endocrine-metabolic",
    "womens-health": "reproductive-womens-health",
    pediatrics: "pediatrics",
    geriatrics: "geriatrics",
    "psychiatry-behavioral": "psychiatry-behavioral",
    "infectious-disease": "infectious-disease",
  },

  "npte-pt": {
    musculoskeletal: "musculoskeletal",
    "neuromuscular-nervous": "neurology",
    "cardiovascular-pulmonary": "cardiovascular",
    integumentary: "integumentary",
    "metabolic-endocrine": "endocrine-metabolic",
    gastrointestinal: "gastrointestinal",
    genitourinary: "renal-genitourinary",
    lymphatic: "lymphatic",
    "system-interactions": "internal-medicine",
    "equipment-devices": "rehab-practice",
    "therapeutic-modalities": "rehab-practice",
    "safety-protection": "patient-safety-management",
    "professional-responsibilities": "professional-ethics-law",
    "research-evidence": "research-evidence",
  },
};

export function getCanonicalTopicId(fieldId: string, subjectId: string): string | undefined {
  const field = normalizeFieldId(fieldId);
  return SUBJECT_CROSSWALK[field]?.[subjectId];
}

export function getCanonicalTopic(fieldId: string, subjectId: string): CanonicalTopic | undefined {
  const id = getCanonicalTopicId(fieldId, subjectId);
  return id ? TOPIC_BY_ID.get(id) : undefined;
}

export function canonicalTopicById(id: string): CanonicalTopic | undefined {
  return TOPIC_BY_ID.get(id);
}

export function listCanonicalTopics(): CanonicalTopic[] {
  return CANONICAL_TOPICS;
}

/** All (fieldId, subjectId) pairs that map to a canonical topic — powers cross-exam filtering. */
export function getFieldSubjectsForCanonical(
  canonicalId: string
): Array<{ fieldId: string; subjectId: string }> {
  const out: Array<{ fieldId: string; subjectId: string }> = [];
  for (const [fieldId, map] of Object.entries(SUBJECT_CROSSWALK)) {
    for (const [subjectId, topicId] of Object.entries(map)) {
      if (topicId === canonicalId) out.push({ fieldId, subjectId });
    }
  }
  return out;
}

export type CrosswalkCoverageIssue =
  | { kind: "unmapped-subject"; fieldId: string; subjectId: string }
  | { kind: "unknown-canonical"; fieldId: string; subjectId: string; canonicalId: string };

/**
 * Validate the crosswalk against a registry snapshot of `fieldId -> subjectIds`.
 * Returns every subject id missing a mapping and every mapping to an unknown
 * canonical id. The vitest suite passes the live registry so drift fails CI.
 */
export function validateCrosswalkCoverage(
  registry: Record<string, string[]>
): CrosswalkCoverageIssue[] {
  const issues: CrosswalkCoverageIssue[] = [];
  for (const [fieldId, subjectIds] of Object.entries(registry)) {
    const map = SUBJECT_CROSSWALK[normalizeFieldId(fieldId)];
    for (const subjectId of subjectIds) {
      const canonicalId = map?.[subjectId];
      if (!canonicalId) {
        issues.push({ kind: "unmapped-subject", fieldId, subjectId });
      } else if (!TOPIC_BY_ID.has(canonicalId)) {
        issues.push({ kind: "unknown-canonical", fieldId, subjectId, canonicalId });
      }
    }
  }
  return issues;
}
