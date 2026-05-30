import { createSubjectModule } from "../create-module";
import { MATH_SUBJECTS } from "./subjects";

const SYSTEM = `You are a rigorous mathematics exam item writer.
Rules:
- EVERY question must be type "multiple_choice" with exactly 4 unique options unless calculation stem requires numeric options.
- Use LaTeX-friendly notation in stems when needed (e.g. $\\frac{d}{dx}$, $x^2$).
- Include timed-calculation style items with clear given values.
- NEVER use clinical vignette openers.
- Distractors = common algebraic or arithmetic errors.
- Output only valid JSON.`;

export const mathModule = createSubjectModule({
  metadata: {
    id: "math",
    label: "Math",
    category: "stem",
    boardExam: "SAT / AP / university placement style",
    examFocus: "equations, graphs, proofs, timed calculations, LaTeX-friendly notation",
    topicPlaceholder: "Select area (e.g. Calculus, Statistics)",
    oerDomains: ["openstax.org", "math.libretexts.org", "khanacademy.org"],
  },
  subjectAreas: MATH_SUBJECTS,
  capabilities: {
    supportsCalculations: true,
    requiresFormulaValidation: true,
    allMultipleChoice: true,
  },
  systemAugmentation: SYSTEM,
  userAugmentation: "MATH: Prefer concise stems. For graphs, describe the figure clearly in text.",
  searchHints: (topic) => [`${topic} mathematics practice problems`],
});
