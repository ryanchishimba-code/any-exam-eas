import type { SubjectModule } from "../types";
import { PHARMACY_SUBJECTS } from "./subjects";
import { PHARMACY_DISTRACTOR_PATTERNS } from "./distractors";
import { PHARMACY_TAXONOMY } from "./taxonomy";
import {
  PHARMACY_EXAM_SYSTEM_AUGMENTATION,
  getPharmacyUserAugmentation,
} from "./prompts";
import { validatePharmacyExam, scorePharmacyQuestionQuality } from "./validation";
import { evaluatePharmacyDifficulty } from "./difficulty";
import { extractPharmacyConcepts } from "./concepts";

export const pharmacyModule: SubjectModule = {
  metadata: {
    id: "pharmacy",
    label: "NAPLEX",
    category: "professional",
    boardExam: "NAPLEX",
    examFocus:
      "pharmacokinetics, pharmacodynamics, drug interactions, dosing, compounding, patient counseling, therapeutic classes",
    topicPlaceholder: "Select NAPLEX area (e.g. Cardiovascular Pharmacotherapy)",
    oerDomains: ["chem.libretexts.org", "med.libretexts.org", "nih.gov", "fda.gov"],
  },
  subjectAreas: PHARMACY_SUBJECTS,
  taxonomy: PHARMACY_TAXONOMY,
  capabilities: {
    supportsDrugQuestions: true,
    supportsCalculations: true,
    requiresCitationValidation: true,
    allMultipleChoice: true,
    defaultHighYield: true,
  },
  cognitiveFramework: {
    name: "NAPLEX competency",
    levels: ["recall", "application", "analysis", "evaluation"],
    difficultyMapping: {
      easy: "single-concept recall",
      medium: "application and counseling",
      hard: "multi-step calculations and interactions",
    },
  },
  terminologyRules: {
    namingConvention: "Generic drug names; include strength/route when relevant.",
  },
  distractorPatterns: PHARMACY_DISTRACTOR_PATTERNS,
  questionTemplates: [
    {
      id: "multiple_choice",
      label: "NAPLEX MCQ",
      description: "Standard pharmacy MCQ",
      promptFragment: "Four options; one best answer.",
    },
    {
      id: "calculation",
      label: "Calculation",
      description: "Dosing or compounding math",
      promptFragment: "Provide data needed to solve; numeric answers as MCQ options.",
    },
  ],
  sourcePreferences: {
    oerDomains: ["chem.libretexts.org", "fda.gov", "nih.gov"],
    searchQueryHints: ["NAPLEX", "pharmacotherapy", "pharmacy"],
  },
  supportedQuestionTypes: ["multiple_choice", "calculation"],
  getExamSystemAugmentation: () => PHARMACY_EXAM_SYSTEM_AUGMENTATION,
  getExamUserAugmentation: () => getPharmacyUserAugmentation(),
  extractConcepts: extractPharmacyConcepts,
  evaluateDifficulty: evaluatePharmacyDifficulty,
  validateExam: validatePharmacyExam,
  scoreQuestionQuality: scorePharmacyQuestionQuality,
};
