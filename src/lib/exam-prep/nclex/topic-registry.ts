/**
 * NCLEX high-yield topic registry — maps Client Needs domains, blueprint slugs,
 * drugs, and study presets to Study Hub topic cards.
 */
import type { DrugClassId } from "@/lib/drugs300/drug-classes";
import type { NclexStudyPresetId } from "@/lib/exam-prep/nclex/study-presets";
import type { HighYieldTopic } from "@/types/edtech";
import type { NclexClientNeedsId } from "./types";

export type NclexClientNeedsDomain = {
  id: NclexClientNeedsId | "ngn-strategy";
  label: string;
  shortLabel: string;
  weightPct: number;
  sortOrder: number;
};

/** Official 2026 Client Needs domains + NGN strategy bucket for Study Hub navigation. */
export const NCLEX_CLIENT_NEEDS_DOMAINS: NclexClientNeedsDomain[] = [
  { id: "management-of-care", label: "Management of Care", shortLabel: "Management", weightPct: 18, sortOrder: 0 },
  { id: "safety-infection", label: "Safety & Infection Control", shortLabel: "Safety", weightPct: 13, sortOrder: 1 },
  { id: "health-promotion", label: "Health Promotion", shortLabel: "Health Promo", weightPct: 9, sortOrder: 2 },
  { id: "psychosocial", label: "Psychosocial Integrity", shortLabel: "Psychosocial", weightPct: 9, sortOrder: 3 },
  { id: "basic-care-comfort", label: "Basic Care & Comfort", shortLabel: "Basic Care", weightPct: 9, sortOrder: 4 },
  { id: "pharmacology-nursing", label: "Pharmacological Therapies", shortLabel: "Pharmacology", weightPct: 16, sortOrder: 5 },
  { id: "reduction-risk", label: "Reduction of Risk Potential", shortLabel: "Risk Reduction", weightPct: 12, sortOrder: 6 },
  { id: "physiological-adaptation", label: "Physiological Adaptation", shortLabel: "Physiological", weightPct: 14, sortOrder: 7 },
  { id: "ngn-strategy", label: "NCLEX NGN Strategy", shortLabel: "NGN", weightPct: 0, sortOrder: 8 },
];

export type NclexTopicMeta = {
  clientNeedsDomain: NclexClientNeedsDomain["id"];
  blueprintTopicSlugs: string[];
  relatedDrugClasses?: Exclude<DrugClassId, "all">[];
  top500DrugSlugs?: string[];
  relatedPresetIds?: NclexStudyPresetId[];
  /** Primary topic slug for roadmap deep-dive when resolving by subject or blueprint. */
  primary?: boolean;
};

export const NCLEX_TOPIC_REGISTRY: Record<string, NclexTopicMeta> = {
  prioritization: {
    clientNeedsDomain: "management-of-care",
    blueprintTopicSlugs: ["prioritization"],
    relatedPresetIds: ["prioritization-workshop", "trap-tier-drill"],
    primary: true,
  },
  delegation: {
    clientNeedsDomain: "management-of-care",
    blueprintTopicSlugs: ["delegation-assignment"],
    relatedPresetIds: ["prioritization-workshop"],
  },
  "legal-ethical": {
    clientNeedsDomain: "management-of-care",
    blueprintTopicSlugs: ["ethical-principles", "informed-consent-advance-directives", "legal-aspects"],
    relatedPresetIds: ["legal-ethical-block"],
  },
  "disaster-triage": {
    clientNeedsDomain: "management-of-care",
    blueprintTopicSlugs: ["disaster-triage", "leadership-conflict-resolution"],
  },
  "quality-improvement": {
    clientNeedsDomain: "management-of-care",
    blueprintTopicSlugs: ["quality-improvement", "continuity-case-management"],
  },
  "infection-control": {
    clientNeedsDomain: "safety-infection",
    blueprintTopicSlugs: [
      "standard-precautions-hand-hygiene",
      "transmission-based-precautions",
      "ppe-donning-doffing",
      "isolation-transport",
      "surgical-asepsis",
      "hai-prevention",
    ],
    relatedPresetIds: ["foundation-review"],
    primary: true,
  },
  "immunization-schedules": {
    clientNeedsDomain: "health-promotion",
    blueprintTopicSlugs: ["immunization-schedules", "health-screening"],
  },
  "prenatal-labor-monitoring": {
    clientNeedsDomain: "health-promotion",
    blueprintTopicSlugs: ["prenatal-fetal-development", "labor-fetal-monitoring"],
  },
  postpartum: {
    clientNeedsDomain: "health-promotion",
    blueprintTopicSlugs: ["postpartum-bubble-he", "postpartum-bubble-he"],
    relatedPresetIds: ["maternal-newborn-block"],
    primary: true,
  },
  "newborn-assessment": {
    clientNeedsDomain: "health-promotion",
    blueprintTopicSlugs: ["newborn-apgar-reflexes"],
  },
  pediatrics: {
    clientNeedsDomain: "health-promotion",
    blueprintTopicSlugs: ["pediatric-milestones", "menopause-aging"],
    relatedPresetIds: ["peds-block"],
  },
  "developmental-milestones": {
    clientNeedsDomain: "health-promotion",
    blueprintTopicSlugs: ["erikson-stages", "piaget-cognitive"],
  },
  psychiatric: {
    clientNeedsDomain: "psychosocial",
    blueprintTopicSlugs: [
      "therapeutic-communication",
      "anxiety-crisis-intervention",
      "mood-psychotic-disorders",
      "suicide-risk",
      "substance-use-withdrawal",
    ],
    relatedDrugClasses: ["cns-psych"],
    top500DrugSlugs: ["sertraline", "lithium", "haloperidol", "lorazepam"],
    relatedPresetIds: ["psych-communication-block"],
    primary: true,
  },
  "pain-opioids": {
    clientNeedsDomain: "basic-care-comfort",
    blueprintTopicSlugs: ["pain-management", "adls-positioning"],
    relatedDrugClasses: ["pain-inflammation", "cns-psych"],
    top500DrugSlugs: ["morphine", "hydromorphone", "naloxone", "acetaminophen", "ibuprofen"],
  },
  "medication-safety": {
    clientNeedsDomain: "pharmacology-nursing",
    blueprintTopicSlugs: ["medication-error-prevention", "dosage-calculations"],
    relatedDrugClasses: ["endocrine", "cardiovascular"],
    top500DrugSlugs: ["insulin-glargine", "heparin", "warfarin", "morphine", "potassium-chloride"],
    relatedPresetIds: ["pharm-high-alert-block", "dosage-calc-sprint"],
    primary: true,
  },
  "anticoagulation-nursing": {
    clientNeedsDomain: "pharmacology-nursing",
    blueprintTopicSlugs: ["cardiovascular-meds", "interactions-antidotes"],
    relatedDrugClasses: ["cardiovascular"],
    top500DrugSlugs: ["warfarin", "heparin", "enoxaparin", "apixaban", "rivaroxaban", "protamine"],
  },
  "cardiovascular-meds-nursing": {
    clientNeedsDomain: "pharmacology-nursing",
    blueprintTopicSlugs: ["cardiovascular-meds"],
    relatedDrugClasses: ["cardiovascular"],
    top500DrugSlugs: ["lisinopril", "metoprolol", "amlodipine", "furosemide", "digoxin", "atorvastatin"],
  },
  "antibiotics-nursing": {
    clientNeedsDomain: "pharmacology-nursing",
    blueprintTopicSlugs: ["anti-infectives"],
    relatedDrugClasses: ["antibiotics"],
    top500DrugSlugs: ["vancomycin", "piperacillin-tazobactam", "azithromycin", "ciprofloxacin", "metronidazole"],
  },
  "psychotropics-nursing": {
    clientNeedsDomain: "pharmacology-nursing",
    blueprintTopicSlugs: ["psychotropics"],
    relatedDrugClasses: ["cns-psych"],
    top500DrugSlugs: ["sertraline", "fluoxetine", "lithium", "haloperidol", "risperidone", "lorazepam"],
  },
  "drug-interactions-antidotes": {
    clientNeedsDomain: "pharmacology-nursing",
    blueprintTopicSlugs: ["interactions-antidotes"],
    relatedDrugClasses: ["cardiovascular", "cns-psych", "antibiotics"],
    top500DrugSlugs: ["naloxone", "vitamin-k", "digoxin-immune-fab", "flumazenil", "acetylcysteine"],
  },
  "iv-fluids-blood-products": {
    clientNeedsDomain: "pharmacology-nursing",
    blueprintTopicSlugs: ["iv-fluids-electrolytes", "blood-products-transfusion"],
    relatedDrugClasses: ["cardiovascular"],
    top500DrugSlugs: ["potassium-chloride", "magnesium-sulfate", "calcium-gluconate"],
  },
  "dosage-calculations": {
    clientNeedsDomain: "reduction-risk",
    blueprintTopicSlugs: ["dosage-calculations"],
    relatedPresetIds: ["dosage-calc-sprint"],
    primary: true,
  },
  "critical-lab-values": {
    clientNeedsDomain: "reduction-risk",
    blueprintTopicSlugs: ["critical-lab-values", "vital-sign-trending", "diagnostic-tests"],
    relatedPresetIds: ["electrolytes-block"],
  },
  "pre-post-procedure": {
    clientNeedsDomain: "reduction-risk",
    blueprintTopicSlugs: ["pre-post-procedure", "postoperative-monitoring"],
  },
  "chemotherapy-toxicity": {
    clientNeedsDomain: "reduction-risk",
    blueprintTopicSlugs: ["chemotherapy-side-effects", "ng-feeding-tube"],
  },
  electrolytes: {
    clientNeedsDomain: "physiological-adaptation",
    blueprintTopicSlugs: ["fluid-balance-io"],
    relatedDrugClasses: ["cardiovascular"],
    top500DrugSlugs: ["potassium-chloride", "magnesium-sulfate", "calcium-gluconate"],
    relatedPresetIds: ["electrolytes-block"],
  },
  "sepsis-shock": {
    clientNeedsDomain: "physiological-adaptation",
    blueprintTopicSlugs: ["shock-sepsis"],
    relatedPresetIds: ["trap-tier-drill"],
    primary: true,
  },
  cardiovascular: {
    clientNeedsDomain: "physiological-adaptation",
    blueprintTopicSlugs: ["cardiac-emergencies"],
    relatedDrugClasses: ["cardiovascular"],
    top500DrugSlugs: ["nitroglycerin", "aspirin", "metoprolol", "furosemide"],
  },
  respiratory: {
    clientNeedsDomain: "physiological-adaptation",
    blueprintTopicSlugs: ["respiratory-emergencies"],
    relatedDrugClasses: ["respiratory"],
    top500DrugSlugs: ["albuterol", "ipratropium", "prednisone", "methylprednisolone"],
  },
  diabetes: {
    clientNeedsDomain: "physiological-adaptation",
    blueprintTopicSlugs: ["endocrine-emergencies"],
    relatedDrugClasses: ["endocrine"],
    top500DrugSlugs: ["insulin-glargine", "metformin", "glucagon"],
  },
  renal: {
    clientNeedsDomain: "physiological-adaptation",
    blueprintTopicSlugs: ["renal-urinary"],
  },
  neurologic: {
    clientNeedsDomain: "physiological-adaptation",
    blueprintTopicSlugs: ["neurological-emergencies"],
    relatedDrugClasses: ["cns-psych"],
    top500DrugSlugs: ["alteplase", "levetiracetam", "phenytoin"],
  },
  "gi-emergencies": {
    clientNeedsDomain: "physiological-adaptation",
    blueprintTopicSlugs: ["gi-disorders"],
  },
  "heme-oncology": {
    clientNeedsDomain: "physiological-adaptation",
    blueprintTopicSlugs: ["hematology-oncology"],
  },
  "burns-trauma": {
    clientNeedsDomain: "physiological-adaptation",
    blueprintTopicSlugs: ["burns-trauma", "musculoskeletal"],
  },
  "sata-mastery": {
    clientNeedsDomain: "ngn-strategy",
    blueprintTopicSlugs: [],
    relatedPresetIds: ["sata-mastery"],
  },
  "bow-tie-ngn": {
    clientNeedsDomain: "ngn-strategy",
    blueprintTopicSlugs: [],
    relatedPresetIds: ["trap-tier-drill"],
  },
  "case-study-ngn": {
    clientNeedsDomain: "ngn-strategy",
    blueprintTopicSlugs: [],
    relatedPresetIds: ["cat-full-exam"],
  },
};

const DOMAIN_BY_ID = new Map(NCLEX_CLIENT_NEEDS_DOMAINS.map((d) => [d.id, d]));

const BLUEPRINT_TO_TOPIC = new Map<string, string>();
for (const [slug, meta] of Object.entries(NCLEX_TOPIC_REGISTRY)) {
  for (const bp of meta.blueprintTopicSlugs) {
    if (!BLUEPRINT_TO_TOPIC.has(bp)) {
      BLUEPRINT_TO_TOPIC.set(bp, slug);
    }
  }
}

const SUBJECT_PRIMARY_TOPIC: Partial<Record<NclexClientNeedsId, string>> = {
  "management-of-care": "prioritization",
  "safety-infection": "infection-control",
  "health-promotion": "postpartum",
  psychosocial: "psychiatric",
  "basic-care-comfort": "pain-opioids",
  "pharmacology-nursing": "medication-safety",
  "reduction-risk": "dosage-calculations",
  "physiological-adaptation": "sepsis-shock",
};

export function getNclexClientNeedsDomain(id: string): NclexClientNeedsDomain | undefined {
  return DOMAIN_BY_ID.get(id as NclexClientNeedsDomain["id"]);
}

export function getNclexClientNeedsLabel(id: string): string {
  return getNclexClientNeedsDomain(id)?.label ?? id;
}

export function getNclexTopicMeta(slug: string): Partial<NclexTopicMeta> {
  return NCLEX_TOPIC_REGISTRY[slug] ?? {};
}

export function enrichNclexTopic(topic: HighYieldTopic): HighYieldTopic {
  const meta = NCLEX_TOPIC_REGISTRY[topic.slug];
  if (!meta) return topic;
  const domain = getNclexClientNeedsDomain(meta.clientNeedsDomain);
  return {
    ...topic,
    category: domain?.label ?? topic.category,
    clientNeedsDomain: meta.clientNeedsDomain,
    blueprintTopicSlugs: meta.blueprintTopicSlugs,
    relatedDrugClasses: meta.relatedDrugClasses,
    top500DrugSlugs: meta.top500DrugSlugs,
    relatedPresetIds: meta.relatedPresetIds,
  };
}

export function enrichNclexTopics(topics: HighYieldTopic[]): HighYieldTopic[] {
  return topics.map(enrichNclexTopic);
}

export function resolveNclexTopicSlugForBlueprint(blueprintSlug: string): string | undefined {
  return BLUEPRINT_TO_TOPIC.get(blueprintSlug);
}

export function resolveNclexTopicSlugForSubject(subjectId: string): string | undefined {
  const primary = SUBJECT_PRIMARY_TOPIC[subjectId as NclexClientNeedsId];
  if (primary) return primary;
  return undefined;
}

export function getNclexTopicsForDomain(
  topics: HighYieldTopic[],
  domainId: NclexClientNeedsDomain["id"]
): HighYieldTopic[] {
  return topics.filter((t) => t.clientNeedsDomain === domainId);
}

export function groupNclexTopicsByDomain(
  topics: HighYieldTopic[]
): Array<{ domain: NclexClientNeedsDomain; topics: HighYieldTopic[] }> {
  return NCLEX_CLIENT_NEEDS_DOMAINS.map((domain) => ({
    domain,
    topics: topics.filter((t) => t.clientNeedsDomain === domain.id),
  })).filter((g) => g.topics.length > 0);
}
