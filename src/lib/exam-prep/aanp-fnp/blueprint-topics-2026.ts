/**
 * AANP FNP high-yield content outline (2026) — body systems, lifespan bands,
 * content categories, and cross-cutting areas for AnyExamEasy generation.
 *
 * Organized for primary-care outpatient vignettes and guideline-directed therapy.
 * Cognitive domains (Assess/Diagnose/Plan/Evaluate) remain the official NPCB axis;
 * study modules rotate clinical systems — not alternate invented exam weights.
 */
import type { AanpFnpClinicalSystemId, AanpFnpDomainId } from "./types";
import {
  AANP_FNP_AGE_GROUP_LABELS,
  AANP_FNP_AGE_GROUP_WEIGHTS,
  AANP_FNP_DOMAIN_LABELS,
  AANP_FNP_DOMAIN_WEIGHTS,
  type AanpFnpPatientAgeGroupId,
} from "./types";

export type AanpFnp2026Topic = {
  slug: string;
  label: string;
};

export type AanpFnp2026TopicGroup = {
  categoryId: AanpFnpClinicalSystemId;
  label: string;
  /** Very high yield systems get heavier rotation in generation. */
  yield: "very-high" | "high" | "standard";
  topics: AanpFnp2026Topic[];
};

export type AanpFnpOfficialBlueprintRow = {
  id: string;
  label: string;
  weight: number;
  weightLabel: string;
  scoredItems?: number;
};

function topic(slug: string, label: string): AanpFnp2026Topic {
  return { slug, label };
}

function pctLabel(weight: number): string {
  const pct = Math.round(weight * 1000) / 10;
  return `${pct}%`;
}

/** Official NPCB Domain I weights (2024+ FNP blueprint). */
export const AANP_FNP_OFFICIAL_DOMAIN_ROWS: AanpFnpOfficialBlueprintRow[] = (
  Object.keys(AANP_FNP_DOMAIN_WEIGHTS) as AanpFnpDomainId[]
).map((id) => ({
  id,
  label: AANP_FNP_DOMAIN_LABELS[id],
  weight: AANP_FNP_DOMAIN_WEIGHTS[id],
  weightLabel: id === "diagnose" || id === "plan" ? "27% (36/135)" : pctLabel(AANP_FNP_DOMAIN_WEIGHTS[id]),
  scoredItems:
    id === "assess"
      ? 43
      : id === "diagnose" || id === "plan"
        ? 36
        : id === "evaluate"
          ? 20
          : undefined,
}));

/** Official NPCB Domain II patient age weights (2024+ FNP blueprint). */
export const AANP_FNP_OFFICIAL_AGE_ROWS: AanpFnpOfficialBlueprintRow[] = (
  Object.keys(AANP_FNP_AGE_GROUP_WEIGHTS) as AanpFnpPatientAgeGroupId[]
).map((id) => ({
  id,
  label: AANP_FNP_AGE_GROUP_LABELS[id],
  weight: AANP_FNP_AGE_GROUP_WEIGHTS[id],
  weightLabel: pctLabel(AANP_FNP_AGE_GROUP_WEIGHTS[id]),
}));

/** High-yield system-based topic registry (11 body-system modules). */
export const AANP_FNP_2026_TOPIC_GROUPS: AanpFnp2026TopicGroup[] = [
  {
    categoryId: "cardiovascular",
    label: "Cardiovascular",
    yield: "very-high",
    topics: [
      topic("hypertension-jnc-acc", "Hypertension (JNC/ACC guidelines, treatment algorithms)"),
      topic("dyslipidemia-statin-therapy", "Dyslipidemia (statin therapy, risk calculators)"),
      topic("heart-failure-gdmt", "Heart failure (classification, GDMT)"),
      topic("coronary-artery-disease-angina", "Coronary artery disease & angina"),
      topic("atrial-fibrillation-anticoagulation", "Atrial fibrillation & anticoagulation (CHA2DS2-VASc, HAS-BLED)"),
      topic("valvular-disease-murmurs", "Valvular disease & murmurs"),
      topic("peripheral-vascular-disease", "Peripheral vascular disease"),
    ],
  },
  {
    categoryId: "pulmonary",
    label: "Respiratory",
    yield: "high",
    topics: [
      topic("asthma-gina-stepwise", "Asthma (GINA guidelines, stepwise therapy)"),
      topic("copd-gold-inhalers", "COPD (GOLD guidelines, inhaler technique)"),
      topic("pneumonia-cap-hap", "Pneumonia (CAP vs HAP)"),
      topic("pulmonary-embolism-dvt", "Pulmonary embolism & DVT"),
      topic("allergic-rhinitis-sinusitis", "Allergic rhinitis & sinusitis"),
      topic("smoking-cessation", "Smoking cessation"),
    ],
  },
  {
    categoryId: "endocrine",
    label: "Endocrine",
    yield: "high",
    topics: [
      topic("diabetes-ada-guidelines", "Diabetes mellitus (ADA — oral agents, insulin, GLP-1, SGLT2)"),
      topic("thyroid-disorders", "Thyroid disorders (hypo/hyperthyroidism, nodules)"),
      topic("adrenal-disorders", "Adrenal disorders"),
      topic("osteoporosis-metabolic-bone", "Osteoporosis & metabolic bone disease"),
      topic("obesity-weight-management", "Obesity & weight management"),
    ],
  },
  {
    categoryId: "infectious-disease",
    label: "Infectious Disease",
    yield: "high",
    topics: [
      topic("antibiotic-selection-stewardship", "Antibiotic selection & stewardship"),
      topic("common-infections-uri-uti-cellulitis", "Common infections (URI, UTI, cellulitis, SSTI)"),
      topic("vaccinations-lifespan-cdc", "Vaccinations across lifespan (CDC schedule)"),
      topic("hiv-prep", "HIV pre-exposure prophylaxis (PrEP)"),
      topic("sexually-transmitted-infections", "Sexually transmitted infections"),
      topic("tuberculosis-latent-tb", "Tuberculosis & latent TB"),
    ],
  },
  {
    categoryId: "gastrointestinal",
    label: "Gastrointestinal",
    yield: "high",
    topics: [
      topic("gerd-peptic-ulcer", "GERD & peptic ulcer disease"),
      topic("ibs-ibd-celiac", "IBS, IBD, celiac disease"),
      topic("hepatitis-liver-disease", "Hepatitis & liver disease"),
      topic("constipation-diarrhea-hemorrhoids", "Constipation, diarrhea, hemorrhoids"),
      topic("colorectal-cancer-screening", "Colorectal cancer screening"),
    ],
  },
  {
    categoryId: "musculoskeletal",
    label: "Musculoskeletal",
    yield: "standard",
    topics: [
      topic("osteoarthritis-rheumatoid-arthritis", "Osteoarthritis & rheumatoid arthritis"),
      topic("low-back-pain-spinal", "Low back pain & spinal disorders"),
      topic("gout-pseudogout", "Gout & pseudogout"),
      topic("sports-injuries-sprains", "Sports injuries & sprains"),
      topic("fibromyalgia", "Fibromyalgia"),
    ],
  },
  {
    categoryId: "neurology",
    label: "Neurology",
    yield: "high",
    topics: [
      topic("headaches-migraine-tension-cluster", "Headaches (migraine, tension, cluster)"),
      topic("seizure-disorders-epilepsy", "Seizure disorders & epilepsy"),
      topic("stroke-tia", "Stroke & TIA"),
      topic("dementia-delirium", "Dementia & delirium"),
      topic("parkinsons-disease", "Parkinson's disease"),
      topic("peripheral-neuropathy", "Peripheral neuropathy"),
    ],
  },
  {
    categoryId: "psychiatry-behavioral",
    label: "Psychiatry / Behavioral Health",
    yield: "high",
    topics: [
      topic("depression-anxiety-disorders", "Depression & anxiety disorders"),
      topic("bipolar-disorder", "Bipolar disorder"),
      topic("adhd-lifespan", "ADHD (across lifespan)"),
      topic("substance-use-disorders", "Substance use disorders"),
      topic("suicide-risk-assessment", "Suicide risk assessment"),
      topic("insomnia-sleep-disorders", "Insomnia & sleep disorders"),
    ],
  },
  {
    categoryId: "womens-health",
    label: "Reproductive / Women's & Men's Health",
    yield: "high",
    topics: [
      topic("contraception-counseling", "Contraception (methods, counseling)"),
      topic("menstrual-disorders-menopause", "Menstrual disorders & menopause"),
      topic("prenatal-pregnancy-complications", "Prenatal care & common pregnancy complications"),
      topic("breast-cervical-cancer-screening", "Breast & cervical cancer screening"),
      topic("benign-prostatic-hyperplasia", "Benign prostatic hyperplasia (BPH)"),
      topic("erectile-dysfunction", "Erectile dysfunction"),
    ],
  },
  {
    categoryId: "pediatrics",
    label: "Pediatrics",
    yield: "high",
    topics: [
      topic("well-child-developmental-milestones", "Well-child visits & developmental milestones"),
      topic("common-pediatric-illnesses", "Common pediatric illnesses (otitis media, viral exanthems)"),
      topic("pediatric-immunization-schedules", "Immunization schedules"),
      topic("adolescent-health-screening", "Adolescent health (screening, contraception)"),
    ],
  },
  {
    categoryId: "geriatrics",
    label: "Geriatrics",
    yield: "high",
    topics: [
      topic("falls-frailty-polypharmacy", "Falls, frailty & polypharmacy in geriatrics"),
      topic("end-of-life-advance-directives", "End-of-life care & advance directives"),
      topic("geriatric-delirium-dementia", "Delirium vs dementia in older adults"),
      topic("beers-criteria-deprescribing", "Beers Criteria & deprescribing"),
    ],
  },
  {
    categoryId: "dermatology-ent",
    label: "Dermatology, Eyes, Ears, Nose, Throat",
    yield: "standard",
    topics: [
      topic("common-rashes-eczema-psoriasis-acne", "Common rashes (eczema, psoriasis, acne)"),
      topic("skin-cancer-detection", "Skin cancer detection"),
      topic("conjunctivitis-glaucoma-macular", "Conjunctivitis, glaucoma, macular degeneration"),
      topic("otitis-hearing-loss", "Otitis media/externa, hearing loss"),
      topic("sinusitis-pharyngitis", "Sinusitis & pharyngitis"),
    ],
  },
];

/** Cross-cutting high-yield areas spanning all systems. */
export const AANP_FNP_CROSS_CUTTING_TOPICS: AanpFnp2026Topic[] = [
  topic("pharmacology-mechanisms-monitoring", "Pharmacology — mechanisms, side effects, monitoring, interactions"),
  topic("lab-diagnostic-interpretation", "Lab & diagnostic interpretation — when to order, what results mean"),
  topic("health-promotion-uspstf-screening", "Health promotion — USPSTF screening guidelines, lifestyle counseling"),
  topic("professional-role-scope-ethics", "Professional role — scope of practice, ethics, billing, collaboration"),
  topic("evidence-based-guidelines", "Evidence-based practice — ADA, JNC, GOLD, IDSA, GINA guideline application"),
];

/** AnyExamEasy content strategy for AANP FNP generation prompts. */
export const AANP_FNP_PLATFORM_CONTENT_GUIDANCE = [
  "Emphasize primary care outpatient management and next-best-step questions.",
  "Strong focus on guideline-directed therapy and patient education.",
  "Include pediatrics and geriatrics as differentiators — mix lifespan in every batch.",
  "Create system-based vignettes (most common AANP question style).",
  "Cross-reference pharmacology (mechanisms, monitoring, pregnancy categories) within clinical scenarios.",
  "Pairs with NCLEX content — many users cross-prepare; use NP scope and prescribing focus.",
].join("\n");

const TOPIC_ROTATION: Record<string, string[]> = {};
for (const group of AANP_FNP_2026_TOPIC_GROUPS) {
  TOPIC_ROTATION[group.categoryId] = group.topics.map((t) => t.slug);
}

const TOPIC_BY_SLUG = new Map<
  string,
  AanpFnp2026Topic & { categoryId: AanpFnpClinicalSystemId }
>();
for (const group of AANP_FNP_2026_TOPIC_GROUPS) {
  for (const t of group.topics) {
    TOPIC_BY_SLUG.set(t.slug, { ...t, categoryId: group.categoryId });
  }
}
for (const t of AANP_FNP_CROSS_CUTTING_TOPICS) {
  TOPIC_BY_SLUG.set(t.slug, { ...t, categoryId: "infectious-disease" });
}

/** Very-high-yield systems rotate more frequently in slot planning. */
export const AANP_FNP_CLINICAL_SYSTEM_YIELD_WEIGHT: Record<AanpFnpClinicalSystemId, number> = {
  cardiovascular: 3,
  pulmonary: 2,
  endocrine: 2,
  "infectious-disease": 2,
  gastrointestinal: 2,
  musculoskeletal: 1,
  neurology: 2,
  "psychiatry-behavioral": 2,
  "womens-health": 2,
  pediatrics: 2,
  geriatrics: 2,
  "dermatology-ent": 1,
};

export const AANP_FNP_CLINICAL_SYSTEM_IDS = AANP_FNP_2026_TOPIC_GROUPS.map(
  (g) => g.categoryId
);

export function pickAanpFnp2026BlueprintTopic(
  clinicalSystem: AanpFnpClinicalSystemId,
  slotIndex: number,
  seed = 0
): string {
  const rotation = TOPIC_ROTATION[clinicalSystem];
  if (!rotation?.length) {
    return AANP_FNP_CROSS_CUTTING_TOPICS[(slotIndex + seed) % AANP_FNP_CROSS_CUTTING_TOPICS.length]!
      .slug;
  }
  return rotation[(slotIndex + seed) % rotation.length]!;
}

export function computeAanpFnpClinicalSystemWeightMap(): Record<AanpFnpClinicalSystemId, number> {
  const sum = Object.values(AANP_FNP_CLINICAL_SYSTEM_YIELD_WEIGHT).reduce((a, b) => a + b, 0);
  const out = {} as Record<AanpFnpClinicalSystemId, number>;
  for (const id of AANP_FNP_CLINICAL_SYSTEM_IDS) {
    out[id] = AANP_FNP_CLINICAL_SYSTEM_YIELD_WEIGHT[id] / sum;
  }
  return out;
}

/** Slug for system-based Deep Dive review modules. */
export function aanpFnpSystemModuleSlug(clinicalSystem: AanpFnpClinicalSystemId): string {
  return `aanp-system-${clinicalSystem}`;
}

export function pickAanpFnp2026ClinicalSystem(slotIndex: number, seed = 0): AanpFnpClinicalSystemId {
  const weighted: AanpFnpClinicalSystemId[] = [];
  for (const id of AANP_FNP_CLINICAL_SYSTEM_IDS) {
    const w = AANP_FNP_CLINICAL_SYSTEM_YIELD_WEIGHT[id] ?? 1;
    for (let i = 0; i < w; i++) weighted.push(id);
  }
  return weighted[(slotIndex + seed) % weighted.length]!;
}

export function labelForAanpFnp2026TopicSlug(slug: string): string {
  return TOPIC_BY_SLUG.get(slug)?.label ?? slug.replace(/-/g, " ");
}

export function getAanpFnp2026Topic(slug: string) {
  return TOPIC_BY_SLUG.get(slug);
}

export function allAanpFnp2026TopicSlugs(): string[] {
  return [...TOPIC_BY_SLUG.keys()];
}

export function listAanpFnp2026TopicsForSystem(
  clinicalSystem: AanpFnpClinicalSystemId
): AanpFnp2026Topic[] {
  return AANP_FNP_2026_TOPIC_GROUPS.find((g) => g.categoryId === clinicalSystem)?.topics ?? [];
}

/** Backward-compatible topic slugs for quota planning. */
export function highYieldTopicsForSystem(clinicalSystem: AanpFnpClinicalSystemId): string[] {
  return listAanpFnp2026TopicsForSystem(clinicalSystem).map((t) => t.slug);
}

export function buildAanpFnp2026TopicCatalogBlock(): string {
  const domainLines = AANP_FNP_OFFICIAL_DOMAIN_ROWS.map(
    (d) => `${d.label} (${d.weightLabel}${d.scoredItems ? `, ${d.scoredItems} scored items` : ""})`
  );
  const ageLines = AANP_FNP_OFFICIAL_AGE_ROWS.map((a) => `${a.label} (${a.weightLabel})`);
  const systemLines = AANP_FNP_2026_TOPIC_GROUPS.map((g) => {
    const topicList = g.topics.map((t) => `${t.slug}: ${t.label}`).join("; ");
    return `${g.label} [${g.yield}] (${g.categoryId}): ${topicList}`;
  });
  const crossCut = AANP_FNP_CROSS_CUTTING_TOPICS.map((t) => t.label).join("; ");
  return [
    "AANP FNP 2026 HIGH-YIELD CONTENT OUTLINE (assign blueprintTopic slug; primary-care vignettes required):",
    "",
    "Official NPCB Domain I (Practice):",
    ...domainLines,
    "",
    "Official NPCB Domain II (Patient age):",
    ...ageLines,
    "",
    "System modules:",
    ...systemLines,
    "",
    `Cross-cutting: ${crossCut}`,
    "",
    AANP_FNP_PLATFORM_CONTENT_GUIDANCE,
  ].join("\n");
}
