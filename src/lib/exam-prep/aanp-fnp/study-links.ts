import { MEMORY_CARDS } from "@/lib/library/seeds";
import { getMemoryCardIdsForTopic } from "@/lib/library/weak-area-map";
import type { RelatedStudyMeta } from "../seed-helpers";
import type { AanpFnpDomainId, AanpFnpPatientAgeGroupId } from "./types";

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
      /\b(acs|stemi|nstemi|coronary|angina|reperfusion|chest pain|atrial fibr|afib|hypertension|htn)\b/i,
    slug: "acute-coronary-syndrome",
  },
  { pattern: /\b(sepsis|septic|qsofa|vasopressor|shock)\b/i, slug: "sepsis-shock" },
  {
    pattern: /\b(diabet|a1c|insulin|metformin|dka|hhs|sglt|glp|hypoglycemia)\b/i,
    slug: "insulin-diabetes-management",
  },
  {
    pattern:
      /\b(cap|pneumonia|uti|pyelonephritis|mrsa|antibiotic|hiv|prep|strep|pharyngitis|tuberculosis|\btb\b|immunization|vaccine|infection)\b/i,
    slug: "infectious-disease",
  },
  { pattern: /\b(asthma|copd|pulmonary|dyspnea)\b/i, slug: "aanp-plan-domain" },
  { pattern: /\b(depression|phq|ssri|anxiety|bipolar)\b/i, slug: "aanp-plan-domain" },
];

const PEDS_AGE_GROUPS = new Set<AanpFnpPatientAgeGroupId>([
  "newborn",
  "infant",
  "toddler",
  "child",
  "adolescent",
]);

const MAX_MEMORY_CARDS = 4;

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

function matchTopicModule(topic: string): string | undefined {
  return TOPIC_MODULE_PATTERNS.find((entry) => entry.pattern.test(topic))?.slug;
}

export type AanpFnpStudyLinkParams = {
  blueprintDomain: AanpFnpDomainId | string;
  clinicalSystem: string;
  blueprintTopic: string;
  patientAgeGroup?: string;
};

/** Resolve deep-dive module + memory cards for a generated AANP FNP item. */
export function resolveAanpFnpStudyLinks(params: AanpFnpStudyLinkParams): RelatedStudyMeta {
  const domain = params.blueprintDomain as AanpFnpDomainId;
  const topic = params.blueprintTopic;
  const topicSlug = topic.toLowerCase().replace(/\s+/g, "-");

  let reviewModuleSlug = matchTopicModule(topic);

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

  return {
    ...(reviewModuleSlug ? { reviewModuleSlug } : {}),
    ...(memoryCardIds.length ? { memoryCardIds } : {}),
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

  const resolved =
    inheritedIds.length > 0
      ? {
          reviewModuleSlug: inheritedModule,
          memoryCardIds: inheritedIds,
        }
      : resolveAanpFnpStudyLinks(params);

  return {
    ...ngnPayload,
    ...(resolved.reviewModuleSlug ? { reviewModuleSlug: resolved.reviewModuleSlug } : {}),
    ...(resolved.memoryCardIds?.length ? { memoryCardIds: resolved.memoryCardIds } : {}),
  };
}
