import type { SubjectModule } from "../types";
import { MEDICINE_SUBJECTS } from "./subjects";
import { MEDICINE_CAPABILITIES } from "./capabilities";
import { MEDICINE_DISTRACTOR_PATTERNS } from "./distractors";
import { MEDICINE_SOURCE_PREFERENCES } from "./sources";
import { MEDICINE_TAXONOMY } from "./taxonomy";
import { MEDICINE_QUESTION_TEMPLATES } from "./templates";
import {
  MEDICINE_EXAM_SYSTEM_AUGMENTATION,
  getMedicineUserAugmentation,
} from "./prompts";
import { validateMedicineExam } from "./validation";
import { evaluateMedicineDifficulty } from "./difficulty";
import { extractMedicineConcepts } from "./concepts";

export const medicineModule: SubjectModule = {
  metadata: {
    id: "medicine",
    label: "Medicine",
    category: "professional",
    boardExam: "USMLE / board-style clinical exams",
    examFocus:
      "clinical vignettes, pathophysiology, diagnostics, pharmacology, anatomy, physiology, pathology, microbiology",
    topicPlaceholder: "Select a subject area below (e.g. Cardiology, Pharmacology)",
    oerDomains: MEDICINE_SOURCE_PREFERENCES.oerDomains,
  },
  subjectAreas: MEDICINE_SUBJECTS,
  taxonomy: MEDICINE_TAXONOMY,
  capabilities: MEDICINE_CAPABILITIES,
  cognitiveFramework: {
    name: "Clinical reasoning ladder",
    levels: ["recall", "interpretation", "diagnosis", "management", "complication"],
    difficultyMapping: {
      easy: "recall and classic presentations",
      medium: "interpretation and diagnosis",
      hard: "management, complications, and differential diagnosis",
    },
  },
  terminologyRules: {
    namingConvention: "Use standard medical terminology; generic drug names preferred.",
    abbreviationPolicy: "Define abbreviations on first use in a vignette when non-obvious.",
  },
  distractorPatterns: MEDICINE_DISTRACTOR_PATTERNS,
  questionTemplates: MEDICINE_QUESTION_TEMPLATES,
  sourcePreferences: MEDICINE_SOURCE_PREFERENCES,
  supportedQuestionTypes: ["multiple_choice", "clinical_vignette", "case_study"],

  getExamSystemAugmentation: () => MEDICINE_EXAM_SYSTEM_AUGMENTATION,
  getExamUserAugmentation: () => getMedicineUserAugmentation(),
  buildSearchQueryHints: (topic, subjectId) => [
    `USMLE ${topic}`,
    subjectId ? `${subjectId.replace(/-/g, " ")} board review` : "",
  ].filter(Boolean),

  extractConcepts: extractMedicineConcepts,
  evaluateDifficulty: evaluateMedicineDifficulty,
  validateExam: validateMedicineExam,
};
