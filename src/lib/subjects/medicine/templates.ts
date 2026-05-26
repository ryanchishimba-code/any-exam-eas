import type { QuestionTemplate } from "../types";

export const MEDICINE_QUESTION_TEMPLATES: QuestionTemplate[] = [
  {
    id: "multiple_choice",
    label: "Standard MCQ",
    description: "Single best answer, four options",
    promptFragment: "Standard USMLE-style multiple choice.",
    supportedDifficulties: ["easy", "medium", "hard"],
  },
  {
    id: "clinical_vignette",
    label: "Clinical vignette",
    description: "Brief patient scenario with clinical data",
    promptFragment:
      "Use a brief vignette (age, sex, presentation, vitals/labs as needed) ending with a clear lead-in question.",
    supportedDifficulties: ["medium", "hard"],
  },
  {
    id: "case_study",
    label: "Case study",
    description: "Multi-finding case requiring synthesis",
    promptFragment:
      "Present a case with multiple findings requiring integration (diagnosis, next step, or complication).",
    supportedDifficulties: ["hard"],
  },
];
