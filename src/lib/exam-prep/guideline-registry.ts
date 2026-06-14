/**
 * Curated guideline registry — topic rules map clinical content to allowed citations.
 * AI and enrichment pick from this list only (no free-form invented citations).
 */
import type { ExamReference } from "./types";

export type GuidelineRule = {
  id: string;
  /** Higher = preferred when multiple rules match. */
  priority: number;
  keywords: RegExp;
  subjectIds?: string[];
  /** When true, subjectId must be in subjectIds to match. */
  strictSubject?: boolean;
  references: ExamReference[];
  /** One-line clinical basis appended when explanation lacks society-specific tie-in. */
  clinicalLine: string;
};

// ── Shared references ───────────────────────────────────────────────────────

export const NCSBN_NCLEX_RN: ExamReference = {
  label: "NCSBN NCLEX-RN Test Plan",
  url: "https://www.ncsbn.org/nclex.htm",
  citation: "Clinical Judgment Measurement Model (CJMM)",
};

export const CDC_INFECTION: ExamReference = {
  label: "CDC Infection Control Guidelines",
  url: "https://www.cdc.gov/infection-control/hcp/isolation-precautions/",
  citation: "Transmission-based precautions and hand hygiene",
};

export const SURVIVING_SEPSIS: ExamReference = {
  label: "Surviving Sepsis Campaign",
  url: "https://www.sccm.org/survivingsepsiscampaign",
  citation: "Hour-1 bundle: lactate, cultures, antibiotics, fluids, reassess",
};

export const AHA_ACLS: ExamReference = {
  label: "AHA ACLS Guidelines",
  url: "https://cpr.heart.org/",
  citation: "Cardiac arrest and peri-arrest emergency algorithms",
};

export const AHA_HF: ExamReference = {
  label: "AHA Heart Failure Guidelines",
  url: "https://www.heart.org/",
  citation: "Volume status, perfusion, and diuretic/afterload management",
};

export const ISMP_MED_SAFETY: ExamReference = {
  label: "ISMP Medication Safety Guidelines",
  url: "https://www.ismp.org/",
  citation: "Rights of medication administration and high-alert drug precautions",
};

export const JOINT_COMMISSION: ExamReference = {
  label: "The Joint Commission National Patient Safety Goals",
  url: "https://www.jointcommission.org/standards/national-patient-safety-goals/",
  citation: "Identify patients correctly; use medications safely; prevent infection",
};

export const APA_THERAPEUTIC: ExamReference = {
  label: "APA Therapeutic Communication Principles",
  citation: "Client-centered responses; avoid minimizing, arguing, or false reassurance",
};

export const AAP_PEDIATRICS: ExamReference = {
  label: "AAP Clinical Practice Guidelines",
  url: "https://publications.aap.org/",
  citation: "Pediatric assessment, immunization, and acute illness management",
};

export const ACOG_MATERNAL: ExamReference = {
  label: "ACOG Practice Bulletins",
  url: "https://www.acog.org/clinical",
  citation: "Maternal-newborn assessment and obstetric emergency management",
};

export const ADA_STANDARDS: ExamReference = {
  label: "ADA Standards of Care in Diabetes",
  url: "https://diabetesjournals.org/care",
  citation: "Glycemic targets, insulin safety, and hypoglycemia management",
};

export const ACC_AHA_CV: ExamReference = {
  label: "ACC/AHA Cardiovascular Guidelines",
  url: "https://www.acc.org/guidelines",
  citation: "Evidence-based cardiovascular risk reduction and therapy",
};

export const FDA_LABELING: ExamReference = {
  label: "FDA Prescribing Information",
  url: "https://www.fda.gov/drugs",
  citation: "Indications, contraindications, monitoring, and boxed warnings",
};

export const IDSA_INFECTION: ExamReference = {
  label: "IDSA Clinical Practice Guidelines",
  url: "https://www.idsociety.org/practice-guideline/",
  citation: "Antimicrobial selection and infection source control",
};

export const USP_COMPOUNDING: ExamReference = {
  label: "USP Compounding Standards",
  url: "https://www.usp.org/compounding",
  citation: "USP <795> nonsterile and <797> sterile compounding requirements",
};

export const DEA_CSA: ExamReference = {
  label: "DEA Controlled Substances Act",
  url: "https://www.deadiversion.usdoj.gov/",
  citation: "Schedule classification, prescribing, and dispensing controls",
};

// ── NCLEX-RN rules ──────────────────────────────────────────────────────────

export const NCLEX_GUIDELINE_RULES: GuidelineRule[] = [
  {
    id: "sepsis",
    priority: 10,
    keywords: /sepsis|septic shock|lactate|blood culture|broad-spectrum antibiotic/i,
    subjectIds: ["physiological-adaptation", "reduction-risk", "med-surg"],
    references: [SURVIVING_SEPSIS, NCSBN_NCLEX_RN],
    clinicalLine:
      "Sepsis management prioritizes early recognition, blood cultures before antibiotics when feasible, timely broad-spectrum antibiotics, fluids, and reassessment per Surviving Sepsis.",
  },
  {
    id: "cdiff",
    priority: 10,
    keywords: /c\.?\s*diff|clostridioides|contact precaution|spore/i,
    subjectIds: ["safety-infection"],
    references: [CDC_INFECTION, NCSBN_NCLEX_RN],
    clinicalLine:
      "C. difficile requires contact precautions and soap-and-water hand hygiene because alcohol-based rubs do not reliably kill spores.",
  },
  {
    id: "isolation",
    priority: 8,
    keywords: /droplet precaution|airborne precaution|contact precaution|isolation|PPE|hand hygiene/i,
    subjectIds: ["safety-infection"],
    references: [CDC_INFECTION, JOINT_COMMISSION],
    clinicalLine:
      "Isolation precautions follow CDC transmission categories; hand hygiene and PPE selection must match the pathogen.",
  },
  {
    id: "heart_failure",
    priority: 9,
    keywords: /heart failure|HFrEF|crackles|pulmonary edema|fluid overload|BMP|BNP/i,
    subjectIds: ["physiological-adaptation", "med-surg", "pharmacology-nursing"],
    references: [AHA_HF, NCSBN_NCLEX_RN],
    clinicalLine:
      "Heart failure exacerbation management balances perfusion and congestion with diuretics, oxygen, monitoring, and escalation per AHA heart failure guidance.",
  },
  {
    id: "cardiac_arrest",
    priority: 10,
    keywords: /cardiac arrest|CPR|defibrillat|ventricular fibrillation|pulseless/i,
    subjectIds: ["physiological-adaptation", "reduction-risk"],
    references: [AHA_ACLS, NCSBN_NCLEX_RN],
    clinicalLine:
      "Cardiac arrest management follows AHA ACLS: high-quality CPR, defibrillation when indicated, and reversible causes.",
  },
  {
    id: "anticoagulation",
    priority: 9,
    keywords: /warfarin|INR|heparin|enoxaparin|anticoagul|bleeding|dabigatran|rivaroxaban/i,
    subjectIds: ["pharmacology-nursing", "med-surg", "reduction-risk"],
    references: [ISMP_MED_SAFETY, JOINT_COMMISSION],
    clinicalLine:
      "Anticoagulant therapy requires indication-appropriate monitoring (e.g., INR), bleeding assessment, and interaction review per medication safety standards.",
  },
  {
    id: "insulin",
    priority: 9,
    keywords: /insulin|hypoglycemia|hyperglycemia|blood glucose|DKA|diabetic ketoacidosis/i,
    subjectIds: ["pharmacology-nursing", "physiological-adaptation", "med-surg"],
    references: [ADA_STANDARDS, ISMP_MED_SAFETY],
    clinicalLine:
      "Insulin administration and hypoglycemia response follow ADA glycemic management and ISMP high-alert medication safety practices.",
  },
  {
    id: "medication_admin",
    priority: 7,
    keywords: /medication administration|rights of medication|MAR|verify.*allergy|high-alert/i,
    subjectIds: ["pharmacology-nursing", "safety-infection"],
    references: [ISMP_MED_SAFETY, JOINT_COMMISSION],
    clinicalLine:
      "Medication administration follows the rights of medication administration and ISMP safety checks before every dose.",
  },
  {
    id: "icp",
    priority: 10,
    keywords: /intracranial pressure|ICP|head injury|Glasgow Coma|Cushing|decerebrate|decorticate/i,
    subjectIds: ["physiological-adaptation", "med-surg"],
    references: [
      {
        label: "Brain Trauma Foundation Guidelines",
        citation: "Head-of-bed elevation, avoid hypoxia/hypotension, and neurological monitoring in TBI",
      },
      NCSBN_NCLEX_RN,
    ],
    clinicalLine:
      "Suspected increased ICP warrants head-of-bed elevation ~30°, neutral neck alignment, oxygenation, and immediate provider notification when GCS or pupils change.",
  },
  {
    id: "postpartum_hemorrhage",
    priority: 10,
    keywords: /postpartum hemorrhage|boggy fundus|uterotonic|lochia|postpartum/i,
    subjectIds: ["maternal-child"],
    references: [ACOG_MATERNAL, NCSBN_NCLEX_RN],
    clinicalLine:
      "Postpartum hemorrhage risk requires fundal assessment, uterotonic therapy per protocol, and close monitoring of lochia and vital signs.",
  },
  {
    id: "labor",
    priority: 8,
    keywords: /\blabor\b|\bcontractions\b|\bfetal heart rate\b|\bdecelerations\b|\bepidural\b|\bpreeclampsia\b/i,
    subjectIds: ["maternal-child"],
    references: [ACOG_MATERNAL, NCSBN_NCLEX_RN],
    clinicalLine:
      "Intrapartum nursing centers on fetal heart rate interpretation, maternal assessment, and escalation per ACOG obstetric guidance.",
  },
  {
    id: "pediatric",
    priority: 7,
    keywords: /pediatric|infant|child|immunization|febrile|growth chart/i,
    subjectIds: ["pediatrics-nursing", "maternal-child"],
    references: [AAP_PEDIATRICS, NCSBN_NCLEX_RN],
    clinicalLine:
      "Pediatric nursing applies age-specific assessment, immunization, and acute illness protocols per AAP guidance.",
  },
  {
    id: "therapeutic_comm",
    priority: 6,
    keywords: /therapeutic communication|active listening|teach-back|grief|anxiety|depression|suicidal/i,
    subjectIds: ["psychosocial", "health-promotion"],
    strictSubject: true,
    references: [APA_THERAPEUTIC, NCSBN_NCLEX_RN],
    clinicalLine:
      "Therapeutic communication uses client-centered responses; avoid minimizing feelings, arguing, or giving false reassurance.",
  },
  {
    id: "delegation",
    priority: 6,
    keywords: /\bdelegat(?:e|ion|ing)\b|\bassign(?:ment)?\b.*\b(?:LPN|LVN|UAP|unlicensed|assistive)\b|\bscope of practice\b|\bfive rights of delegation\b/i,
    subjectIds: ["management-of-care"],
    strictSubject: true,
    references: [NCSBN_NCLEX_RN, JOINT_COMMISSION],
    clinicalLine:
      "Delegation and assignment follow scope of practice, client stability, and five rights of delegation per NCSBN.",
  },
  {
    id: "fall_risk",
    priority: 6,
    keywords: /fall risk|fall precaution|restraint|ambulat|syncope/i,
    subjectIds: ["safety-infection", "basic-care-comfort", "reduction-risk"],
    references: [JOINT_COMMISSION, NCSBN_NCLEX_RN],
    clinicalLine:
      "Fall prevention uses individualized risk assessment, environmental safety, and least-restrictive interventions.",
  },
  {
    id: "respiratory",
    priority: 8,
    keywords: /COPD|asthma|oxygen|SpO2|respiratory distress|wheez|intubat/i,
    subjectIds: ["physiological-adaptation", "med-surg", "pediatrics-nursing"],
    references: [NCSBN_NCLEX_RN, AHA_ACLS],
    clinicalLine:
      "Respiratory compromise prioritizes airway, breathing, oxygen titration, and monitoring with escalation when work of breathing or SpO₂ worsens.",
  },
  {
    id: "renal",
    priority: 7,
    keywords: /acute kidney|oliguria|dialysis|creatinine|fluid restriction|FENa/i,
    subjectIds: ["physiological-adaptation", "med-surg", "reduction-risk"],
    references: [NCSBN_NCLEX_RN, JOINT_COMMISSION],
    clinicalLine:
      "Acute kidney injury nursing focuses on intake/output, nephrotoxic medication review, electrolyte monitoring, and early provider notification.",
  },
];

// ── NAPLEX rules ────────────────────────────────────────────────────────────

export const NAPLEX_GUIDELINE_RULES: GuidelineRule[] = [
  {
    id: "diabetes",
    priority: 10,
    keywords: /diabetes|metformin|insulin|A1c|GLP-1|SGLT2|hypoglycemia/i,
    references: [ADA_STANDARDS, FDA_LABELING],
    clinicalLine: "Diabetes pharmacotherapy follows ADA Standards of Care and FDA labeling for dosing and monitoring.",
  },
  {
    id: "heart_failure_rx",
    priority: 9,
    keywords: /heart failure|HFrEF|spironolactone|eplerenone|sacubitril|GDMT/i,
    references: [ACC_AHA_CV, FDA_LABELING],
    clinicalLine: "Heart failure drug therapy aligns with ACC/AHA guideline-directed medical therapy and renal/electrolyte monitoring.",
  },
  {
    id: "antimicrobial",
    priority: 9,
    keywords: /antibiotic|antimicrobial|UTI|pneumonia|sepsis|culture/i,
    references: [IDSA_INFECTION, FDA_LABELING],
    clinicalLine: "Antimicrobial selection follows IDSA guidelines and local resistance patterns with culture-directed therapy when possible.",
  },
  {
    id: "anticoag_rx",
    priority: 8,
    keywords: /warfarin|DOAC|anticoagul|INR|bleeding risk/i,
    references: [FDA_LABELING, ACC_AHA_CV],
    clinicalLine: "Anticoagulant counseling includes indication, bleeding precautions, interactions, and monitoring per FDA labeling.",
  },
  {
    id: "compounding",
    priority: 8,
    keywords: /compounding|beyond-use date|BUD|sterile|nonsterile/i,
    references: [USP_COMPOUNDING, FDA_LABELING],
    clinicalLine: "Compounding assignments must meet applicable USP <795>/<797> standards and stability/BUD labeling.",
  },
  {
    id: "controlled_substance",
    priority: 9,
    keywords: /controlled substance|Schedule II|DEA|CII|partial fill|emergency supply/i,
    references: [DEA_CSA, FDA_LABELING],
    clinicalLine: "Controlled substance dispensing and counseling follow DEA schedule requirements and state/federal law.",
  },
  {
    id: "medication_safety_rx",
    priority: 7,
    keywords: /medication error|look-alike|high-alert|LASA|counseling/i,
    references: [ISMP_MED_SAFETY, FDA_LABELING],
    clinicalLine: "Medication safety counseling addresses high-alert risks, storage, administration, and monitoring per ISMP and FDA labeling.",
  },
];

export function getGuidelineRulesForField(fieldId: string): GuidelineRule[] {
  if (fieldId === "nursing") return NCLEX_GUIDELINE_RULES;
  if (fieldId === "pharmacy") return NAPLEX_GUIDELINE_RULES;
  return [];
}

export function getDefaultReferencesForField(fieldId: string): ExamReference[] {
  if (fieldId === "nursing") return [NCSBN_NCLEX_RN];
  if (fieldId === "pharmacy") return [FDA_LABELING];
  return [];
}
