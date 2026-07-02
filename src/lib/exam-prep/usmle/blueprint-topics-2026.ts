/**
 * USMLE Steps 1, 2 CK, and 3 — granular high-yield topic registry (2026).
 * Emphasizes clinical application, diagnosis, management, and mechanisms of disease.
 */
import type { UsmleStepLevel } from "./types";

export type Usmle2026Topic = {
  slug: string;
  label: string;
};

export type Usmle2026TopicGroup = {
  /** Blueprint category id (organ system or discipline bucket). */
  categoryId: string;
  label: string;
  stepLevel: UsmleStepLevel;
  topics: Usmle2026Topic[];
  /** Step 1 basic-science discipline emphasis. */
  discipline?: string;
};

function topic(slug: string, label: string): Usmle2026Topic {
  return { slug, label };
}

/** Step 1 discipline priority (pathology highest yield). */
export const USMLE_STEP1_DISCIPLINES = [
  { slug: "pathology", label: "Pathology (most important)", weight: 0.22 },
  { slug: "pharmacology", label: "Pharmacology", weight: 0.18 },
  { slug: "physiology", label: "Physiology", weight: 0.16 },
  { slug: "biochemistry", label: "Biochemistry", weight: 0.14 },
  { slug: "microbiology-immunology", label: "Microbiology & Immunology", weight: 0.14 },
  { slug: "anatomy-embryology", label: "Anatomy & Embryology", weight: 0.08 },
  { slug: "behavioral-biostatistics", label: "Behavioral Sciences & Biostatistics", weight: 0.08 },
] as const;

/** Granular topics by blueprint category — Step 1 (basic sciences / mechanisms). */
export const USMLE_STEP1_TOPIC_GROUPS: Usmle2026TopicGroup[] = [
  {
    categoryId: "cardiovascular",
    label: "Cardiovascular",
    stepLevel: "step1",
    discipline: "pathology",
    topics: [
      topic("atherosclerosis-mechanisms", "Atherosclerosis & plaque rupture mechanisms"),
      topic("heart-failure-pathophysiology", "Heart failure pathophysiology (HFrEF/HFpEF)"),
      topic("hypertension-mechanisms", "Hypertension mechanisms & end-organ damage"),
      topic("acs-pathophysiology", "ACS pathophysiology & ECG correlates"),
      topic("arrhythmia-electrophysiology", "Arrhythmia electrophysiology"),
      topic("valvular-disease-mechanisms", "Valvular disease mechanisms"),
    ],
  },
  {
    categoryId: "respiratory-renal",
    label: "Respiratory / Renal",
    stepLevel: "step1",
    discipline: "pathology",
    topics: [
      topic("ards-pathology", "ARDS pathology & V/Q mismatch"),
      topic("asthma-copd-pathology", "Asthma & COPD pathology"),
      topic("glomerular-diseases", "Glomerular diseases (nephritic vs nephrotic)"),
      topic("acid-base-physiology", "Acid-base physiology & compensation"),
      topic("aki-mechanisms", "AKI mechanisms & tubular injury"),
      topic("pe-pathophysiology", "Pulmonary embolism pathophysiology"),
    ],
  },
  {
    categoryId: "gastrointestinal",
    label: "Gastrointestinal",
    stepLevel: "step1",
    discipline: "pathology",
    topics: [
      topic("liver-pathology", "Liver pathology (cirrhosis, hepatitis, cholestasis)"),
      topic("ibd-mechanisms", "IBD mechanisms (Crohn vs UC)"),
      topic("malabsorption", "Malabsorption syndromes"),
      topic("pancreatitis-enzymes", "Pancreatitis & enzyme markers"),
      topic("gi-bleeding-sources", "GI bleeding sources & histology"),
      topic("hepatitis-serology", "Hepatitis serology interpretation"),
    ],
  },
  {
    categoryId: "reproductive-endocrine",
    label: "Reproductive / Endocrine",
    stepLevel: "step1",
    discipline: "pathology",
    topics: [
      topic("diabetes-pathophysiology", "Diabetes pathophysiology (T1/T2, DKA biochemistry)"),
      topic("thyroid-disorders", "Thyroid disorders (hyper/hypothyroid mechanisms)"),
      topic("adrenal-disorders", "Adrenal disorders (Addison, Cushing, pheochromocytoma)"),
      topic("pcos-endocrine", "PCOS & reproductive endocrine"),
      topic("preeclampsia-mechanism", "Preeclampsia mechanism"),
      topic("contraception-pharmacology", "Contraception pharmacology"),
    ],
  },
  {
    categoryId: "hematology-immunology",
    label: "Hematology / Immunology",
    stepLevel: "step1",
    discipline: "pathology",
    topics: [
      topic("leukemia-classification", "Leukemia classification & markers"),
      topic("anemia-workup", "Anemia workup & mechanisms"),
      topic("tumor-markers", "Tumor markers & paraneoplastic syndromes"),
      topic("hypersensitivity", "Hypersensitivity reactions (I–IV)"),
      topic("transplant-immunology", "Transplant immunology & rejection"),
      topic("coagulation-cascade", "Coagulation cascade & bleeding disorders"),
    ],
  },
  {
    categoryId: "musculoskeletal",
    label: "Musculoskeletal / Connective Tissue",
    stepLevel: "step1",
    discipline: "pathology",
    topics: [
      topic("rheumatoid-arthritis", "Rheumatoid arthritis mechanisms"),
      topic("lupus-pathology", "Systemic lupus erythematosus"),
      topic("gout-crystals", "Gout & crystal arthropathies"),
      topic("osteoporosis-bone", "Osteoporosis & bone remodeling"),
      topic("myopathies", "Myopathies & inflammatory muscle disease"),
      topic("collagen-disorders", "Collagen & connective tissue disorders"),
    ],
  },
  {
    categoryId: "behavioral-nervous",
    label: "Behavioral / Nervous",
    stepLevel: "step1",
    discipline: "pathology",
    topics: [
      topic("stroke-localization", "Stroke localization & vascular territories"),
      topic("ms-pathology", "Multiple sclerosis pathology"),
      topic("neurodegenerative", "Neurodegenerative disease (Alzheimer, Parkinson)"),
      topic("seizure-mechanisms", "Seizure mechanisms & AED pharmacology"),
      topic("cranial-nerve-lesions", "Cranial nerve lesions"),
      topic("psychiatric-pharmacology", "Psychiatric pharmacology (depression, psychosis)"),
    ],
  },
  {
    categoryId: "pharmacology-microbiology",
    label: "Pharmacology / Microbiology",
    stepLevel: "step1",
    discipline: "pharmacology",
    topics: [
      topic("drug-moa-side-effects", "Drug MOA & high-yield side effects"),
      topic("autonomic-pharmacology", "Autonomic pharmacology"),
      topic("antibiotic-mechanisms", "Antibiotic mechanisms & coverage"),
      topic("antiviral-agents", "Antiviral agents"),
      topic("gram-positive-organisms", "High-yield gram-positive organisms"),
      topic("gram-negative-fungi-parasites", "Gram-negative, fungi & parasites"),
    ],
  },
  {
    categoryId: "biochemistry-genetics",
    label: "Biochemistry / Genetics / Biostatistics",
    stepLevel: "step1",
    discipline: "biochemistry",
    topics: [
      topic("metabolic-pathways", "Metabolic pathways (glycolysis, urea cycle)"),
      topic("inborn-errors", "Inborn errors of metabolism"),
      topic("lysosomal-storage", "Lysosomal storage diseases"),
      topic("dna-repair-genetics", "DNA repair & inheritance patterns"),
      topic("study-designs", "Study designs (RCT, cohort, case-control)"),
      topic("sensitivity-specificity", "Sensitivity, specificity, PPV/NPV, p-values"),
    ],
  },
];

/** Step 2 CK — diagnosis, workup, initial management (prioritize this step). */
export const USMLE_STEP2_TOPIC_GROUPS: Usmle2026TopicGroup[] = [
  {
    categoryId: "internal-medicine",
    label: "Internal Medicine",
    stepLevel: "step2",
    topics: [
      topic("acs-management", "ACS (STEMI/NSTEMI) diagnosis & management"),
      topic("chf-management", "CHF exacerbation & GDMT"),
      topic("arrhythmias-management", "Arrhythmias (AF, VT, bradyarrhythmias)"),
      topic("valvular-disease-clinical", "Valvular disease workup & management"),
      topic("pneumonia-workup", "Pneumonia diagnosis & antibiotic selection"),
      topic("pe-workup", "Pulmonary embolism workup & anticoagulation"),
      topic("copd-asthma-exacerbation", "COPD/asthma exacerbation management"),
      topic("gi-bleed-management", "GI bleed workup & initial management"),
      topic("pancreatitis-hepatitis", "Pancreatitis, hepatitis & cirrhosis"),
      topic("aki-ckd-electrolytes", "AKI vs CKD & electrolyte disorders"),
      topic("nephrotic-nephritic", "Nephrotic vs nephritic syndrome"),
      topic("diabetes-dka-management", "Diabetes management, DKA/HHS"),
      topic("thyroid-storm", "Thyroid storm & myxedema coma"),
      topic("sepsis-bundles", "Sepsis recognition & bundles"),
      topic("hiv-opportunistic", "HIV & opportunistic infections"),
      topic("rheumatology-autoimmune", "Rheumatology & autoimmune (RA, lupus, vasculitis)"),
      topic("stroke-management", "Stroke diagnosis & acute management"),
      topic("seizures-headaches", "Seizures & dangerous headache red flags"),
      topic("dementia-workup", "Dementia workup & reversible causes"),
      topic("preventive-screening", "Preventive screening (cancer, AAA, vaccines)"),
    ],
  },
  {
    categoryId: "surgery-acute-care",
    label: "Surgery / Acute Care",
    stepLevel: "step2",
    topics: [
      topic("pre-post-op-care", "Pre-op/post-op care & complications"),
      topic("trauma-atls", "Trauma (ATLS priorities)"),
      topic("appendicitis-cholecystitis", "Appendicitis & cholecystitis"),
      topic("bowel-obstruction", "Bowel obstruction & acute abdomen"),
      topic("hernia-management", "Hernias & surgical emergencies"),
      topic("burns-management", "Burns & wound management"),
    ],
  },
  {
    categoryId: "pediatrics",
    label: "Pediatrics",
    stepLevel: "step2",
    topics: [
      topic("developmental-milestones", "Developmental milestones"),
      topic("pediatric-infections", "Common pediatric infections"),
      topic("congenital-heart-disease", "Congenital heart disease"),
      topic("vaccination-schedules", "Vaccination schedules"),
      topic("child-abuse-red-flags", "Child abuse red flags"),
      topic("febrile-infant", "Febrile infant workup"),
    ],
  },
  {
    categoryId: "obgyn",
    label: "OB/GYN",
    stepLevel: "step2",
    topics: [
      topic("prenatal-care", "Prenatal care & screening"),
      topic("preeclampsia-eclampsia", "Preeclampsia/eclampsia management"),
      topic("labor-delivery", "Labor & delivery complications"),
      topic("gyn-cancers", "Gynecologic cancers workup"),
      topic("contraception", "Contraception selection"),
      topic("menstrual-disorders", "Menstrual disorders & abnormal bleeding"),
    ],
  },
  {
    categoryId: "psychiatry",
    label: "Psychiatry",
    stepLevel: "step2",
    topics: [
      topic("depression-bipolar", "Depression & bipolar disorder"),
      topic("schizophrenia-psychosis", "Schizophrenia & psychosis workup"),
      topic("anxiety-disorders", "Anxiety disorders"),
      topic("suicide-risk", "Suicide risk assessment"),
      topic("substance-use-disorders", "Substance use disorders & withdrawal"),
      topic("personality-disorders", "Personality disorders"),
    ],
  },
];

/** Step 3 — management emphasis, CCS-style case simulations. */
export const USMLE_STEP3_TOPIC_GROUPS: Usmle2026TopicGroup[] = [
  {
    categoryId: "internal-medicine",
    label: "Internal Medicine (ambulatory & inpatient)",
    stepLevel: "step3",
    topics: [
      topic("ambulatory-chronic-care", "Ambulatory chronic disease management"),
      topic("inpatient-orders", "Inpatient orders & monitoring"),
      topic("next-best-step", "Next best step in management"),
      topic("lab-interpretation", "Lab interpretation & trending"),
      topic("cost-effective-care", "Cost-effective care & resource use"),
    ],
  },
  {
    categoryId: "surgery",
    label: "Surgery / Emergency",
    stepLevel: "step3",
    topics: [
      topic("emergency-management", "Emergency management & stabilization"),
      topic("post-op-fever", "Post-op fever & complications"),
      topic("acute-abdomen-ccs", "Acute abdomen CCS workup"),
    ],
  },
  {
    categoryId: "ccs",
    label: "CCS-Style Case Simulations",
    stepLevel: "step3",
    topics: [
      topic("ccs-initial-workup", "CCS: initial workup & diagnostics"),
      topic("ccs-monitoring-escalation", "CCS: monitoring, escalation & disposition"),
      topic("ccs-discharge-planning", "CCS: discharge planning & follow-up"),
      topic("ccs-orders-sequence", "CCS: timed orders & clinical trajectory"),
    ],
  },
  {
    categoryId: "biostatistics",
    label: "Biostatistics & Epidemiology",
    stepLevel: "step3",
    topics: [
      topic("nnt-arr", "NNT, ARR, RRR & absolute risk"),
      topic("sensitivity-specificity-lr", "Sensitivity, specificity & likelihood ratios"),
      topic("study-design-appraisal", "Study design appraisal & bias"),
    ],
  },
  {
    categoryId: "ethics",
    label: "Ethics & Professionalism",
    stepLevel: "step3",
    topics: [
      topic("informed-consent-capacity", "Informed consent & capacity"),
      topic("confidentiality-reporting", "Confidentiality & mandatory reporting"),
      topic("end-of-life-ethics", "End-of-life & advance directives"),
    ],
  },
  {
    categoryId: "pediatrics",
    label: "Pediatrics",
    stepLevel: "step3",
    topics: [
      topic("well-child-preventive", "Well-child & preventive pediatrics"),
      topic("pediatric-ccs", "Pediatric CCS scenarios"),
    ],
  },
  {
    categoryId: "obgyn",
    label: "OB/GYN",
    stepLevel: "step3",
    topics: [
      topic("ob-labor-ccs", "OB labor & delivery CCS"),
      topic("postpartum-complications", "Postpartum complications"),
    ],
  },
  {
    categoryId: "psychiatry",
    label: "Psychiatry",
    stepLevel: "step3",
    topics: [
      topic("psychiatric-hospitalization", "Psychiatric hospitalization criteria"),
      topic("medication-monitoring", "Psychotropic monitoring & adherence"),
    ],
  },
];

/** Cross-cutting themes tested across all USMLE steps. */
export const USMLE_CROSS_CUTTING_TOPICS: Usmle2026Topic[] = [
  topic("biostatistics-interpretation", "Biostatistics & study interpretation"),
  topic("ethics-professionalism", "Ethics & professionalism (consent, confidentiality)"),
  topic("sdoh-health-equity", "Social determinants of health & health equity"),
  topic("diagnostic-test-interpretation", "Diagnostic test interpretation (labs, imaging, EKG)"),
  topic("pharmacology-interactions", "Pharmacology (side effects, contraindications, interactions)"),
  topic("emergency-acls", "Emergency medicine (ACLS, common emergencies)"),
];

function buildRotationMap(
  groups: Usmle2026TopicGroup[]
): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const g of groups) {
    map[g.categoryId] = g.topics.map((t) => t.slug);
  }
  return map;
}

export const USMLE_2026_TOPIC_ROTATION: Record<UsmleStepLevel, Record<string, string[]>> = {
  step1: buildRotationMap(USMLE_STEP1_TOPIC_GROUPS),
  step2: buildRotationMap(USMLE_STEP2_TOPIC_GROUPS),
  step3: buildRotationMap(USMLE_STEP3_TOPIC_GROUPS),
};

const TOPIC_BY_SLUG = new Map<string, Usmle2026Topic & { categoryId: string; stepLevel: UsmleStepLevel }>();
for (const groups of [USMLE_STEP1_TOPIC_GROUPS, USMLE_STEP2_TOPIC_GROUPS, USMLE_STEP3_TOPIC_GROUPS]) {
  for (const g of groups) {
    for (const t of g.topics) {
      TOPIC_BY_SLUG.set(t.slug, { ...t, categoryId: g.categoryId, stepLevel: g.stepLevel });
    }
  }
}

export function pickUsmle2026BlueprintTopic(
  stepLevel: UsmleStepLevel,
  categoryId: string,
  slotIndex: number,
  examSeed: number
): string {
  const rotation = USMLE_2026_TOPIC_ROTATION[stepLevel][categoryId];
  if (!rotation?.length) {
    return USMLE_CROSS_CUTTING_TOPICS[(slotIndex + examSeed) % USMLE_CROSS_CUTTING_TOPICS.length]!.slug;
  }
  return rotation[(slotIndex + examSeed) % rotation.length]!;
}

export function labelForUsmle2026TopicSlug(slug: string): string {
  return TOPIC_BY_SLUG.get(slug)?.label ?? slug.replace(/-/g, " ");
}

export function getUsmle2026Topic(slug: string) {
  return TOPIC_BY_SLUG.get(slug);
}

export function allUsmle2026TopicSlugs(): string[] {
  return [...TOPIC_BY_SLUG.keys()];
}

export function listUsmle2026TopicsForCategory(
  stepLevel: UsmleStepLevel,
  categoryId: string
): Usmle2026Topic[] {
  const groups =
    stepLevel === "step1"
      ? USMLE_STEP1_TOPIC_GROUPS
      : stepLevel === "step3"
        ? USMLE_STEP3_TOPIC_GROUPS
        : USMLE_STEP2_TOPIC_GROUPS;
  return groups.find((g) => g.categoryId === categoryId)?.topics ?? [];
}

/** Compact catalog for LLM generation prompts. */
export function buildUsmle2026TopicCatalogBlock(stepLevel: UsmleStepLevel): string {
  const groups =
    stepLevel === "step1"
      ? USMLE_STEP1_TOPIC_GROUPS
      : stepLevel === "step3"
        ? USMLE_STEP3_TOPIC_GROUPS
        : USMLE_STEP2_TOPIC_GROUPS;
  const stepLabel =
    stepLevel === "step1" ? "Step 1" : stepLevel === "step3" ? "Step 3" : "Step 2 CK";
  const lines = groups.map((g) => {
    const topicList = g.topics.map((t) => `${t.slug}: ${t.label}`).join("; ");
    return `${g.label} (${g.categoryId}): ${topicList}`;
  });
  const crossCut = USMLE_CROSS_CUTTING_TOPICS.map((t) => t.label).join("; ");
  return [
    `USMLE ${stepLabel} HIGH-YIELD TOPIC CATALOG (assign blueprintTopic slug; case-based vignettes required):`,
    ...lines,
    `Cross-cutting (all steps): ${crossCut}`,
  ].join("\n");
}

/** Platform content strategy — embed in generation prompts. */
export const USMLE_PLATFORM_CONTENT_GUIDANCE = [
  "Prioritize Step 2 CK-style clinical vignettes: diagnosis, workup, and initial management.",
  "Use case-based vignettes with age, vitals, labs, and imaging findings — not pure recall.",
  "Step 3 items: emphasize next best step, monitoring orders, disposition, and cost-effective care.",
  "Include CCS-style sequential management when format=sequential or step3.",
  "Integrate pharmacology and biostatistics within clinical scenarios when possible.",
  "Describe exhibits (EKG, histology, imaging) in chartData when format=image_based.",
].join("\n");
