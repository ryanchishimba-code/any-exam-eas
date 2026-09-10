/**
 * AANP FNP study presets — domain, lifespan, pharm, preventive, SATA, timed mock.
 * Packaging that converts like APEA / Barkley study paths (QBank blocks, not a video course).
 */
import { MIXED_SUBJECT_ID, spacedReviewHref } from "@/lib/edtech/practice-links-core";
import { fullExamLaunchHref } from "@/lib/full-exam/config";
import type { ExamSlug } from "@/types/edtech";
import type { AanpFnpDomainId, AanpFnpLifespanBandId } from "./types";

export type AanpFnpStudyPresetId =
  | "assess-domain-block"
  | "diagnose-domain-block"
  | "plan-domain-block"
  | "evaluate-domain-block"
  | "pediatrics-lifespan"
  | "geriatrics-lifespan"
  | "womens-health-block"
  | "pharm-therapeutics-block"
  | "preventive-uspstf-block"
  | "sata-mastery"
  | "cardiovascular-high-yield"
  | "timed-full-mock"
  | "silent-weak-area";

export type AanpFnpStudyPreset = {
  id: AanpFnpStudyPresetId;
  title: string;
  description: string;
  count: number;
  timed?: boolean;
  timeLimitMin?: number;
  /** Query param passed to /api/questions */
  aanpFnpPreset: AanpFnpStudyPresetId;
  blueprintDomain?: AanpFnpDomainId;
  lifespanBand?: AanpFnpLifespanBandId;
  clinicalSystem?: string;
  itemTypes?: string[];
  tags?: string[];
  blueprintTopicIncludes?: string[];
  subjectId?: string;
};

export const AANP_FNP_STUDY_PRESETS: AanpFnpStudyPreset[] = [
  {
    id: "assess-domain-block",
    title: "Assess Domain Block",
    description: "25 history, exam, and screening items — cue recognition across the lifespan.",
    count: 25,
    aanpFnpPreset: "assess-domain-block",
    blueprintDomain: "assess",
  },
  {
    id: "diagnose-domain-block",
    title: "Diagnose Domain Block",
    description: "25 differential and diagnostic-study items — choose the most likely / next test.",
    count: 25,
    aanpFnpPreset: "diagnose-domain-block",
    blueprintDomain: "diagnose",
  },
  {
    id: "plan-domain-block",
    title: "Plan Domain Block",
    description: "25 management and pharmacotherapy items — first-line plans and counseling.",
    count: 25,
    aanpFnpPreset: "plan-domain-block",
    blueprintDomain: "plan",
  },
  {
    id: "evaluate-domain-block",
    title: "Evaluate Domain Block",
    description: "20 follow-up, monitoring, and outcome items — when to escalate or refer.",
    count: 20,
    aanpFnpPreset: "evaluate-domain-block",
    blueprintDomain: "evaluate",
  },
  {
    id: "pediatrics-lifespan",
    title: "Pediatrics Lifespan",
    description: "20 well-child, development, immunization, and common pediatric illness items.",
    count: 20,
    aanpFnpPreset: "pediatrics-lifespan",
    lifespanBand: "pediatrics",
    clinicalSystem: "pediatrics",
  },
  {
    id: "geriatrics-lifespan",
    title: "Geriatrics Lifespan",
    description: "20 falls, frailty, polypharmacy, Beers, and delirium-vs-dementia items.",
    count: 20,
    aanpFnpPreset: "geriatrics-lifespan",
    lifespanBand: "geriatrics",
    clinicalSystem: "geriatrics",
  },
  {
    id: "womens-health-block",
    title: "Women's Health Block",
    description: "20 contraception, prenatal, menopause, and cancer-screening items.",
    count: 20,
    aanpFnpPreset: "womens-health-block",
    lifespanBand: "womens-health",
    clinicalSystem: "womens-health",
  },
  {
    id: "pharm-therapeutics-block",
    title: "Pharm & Therapeutics",
    description: "25 prescribing, monitoring, interactions, and guideline-tied drug choices.",
    count: 25,
    aanpFnpPreset: "pharm-therapeutics-block",
    tags: ["pharmacology", "pharmacotherapeutics"],
    blueprintTopicIncludes: [
      "pharmacology",
      "diabetes-ada",
      "hypertension-jnc",
      "heart-failure",
      "asthma-gina",
      "copd-gold",
      "beers-criteria",
      "antibiotic-selection",
    ],
  },
  {
    id: "preventive-uspstf-block",
    title: "Preventive & USPSTF",
    description: "20 screening, counseling, and health-promotion items across adulthood.",
    count: 20,
    aanpFnpPreset: "preventive-uspstf-block",
    tags: ["prevention", "screening", "uspstf"],
    blueprintTopicIncludes: [
      "health-promotion-uspstf",
      "colorectal-cancer-screening",
      "breast-cervical-cancer",
      "vaccinations-lifespan",
      "smoking-cessation",
    ],
  },
  {
    id: "sata-mastery",
    title: "SATA Mastery Block",
    description: "15 select-all-that-apply items — multi-correct primary-care decisions.",
    count: 15,
    aanpFnpPreset: "sata-mastery",
    itemTypes: ["select_all", "sata"],
  },
  {
    id: "cardiovascular-high-yield",
    title: "Cardiovascular High-Yield",
    description: "20 HTN, lipids, HF, AFib anticoagulation, and angina items.",
    count: 20,
    aanpFnpPreset: "cardiovascular-high-yield",
    clinicalSystem: "cardiovascular",
    subjectId: "cardiovascular",
  },
  {
    id: "timed-full-mock",
    title: "Timed Full Mock",
    description: "150-question AANP-style timed mock — blueprint-mixed, exam pace.",
    count: 150,
    timed: true,
    timeLimitMin: 180,
    aanpFnpPreset: "timed-full-mock",
  },
  {
    id: "silent-weak-area",
    title: "Silent Weak-Area Review",
    description: "Adaptive 30Q on your lowest-readiness domains — no score noise.",
    count: 30,
    aanpFnpPreset: "silent-weak-area",
  },
];

export type AanpFnpFourWeekDay = {
  day: number;
  label: string;
  presetIds: AanpFnpStudyPresetId[];
};

export const AANP_FNP_FOUR_WEEK_PLAN: {
  week: number;
  title: string;
  days: AanpFnpFourWeekDay[];
}[] = [
  {
    week: 1,
    title: "Domains — Assess & Diagnose",
    days: [
      { day: 1, label: "Assess domain 25Q", presetIds: ["assess-domain-block"] },
      { day: 2, label: "Diagnose domain 25Q", presetIds: ["diagnose-domain-block"] },
      { day: 3, label: "Cardiovascular HY", presetIds: ["cardiovascular-high-yield"] },
      { day: 4, label: "SATA mastery", presetIds: ["sata-mastery"] },
      { day: 5, label: "Preventive USPSTF", presetIds: ["preventive-uspstf-block"] },
      { day: 6, label: "Silent weak-area", presetIds: ["silent-weak-area"] },
      { day: 7, label: "Rest / flashcards", presetIds: [] },
    ],
  },
  {
    week: 2,
    title: "Plan, Pharm & Evaluate",
    days: [
      { day: 1, label: "Plan domain 25Q", presetIds: ["plan-domain-block"] },
      { day: 2, label: "Pharm therapeutics", presetIds: ["pharm-therapeutics-block"] },
      { day: 3, label: "Evaluate domain", presetIds: ["evaluate-domain-block"] },
      { day: 4, label: "SATA + plan mix", presetIds: ["sata-mastery", "plan-domain-block"] },
      { day: 5, label: "Cardiovascular HY", presetIds: ["cardiovascular-high-yield"] },
      { day: 6, label: "Silent weak-area", presetIds: ["silent-weak-area"] },
      { day: 7, label: "Rest", presetIds: [] },
    ],
  },
  {
    week: 3,
    title: "Lifespan — Peds, Geri, Women's Health",
    days: [
      { day: 1, label: "Pediatrics lifespan", presetIds: ["pediatrics-lifespan"] },
      { day: 2, label: "Geriatrics lifespan", presetIds: ["geriatrics-lifespan"] },
      { day: 3, label: "Women's health", presetIds: ["womens-health-block"] },
      { day: 4, label: "Preventive USPSTF", presetIds: ["preventive-uspstf-block"] },
      { day: 5, label: "Pharm therapeutics", presetIds: ["pharm-therapeutics-block"] },
      { day: 6, label: "Silent weak-area", presetIds: ["silent-weak-area"] },
      { day: 7, label: "Rest", presetIds: [] },
    ],
  },
  {
    week: 4,
    title: "Exam Simulation & Readiness",
    days: [
      { day: 1, label: "Assess + diagnose mix", presetIds: ["assess-domain-block", "diagnose-domain-block"] },
      { day: 2, label: "SATA mastery", presetIds: ["sata-mastery"] },
      { day: 3, label: "Timed full mock", presetIds: ["timed-full-mock"] },
      { day: 4, label: "Silent weak-area", presetIds: ["silent-weak-area"] },
      { day: 5, label: "Lifespan review", presetIds: ["pediatrics-lifespan", "geriatrics-lifespan"] },
      { day: 6, label: "Review missed only", presetIds: [] },
      { day: 7, label: "Light assess 25Q", presetIds: ["assess-domain-block"] },
    ],
  },
];

const BY_ID = new Map(AANP_FNP_STUDY_PRESETS.map((p) => [p.id, p]));

export function getAanpFnpStudyPreset(
  id: string
): AanpFnpStudyPreset | undefined {
  return BY_ID.get(id as AanpFnpStudyPresetId);
}

export function aanpFnpPresetPracticeHref(
  examSlug: ExamSlug,
  preset: AanpFnpStudyPreset,
  fieldId = "aanp-fnp"
): string {
  if (preset.id === "silent-weak-area") {
    return `${spacedReviewHref(examSlug, preset.count)}&autostart=1`;
  }

  if (preset.id === "timed-full-mock") {
    return fullExamLaunchHref(examSlug, { mode: "full", autostart: true });
  }

  const qs = new URLSearchParams({
    field: fieldId,
    mode: "bank",
    count: String(preset.count),
    aanpFnpPreset: preset.aanpFnpPreset,
    autostart: "1",
  });
  qs.set("subjectId", preset.subjectId ?? MIXED_SUBJECT_ID);
  if (preset.timed) qs.set("timed", "1");
  if (preset.timeLimitMin) qs.set("timeLimitMin", String(preset.timeLimitMin));
  return `/question-bank?${qs.toString()}`;
}
