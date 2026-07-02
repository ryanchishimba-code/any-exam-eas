/**
 * FSBPT NPTE-PT Content Outline — current for 2026.
 * Three dimensions: exam domains (study framing), process task areas, and body-system categories.
 *
 * Used for Roadmaps, generation prompts, toolkit copy, and blueprint high-yield tags.
 */
import type { NptePtContentCategoryId, NptePtTaskCategoryId } from "./types";

export type NptePtExamDomainId =
  | "clinical-practice"
  | "foundations"
  | "safety-professionalism"
  | "research-education";

export type NptePtExamDomain = {
  id: NptePtExamDomainId;
  label: string;
  weight: number;
  weightLabel: string;
  summary: string;
  focusAreas: string[];
};

export type NptePtTaskArea = {
  id: NptePtTaskCategoryId;
  label: string;
  weight: number;
  weightLabel: string;
  summary: string;
};

export type NptePtBodySystemArea = {
  id: NptePtContentCategoryId;
  label: string;
  weight: number;
  weightLabel: string;
  summary: string;
  topics: string[];
  highYieldTopics: string[];
  /** Subject IDs used for question tagging and bank quotas. */
  subjectIds: string[];
};

/** High-level exam domains — study-oriented framing aligned to FSBPT 2026. */
export const NPTE_PT_EXAM_DOMAINS: NptePtExamDomain[] = [
  {
    id: "clinical-practice",
    label: "Clinical Practice (Evaluation, Diagnosis, Prognosis, Intervention)",
    weight: 0.625,
    weightLabel: "~60–65%",
    summary:
      "Patient management across the lifespan — examination, clinical reasoning, intervention selection, and outcomes.",
    focusAreas: [
      "Case-based clinical decision-making",
      "Examination clusters & special tests",
      "Intervention progression & patient education",
      "Outcome measure interpretation",
    ],
  },
  {
    id: "foundations",
    label: "Foundations for Evaluation, Examination & Interventions",
    weight: 0.225,
    weightLabel: "~20–25%",
    summary:
      "Anatomy, physiology, pathophysiology, biomechanics, modalities, and equipment underpinning PT practice.",
    focusAreas: [
      "Anatomy & kinesiology — muscle actions, joint mechanics",
      "Biomechanics & gait analysis",
      "Therapeutic modalities & exercise prescription",
      "Motor control & motor learning theories",
    ],
  },
  {
    id: "safety-professionalism",
    label: "Safety, Professionalism & Practice Management",
    weight: 0.125,
    weightLabel: "~10–15%",
    summary:
      "Patient safety, ethics, legal issues, infection control, documentation, and billing.",
    focusAreas: [
      "Fall risk & contraindications to exercise",
      "Red flags & referral to physician",
      "Scope of practice & informed consent",
      "Evidence-based practice & outcome measures",
    ],
  },
  {
    id: "research-education",
    label: "Other (Research, Education, Consultation)",
    weight: 0.025,
    weightLabel: "Remaining",
    summary:
      "Evidence appraisal, research interpretation, patient education, and interprofessional consultation.",
    focusAreas: [
      "RCT appraisal & sensitivity/specificity",
      "Minimal clinically important difference (MCID)",
      "Patient education & health literacy",
    ],
  },
];

/** FSBPT process categories — how PTs apply knowledge on the exam. */
export const NPTE_PT_TASK_AREAS: NptePtTaskArea[] = [
  {
    id: "examination",
    label: "Physical Therapy Examination",
    weight: 0.18,
    weightLabel: "18%",
    summary: "Tests/measures, outcome tools, systems review, movement analysis, and special tests.",
  },
  {
    id: "evaluation-diagnosis-prognosis",
    label: "Evaluation, Differential Diagnosis & Prognosis",
    weight: 0.24,
    weightLabel: "24%",
    summary: "Clinical reasoning, diagnosis, prognosis, goal setting, and red-flag screening.",
  },
  {
    id: "interventions",
    label: "Interventions",
    weight: 0.21,
    weightLabel: "21%",
    summary: "Therapeutic exercise, manual therapy, modalities, patient education, and assistive devices.",
  },
];

/** FSBPT body-system and non-system content areas (weights normalized from official outline). */
export const NPTE_PT_BODY_SYSTEMS: NptePtBodySystemArea[] = [
  {
    id: "musculoskeletal",
    label: "Musculoskeletal System",
    weight: 0.278,
    weightLabel: "~28%",
    summary: "Highest-yield system — spine, shoulder, knee, hip, ankle, arthritis, fractures, manual therapy.",
    topics: [
      "Spine — low back pain, cervical radiculopathy, spinal stenosis, scoliosis",
      "Shoulder — rotator cuff, impingement, instability, special tests",
      "Knee — ACL, meniscus, patellofemoral pain, OA, TKA rehab",
      "Hip — fractures, OA, labral tears, THA precautions",
      "Ankle/Foot — sprains, plantar fasciitis, Achilles tendinopathy",
      "Arthritis — OA vs RA; fractures & post-surgical rehab",
      "Manual therapy & therapeutic exercise progression",
    ],
    highYieldTopics: [
      "low back pain",
      "rotator cuff",
      "ACL rehab",
      "TKA/THA",
      "manual therapy",
      "special tests",
      "gait deviations",
    ],
    subjectIds: ["musculoskeletal"],
  },
  {
    id: "neuromuscular-nervous",
    label: "Neuromuscular & Nervous Systems",
    weight: 0.236,
    weightLabel: "~24%",
    summary: "Stroke, SCI, MS, Parkinson, peripheral nerve injuries, balance & vestibular disorders.",
    topics: [
      "Stroke (CVA) & hemiplegia management",
      "Spinal cord injury — complete vs incomplete",
      "Multiple sclerosis & Parkinson's disease",
      "Peripheral nerve injuries — Bell's palsy, brachial plexus",
      "Guillain-Barré & myasthenia gravis",
      "Balance & vestibular disorders (BPPV)",
      "Gait training & motor learning",
    ],
    highYieldTopics: ["stroke", "SCI", "Parkinson", "vestibular", "balance", "gait training"],
    subjectIds: ["neuromuscular-nervous"],
  },
  {
    id: "cardiovascular-pulmonary",
    label: "Cardiovascular & Pulmonary Systems",
    weight: 0.139,
    weightLabel: "~14%",
    summary: "Cardiac rehab, pulmonary rehab, exercise physiology, vital signs, and contraindications.",
    topics: [
      "Cardiac rehab — post-MI, CABG, CHF",
      "Pulmonary rehab — COPD, pneumonia, restrictive disease",
      "Exercise physiology — METs, Borg scale",
      "Vital signs monitoring & contraindications to exercise",
    ],
    highYieldTopics: ["COPD", "CHF", "post-MI rehab", "METs", "oxygen titration"],
    subjectIds: ["cardiovascular-pulmonary"],
  },
  {
    id: "integumentary",
    label: "Integumentary System",
    weight: 0.056,
    weightLabel: "~6%",
    summary: "Wound care, pressure ulcers, burns, and diabetic foot ulcers.",
    topics: [
      "Wound healing phases",
      "Pressure ulcer staging & prevention",
      "Burns — classification & management",
      "Diabetic foot ulcers",
    ],
    highYieldTopics: ["pressure injuries", "wound care", "burns", "diabetic foot"],
    subjectIds: ["integumentary"],
  },
  {
    id: "system-interactions",
    label: "System Interactions",
    weight: 0.05,
    weightLabel: "~5%",
    summary: "Pediatrics, geriatrics, acute care, oncology, and multi-system comorbidity.",
    topics: [
      "Pediatrics — CP, torticollis, developmental delays, scoliosis",
      "Geriatrics — falls, frailty, osteoporosis, sarcopenia",
      "Women's health — pelvic floor, incontinence, pregnancy pain",
      "Oncology — lymphedema, cancer-related fatigue",
      "Acute care / ICU — early mobilization, lines & tubes",
    ],
    highYieldTopics: ["pediatrics", "geriatrics", "falls", "acute care", "oncology"],
    subjectIds: ["system-interactions"],
  },
  {
    id: "safety-protection",
    label: "Safety & Protection",
    weight: 0.033,
    weightLabel: "~3%",
    summary: "Fall risk, infection control, body mechanics, and exercise contraindications.",
    topics: [
      "Fall risk assessment",
      "Infection control & BBP precautions",
      "Body mechanics & safe transfers",
      "Contraindications & red flags for referral",
    ],
    highYieldTopics: ["falls", "infection control", "BBP", "contraindications"],
    subjectIds: ["safety-protection"],
  },
  {
    id: "therapeutic-modalities",
    label: "Therapeutic Modalities",
    weight: 0.028,
    weightLabel: "~3%",
    summary: "Ultrasound, TENS, heat/cold, iontophoresis — parameters and contraindications.",
    topics: [
      "Ultrasound parameters & contraindications",
      "TENS & NMES modes",
      "Heat & cold therapy",
      "Iontophoresis",
    ],
    highYieldTopics: ["ultrasound", "TENS", "NMES", "cryotherapy", "heat"],
    subjectIds: ["therapeutic-modalities"],
  },
  {
    id: "equipment-devices",
    label: "Equipment, Devices & Technologies",
    weight: 0.031,
    weightLabel: "~3%",
    summary: "Wheelchairs, ambulatory aids, prosthetics, and orthotics.",
    topics: [
      "Wheelchair fitting & prosthetic gait",
      "Ambulatory aids — cane, crutches, walker",
      "Orthotics & bracing",
    ],
    highYieldTopics: ["wheelchair", "ambulatory aids", "prosthetics", "orthotics"],
    subjectIds: ["equipment-devices"],
  },
  {
    id: "lymphatic",
    label: "Lymphatic System",
    weight: 0.031,
    weightLabel: "~3%",
    summary: "Lymphedema management, CDT, and compression.",
    topics: ["Lymphedema & CDT", "Compression bandaging", "Oncology-related lymphedema"],
    highYieldTopics: ["lymphedema", "CDT", "compression"],
    subjectIds: ["lymphatic"],
  },
  {
    id: "genitourinary",
    label: "Genitourinary System",
    weight: 0.019,
    weightLabel: "~2%",
    summary: "Incontinence, pelvic floor training, and pregnancy-related pain.",
    topics: [
      "Urinary incontinence types",
      "Pelvic floor muscle training",
      "Pregnancy-related pain",
    ],
    highYieldTopics: ["incontinence", "pelvic floor", "pregnancy"],
    subjectIds: ["genitourinary"],
  },
  {
    id: "metabolic-endocrine",
    label: "Metabolic & Endocrine Systems",
    weight: 0.028,
    weightLabel: "~3%",
    summary: "Diabetes exercise, osteoporosis, and obesity management.",
    topics: ["Diabetes & exercise", "Osteoporosis", "Obesity exercise prescription"],
    highYieldTopics: ["diabetes exercise", "osteoporosis"],
    subjectIds: ["metabolic-endocrine"],
  },
  {
    id: "gastrointestinal",
    label: "Gastrointestinal System",
    weight: 0.025,
    weightLabel: "~2%",
    summary: "Post-abdominal surgery mobility and pelvic floor GI presentations.",
    topics: ["Post-abdominal surgery", "Pelvic floor GI", "Core stabilization"],
    highYieldTopics: ["post-abdominal surgery", "pelvic floor"],
    subjectIds: ["gastrointestinal"],
  },
  {
    id: "professional-responsibilities",
    label: "Professional Responsibilities",
    weight: 0.025,
    weightLabel: "~2%",
    summary: "Ethics, scope, documentation, supervision, and billing.",
    topics: ["Scope of practice", "Ethics & consent", "Documentation", "Billing"],
    highYieldTopics: ["ethics", "documentation", "supervision", "scope"],
    subjectIds: ["professional-responsibilities"],
  },
  {
    id: "research-evidence",
    label: "Research & Evidence-Based Practice",
    weight: 0.022,
    weightLabel: "~2%",
    summary: "Sensitivity/specificity, outcome measures, MCID, and RCT appraisal.",
    topics: [
      "Sensitivity & specificity",
      "Outcome measures & MCID",
      "RCT appraisal",
    ],
    highYieldTopics: ["sensitivity", "specificity", "outcome measures", "RCT appraisal"],
    subjectIds: ["research-evidence"],
  },
];

/** Cross-cutting high-yield focus for study planning and marketing copy. */
export const NPTE_PT_HIGH_YIELD_FOCUS_AREAS = [
  "Clinical decision-making — case-based examination, intervention, and progression questions",
  "Red flags & referral — when to refer to MD before PT progression",
  "Special tests — shoulder, knee, spine clusters with interpretation",
  "Exercise prescription — FITT principles, METs, Borg RPE, contraindications",
  "Pediatric & geriatric considerations across all body systems",
  "Musculoskeletal & neuromuscular — largest combined exam weight (~52%)",
] as const;

/** Product capabilities aligned to NPTE-PT prep needs. */
export const NPTE_PT_PLATFORM_STUDY_FEATURES = [
  "Clinical vignettes — patient case → best examination, intervention, or progression",
  "System-based modules with differential diagnosis trees",
  "Safety & red-flag emphasis in every mixed block",
  "Full-length 250-question NPTE-PT simulations (180 scored)",
  "Roadmap tracking by FSBPT body system and process task area",
  "Image-rich contexts for gait analysis, special tests, and exercise technique",
] as const;

export const NPTE_PT_OUTLINE_SOURCE =
  "FSBPT NPTE-PT Test Content Outline (current for 2026) — 250 questions, 5 hours";

export function getNptePtExamDomain(id: NptePtExamDomainId): NptePtExamDomain | undefined {
  return NPTE_PT_EXAM_DOMAINS.find((d) => d.id === id);
}

export function getNptePtTaskArea(id: NptePtTaskCategoryId): NptePtTaskArea | undefined {
  return NPTE_PT_TASK_AREAS.find((t) => t.id === id);
}

export function getNptePtBodySystem(
  id: NptePtContentCategoryId
): NptePtBodySystemArea | undefined {
  return NPTE_PT_BODY_SYSTEMS.find((b) => b.id === id);
}
