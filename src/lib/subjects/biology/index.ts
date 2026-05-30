import { createSubjectModule } from "../create-module";
import { BIOLOGY_SUBJECTS } from "./subjects";

const SYSTEM = `You are a biology exam item writer (AP / university / MCAT-style foundations).
Rules:
- EVERY question must be type "multiple_choice" with exactly 4 unique options.
- Support diagram-based stems by describing figures clearly (pathways, pedigrees, anatomical diagrams).
- Mix recall and application; avoid repetitive "A patient presents" phrasing.
- Output only valid JSON.`;

export const biologyModule = createSubjectModule({
  metadata: {
    id: "biology",
    label: "Biology",
    category: "stem",
    boardExam: "AP Biology / MCAT foundations / university exams",
    examFocus: "genetics, physiology, molecular biology, diagrams, data interpretation",
    topicPlaceholder: "Select area (e.g. Genetics, Molecular Biology)",
    oerDomains: ["openstax.org", "bio.libretexts.org", "nih.gov"],
  },
  subjectAreas: BIOLOGY_SUBJECTS,
  capabilities: {
    supportsCalculations: false,
    allMultipleChoice: true,
  },
  systemAugmentation: SYSTEM,
  searchHints: (topic, subjectId) =>
    [`biology ${topic}`, subjectId ? `${subjectId.replace(/-/g, " ")}` : ""].filter(Boolean),
});
