// @ts-nocheck — legacy AANP FNP module (retired; use pance/)
import type { SubjectModule } from "../types";
import { AANP_FNP_SUBJECTS } from "./subjects";
import { AANP_FNP_DISTRACTOR_PATTERNS } from "./distractors";
import { AANP_FNP_TAXONOMY } from "./taxonomy";
import { AANP_FNP_EXAM_SYSTEM_AUGMENTATION, getAanpFnpUserAugmentation } from "./prompts";
import { validateAanpFnpExam } from "./validation";
import { evaluateAanpFnpDifficulty } from "./difficulty";
import { extractAanpFnpConcepts } from "./concepts";

export const aanpFnpModule: SubjectModule = {
  metadata: {
    id: "aanp-fnp",
    label: "AANP FNP",
    category: "professional",
    boardExam: "AANP FNP-C",
    examFocus:
      "primary care across the lifespan — assessment, diagnosis, plan, evaluate; pharmacology; women's health; pediatrics; geriatrics",
    topicPlaceholder: "Select FNP area (e.g. Assess, Plan, Cardiovascular)",
    oerDomains: ["openrn.org", "openstax.org", "cdc.gov", "nih.gov"],
  },
  subjectAreas: AANP_FNP_SUBJECTS,
  taxonomy: AANP_FNP_TAXONOMY,
  capabilities: {
    supportsCaseStudies: true,
    supportsClinicalVignettes: true,
    allMultipleChoice: true,
    defaultHighYield: true,
  },
  cognitiveFramework: {
    name: "AANP FNP clinical process",
    levels: ["assess", "diagnose", "plan", "evaluate"],
    difficultyMapping: {
      easy: "single-finding assessment or classic presentation",
      medium: "two-step diagnosis or initial management",
      hard: "competing priorities, geriatric complexity, or multi-system integration",
    },
  },
  terminologyRules: {
    namingConvention: "Use NP-appropriate clinical terminology; generic drug names preferred.",
  },
  distractorPatterns: AANP_FNP_DISTRACTOR_PATTERNS,
  questionTemplates: [
    {
      id: "multiple_choice",
      label: "FNP MCQ",
      description: "Primary-care vignette with single best answer",
      promptFragment: "One best answer; four clinically plausible options.",
    },
  ],
  sourcePreferences: {
    oerDomains: ["openrn.org", "openstax.org", "cdc.gov", "aanpcert.org"],
    searchQueryHints: ["AANP FNP", "family nurse practitioner", "primary care", "NP certification"],
  },
  supportedQuestionTypes: ["multiple_choice", "clinical_vignette", "select_all"],

  getExamSystemAugmentation: () => AANP_FNP_EXAM_SYSTEM_AUGMENTATION,
  getExamUserAugmentation: () => getAanpFnpUserAugmentation(),
  buildSearchQueryHints: (topic, subjectId) =>
    ["AANP FNP", topic, subjectId?.replace(/-/g, " ")].filter(Boolean),
  extractConcepts: extractAanpFnpConcepts,
  evaluateDifficulty: evaluateAanpFnpDifficulty,
  validateExam: validateAanpFnpExam,
};
