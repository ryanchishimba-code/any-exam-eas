/**
 * USMLE step-scoped study blocks — timed practice linked from topic hub & roadmap.
 */
import { practiceTopicHref } from "@/lib/edtech/practice-links";
import type { ExamSlug } from "@/types/edtech";
import type { UsmleStepLevel } from "./types";

export type UsmleStudyPresetId =
  | "step1-pharm-drill"
  | "step1-path-drill"
  | "step2-cardiology-block"
  | "step2-pulmonary-block"
  | "step2-id-block"
  | "step2-endocrine-block"
  | "step2-psych-block"
  | "step3-biostats-sprint"
  | "step3-ccs-drill";

export type UsmleStudyPreset = {
  id: UsmleStudyPresetId;
  title: string;
  description: string;
  count: number;
  stepLevel: UsmleStepLevel;
  subjectId: string;
  timed?: boolean;
  timeLimitMin?: number;
  reviewModuleSlug?: string;
};

export const USMLE_STUDY_PRESETS: UsmleStudyPreset[] = [
  {
    id: "step1-pharm-drill",
    title: "Step 1 Pharm MOA Block",
    description: "20 mechanism-of-action items — autonomic, CV, and antimicrobial drugs.",
    count: 20,
    stepLevel: "step1",
    subjectId: "pharmacology",
    reviewModuleSlug: "pharmacology-moa",
  },
  {
    id: "step1-path-drill",
    title: "Step 1 Pathology Block",
    description: "20 pathology items — inflammation, neoplasia, and hemodynamics.",
    count: 20,
    stepLevel: "step1",
    subjectId: "pathology",
    reviewModuleSlug: "pathology-neoplasia",
  },
  {
    id: "step2-cardiology-block",
    title: "Step 2 Cardiology Block",
    description: "25 CK vignettes — ACS, CHF, arrhythmias, and hypertension.",
    count: 25,
    stepLevel: "step2",
    subjectId: "cardiology",
    timed: true,
    timeLimitMin: 35,
    reviewModuleSlug: "acute-coronary-syndrome",
  },
  {
    id: "step2-pulmonary-block",
    title: "Step 2 Pulmonary Block",
    description: "20 items — COPD, asthma, pneumonia, and PE.",
    count: 20,
    stepLevel: "step2",
    subjectId: "pulmonology",
    reviewModuleSlug: "pulmonary",
  },
  {
    id: "step2-id-block",
    title: "Step 2 ID Block",
    description: "20 infectious disease vignettes — sepsis, HIV, and antibiotic selection.",
    count: 20,
    stepLevel: "step2",
    subjectId: "internal-medicine",
    reviewModuleSlug: "infectious-disease",
  },
  {
    id: "step2-endocrine-block",
    title: "Step 2 Endocrine Block",
    description: "20 items — diabetes, DKA/HHS, and thyroid emergencies.",
    count: 20,
    stepLevel: "step2",
    subjectId: "internal-medicine",
    reviewModuleSlug: "endocrine-dm",
  },
  {
    id: "step2-psych-block",
    title: "Step 2 Psychiatry Block",
    description: "15 psych vignettes — mood, psychosis, and substance use.",
    count: 15,
    stepLevel: "step2",
    subjectId: "psychiatry",
    reviewModuleSlug: "psychiatry",
  },
  {
    id: "step3-biostats-sprint",
    title: "Step 3 Biostatistics Sprint",
    description: "15 biostat/epi items — sensitivity, NNT, and study design.",
    count: 15,
    stepLevel: "step3",
    subjectId: "internal-medicine",
    reviewModuleSlug: "biostatistics-epidemiology",
  },
  {
    id: "step3-ccs-drill",
    title: "Step 3 CCS Drill",
    description: "10 case-management style items — workup, monitoring, and escalation.",
    count: 10,
    stepLevel: "step3",
    subjectId: "internal-medicine",
    reviewModuleSlug: "ccs-case-management",
  },
];

const PRESET_BY_ID = new Map(USMLE_STUDY_PRESETS.map((p) => [p.id, p]));

export function getUsmleStudyPreset(id: UsmleStudyPresetId): UsmleStudyPreset | undefined {
  return PRESET_BY_ID.get(id);
}

export function usmlePresetFieldId(step: UsmleStepLevel): string {
  if (step === "step1") return "usmle-step-1";
  if (step === "step3") return "usmle-step-3";
  return "usmle-step-2";
}

export function usmlePresetPracticeHref(
  examSlug: ExamSlug,
  preset: UsmleStudyPreset
): string {
  const field = usmlePresetFieldId(preset.stepLevel);
  const base = practiceTopicHref(examSlug, preset.subjectId, preset.count);
  const qs = new URLSearchParams({
    field,
    mode: "bank",
    count: String(preset.count),
    autostart: "1",
  });
  if (preset.timed && preset.timeLimitMin) {
    qs.set("timed", "1");
    qs.set("timeLimitMin", String(preset.timeLimitMin));
  }
  return `/study?${qs.toString()}`;
}
