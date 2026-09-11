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
  AanpFnpQuestionFormat,
} from "./types";
import {
  AANP_FNP_AGE_GROUP_LABELS,
  AANP_FNP_AGE_GROUP_WEIGHTS,
  AANP_FNP_DOMAIN_LABELS,
  AANP_FNP_DOMAIN_WEIGHTS,
  AANP_FNP_SELECT_ALL_MIX,
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

const SATA_STEM_FORMATS = [
  "select all interventions that are appropriate",
  "which findings support this diagnosis (select all that apply)",
  "which counseling points should the NP include (select all)",
  "which medications require monitoring labs (select all that apply)",
  "which red-flag features warrant urgent referral (select all)",
] as const;

/** ~12% of new slots are FNP-native select-all (not NCLEX NGN). */
export function questionFormatForIndex(index: number): AanpFnpQuestionFormat {
  // Stable mix without floating RNG: every Nth slot.
  const every = Math.max(2, Math.round(1 / AANP_FNP_SELECT_ALL_MIX));
  return index % every === 0 ? "select_all" : "mcq";
}

export function formatInstructionsForAanp(format: AanpFnpQuestionFormat): string {
  if (format === "select_all") {
    return "Multiple response — 5–6 options, 2–4 correct; correctAnswer comma-separated exact option texts; stem must say select all that apply";
  }
  return "Multiple choice — exactly 4 unique options; single best answer";
}

/**
 * Pick the category with the largest remaining deficit (> 0).
 * Never assigns zero-deficit categories (stops Evaluate / pediatric overfill).
 * Fallback only when every category is already at/above target.
 */
function pickDeficitCategory<T extends string>(
  ids: readonly T[],
  remaining: Record<string, number>,
  fallbackIds: readonly T[]
): T {
  const under = ids
    .filter((id) => (remaining[id] ?? 0) > 0)
    .sort((a, b) => (remaining[b] ?? 0) - (remaining[a] ?? 0));
  if (under.length > 0) return under[0]!;
  return fallbackIds[0] ?? ids[0]!;
}

function pickClinicalSystem(index: number, seed = 0): AanpFnpClinicalSystemId {
  return pickAanpFnp2026ClinicalSystem(index, seed);
}

/** Domains that are safe fallbacks when the bank is already at quota everywhere. */
const DOMAIN_FALLBACK: AanpFnpDomainId[] = ["assess", "diagnose", "plan"];

/** Adult lifespan bands — preferred fallback when peds bands are already overfilled. */
const AGE_FALLBACK: AanpFnpPatientAgeGroupId[] = [
  "older-adult",
  "middle-adult",
  "young-adult",
];

/**
 * Build generation slots prioritizing domains and age groups with the largest deficit.
 * Mutates working deficit copies so a batch does not keep rotating into overfilled buckets.
 */
export function planAanpFnpGenerationSlots(params: {
  count: number;
  domainDeficits: Record<string, number>;
  ageGroupDeficits?: Record<string, number>;
  seed?: number;
}): AanpFnpGenerationSlot[] {
  const { count, domainDeficits, ageGroupDeficits = {}, seed = 0 } = params;
  const slots: AanpFnpGenerationSlot[] = [];

  const domainRemaining: Record<string, number> = {};
  for (const id of DOMAIN_IDS) {
    domainRemaining[id] = Math.max(0, domainDeficits[id] ?? 0);
  }
  const ageRemaining: Record<string, number> = {};
  for (const id of AGE_GROUP_IDS) {
    ageRemaining[id] = Math.max(0, ageGroupDeficits[id] ?? 0);
  }

  for (let i = 0; i < count; i++) {
    const idx = i + seed;
    const blueprintDomain = pickDeficitCategory(DOMAIN_IDS, domainRemaining, DOMAIN_FALLBACK);
    domainRemaining[blueprintDomain] = Math.max(0, (domainRemaining[blueprintDomain] ?? 0) - 1);

    const patientAgeGroup = pickDeficitCategory(AGE_GROUP_IDS, ageRemaining, AGE_FALLBACK);
    ageRemaining[patientAgeGroup] = Math.max(0, (ageRemaining[patientAgeGroup] ?? 0) - 1);

    const clinicalSystem = pickClinicalSystem(idx, seed);
    const blueprintTopic = pickAanpFnp2026BlueprintTopic(clinicalSystem, idx, seed);
    const difficulty = 2 + (idx % 4);
    const questionFormat = questionFormatForIndex(idx);

    slots.push({
      blueprintDomain,
      clinicalSystem,
      patientAgeGroup,
      blueprintTopic,
      difficulty,
      questionFormat,
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

export function stemFormatForIndex(
  index: number,
  questionFormat: AanpFnpQuestionFormat = "mcq"
): string {
  if (questionFormat === "select_all") {
    return SATA_STEM_FORMATS[index % SATA_STEM_FORMATS.length]!;
  }
  return STEM_FORMATS[index % STEM_FORMATS.length]!;
}
