import { usmleStepsForTopicSlug } from "@/lib/edtech/usmle-library-catalog";
import { isUsmleStep1Subject } from "@/lib/subjects/medicine/subject-splits";
import type { HighYieldTopic } from "@/types/edtech";
import {
  allUsmle2026TopicSlugs,
  getUsmle2026Topic,
} from "./blueprint-topics-2026";
import { usmlePresetFieldId } from "./study-presets";
import { getUsmleStudyDomain, getUsmleTopicMeta } from "./topic-registry";
import type { UsmleStepLevel } from "./types";

export type UsmleTopicPracticeParams = {
  /** USMLE field bucket for the initial DB pull. */
  fieldId: string;
  /** Subject bucket for the initial DB pull. */
  subjectId: string;
  /** Granular 2026 blueprint slugs — practice items must match one of these. */
  blueprintTopics?: string[];
  /** Study Hub topic slug — enables Step 3 format subtopic filters. */
  topicSlug?: string;
};

/** Narrow flagship modules — avoid pulling an entire study domain. */
const NARROW_FLAGSHIP_ALIASES: Partial<Record<string, string[]>> = {
  "acute-coronary-syndrome": ["acs-management", "acs-pathophysiology"],
  "neurology-stroke": ["stroke-management", "stroke-localization", "seizures-headaches"],
  "endocrine-dm": [
    "diabetes-dka-management",
    "diabetes-pathophysiology",
    "thyroid-storm",
    "thyroid-disorders",
  ],
  "renal-electrolytes": [
    "aki-ckd-electrolytes",
    "aki-mechanisms",
    "nephrotic-nephritic",
    "acid-base-physiology",
  ],
  pulmonary: [
    "pneumonia-workup",
    "pe-workup",
    "copd-asthma-exacerbation",
    "ards-pathology",
    "asthma-copd-pathology",
  ],
  "infectious-disease": ["sepsis-bundles", "hiv-opportunistic", "antibiotic-mechanisms"],
  "emergency-toxicology": ["trauma-atls", "emergency-acls", "emergency-management"],
  "biostatistics-epidemiology": [
    "nnt-arr",
    "sensitivity-specificity-lr",
    "study-design-appraisal",
    "biostatistics-interpretation",
    "study-designs",
    "sensitivity-specificity",
  ],
  "medical-ethics-legal": [
    "informed-consent-capacity",
    "confidentiality-reporting",
    "end-of-life-ethics",
    "ethics-professionalism",
  ],
  "pharmaceutical-ads-abstracts": ["pharmaceutical-ads-abstracts", "diagnostic-test-interpretation"],
  "nnt-arr": ["nnt-arr", "sensitivity-specificity-lr", "study-design-appraisal"],
  "next-best-step": ["next-best-step", "ambulatory-chronic-care", "inpatient-orders"],
  "ccs-case-management": [
    "ccs-initial-workup",
    "ccs-monitoring-escalation",
    "ccs-discharge-planning",
    "ccs-orders-sequence",
    "next-best-step",
    "ambulatory-chronic-care",
    "inpatient-orders",
  ],
  "ccs-initial-workup": [
    "ccs-initial-workup",
    "ccs-orders-sequence",
    "next-best-step",
    "inpatient-orders",
  ],
  "ccs-monitoring-escalation": [
    "ccs-monitoring-escalation",
    "inpatient-orders",
    "next-best-step",
    "lab-interpretation",
  ],
  "ambulatory-chronic-care": ["ambulatory-chronic-care", "cost-effective-care"],
};

/** Subject overrides when practiceTopicSlug would pull the wrong bank bucket. */
const TOPIC_SUBJECT_OVERRIDES: Partial<Record<string, string>> = {
  "pathology-neoplasia": "pathology",
  "pharmacology-moa": "pharmacology",
  "physiology-systems": "physiology",
  "biochemistry-metabolism": "biochemistry",
  "microbiology-immunology": "microbiology",
  "anatomy-embryology": "anatomy",
  "acute-coronary-syndrome": "cardiology",
  pulmonary: "pulmonology",
  "renal-electrolytes": "nephrology",
  "endocrine-dm": "internal-medicine",
  gastroenterology: "internal-medicine",
  "infectious-disease": "internal-medicine",
  "neurology-stroke": "internal-medicine",
  "hematology-oncology": "internal-medicine",
  rheumatology: "internal-medicine",
  obstetrics: "obgyn",
  pediatrics: "pediatrics",
  psychiatry: "psychiatry",
  "emergency-toxicology": "emergency-medicine",
  "dermatology-allergic": "internal-medicine",
  "biostatistics-epidemiology": "internal-medicine",
  "medical-ethics-legal": "internal-medicine",
  "ccs-case-management": "internal-medicine",
  "pharmaceutical-ads-abstracts": "internal-medicine",
  "next-best-step": "internal-medicine",
  "ccs-monitoring-escalation": "internal-medicine",
  "ccs-initial-workup": "internal-medicine",
  "ambulatory-chronic-care": "internal-medicine",
  "nnt-arr": "internal-medicine",
  "ethics-biostats": "internal-medicine",
  "sig-code-abbreviations": "pharmacology",
  cardiovascular: "cardiology",
};

function resolveUsmleTopicStepLevel(topic: HighYieldTopic): UsmleStepLevel {
  const meta = getUsmleTopicMeta(topic.slug);
  const domainStep = getUsmleStudyDomain(meta.studyDomain)?.stepLevel;
  if (domainStep) return domainStep;

  const steps = topic.usmleSteps ?? usmleStepsForTopicSlug(topic.slug);
  if (steps.length === 1) return steps[0]!;
  if (steps.includes("step3") && !steps.includes("step2")) return "step3";
  if (steps.includes("step1") && !steps.includes("step2") && !steps.includes("step3")) {
    return "step1";
  }
  if (isUsmleStep1Subject(topic.practiceTopicSlug)) return "step1";
  return "step2";
}

export function resolveUsmleTopicFieldId(topic: HighYieldTopic): string {
  return usmlePresetFieldId(resolveUsmleTopicStepLevel(topic));
}

function blueprintSlugsForStudyDomain(domainId: string): string[] {
  return allUsmle2026TopicSlugs().filter(
    (slug) => getUsmleTopicMeta(slug).studyDomain === domainId
  );
}

function resolveBlueprintTopics(topic: HighYieldTopic): string[] {
  const meta = getUsmleTopicMeta(topic.slug);
  if (meta.blueprintTopicSlugs?.length) return [...meta.blueprintTopicSlugs];

  const narrow = NARROW_FLAGSHIP_ALIASES[topic.slug];
  if (narrow?.length) return narrow;

  if (getUsmle2026Topic(topic.slug)) return [topic.slug];

  if (meta.studyDomain) {
    const domainSlugs = blueprintSlugsForStudyDomain(meta.studyDomain);
    if (domainSlugs.length) return domainSlugs;
  }

  return [topic.slug];
}

function resolveUsmleTopicSubjectId(topic: HighYieldTopic): string {
  const override = TOPIC_SUBJECT_OVERRIDES[topic.slug];
  if (override) return override;
  return topic.practiceTopicSlug;
}

/**
 * Resolve question-bank filters for a high-yield USMLE topic card.
 * Prefers blueprintTopicSlugs so practice matches what the Study Hub module teaches.
 */
export function resolveUsmleTopicPracticeParams(topic: HighYieldTopic): UsmleTopicPracticeParams {
  const blueprintTopics = resolveBlueprintTopics(topic);
  const fieldId = resolveUsmleTopicFieldId(topic);

  return {
    fieldId,
    subjectId: resolveUsmleTopicSubjectId(topic),
    blueprintTopics,
    topicSlug: topic.slug,
  };
}
