/**
 * Resolve Deep Dive modules and Top 500 pharmacology cross-links for AANP FNP items.
 */
import { MEMORY_CARDS } from "@/lib/library/seeds";
import { getMemoryCardIdsForTopic } from "@/lib/library/weak-area-map";
import { extractTop500DrugsFromText } from "../nclex-study-meta";
import { enrichRelatedStudyMeta } from "../anatomy-study-meta";
import type { RelatedStudyMeta } from "../seed-helpers";
import {
  aanpFnpSystemModuleSlug,
  getAanpFnp2026Topic,
} from "./blueprint-topics-2026";
import type { AanpFnpClinicalSystemId, AanpFnpDomainId, AanpFnpPatientAgeGroupId } from "./types";

const AANP_FNP_CARD_IDS = new Set(
  MEMORY_CARDS.filter((c) => c.examSlug === "aanp-fnp").map((c) => c.id)
);

const DOMAIN_MODULE: Record<AanpFnpDomainId, string> = {
  assess: "aanp-assess-domain",
  diagnose: "aanp-diagnose-domain",
  plan: "aanp-plan-domain",
  evaluate: "aanp-evaluate-domain",
};

const TOPIC_MODULE_PATTERNS: Array<{ pattern: RegExp; slug: string }> = [
  {
    pattern:
      /\b(acs|stemi|nstemi|coronary|angina|reperfusion|chest pain|atrial fibr|afib|hypertension|htn|heart failure|gdmt|statin|dyslipidemia)\b/i,
    slug: "aanp-system-cardiovascular",
  },
  {
    pattern: /\b(asthma|gina|copd|gold|pneumonia|cap|pe|dvt|pulmonary embol|smoking cessation)\b/i,
    slug: "aanp-system-pulmonary",
  },
  {
    pattern: /\b(diabet|a1c|insulin|metformin|dka|hhs|sglt|glp|thyroid|osteoporosis|obesity)\b/i,
    slug: "aanp-system-endocrine",
  },
  {
    pattern:
      /\b(cap|pneumonia|uti|pyelonephritis|mrsa|antibiotic|hiv|prep|strep|pharyngitis|tuberculosis|\btb\b|immunization|vaccine|stewardship)\b/i,
    slug: "aanp-system-infectious-disease",
  },
  {
    pattern: /\b(gerd|peptic|ibs|ibd|celiac|hepatitis|constipation|diarrhea|hemorrhoid|colorectal)\b/i,
    slug: "aanp-system-gastrointestinal",
  },
  {
    pattern: /\b(osteoarthritis|rheumatoid|back pain|gout|fibromyalgia|sprain|msk)\b/i,
    slug: "aanp-system-musculoskeletal",
  },
  {
    pattern: /\b(migraine|headache|seizure|epilepsy|stroke|tia|dementia|delirium|parkinson|neuropathy)\b/i,
    slug: "aanp-system-neurology",
  },
  {
    pattern: /\b(depression|phq|ssri|anxiety|bipolar|adhd|substance|suicide|insomnia)\b/i,
    slug: "aanp-system-psychiatry-behavioral",
  },
  {
    pattern: /\b(contraception|prenatal|menopause|menstrual|bph|erectile|breast|cervical)\b/i,
    slug: "aanp-system-womens-health",
  },
  {
    pattern: /\b(eczema|psoriasis|acne|skin cancer|conjunctivitis|glaucoma|otitis|sinusitis)\b/i,
    slug: "aanp-system-dermatology-ent",
  },
  { pattern: /\b(sepsis|septic|qsofa|vasopressor|shock)\b/i, slug: "sepsis-shock" },
];

const PEDS_AGE_GROUPS = new Set<AanpFnpPatientAgeGroupId>([
  "newborn",
  "infant",
  "toddler",
  "child",
  "adolescent",
]);

const MAX_MEMORY_CARDS = 4;
const MAX_TOP500_DRUGS = 3;

function filterAanpFnpCardIds(ids: string[]): string[] {
  return ids.filter((id) => AANP_FNP_CARD_IDS.has(id));
}

function collectMemoryCardIds(keys: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const key of keys) {
    for (const id of filterAanpFnpCardIds(getMemoryCardIdsForTopic(key))) {
      if (seen.has(id)) continue;
      seen.add(id);
      out.push(id);
      if (out.length >= MAX_MEMORY_CARDS) return out;
    }
  }
  return out;
}

function matchTopicModule(topic: string, clinicalSystem: string): string | undefined {
  const fromPattern = TOPIC_MODULE_PATTERNS.find((entry) => entry.pattern.test(topic))?.slug;
  if (fromPattern) return fromPattern;

  const topicMeta = getAanpFnp2026Topic(topic);
  if (topicMeta) return aanpFnpSystemModuleSlug(topicMeta.categoryId);

  if (clinicalSystem) {
    return aanpFnpSystemModuleSlug(clinicalSystem as AanpFnpClinicalSystemId);
  }
  return undefined;
}

export type AanpFnpStudyLinkParams = {
  blueprintDomain: AanpFnpDomainId | string;
  clinicalSystem: string;
  blueprintTopic: string;
  patientAgeGroup?: string;
  /** Vignette + stem + rationale text for Top 500 drug cross-links. */
  text?: string;
};

/** Resolve deep-dive module, memory cards, and NAPLEX-style drug links for a generated AANP FNP item. */
export function resolveAanpFnpStudyLinks(params: AanpFnpStudyLinkParams): RelatedStudyMeta {
  const domain = params.blueprintDomain as AanpFnpDomainId;
  const topic = params.blueprintTopic;
  const topicSlug = topic.toLowerCase().replace(/\s+/g, "-");
  const searchText = [params.text, topic, params.clinicalSystem].filter(Boolean).join("\n");

  let reviewModuleSlug = matchTopicModule(searchText, params.clinicalSystem);

  if (
    !reviewModuleSlug &&
    params.patientAgeGroup &&
    PEDS_AGE_GROUPS.has(params.patientAgeGroup as AanpFnpPatientAgeGroupId) &&
    (params.clinicalSystem === "pediatrics" ||
      /\b(pediatric|infant|newborn|adolescent|well-child|immunization|aom|otitis|milestone)\b/i.test(topic))
  ) {
    reviewModuleSlug = "aanp-pediatrics-high-yield";
  }

  if (
    !reviewModuleSlug &&
    params.patientAgeGroup === "older-adult" &&
    (params.clinicalSystem === "geriatrics" ||
      /\b(geriatric|delirium|dementia|falls|beers|polypharmacy|hospice|advance)\b/i.test(topic))
  ) {
    reviewModuleSlug = "aanp-geriatrics-high-yield";
  }

  if (!reviewModuleSlug && DOMAIN_MODULE[domain]) {
    reviewModuleSlug = DOMAIN_MODULE[domain];
  }

  const memoryCardIds = collectMemoryCardIds(
    [reviewModuleSlug, params.clinicalSystem, domain, topicSlug].filter(Boolean) as string[]
  );

  const top500Drugs =
    searchText.trim().length > 0
      ? extractTop500DrugsFromText(searchText, MAX_TOP500_DRUGS)
      : [];

  return {
    ...(reviewModuleSlug ? { reviewModuleSlug } : {}),
    ...(memoryCardIds.length ? { memoryCardIds } : {}),
    ...(top500Drugs.length ? { top500Drugs } : {}),
  };
}

/** Merge study links into ngnPayload — prefer explicit seed links when present. */
export function attachAanpFnpStudyLinks(
  ngnPayload: Record<string, unknown>,
  params: AanpFnpStudyLinkParams,
  inheritFrom?: Record<string, unknown> | null
): Record<string, unknown> {
  const inheritedIds = Array.isArray(inheritFrom?.memoryCardIds)
    ? filterAanpFnpCardIds(inheritFrom.memoryCardIds.map(String)).slice(0, MAX_MEMORY_CARDS)
    : [];
  const inheritedModule =
    typeof inheritFrom?.reviewModuleSlug === "string" ? inheritFrom.reviewModuleSlug : undefined;
  const inheritedDrugs = Array.isArray(inheritFrom?.top500Drugs)
    ? inheritFrom.top500Drugs.map(String).slice(0, MAX_TOP500_DRUGS)
    : [];

  const base =
    inheritedIds.length > 0 || inheritedDrugs.length > 0
      ? {
          reviewModuleSlug: inheritedModule,
          memoryCardIds: inheritedIds,
          top500Drugs: inheritedDrugs,
        }
      : resolveAanpFnpStudyLinks(params);

  const resolved = enrichRelatedStudyMeta(base, {
    reviewModuleSlug: base.reviewModuleSlug,
    subjectId: params.clinicalSystem,
    blueprintSystem: params.clinicalSystem,
    blueprintTopic: params.blueprintTopic,
    memoryCardIds: base.memoryCardIds,
    text: params.text ?? params.blueprintTopic,
  });

  return {
    ...ngnPayload,
    ...(resolved.reviewModuleSlug ? { reviewModuleSlug: resolved.reviewModuleSlug } : {}),
    ...(resolved.memoryCardIds?.length ? { memoryCardIds: resolved.memoryCardIds } : {}),
    ...(resolved.top500Drugs?.length ? { top500Drugs: resolved.top500Drugs } : {}),
    ...(resolved.structureIds?.length ? { structureIds: resolved.structureIds } : {}),
  };
}
