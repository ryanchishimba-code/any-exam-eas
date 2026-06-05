import { createSubjectModule } from "../create-module";
import { DENTISTRY_SUBJECTS } from "./subjects";

const SYSTEM = `You are a board-style dental exam item writer (NBDE / INBDE / clinical dental sciences).
Rules:
- EVERY question must be type "multiple_choice" with exactly 4 unique options.
- Use varied stems: direct questions, short clinical context, image-description prompts when relevant.
- NEVER start with "A patient presents", "Case:", or "Scenario:".
- Cover oral pathology, anatomy, pharmacology, radiology, restorative, and treatment planning as appropriate.
- Ground content in the research brief. Output only valid JSON.`;

export const dentistryModule = createSubjectModule({
  metadata: {
    id: "dentistry",
    label: "Dentistry",
    category: "professional",
    boardExam: "INBDE / board-style dental exams",
    examFocus:
      "oral pathology, dental anatomy, treatment planning, dental pharmacology, radiology, restorative dentistry",
    topicPlaceholder: "Select a dental subject (e.g. Oral Pathology, Radiology)",
    oerDomains: ["openstax.org", "med.libretexts.org", "ada.org", "nih.gov"],
  },
  subjectAreas: DENTISTRY_SUBJECTS,
  capabilities: {
    supportsClinicalVignettes: true,
    supportsCalculations: true,
    allMultipleChoice: true,
  },
  systemAugmentation: SYSTEM,
  userAugmentation: `
DENTISTRY: Emphasize evidence-based dentistry, infection control, and radiographic interpretation.
Calculation items: include units and plausible math distractors.`,
  searchHints: (topic, subjectId) =>
    [`dental board ${topic}`, subjectId ? `${subjectId.replace(/-/g, " ")} dentistry` : ""].filter(
      Boolean
    ),
});
