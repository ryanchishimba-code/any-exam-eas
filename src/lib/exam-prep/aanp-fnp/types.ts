/**
 * AANPCB FNP Content Outline (2024+ blueprint).
 * Source: https://www.aanpcert.org/certs/fnp
 */

export const AANP_FNP_BLUEPRINT_SOURCE =
  "AANPCB FNP Content Outline (2024+ blueprint)";

/** Official target for the curated + AI-generated AANP FNP bank. */
export const AANP_FNP_TARGET_TOTAL = 6000;

/** Recommended seed count per blueprint domain before bulk AI generation. */
export const AANP_FNP_SEED_TARGET_PER_DOMAIN = 250;

/** Default AI batch size for generation runs. */
export const AANP_FNP_GENERATION_BATCH_SIZE = 500;

/** Items generated per OpenAI call (must satisfy batch-of-10 diversity rules). */
export const AANP_FNP_GENERATION_CHUNK_SIZE = 10;

/** Parallel OpenAI chunk requests during batch generation. */
export const AANP_FNP_GENERATION_CONCURRENCY = 5;

/** Default variants created per curated seed in hybrid pipeline. */
export const AANP_FNP_VARIANTS_PER_SEED = 4;

export const AANP_FNP_GENERATION_VERSION = "gpt-4o-mini-aanp-fnp-v3-hybrid";

export type AanpFnpReviewStatus = "pending" | "approved" | "flagged" | "rejected";

/** AANP cognitive domains (primary blueprint dimension). */
export type AanpFnpDomainId = "assess" | "diagnose" | "plan" | "evaluate";

/** Cross-cutting patient lifespan bands on the AANP FNP exam. */
export type AanpFnpPatientAgeGroupId =
  | "newborn"
  | "infant"
  | "toddler"
  | "child"
  | "adolescent"
  | "young-adult"
  | "middle-adult"
  | "older-adult";

/** Clinical system subject ids (secondary stratification). */
export type AanpFnpClinicalSystemId =
  | "cardiovascular"
  | "pulmonary"
  | "endocrine"
  | "womens-health"
  | "pediatrics"
  | "geriatrics"
  | "psychiatry-behavioral"
  | "infectious-disease";

export type AanpFnpGenerationSlot = {
  blueprintDomain: AanpFnpDomainId;
  clinicalSystem: AanpFnpClinicalSystemId;
  patientAgeGroup: AanpFnpPatientAgeGroupId;
  blueprintTopic: string;
  difficulty: number;
};

export type AanpFnpGenerationMeta = {
  batchId: string;
  slotIndex: number;
  model: string;
  pipelineVersion: string;
  blueprintAligned: boolean;
  difficultyRating?: number;
  qcScore?: number;
  qcFlags?: string[];
  seedExemplarIds?: string[];
  generatedAt: string;
};

export type AanpFnpDomainQuotaRow = {
  domain: AanpFnpDomainId;
  label: string;
  weight: number;
  targetCount: number;
  currentCount?: number;
  deficit?: number;
};

export type AanpFnpAgeGroupQuotaRow = {
  ageGroup: AanpFnpPatientAgeGroupId;
  label: string;
  weight: number;
  targetCount: number;
  currentCount?: number;
  deficit?: number;
};

/** Official domain weights (AANPCB 2024+). */
export const AANP_FNP_DOMAIN_WEIGHTS: Record<AanpFnpDomainId, number> = {
  assess: 0.32,
  diagnose: 0.265,
  plan: 0.265,
  evaluate: 0.15,
};

/** Official patient age group weights (AANPCB 2024+). */
export const AANP_FNP_AGE_GROUP_WEIGHTS: Record<AanpFnpPatientAgeGroupId, number> = {
  newborn: 0.02,
  infant: 0.03,
  toddler: 0.04,
  child: 0.04,
  adolescent: 0.09,
  "young-adult": 0.22,
  "middle-adult": 0.26,
  "older-adult": 0.3,
};

export const AANP_FNP_DOMAIN_LABELS: Record<AanpFnpDomainId, string> = {
  assess: "Assess",
  diagnose: "Diagnose",
  plan: "Plan",
  evaluate: "Evaluate",
};

export const AANP_FNP_AGE_GROUP_LABELS: Record<AanpFnpPatientAgeGroupId, string> = {
  newborn: "Newborn (0–28 days)",
  infant: "Infant (1–12 months)",
  toddler: "Toddler (1–3 years)",
  child: "Child (3–12 years)",
  adolescent: "Adolescent (13–17 years)",
  "young-adult": "Young Adult (18–39 years)",
  "middle-adult": "Middle Adult (40–64 years)",
  "older-adult": "Older Adult (65+ years)",
};
