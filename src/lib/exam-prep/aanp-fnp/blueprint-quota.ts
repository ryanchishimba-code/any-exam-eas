/**
 * AANPCB FNP blueprint — proportional quotas and generation slot planning.
 */
import { AANP_FNP_SUBJECTS } from "@/lib/subjects/aanp-fnp/subjects";
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

export { AANP_FNP_BLUEPRINT_SOURCE } from "./types";

const CLINICAL_SYSTEM_IDS = AANP_FNP_SUBJECTS.filter((s) =>
  ["cardiovascular", "pulmonary", "endocrine", "womens-health", "pediatrics", "geriatrics", "psychiatry-behavioral", "infectious-disease"].includes(
    s.id
  )
).map((s) => s.id as AanpFnpClinicalSystemId);

const DOMAIN_IDS = Object.keys(AANP_FNP_DOMAIN_WEIGHTS) as AanpFnpDomainId[];
const AGE_GROUP_IDS = Object.keys(AANP_FNP_AGE_GROUP_WEIGHTS) as AanpFnpPatientAgeGroupId[];

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

/** High-yield topic examples per clinical system. */
export function highYieldTopicsForSystem(
  clinicalSystem: AanpFnpClinicalSystemId
): string[] {
  const map: Record<AanpFnpClinicalSystemId, string[]> = {
    cardiovascular: ["hypertension", "heart failure", "ACS", "atrial fibrillation", "lipid management"],
    pulmonary: ["asthma", "COPD", "pneumonia", "PE", "sleep apnea"],
    endocrine: ["type 2 diabetes", "thyroid disorders", "DKA", "obesity", "osteoporosis"],
    "womens-health": ["prenatal care", "contraception", "menopause", "STI screening", "breast health"],
    pediatrics: ["well-child", "febrile infant", "ADHD", "immunizations", "developmental milestones"],
    geriatrics: ["polypharmacy", "falls", "delirium", "dementia", "Beers Criteria"],
    "psychiatry-behavioral": ["depression", "anxiety", "substance use", "suicide risk", "SSRI monitoring"],
    "infectious-disease": ["UTI", "CAP", "HIV", "sepsis", "antibiotic selection"],
  };
  return map[clinicalSystem] ?? [];
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

function pickClinicalSystem(index: number): AanpFnpClinicalSystemId {
  return CLINICAL_SYSTEM_IDS[index % CLINICAL_SYSTEM_IDS.length]!;
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
    const clinicalSystem = pickClinicalSystem(idx);
    const topics = highYieldTopicsForSystem(clinicalSystem);
    const blueprintTopic = topics[idx % topics.length] ?? clinicalSystem;
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
