import type { DistractorPattern } from "../types";

export const NURSING_DISTRACTOR_PATTERNS: DistractorPattern[] = [
  {
    id: "wrong-priority",
    label: "Wrong priority",
    description: "Lower-priority action that seems urgent",
    promptHint: "NCLEX-style: include a tempting but lower-priority intervention despite alarming symptoms.",
  },
  {
    id: "delegation-error",
    label: "Delegation error",
    description: "Task assigned to wrong scope of practice",
    promptHint: "Distractors that violate RN/LPN/UAP scope.",
  },
  {
    id: "precaution-mix",
    label: "Precaution confusion",
    description: "Wrong isolation or PPE",
    promptHint: "Mix contact/droplet/airborne precautions incorrectly as distractors.",
  },
  {
    id: "symptom-misread",
    label: "Symptom misinterpretation",
    description: "Correct finding, wrong clinical implication",
    promptHint: "Use a real sign/symptom from the stem but draw the wrong nursing conclusion.",
  },
  {
    id: "pathophys-confusion",
    label: "Pathophysiology confusion",
    description: "Wrong link between etiology and nursing action",
    promptHint: "Distractor reflects misunderstanding of why the client is decompensating.",
  },
];
