import { createSubjectModule } from "../create-module";
import { CHEMISTRY_SUBJECTS } from "./subjects";

const SYSTEM = `You are a chemistry exam item writer.
Rules:
- EVERY question must be type "multiple_choice" with exactly 4 unique options.
- Include reaction logic, stoichiometry, and scientific notation where appropriate.
- Calculation stems must include all given values; distractors = unit or rounding errors.
- NEVER use clinical vignette openers unless biochemistry context requires one sentence of context.
- Output only valid JSON.`;

export const chemistryModule = createSubjectModule({
  metadata: {
    id: "chemistry",
    label: "Chemistry",
    category: "stem",
    boardExam: "AP / university general & organic chemistry",
    examFocus: "organic mechanisms, biochemistry pathways, calculations, scientific notation",
    topicPlaceholder: "Select area (e.g. Organic Chemistry, Biochemistry)",
    oerDomains: ["openstax.org", "chem.libretexts.org", "libretexts.org"],
  },
  subjectAreas: CHEMISTRY_SUBJECTS,
  capabilities: {
    supportsCalculations: true,
    requiresFormulaValidation: true,
    allMultipleChoice: true,
  },
  systemAugmentation: SYSTEM,
  searchHints: (topic) => [`chemistry ${topic} practice exam`],
});
