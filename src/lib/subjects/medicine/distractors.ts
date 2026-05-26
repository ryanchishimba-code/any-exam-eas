import type { DistractorPattern } from "../types";

export const MEDICINE_DISTRACTOR_PATTERNS: DistractorPattern[] = [
  {
    id: "related-diagnosis",
    label: "Related diagnosis",
    description: "Same organ system, wrong disease",
    promptHint: "Use a diagnosis that shares features but fails key discriminating findings.",
  },
  {
    id: "wrong-next-step",
    label: "Wrong next step",
    description: "Plausible management that is not first-line or is contraindicated",
    promptHint: "Include a tempting but incorrect next step in management sequences.",
  },
  {
    id: "drug-class-confusion",
    label: "Drug class confusion",
    description: "Same class wrong agent or wrong MOA",
    promptHint: "Distractors from the same drug class with incorrect MOA or indication.",
  },
  {
    id: "lab-trap",
    label: "Lab misinterpretation",
    description: "Misread or partial lab pattern",
    promptHint: "Offer options reflecting common lab interpretation errors.",
  },
  {
    id: "anatomy-adjacent",
    label: "Anatomically adjacent",
    description: "Nearby structure or wrong nerve/vessel",
    promptHint: "For anatomy, use adjacent structures or common anatomic confusion.",
  },
];
