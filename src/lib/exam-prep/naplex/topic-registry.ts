/**
 * NAPLEX high-yield topic registry — maps NABP content domains to Study Hub topic cards.
 */
import type { HighYieldTopic } from "@/types/edtech";
import type { NaplexContentDomainId } from "@/lib/exam-prep/naplex/content-outline";

export type NaplexContentDomain = {
  id: NaplexContentDomainId;
  label: string;
  shortLabel: string;
  weightPct: number;
  sortOrder: number;
};

/** NABP five-domain outline for Study Hub navigation (weights approximate). */
export const NAPLEX_CONTENT_DOMAINS: NaplexContentDomain[] = [
  {
    id: "naplex-area1-foundations",
    label: "Foundational Knowledge (~25%)",
    shortLabel: "Foundations",
    weightPct: 25,
    sortOrder: 0,
  },
  {
    id: "naplex-area2-therapeutics",
    label: "Medication Use Process (~25%)",
    shortLabel: "Med Use Process",
    weightPct: 25,
    sortOrder: 1,
  },
  {
    id: "naplex-area3-treatment-planning",
    label: "Treatment Planning (~40%)",
    shortLabel: "Treatment Planning",
    weightPct: 40,
    sortOrder: 2,
  },
  {
    id: "naplex-area4-safety",
    label: "Professional Practice",
    shortLabel: "Prof. Practice",
    weightPct: 5,
    sortOrder: 3,
  },
  {
    id: "naplex-area5-management",
    label: "Management & Leadership",
    shortLabel: "Management",
    weightPct: 5,
    sortOrder: 4,
  },
];

export type NaplexTopicMeta = {
  contentDomain: NaplexContentDomainId;
  blueprintTopicSlugs?: string[];
  primary?: boolean;
};

export const NAPLEX_TOPIC_REGISTRY: Record<string, NaplexTopicMeta> = {
  // Review modules
  "heart-failure-gdmt": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["heart failure GDMT"],
    primary: true,
  },
  "anticoagulation-reversal": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["anticoagulation DOACs"],
    primary: true,
  },
  "insulin-diabetes-management": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["diabetes pharmacotherapy"],
    primary: true,
  },
  "antibiotics-stewardship": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["antibiotic stewardship"],
    primary: true,
  },
  "controlled-substances": {
    contentDomain: "naplex-area4-safety",
    blueprintTopicSlugs: ["controlled substances"],
    primary: true,
  },
  "calculations-workshop": {
    contentDomain: "naplex-area1-foundations",
    blueprintTopicSlugs: ["calculations"],
    primary: true,
  },
  "asthma-copd-inhalers": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["asthma COPD inhalers"],
    primary: true,
  },
  "psychotropics-monitoring": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["psychotropic monitoring"],
  },
  "renal-ckd-pharmacotherapy": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["renal dose adjustment"],
    primary: true,
  },
  "toxicology-antidotes": {
    contentDomain: "naplex-area1-foundations",
    blueprintTopicSlugs: ["toxicology antidotes"],
    primary: true,
  },
  "geriatrics-beers": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["special populations"],
  },
  "tdm-monitoring": {
    contentDomain: "naplex-area2-therapeutics",
    blueprintTopicSlugs: ["TDM"],
    primary: true,
  },
  "gi-pharmacotherapy": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["GERD PUD IBD"],
  },
  // Core seed topics
  "biostatistics-study-design": {
    contentDomain: "naplex-area1-foundations",
    blueprintTopicSlugs: ["NNT/ARR", "biostatistics"],
  },
  "antihypertensive-drug-classes": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["hypertension guidelines"],
  },
  "drug-interactions-qt-prolongation": {
    contentDomain: "naplex-area1-foundations",
    blueprintTopicSlugs: ["CYP interactions"],
  },
  "calculations-drip-rates": {
    contentDomain: "naplex-area1-foundations",
    blueprintTopicSlugs: ["calculations", "IV rates"],
  },
  "calculations-creatinine-clearance": {
    contentDomain: "naplex-area1-foundations",
    blueprintTopicSlugs: ["renal dose adjustment"],
  },
  "adverse-drug-reactions": {
    contentDomain: "naplex-area2-therapeutics",
    blueprintTopicSlugs: ["medication safety"],
  },
  "patient-counseling": {
    contentDomain: "naplex-area4-safety",
    blueprintTopicSlugs: ["patient counseling"],
  },
  "immunizations": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["immunizations"],
  },
  "compounding-basics": {
    contentDomain: "naplex-area1-foundations",
    blueprintTopicSlugs: ["compounding", "USP compounding"],
  },
  "otc-triage": {
    contentDomain: "naplex-area4-safety",
    blueprintTopicSlugs: ["OTC self-care"],
  },
  "hiv-opportunistic-infections": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["HIV prophylaxis"],
  },
  "special-populations-pregnancy-lactation": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["special populations"],
  },
  "sig-code-abbreviations": {
    contentDomain: "naplex-area2-therapeutics",
    blueprintTopicSlugs: ["dispensing verification"],
  },
  // Extended topics
  "pharmacokinetics-pk-pd": {
    contentDomain: "naplex-area1-foundations",
    blueprintTopicSlugs: ["PK/PD"],
    primary: true,
  },
  "dyslipidemia-statins": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["dyslipidemia"],
  },
  "oncology-supportive-care": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["oncology toxicities"],
  },
  "seizure-epilepsy": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["epilepsy"],
  },
  "thyroid-pharmacotherapy": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["thyroid"],
  },
  "pain-opioid-management": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["pain opioids"],
  },
  "pediatric-pharmacy": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["pediatrics"],
  },
  "hepatitis-liver-disease": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["hepatitis liver"],
  },
  pharmacogenomics: {
    contentDomain: "naplex-area1-foundations",
    blueprintTopicSlugs: ["pharmacogenomics"],
  },
  "medication-safety-ismp": {
    contentDomain: "naplex-area2-therapeutics",
    blueprintTopicSlugs: ["ISMP high-alert", "medication safety"],
  },
  "hipaa-pharmacy-ethics": {
    contentDomain: "naplex-area4-safety",
    blueprintTopicSlugs: ["HIPAA", "ethics"],
  },
  "pharmacy-management": {
    contentDomain: "naplex-area5-management",
    blueprintTopicSlugs: ["inventory", "formulary", "reimbursement"],
    primary: true,
  },
  "contraception-womens-health": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["contraception"],
  },
  "cap-pneumonia-regimens": {
    contentDomain: "naplex-area3-treatment-planning",
    blueprintTopicSlugs: ["pneumonia CAP"],
  },
};

const DOMAIN_BY_ID = new Map(NAPLEX_CONTENT_DOMAINS.map((d) => [d.id, d]));

export function getNaplexContentDomain(id: string): NaplexContentDomain | undefined {
  return DOMAIN_BY_ID.get(id as NaplexContentDomainId);
}

export function getNaplexTopicMeta(slug: string): Partial<NaplexTopicMeta> {
  return NAPLEX_TOPIC_REGISTRY[slug] ?? {};
}

export function enrichNaplexTopic(topic: HighYieldTopic): HighYieldTopic {
  const meta = NAPLEX_TOPIC_REGISTRY[topic.slug];
  if (!meta) return topic;
  const domain = getNaplexContentDomain(meta.contentDomain);
  return {
    ...topic,
    category: domain?.label ?? topic.category,
    clientNeedsDomain: meta.contentDomain,
    blueprintTopicSlugs: meta.blueprintTopicSlugs,
  };
}

export function enrichNaplexTopics(topics: HighYieldTopic[]): HighYieldTopic[] {
  return topics.map(enrichNaplexTopic);
}

export function groupNaplexTopicsByDomain(
  topics: HighYieldTopic[]
): Array<{ domain: NaplexContentDomain; topics: HighYieldTopic[] }> {
  return NAPLEX_CONTENT_DOMAINS.map((domain) => ({
    domain,
    topics: topics.filter((t) => t.clientNeedsDomain === domain.id),
  })).filter((g) => g.topics.length > 0);
}

export function resolveNaplexTopicSlugForBlueprint(blueprintSlug: string): string | undefined {
  for (const [slug, meta] of Object.entries(NAPLEX_TOPIC_REGISTRY)) {
    if (meta.blueprintTopicSlugs?.some((b) => b.toLowerCase().includes(blueprintSlug.toLowerCase()))) {
      return slug;
    }
  }
  return undefined;
}
