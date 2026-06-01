import type { DistractorPattern } from "../types";

export const PHARMACY_DISTRACTOR_PATTERNS: DistractorPattern[] = [
  {
    id: "dose-error",
    label: "Dosing error",
    description: "Wrong unit or concentration",
    promptHint: "Include plausible calculation mistakes as distractors.",
  },
  {
    id: "interaction",
    label: "Interaction trap",
    description: "Contraindicated combination",
    promptHint: "Distractors with known interaction pairs from the patient's med list.",
  },
  {
    id: "counseling-gap",
    label: "Counseling omission",
    description: "Incomplete patient teaching",
    promptHint: "Wrong counseling focus vs correct monitoring/teaching.",
  },
  {
    id: "wrong-indication",
    label: "Wrong drug for condition",
    description: "Same class, wrong agent or indication",
    promptHint: "Drug that treats a related condition but not this patient's etiology/presentation.",
  },
  {
    id: "symptom-drug-confusion",
    label: "Symptom vs adverse effect",
    description: "Misattribute finding to wrong cause",
    promptHint: "Confuse disease sign/symptom with drug adverse effect or vice versa.",
  },
];
