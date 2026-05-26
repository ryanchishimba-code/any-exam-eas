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
    promptHint: "Distractors with known interaction pairs.",
  },
  {
    id: "counseling-gap",
    label: "Counseling omission",
    description: "Incomplete patient teaching",
    promptHint: "Wrong counseling focus vs correct monitoring/teaching.",
  },
];
