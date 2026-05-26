import type { SubjectModule } from "../types";
import { NURSING_SUBJECTS } from "./subjects";
import { NURSING_DISTRACTOR_PATTERNS } from "./distractors";
import { NURSING_TAXONOMY } from "./taxonomy";
import {
  NURSING_EXAM_SYSTEM_AUGMENTATION,
  getNursingUserAugmentation,
} from "./prompts";
import { validateNursingExam } from "./validation";
import { evaluateNursingDifficulty } from "./difficulty";
import { extractNursingConcepts } from "./concepts";

export const nursingModule: SubjectModule = {
  metadata: {
    id: "nursing",
    label: "Nursing",
    category: "professional",
    boardExam: "NCLEX-RN",
    examFocus:
      "NCLEX prioritization, safety, infection control, pharmacology, med-surg, maternal-child, psychosocial care",
    topicPlaceholder: "Select NCLEX category (e.g. Pharmacological Therapies)",
    oerDomains: ["openstax.org", "openrn.org", "med.libretexts.org", "nih.gov", "cdc.gov"],
  },
  subjectAreas: NURSING_SUBJECTS,
  taxonomy: NURSING_TAXONOMY,
  capabilities: {
    supportsCaseStudies: true,
    supportsPrioritization: true,
    supportsClinicalVignettes: true,
    allMultipleChoice: true,
    defaultHighYield: true,
  },
  cognitiveFramework: {
    name: "NCLEX Clinical Judgment",
    levels: ["recognize cues", "analyze", "prioritize hypotheses", "generate solutions", "evaluate"],
    difficultyMapping: {
      easy: "single client, clear priority",
      medium: "multiple findings, one best action",
      hard: "competing priorities, unstable clients",
    },
  },
  terminologyRules: {
    namingConvention: "Use NCLEX-standard nursing terminology and client (not patient) when appropriate.",
  },
  distractorPatterns: NURSING_DISTRACTOR_PATTERNS,
  questionTemplates: [
    {
      id: "multiple_choice",
      label: "NCLEX MCQ",
      description: "Single best nursing action",
      promptFragment: "One best answer; four options.",
    },
    {
      id: "prioritization",
      label: "Prioritization",
      description: "Who to see first / order of actions",
      promptFragment: "Prioritization stem with one best action.",
    },
  ],
  sourcePreferences: {
    oerDomains: ["openrn.org", "openstax.org", "cdc.gov"],
    searchQueryHints: ["NCLEX", "nursing", "Open RN"],
  },
  supportedQuestionTypes: ["multiple_choice", "prioritization", "clinical_vignette"],

  getExamSystemAugmentation: () => NURSING_EXAM_SYSTEM_AUGMENTATION,
  getExamUserAugmentation: () => getNursingUserAugmentation(),
  extractConcepts: extractNursingConcepts,
  evaluateDifficulty: evaluateNursingDifficulty,
  validateExam: validateNursingExam,
};
