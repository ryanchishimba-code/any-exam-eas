/**
 * FSBPT NPTE-PT high-yield topic registry (2026) — body systems, non-systems,
 * and cross-cutting areas for AnyExamEasy generation rotation.
 *
 * Musculoskeletal and neuromuscular modules are expanded (very high yield).
 */
import type { NptePtContentCategoryId, NptePtTaskCategoryId } from "./types";

export type NptePt2026Topic = {
  slug: string;
  label: string;
};

export type NptePt2026TopicGroup = {
  categoryId: NptePtContentCategoryId;
  label: string;
  /** Very high yield systems get heavier rotation in generation. */
  yield: "very-high" | "high" | "standard";
  topics: NptePt2026Topic[];
};

function topic(slug: string, label: string): NptePt2026Topic {
  return { slug, label };
}

/** Granular topics by FSBPT content category — 2026 high-yield registry. */
export const NPTE_PT_2026_TOPIC_GROUPS: NptePt2026TopicGroup[] = [
  {
    categoryId: "musculoskeletal",
    label: "Musculoskeletal System",
    yield: "very-high",
    topics: [
      topic("lumbar-low-back-pain", "Low back pain — red flags, McKenzie, stabilization"),
      topic("cervical-radiculopathy-stenosis", "Cervical radiculopathy & spinal stenosis"),
      topic("scoliosis-posture", "Scoliosis assessment & postural management"),
      topic("rotator-cuff-impingement", "Rotator cuff pathology & shoulder impingement"),
      topic("shoulder-instability-special-tests", "Shoulder instability — special tests (Apprehension, Jobe)"),
      topic("acl-rehab-phases", "ACL injury & post-reconstruction rehab phases"),
      topic("meniscus-patellofemoral", "Meniscus injury & patellofemoral pain syndrome"),
      topic("knee-oa-tka", "Knee osteoarthritis & TKA post-op protocols"),
      topic("hip-fracture-tha", "Hip fractures & THA precautions/progression"),
      topic("hip-labral-oa", "Hip labral tears & hip OA management"),
      topic("ankle-sprain-achilles", "Ankle sprains, plantar fasciitis & Achilles tendinopathy"),
      topic("oa-vs-ra-arthritis", "Osteoarthritis vs rheumatoid arthritis — PT implications"),
      topic("fracture-post-surgical-rehab", "Fractures & post-surgical rehab progression"),
      topic("manual-therapy-indications", "Manual therapy techniques & indications"),
      topic("therapeutic-exercise-progression", "Therapeutic exercise — strength, endurance, proprioception"),
      topic("special-tests-shoulder-knee-spine", "Special tests — shoulder, knee, spine clusters"),
      topic("gait-deviations-biomechanics", "Gait deviations & lower-extremity biomechanics"),
    ],
  },
  {
    categoryId: "neuromuscular-nervous",
    label: "Neuromuscular & Nervous Systems",
    yield: "very-high",
    topics: [
      topic("stroke-cva-hemiplegia", "Stroke (CVA) & hemiplegia management"),
      topic("sci-complete-incomplete", "Spinal cord injury — complete vs incomplete lesions"),
      topic("tbi-concussion-rehab", "Traumatic brain injury & concussion rehab stages"),
      topic("multiple-sclerosis", "Multiple sclerosis — fatigue, heat sensitivity, progression"),
      topic("parkinsons-disease", "Parkinson's disease — cueing, freezing, fall prevention"),
      topic("peripheral-nerve-bells-plexus", "Peripheral nerve injuries — Bell's palsy, brachial plexus"),
      topic("guillain-barre-myasthenia", "Guillain-Barré & myasthenia gravis"),
      topic("balance-vestibular-disorders", "Balance & vestibular disorders — BPPV, central vs peripheral"),
      topic("gait-training-neuro", "Gait training — neuroplasticity, task-specific practice"),
      topic("motor-control-learning", "Motor control & motor learning theories"),
      topic("wheelchair-mobility-sci", "Wheelchair mobility & SCI functional levels"),
      topic("neuro-outcome-measures", "Neuro outcome measures — Berg, TUG, FIM, 6MWT"),
    ],
  },
  {
    categoryId: "cardiovascular-pulmonary",
    label: "Cardiovascular & Pulmonary Systems",
    yield: "high",
    topics: [
      topic("post-mi-cardiac-rehab", "Post-MI cardiac rehabilitation phases"),
      topic("cabg-valve-surgery-rehab", "Post-CABG & valve surgery rehab"),
      topic("chf-exercise-prescription", "CHF — exercise prescription & activity guidelines"),
      topic("copd-pulmonary-rehab", "COPD pulmonary rehab & breathing techniques"),
      topic("pneumonia-restrictive-disease", "Pneumonia & restrictive lung disease"),
      topic("exercise-physiology-mets-borg", "Exercise physiology — METs, Borg RPE scale"),
      topic("vital-signs-contraindications", "Vital signs monitoring & contraindications to exercise"),
      topic("oxygen-titration-spo2", "Oxygen titration & SpO₂ targets"),
      topic("airway-clearance-techniques", "Airway clearance — PEP, flutter, postural drainage"),
    ],
  },
  {
    categoryId: "integumentary",
    label: "Integumentary System",
    yield: "high",
    topics: [
      topic("wound-healing-phases", "Wound healing phases & tissue types"),
      topic("pressure-ulcer-staging", "Pressure ulcer staging & prevention"),
      topic("burns-classification-rehab", "Burns — classification & contracture prevention"),
      topic("diabetic-foot-ulcers", "Diabetic foot ulcers — offloading & vascular screening"),
      topic("wound-dressing-selection", "Wound dressing selection & debridement principles"),
    ],
  },
  {
    categoryId: "metabolic-endocrine",
    label: "Metabolic & Endocrine Systems",
    yield: "standard",
    topics: [
      topic("diabetes-exercise-glucose", "Diabetes — exercise & glucose management"),
      topic("osteoporosis-weight-bearing", "Osteoporosis — weight-bearing & fall prevention"),
      topic("obesity-exercise-prescription", "Obesity — exercise prescription & energy balance"),
    ],
  },
  {
    categoryId: "gastrointestinal",
    label: "Gastrointestinal System",
    yield: "standard",
    topics: [
      topic("post-abdominal-surgery-mobility", "Post-abdominal surgery — early mobilization"),
      topic("pelvic-floor-gi", "Pelvic floor dysfunction — GI-related presentations"),
      topic("core-stabilization-post-op", "Core stabilization after abdominal procedures"),
    ],
  },
  {
    categoryId: "genitourinary",
    label: "Genitourinary System",
    yield: "high",
    topics: [
      topic("urinary-incontinence-types", "Urinary incontinence — stress, urge, mixed"),
      topic("pelvic-floor-training", "Pelvic floor muscle training & biofeedback"),
      topic("pregnancy-related-pain", "Pregnancy-related pain — diastasis, SI joint, posture"),
      topic("post-prostatectomy-rehab", "Post-prostatectomy pelvic floor rehab"),
    ],
  },
  {
    categoryId: "lymphatic",
    label: "Lymphatic System",
    yield: "standard",
    topics: [
      topic("lymphedema-cdt", "Lymphedema — complete decongestive therapy (CDT)"),
      topic("compression-bandaging", "Compression bandaging & garment selection"),
      topic("oncology-lymphedema", "Oncology-related lymphedema management"),
    ],
  },
  {
    categoryId: "system-interactions",
    label: "System Interactions",
    yield: "high",
    topics: [
      topic("pediatrics-cp-torticollis", "Pediatrics — cerebral palsy, torticollis, developmental delays"),
      topic("pediatric-scoliosis", "Pediatric scoliosis & growth considerations"),
      topic("geriatrics-falls-frailty", "Geriatrics — falls prevention, frailty, sarcopenia"),
      topic("acute-care-icu-mobilization", "Acute care / ICU — early mobilization, lines & tubes"),
      topic("oncology-fatigue-deconditioning", "Oncology — cancer-related fatigue & deconditioning"),
      topic("comorbidity-exercise-modification", "Multi-system comorbidity & exercise modification"),
    ],
  },
  {
    categoryId: "equipment-devices",
    label: "Equipment, Devices & Technologies",
    yield: "standard",
    topics: [
      topic("wheelchair-prosthetics", "Wheelchair fitting & prosthetic gait training"),
      topic("ambulatory-aids-selection", "Ambulatory aids — cane, crutches, walker selection"),
      topic("orthotics-bracing", "Orthotics & bracing — indications and fit"),
      topic("adaptive-equipment-adl", "Adaptive equipment for ADL independence"),
    ],
  },
  {
    categoryId: "therapeutic-modalities",
    label: "Therapeutic Modalities",
    yield: "high",
    topics: [
      topic("ultrasound-parameters", "Ultrasound — parameters, depth, contraindications"),
      topic("tens-nmes", "TENS & NMES — modes, indications, electrode placement"),
      topic("heat-cold-therapy", "Heat & cold therapy — acute vs chronic indications"),
      topic("iontophoresis-phonophoresis", "Iontophoresis & phonophoresis"),
      topic("modality-contraindications", "Modality contraindications — pregnancy, malignancy, sensation"),
    ],
  },
  {
    categoryId: "safety-protection",
    label: "Safety & Protection",
    yield: "high",
    topics: [
      topic("fall-risk-assessment", "Fall risk assessment — TUG, Berg, Morse scale"),
      topic("infection-control-bbp", "Infection control & bloodborne pathogen precautions"),
      topic("body-mechanics-transfers", "Body mechanics & safe patient transfers"),
      topic("exercise-contraindications", "Contraindications to exercise & red flags for referral"),
      topic("standard-precautions-isolation", "Standard precautions & isolation protocols"),
    ],
  },
  {
    categoryId: "professional-responsibilities",
    label: "Professional Responsibilities",
    yield: "standard",
    topics: [
      topic("scope-of-practice", "Scope of practice & supervision requirements"),
      topic("informed-consent-documentation", "Informed consent & documentation standards"),
      topic("ethics-boundaries", "Ethical issues — boundaries, abandonment, dual relationships"),
      topic("billing-reimbursement", "Billing, reimbursement & coding basics"),
    ],
  },
  {
    categoryId: "research-evidence",
    label: "Research & Evidence-Based Practice",
    yield: "standard",
    topics: [
      topic("sensitivity-specificity", "Sensitivity, specificity & likelihood ratios"),
      topic("outcome-measures-mcid", "Outcome measures & minimal clinically important difference"),
      topic("rct-appraisal", "RCT appraisal & levels of evidence"),
      topic("clinical-prediction-rules", "Clinical prediction rules & guideline application"),
    ],
  },
];

/** Cross-cutting high-yield areas spanning all systems. */
export const NPTE_PT_CROSS_CUTTING_TOPICS: NptePt2026Topic[] = [
  topic("red-flags-referral", "Red flags & when to refer to physician"),
  topic("differential-diagnosis-pt", "Differential diagnosis in PT context"),
  topic("exercise-prescription-fitt", "Exercise prescription — FITT principles"),
  topic("pain-science-acute-chronic", "Pain science — acute vs chronic, central sensitization"),
  topic("anatomy-kinesiology-gait", "Anatomy & kinesiology — muscle actions, joint mechanics, gait analysis"),
];

/** AnyExamEasy content strategy for NPTE-PT generation prompts. */
export const NPTE_PT_PLATFORM_CONTENT_GUIDANCE = [
  "Focus on clinical decision-making and case-based vignettes (90%+ scenario format).",
  "Emphasize safety and red flags — heavily tested on NPTE-PT.",
  "Include video/image-rich contexts for gait analysis, special tests, and exercise technique when possible.",
  "Build differential diagnosis reasoning — best examination, intervention, or progression.",
  "Mix lifespan presentations: pediatric, adult, geriatric, acute-care, and outpatient.",
  "Pairs with PANCE/AANP content for users cross-preparing in rehab and primary care.",
].join("\n");

const TOPIC_ROTATION: Record<string, string[]> = {};
for (const group of NPTE_PT_2026_TOPIC_GROUPS) {
  TOPIC_ROTATION[group.categoryId] = group.topics.map((t) => t.slug);
}

const TOPIC_BY_SLUG = new Map<
  string,
  NptePt2026Topic & { categoryId: NptePtContentCategoryId }
>();
for (const group of NPTE_PT_2026_TOPIC_GROUPS) {
  for (const t of group.topics) {
    TOPIC_BY_SLUG.set(t.slug, { ...t, categoryId: group.categoryId });
  }
}
for (const t of NPTE_PT_CROSS_CUTTING_TOPICS) {
  TOPIC_BY_SLUG.set(t.slug, { ...t, categoryId: "system-interactions" });
}

/** Yield-weighted rotation — MSK and neuro appear more frequently. */
const CATEGORY_YIELD_WEIGHT: Record<NptePtContentCategoryId, number> = {
  musculoskeletal: 4,
  "neuromuscular-nervous": 4,
  "cardiovascular-pulmonary": 2,
  integumentary: 2,
  "metabolic-endocrine": 1,
  gastrointestinal: 1,
  genitourinary: 2,
  lymphatic: 1,
  "system-interactions": 2,
  "equipment-devices": 1,
  "therapeutic-modalities": 2,
  "safety-protection": 2,
  "professional-responsibilities": 1,
  "research-evidence": 1,
};

export const NPTE_PT_CONTENT_CATEGORY_IDS = NPTE_PT_2026_TOPIC_GROUPS.map(
  (g) => g.categoryId
);

export function pickNptePt2026BlueprintTopic(
  contentCategory: NptePtContentCategoryId,
  slotIndex: number,
  seed = 0
): string {
  const rotation = TOPIC_ROTATION[contentCategory];
  if (!rotation?.length) {
    return NPTE_PT_CROSS_CUTTING_TOPICS[(slotIndex + seed) % NPTE_PT_CROSS_CUTTING_TOPICS.length]!
      .slug;
  }
  return rotation[(slotIndex + seed) % rotation.length]!;
}

export function pickNptePt2026ContentCategory(
  slotIndex: number,
  seed = 0
): NptePtContentCategoryId {
  const weighted: NptePtContentCategoryId[] = [];
  for (const id of NPTE_PT_CONTENT_CATEGORY_IDS) {
    const w = CATEGORY_YIELD_WEIGHT[id] ?? 1;
    for (let i = 0; i < w; i++) weighted.push(id);
  }
  return weighted[(slotIndex + seed) % weighted.length]!;
}

export function labelForNptePt2026TopicSlug(slug: string): string {
  return TOPIC_BY_SLUG.get(slug)?.label ?? slug.replace(/-/g, " ");
}

export function getNptePt2026Topic(slug: string) {
  return TOPIC_BY_SLUG.get(slug);
}

export function allNptePt2026TopicSlugs(): string[] {
  return [...TOPIC_BY_SLUG.keys()];
}

export function listNptePt2026TopicsForCategory(
  contentCategory: NptePtContentCategoryId
): NptePt2026Topic[] {
  return (
    NPTE_PT_2026_TOPIC_GROUPS.find((g) => g.categoryId === contentCategory)?.topics ?? []
  );
}

/** Backward-compatible topic slugs for quota planning. */
export function highYieldTopicsForCategory2026(
  contentCategory: NptePtContentCategoryId
): string[] {
  return listNptePt2026TopicsForCategory(contentCategory).map((t) => t.slug);
}

export function buildNptePt2026TopicCatalogBlock(): string {
  const systemLines = NPTE_PT_2026_TOPIC_GROUPS.map((g) => {
    const topicList = g.topics.map((t) => `${t.slug}: ${t.label}`).join("; ");
    return `${g.label} [${g.yield}] (${g.categoryId}): ${topicList}`;
  });
  const crossCut = NPTE_PT_CROSS_CUTTING_TOPICS.map((t) => t.label).join("; ");
  return [
    "NPTE-PT 2026 HIGH-YIELD CONTENT OUTLINE (assign blueprintTopic slug; clinical vignettes required):",
    "",
    "Body systems & non-systems:",
    ...systemLines,
    "",
    `Cross-cutting: ${crossCut}`,
    "",
    NPTE_PT_PLATFORM_CONTENT_GUIDANCE,
  ].join("\n");
}

/** Map task category hints for generation slot diversity. */
export const NPTE_PT_TASK_TOPIC_HINTS: Partial<
  Record<NptePtTaskCategoryId, string[]>
> = {
  examination: [
    "special-tests-shoulder-knee-spine",
    "gait-deviations-biomechanics",
    "neuro-outcome-measures",
    "fall-risk-assessment",
  ],
  "evaluation-diagnosis-prognosis": [
    "differential-diagnosis-pt",
    "red-flags-referral",
    "oa-vs-ra-arthritis",
    "sci-complete-incomplete",
  ],
  interventions: [
    "therapeutic-exercise-progression",
    "manual-therapy-indications",
    "exercise-prescription-fitt",
    "balance-vestibular-disorders",
  ],
};
