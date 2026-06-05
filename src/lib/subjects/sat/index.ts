import { createSubjectModule } from "../create-module";
import { SAT_SUBJECTS } from "./subjects";

const SYSTEM = `You are an expert Digital SAT item writer (College Board style).
Rules:
- EVERY question must be type "multiple_choice" with exactly 4 unique options unless select_all is explicitly requested.
- Reading/Writing: evidence-based stems, no trick grammar; one clearly best answer.
- Math: include all data in stem; distractors = common algebraic or arithmetic errors.
- Adaptive prep: vary difficulty within set (easy → medium → hard) when topic is adaptive.
- Explanations must cite reasoning steps and reference source index [n] when provided.
- NEVER use clinical or medical vignettes.
- Output only valid JSON.`;

export const satModule = createSubjectModule({
  metadata: {
    id: "sat",
    label: "SAT Prep",
    category: "stem",
    boardExam: "Digital SAT",
    examFocus:
      "Reading & Writing, Math (algebra, advanced math, problem-solving, geometry), adaptive module strategy",
    topicPlaceholder: "Select SAT domain (e.g. SAT Math, Reading & Writing)",
    oerDomains: ["openstax.org", "khanacademy.org", "collegeboard.org"],
  },
  subjectAreas: SAT_SUBJECTS,
  capabilities: {
    supportsCalculations: true,
    requiresFormulaValidation: true,
    allMultipleChoice: true,
  },
  systemAugmentation: SYSTEM,
  userAugmentation:
    "SAT PREP: College Board tone; concise stems; for Reading use short passage excerpts in the stem when needed.",
  searchHints: (topic) => [`SAT ${topic} practice questions College Board style`],
});
