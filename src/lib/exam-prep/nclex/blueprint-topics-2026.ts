/**
 * NCLEX-RN 2026 Test Plan — granular Client Needs topic registry.
 * Single source for AI generation slots, blueprintTopic tags, module seeds, and QA.
 */
import type { NclexClientNeedsId } from "./types";

export type Nclex2026Topic = {
  /** Stable slug for blueprintTopic / tags (kebab-case). */
  slug: string;
  /** Human-readable label for prompts and UI. */
  label: string;
};

export type Nclex2026Category = {
  id: NclexClientNeedsId;
  label: string;
  /** Published NCSBN 2026 percentage range. */
  weightPct: { min: number; max: number };
  /** Midpoint weight for exam allocation (sums to 1.0). */
  weight: number;
  topics: Nclex2026Topic[];
};

function topic(slug: string, label: string): Nclex2026Topic {
  return { slug, label };
}

/** Full 2026 Client Needs taxonomy — feed to generation, tagging, and study modules. */
export const NCLEX_2026_CLIENT_NEEDS: Nclex2026Category[] = [
  {
    id: "management-of-care",
    label: "Management of Care",
    weightPct: { min: 15, max: 21 },
    weight: 0.18,
    topics: [
      topic("prioritization", "Prioritization (ABCs, Maslow, acute vs chronic, unstable vs stable)"),
      topic("delegation-assignment", "Delegation & assignment (RN, LPN, UAP scope)"),
      topic("ethical-principles", "Ethical principles (autonomy, beneficence, non-maleficence, justice)"),
      topic("informed-consent-advance-directives", "Informed consent & advance directives (living will, DNR, POA)"),
      topic("legal-aspects", "Legal aspects (negligence, malpractice, mandatory reporting)"),
      topic("continuity-case-management", "Continuity of care & case management"),
      topic("quality-improvement", "Quality improvement (root cause analysis, incident reporting)"),
      topic("client-advocacy-education", "Client advocacy & education"),
      topic("disaster-triage", "Disaster & triage (START triage, mass casualty)"),
      topic("leadership-conflict-resolution", "Leadership & conflict resolution"),
    ],
  },
  {
    id: "safety-infection",
    label: "Safety and Infection Prevention and Control",
    weightPct: { min: 10, max: 16 },
    weight: 0.13,
    topics: [
      topic("standard-precautions-hand-hygiene", "Standard precautions & hand hygiene"),
      topic("transmission-based-precautions", "Transmission-based precautions (airborne, droplet, contact)"),
      topic("ppe-donning-doffing", "PPE use & donning/doffing sequences"),
      topic("isolation-transport", "Isolation room setup & patient transport"),
      topic("needle-safety-waste", "Needle safety & hazardous waste disposal"),
      topic("fall-prevention-restraints", "Fall prevention & restraint safety"),
      topic("fire-safety-evacuation", "Fire safety & evacuation (RACE, PASS)"),
      topic("medication-error-prevention", "Medication error prevention (rights, high-alert meds)"),
      topic("surgical-asepsis", "Surgical asepsis & sterile technique"),
      topic("hai-prevention", "Hospital-acquired infection prevention (CAUTI, CLABSI, VAP)"),
    ],
  },
  {
    id: "health-promotion",
    label: "Health Promotion and Maintenance",
    weightPct: { min: 6, max: 12 },
    weight: 0.09,
    topics: [
      topic("erikson-stages", "Erikson's stages of psychosocial development"),
      topic("piaget-cognitive", "Piaget's cognitive development"),
      topic("immunization-schedules", "Immunization schedules (pediatric & adult)"),
      topic("health-screening", "Health screening guidelines (cancer, HTN, diabetes)"),
      topic("prenatal-fetal-development", "Prenatal care & fetal development"),
      topic("labor-fetal-monitoring", "Labor stages & fetal monitoring"),
      topic("postpartum-bubble-he", "Postpartum assessment (BUBBLE-HE)"),
      topic("postpartum-hemorrhage", "Postpartum hemorrhage (fundal massage, boggy uterus, lochia)"),
      topic("newborn-apgar-reflexes", "Newborn assessment & care (APGAR, reflexes)"),
      topic("pediatric-milestones", "Pediatric growth milestones (Denver Developmental)"),
      topic("menopause-aging", "Menopause & aging changes"),
    ],
  },
  {
    id: "psychosocial",
    label: "Psychosocial Integrity",
    weightPct: { min: 6, max: 12 },
    weight: 0.09,
    topics: [
      topic("therapeutic-communication", "Therapeutic vs non-therapeutic communication"),
      topic("anxiety-crisis-intervention", "Anxiety disorders & crisis intervention"),
      topic("mood-psychotic-disorders", "Depression, bipolar, schizophrenia (symptoms, medications)"),
      topic("suicide-risk", "Suicide risk assessment & precautions"),
      topic("substance-use-withdrawal", "Substance use disorders & withdrawal"),
      topic("abuse-neglect", "Abuse & neglect (child, elder, domestic)"),
      topic("grief-loss", "Grief & loss (Kübler-Ross stages)"),
      topic("cultural-spiritual-care", "Cultural competence & spiritual care"),
      topic("eating-disorders", "Eating disorders & body image"),
      topic("personality-disorders", "Personality disorders"),
    ],
  },
  {
    id: "basic-care-comfort",
    label: "Basic Care and Comfort",
    weightPct: { min: 6, max: 12 },
    weight: 0.09,
    topics: [
      topic("adls-positioning", "ADLs assistance & positioning"),
      topic("pressure-injury-staging", "Pressure injury prevention & staging"),
      topic("wound-care-dressings", "Wound care & dressings"),
      topic("pain-management", "Pain management (non-pharmacologic & scales)"),
      topic("nutrition-feeding", "Nutrition (enteral, parenteral, therapeutic diets)"),
      topic("elimination-catheter", "Elimination (catheter care, bowel training)"),
      topic("palliative-hospice", "Palliative & hospice care"),
      topic("mobility-assistive-devices", "Mobility & assistive devices (crutches, walkers)"),
      topic("sleep-rest", "Sleep & rest promotion"),
      topic("sensory-impairment", "Sensory impairment care (hearing, vision)"),
    ],
  },
  {
    id: "pharmacology-nursing",
    label: "Pharmacological and Parenteral Therapies",
    weightPct: { min: 13, max: 19 },
    weight: 0.16,
    topics: [
      topic("cardiovascular-meds", "Cardiovascular (antihypertensives, anticoagulants, antiplatelets, digoxin, statins)"),
      topic("respiratory-meds", "Respiratory (bronchodilators, corticosteroids, mucolytics)"),
      topic("endocrine-meds", "Endocrine (insulin types, oral hypoglycemics, thyroid, corticosteroids)"),
      topic("anti-infectives", "Anti-infectives (antibiotics, antivirals, antifungals — generations & coverage)"),
      topic("psychotropics", "Psychotropics (antidepressants, antipsychotics, anxiolytics, mood stabilizers)"),
      topic("pain-opioids-nsaids", "Pain management (opioids, NSAIDs, PCA pumps)"),
      topic("iv-fluids-electrolytes", "IV fluids & electrolyte replacement"),
      topic("blood-products-transfusion", "Blood products & transfusion reactions"),
      topic("dosage-calculations", "Dosage calculations (weight-based, drip rates, reconstitution)"),
      topic("interactions-antidotes", "Medication interactions & antidotes (Narcan, vitamin K, Digibind)"),
    ],
  },
  {
    id: "reduction-risk",
    label: "Reduction of Risk Potential",
    weightPct: { min: 9, max: 15 },
    weight: 0.12,
    topics: [
      topic("critical-lab-values", "Critical lab values (electrolytes, CBC, BMP, ABGs, troponin, BNP, INR)"),
      topic("diagnostic-tests", "Diagnostic tests (EKG basics, chest X-ray, ultrasound)"),
      topic("pre-post-procedure", "Pre & post-procedure care (angiography, colonoscopy, bronchoscopy)"),
      topic("vital-sign-trending", "Vital signs abnormalities & trending"),
      topic("immobility-complications", "Complications of immobility"),
      topic("postoperative-monitoring", "Post-operative care & monitoring"),
      topic("fluid-balance-io", "Fluid balance assessment (I&O, daily weights)"),
      topic("chemotherapy-side-effects", "Cancer care & chemotherapy side effects"),
      topic("ng-feeding-tube", "NG tube & feeding tube management"),
    ],
  },
  {
    id: "physiological-adaptation",
    label: "Physiological Adaptation",
    weightPct: { min: 11, max: 17 },
    weight: 0.14,
    topics: [
      topic("cardiac-emergencies", "Cardiac (MI, heart failure, dysrhythmias, hypertensive crisis)"),
      topic("respiratory-emergencies", "Respiratory (pneumonia, COPD, asthma, PE, chest tubes)"),
      topic("neurological-emergencies", "Neurological (stroke, seizures, increased ICP, meningitis)"),
      topic("renal-urinary", "Renal/urinary (AKI, CKD, dialysis, electrolyte imbalances)"),
      topic("gi-disorders", "GI (GI bleed, pancreatitis, liver failure, IBD)"),
      topic("endocrine-emergencies", "Endocrine (DKA, HHNS, hypothyroidism, adrenal crisis)"),
      topic("musculoskeletal", "Musculoskeletal (fractures, compartment syndrome, osteoporosis)"),
      topic("hematology-oncology", "Hematology/oncology (anemia, leukemia, sickle cell crisis)"),
      topic("shock-sepsis", "Shock & sepsis (types of shock, SIRS)"),
      topic("burns-trauma", "Burns & trauma (fluid resuscitation, wound management)"),
    ],
  },
];

/** Topic slugs rotated during full-exam generation (first 6 per category, high-yield order). */
export const NCLEX_2026_HIGH_YIELD_ROTATION: Record<NclexClientNeedsId, string[]> =
  Object.fromEntries(
    NCLEX_2026_CLIENT_NEEDS.map((cat) => [
      cat.id,
      cat.topics.slice(0, 6).map((t) => t.slug),
    ])
  ) as Record<NclexClientNeedsId, string[]>;

const TOPIC_BY_SLUG = new Map<string, Nclex2026Topic & { categoryId: NclexClientNeedsId }>();
for (const cat of NCLEX_2026_CLIENT_NEEDS) {
  for (const t of cat.topics) {
    TOPIC_BY_SLUG.set(t.slug, { ...t, categoryId: cat.id });
  }
}

export function getNclex2026Category(id: NclexClientNeedsId): Nclex2026Category | undefined {
  return NCLEX_2026_CLIENT_NEEDS.find((c) => c.id === id);
}

export function getNclex2026Topic(slug: string): (Nclex2026Topic & { categoryId: NclexClientNeedsId }) | undefined {
  return TOPIC_BY_SLUG.get(slug);
}

export function listNclex2026TopicsForCategory(id: NclexClientNeedsId): Nclex2026Topic[] {
  return getNclex2026Category(id)?.topics ?? [];
}

/** Pick a blueprint topic slug for generation slot planning. */
export function pickNclex2026BlueprintTopic(
  categoryId: NclexClientNeedsId,
  slotIndex: number,
  examSeed: number
): string {
  if (categoryId === "management-of-care") {
    const mocRotation = [
      "prioritization",
      "prioritization",
      "prioritization",
      "client-advocacy-education",
      "informed-consent-advance-directives",
      "delegation-assignment",
      "continuity-case-management",
      "delegation-assignment",
    ];
    return mocRotation[(slotIndex + examSeed) % mocRotation.length]!;
  }
  const topics = NCLEX_2026_HIGH_YIELD_ROTATION[categoryId];
  return topics[(slotIndex + examSeed) % topics.length]!;
}

/** Compact topic list for LLM system/user prompts. */
export function buildNclex2026TopicCatalogBlock(): string {
  const lines = NCLEX_2026_CLIENT_NEEDS.map((cat) => {
    const pct = `${cat.weightPct.min}–${cat.weightPct.max}%`;
    const topicList = cat.topics.map((t) => t.label).join("; ");
    return `${cat.label} (${pct}): ${topicList}`;
  });
  return [
    "NCLEX-RN 2026 CLIENT NEEDS — GRANULAR TOPIC CATALOG (tag blueprintTopic with slug; vary vignettes):",
    ...lines,
  ].join("\n");
}

/** Per-slot topic label for prompts. */
export function labelForNclex2026TopicSlug(slug: string): string {
  return TOPIC_BY_SLUG.get(slug)?.label ?? slug.replace(/-/g, " ");
}

/** Flat list of all topic slugs for validation / autocomplete. */
export function allNclex2026TopicSlugs(): string[] {
  return [...TOPIC_BY_SLUG.keys()];
}

/** Keyword hints for infer-blueprint-topic backfill (slug → regex fragments). */
export const NCLEX_2026_TOPIC_KEYWORDS: { slug: string; pattern: RegExp }[] = [
  { slug: "delegation-assignment", pattern: /\bdelegate|\buap\b|\bunlicensed assistive|\bassign.*(?:task|lvpn|lpn)/i },
  { slug: "fire-safety-evacuation", pattern: /\bRACE\b|\bPASS\b|\bfire extinguisher|\bevacuation/i },
  { slug: "disaster-triage", pattern: /\bSTART triage|\bmass casualty|\btriage tag|\bMCI\b|\bblack tag|\bred tag/i },
  { slug: "postpartum-bubble-he", pattern: /\bBUBBLE-HE\b|\bboggy uterus|\blochia/i },
  { slug: "newborn-apgar-reflexes", pattern: /\bAPGAR|\bmoro reflex|\bnewborn assessment/i },
  { slug: "dosage-calculations", pattern: /\bdrip rate|\bmL\/hr|\breconstitut|\bmg\/kg|\bcalculate the|\bhow many mL/i },
  { slug: "medication-error-prevention", pattern: /\bmedication rights?|\b5 rights|\bsix rights|\bhigh[- ]alert|\blook[- ]alike|\bindependent double check/i },
  { slug: "fluid-balance-io", pattern: /\bhyponatremia|\bhyperkalemia|\bhypokalemia|\belectrolyte|\bdaily weight|\bI\s*&\s*O|\bintake and output/i },
  { slug: "iv-fluids-electrolytes", pattern: /\bIV fluids?|\bnormal saline|\blactated ringer|\bKCl infusion|\bIV potassium/i },
  { slug: "interactions-antidotes", pattern: /\bNarcan|\bnaloxone|\bDigibind|\bvitamin K|\bprotamine/i },
  { slug: "blood-products-transfusion", pattern: /\btransfusion reaction|\bhemolytic|\btype and cross|\bPRBC|\btwo[- ]nurse/i },
  { slug: "critical-lab-values", pattern: /\btroponin|\bBNP|\bINR|\bcritical (?:lab|value)/i },
  { slug: "compartment-syndrome", pattern: /\bcompartment syndrome|\b6 P'?s|\bpain out of proportion/i },
  { slug: "sickle-cell-crisis", pattern: /\bsickle cell|\bvaso-occlusive/i },
  { slug: "burns-trauma", pattern: /\bburn(?:s)? (?:patient|victim)|\bParkland|\bTBSA|\brule of nines/i },
  { slug: "chemotherapy-side-effects", pattern: /\bchemotherapy|\bneutropenic|\bnadir|\btumor lysis|\bextravasation/i },
  { slug: "hematology-oncology", pattern: /\bsickle cell|\bleukemia|\bthrombocytopenia|\banemia|\bDIC\b/i },
  { slug: "musculoskeletal", pattern: /\bfracture|\btraction|\bcast care|\bfat embolism|\bcompartment syndrome/i },
];
