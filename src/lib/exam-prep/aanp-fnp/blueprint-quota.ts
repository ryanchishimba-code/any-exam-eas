/**
 * AANPCB FNP blueprint — proportional quotas and generation slot planning.
 */
import {
  computeAanpFnpClinicalSystemWeightMap,
  highYieldTopicsForSystem,
  pickAanpFnp2026BlueprintTopic,
  pickAanpFnp2026ClinicalSystem,
} from "./blueprint-topics-2026";
import type {
  AanpFnpAgeGroupQuotaRow,
  AanpFnpClinicalSystemId,
  AanpFnpDomainId,
  AanpFnpDomainQuotaRow,
  AanpFnpGenerationSlot,
  AanpFnpPatientAgeGroupId,
} from "./types";
import {
  AANP_FNP_AGE_GROUP_LABELS,
  AANP_FNP_AGE_GROUP_WEIGHTS,
  AANP_FNP_DOMAIN_LABELS,
  AANP_FNP_DOMAIN_WEIGHTS,
  AANP_FNP_TARGET_TOTAL,
} from "./types";
import { AANP_FNP_2026_TOPIC_GROUPS } from "./blueprint-topics-2026";

export { AANP_FNP_BLUEPRINT_SOURCE } from "./types";
export { highYieldTopicsForSystem } from "./blueprint-topics-2026";

export type AanpFnpClinicalSystemQuotaRow = {
  system: AanpFnpClinicalSystemId;
  label: string;
  weight: number;
  targetCount: number;
  currentCount?: number;
  deficit?: number;
};

export type AanpFnpTopicQuotaRow = {
  topicSlug: string;
  label: string;
  clinicalSystem: AanpFnpClinicalSystemId;
  targetCount: number;
  currentCount?: number;
  deficit?: number;
};

const CLINICAL_SYSTEM_WEIGHTS = computeAanpFnpClinicalSystemWeightMap();
const CLINICAL_SYSTEM_IDS = Object.keys(CLINICAL_SYSTEM_WEIGHTS) as AanpFnpClinicalSystemId[];
const DOMAIN_IDS = Object.keys(AANP_FNP_DOMAIN_WEIGHTS) as AanpFnpDomainId[];
const AGE_GROUP_IDS = Object.keys(AANP_FNP_AGE_GROUP_WEIGHTS) as AanpFnpPatientAgeGroupId[];

/** Per clinical-system targets (yield-weighted rotation). */
export function computeAanpFnpClinicalSystemQuotas(
  total = AANP_FNP_TARGET_TOTAL
): AanpFnpClinicalSystemQuotaRow[] {
  return CLINICAL_SYSTEM_IDS.map((system) => {
    const group = AANP_FNP_2026_TOPIC_GROUPS.find((g) => g.categoryId === system);
    return {
      system,
      label: group?.label ?? system,
      weight: CLINICAL_SYSTEM_WEIGHTS[system],
      targetCount: Math.round(total * CLINICAL_SYSTEM_WEIGHTS[system]),
    };
  });
}

/** Per-topic targets — evenly split within each clinical system. */
export function computeAanpFnpTopicQuotas(
  total = AANP_FNP_TARGET_TOTAL
): AanpFnpTopicQuotaRow[] {
  const rows: AanpFnpTopicQuotaRow[] = [];
  for (const group of AANP_FNP_2026_TOPIC_GROUPS) {
    const systemTarget = Math.round(total * CLINICAL_SYSTEM_WEIGHTS[group.categoryId]);
    const perTopic = Math.max(1, Math.round(systemTarget / group.topics.length));
    for (const topic of group.topics) {
      rows.push({
        topicSlug: topic.slug,
        label: topic.label,
        clinicalSystem: group.categoryId,
        targetCount: perTopic,
      });
    }
  }
  return rows;
}

/** Merge live DB counts with clinical-system targets. */
export function mergeAanpFnpClinicalSystemQuotaWithCounts(
  countsBySystem: Record<string, number>,
  total = AANP_FNP_TARGET_TOTAL
): AanpFnpClinicalSystemQuotaRow[] {
  return computeAanpFnpClinicalSystemQuotas(total).map((row) => {
    const currentCount = countsBySystem[row.system] ?? 0;
    return {
      ...row,
      currentCount,
      deficit: Math.max(0, row.targetCount - currentCount),
    };
  });
}

/** Merge live DB counts with per-topic targets (subjectId or blueprintTopic slug). */
export function mergeAanpFnpTopicQuotaWithCounts(
  countsByTopic: Record<string, number>,
  total = AANP_FNP_TARGET_TOTAL
): AanpFnpTopicQuotaRow[] {
  return computeAanpFnpTopicQuotas(total).map((row) => {
    const currentCount = countsByTopic[row.topicSlug] ?? 0;
    return {
      ...row,
      currentCount,
      deficit: Math.max(0, row.targetCount - currentCount),
    };
  });
}

/** Per-domain question targets for a given bank size (default 6000). */
export function computeAanpFnpDomainQuotas(
  total = AANP_FNP_TARGET_TOTAL
): AanpFnpDomainQuotaRow[] {
  return DOMAIN_IDS.map((domain) => ({
    domain,
    label: AANP_FNP_DOMAIN_LABELS[domain],
    weight: AANP_FNP_DOMAIN_WEIGHTS[domain],
    targetCount: Math.round(total * AANP_FNP_DOMAIN_WEIGHTS[domain]),
  }));
}

/** Per age-group targets (cross-cutting lifespan dimension). */
export function computeAanpFnpAgeGroupQuotas(
  total = AANP_FNP_TARGET_TOTAL
): AanpFnpAgeGroupQuotaRow[] {
  return AGE_GROUP_IDS.map((ageGroup) => ({
    ageGroup,
    label: AANP_FNP_AGE_GROUP_LABELS[ageGroup],
    weight: AANP_FNP_AGE_GROUP_WEIGHTS[ageGroup],
    targetCount: Math.round(total * AANP_FNP_AGE_GROUP_WEIGHTS[ageGroup]),
  }));
}

/** Target count for one domain at a given bank size. */
export function getAanpFnpDomainTarget(
  domain: string,
  total = AANP_FNP_TARGET_TOTAL
): number {
  const row = computeAanpFnpDomainQuotas(total).find((q) => q.domain === domain);
  return row?.targetCount ?? Math.round(total / DOMAIN_IDS.length);
}

/** Merge live DB counts with blueprint domain targets. */
export function mergeAanpFnpDomainQuotaWithCounts(
  countsByDomain: Record<string, number>,
  total = AANP_FNP_TARGET_TOTAL
): AanpFnpDomainQuotaRow[] {
  return computeAanpFnpDomainQuotas(total).map((row) => {
    const currentCount = countsByDomain[row.domain] ?? 0;
    return {
      ...row,
      currentCount,
      deficit: Math.max(0, row.targetCount - currentCount),
    };
  });
}

/** Merge live DB counts with age-group targets. */
export function mergeAanpFnpAgeGroupQuotaWithCounts(
  countsByAgeGroup: Record<string, number>,
  total = AANP_FNP_TARGET_TOTAL
): AanpFnpAgeGroupQuotaRow[] {
  return computeAanpFnpAgeGroupQuotas(total).map((row) => {
    const currentCount = countsByAgeGroup[row.ageGroup] ?? 0;
    return {
      ...row,
      currentCount,
      deficit: Math.max(0, row.targetCount - currentCount),
    };
  });
}

/** Lead-in stem formats to rotate for batch diversity. */
const STEM_FORMATS = [
  "most likely diagnosis",
  "most appropriate next step in management",
  "most appropriate initial diagnostic study",
  "most appropriate pharmacotherapy",
  "best explanation for the findings",
  "most appropriate preventive measure",
  "most appropriate follow-up plan",
  "most appropriate physical exam finding to assess next",
] as const;

function pickDomainForSlot(index: number, deficits: Record<string, number>): AanpFnpDomainId {
  const sorted = [...DOMAIN_IDS].sort(
    (a, b) => (deficits[b] ?? getAanpFnpDomainTarget(b)) - (deficits[a] ?? getAanpFnpDomainTarget(a))
  );
  return sorted[index % sorted.length]!;
}

function pickAgeGroupForSlot(index: number, deficits: Record<string, number>): AanpFnpPatientAgeGroupId {
  const sorted = [...AGE_GROUP_IDS].sort((a, b) => {
    const weightA = AANP_FNP_AGE_GROUP_WEIGHTS[a];
    const weightB = AANP_FNP_AGE_GROUP_WEIGHTS[b];
    const deficitA = deficits[a] ?? Math.round(AANP_FNP_TARGET_TOTAL * weightA);
    const deficitB = deficits[b] ?? Math.round(AANP_FNP_TARGET_TOTAL * weightB);
    return deficitB - deficitA;
  });
  return sorted[index % sorted.length]!;
}

function pickClinicalSystem(index: number, seed = 0): AanpFnpClinicalSystemId {
  return pickAanpFnp2026ClinicalSystem(index, seed);
}

/**
 * Build generation slots prioritizing domains and age groups with the largest deficit.
 */
export function planAanpFnpGenerationSlots(params: {
  count: number;
  domainDeficits: Record<string, number>;
  ageGroupDeficits?: Record<string, number>;
  seed?: number;
}): AanpFnpGenerationSlot[] {
  const { count, domainDeficits, ageGroupDeficits = {}, seed = 0 } = params;
  const slots: AanpFnpGenerationSlot[] = [];

  for (let i = 0; i < count; i++) {
    const idx = i + seed;
    const blueprintDomain = pickDomainForSlot(idx, domainDeficits);
    const patientAgeGroup = pickAgeGroupForSlot(idx, ageGroupDeficits);
    const clinicalSystem = pickClinicalSystem(idx, seed);
    const blueprintTopic = pickAanpFnp2026BlueprintTopic(clinicalSystem, idx, seed);
    const difficulty = 2 + (idx % 4);

    slots.push({
      blueprintDomain,
      clinicalSystem,
      patientAgeGroup,
      blueprintTopic,
      difficulty,
    });
  }

  return slots;
}

/** Validate that category counts are within ±5% of blueprint weights. */
export function assessAanpFnpBlueprintAlignment(
  countsByDomain: Record<string, number>,
  total: number
): {
  aligned: boolean;
  deviations: { domain: string; expected: number; actual: number; deltaPct: number }[];
} {
  const quotas = computeAanpFnpDomainQuotas(total);
  const deviations = quotas.map((q) => {
    const actual = countsByDomain[q.domain] ?? 0;
    const expected = q.targetCount;
    const deltaPct =
      expected > 0 ? Math.round(((actual - expected) / expected) * 100) : 0;
    return { domain: q.domain, expected, actual, deltaPct };
  });
  const aligned = deviations.every((d) => Math.abs(d.deltaPct) <= 5);
  return { aligned, deviations };
}

export function stemFormatForIndex(index: number): string {
  return STEM_FORMATS[index % STEM_FORMATS.length]!;
}
