import type { ExamGenerationContext } from "../types";
import {
  PANCE_HIGH_YIELD_FOCUS_AREAS,
  PANCE_KNOWLEDGE_AREAS,
  PANCE_OUTLINE_SOURCE,
  PANCE_TASK_AREAS,
} from "@/lib/exam-prep/pance/content-outline";

const TASK_SUMMARY = PANCE_TASK_AREAS.map(
  (t) => `${t.label} (${t.weightLabel})`
).join("; ");

const KNOWLEDGE_SUMMARY = PANCE_KNOWLEDGE_AREAS.map(
  (d) => `${d.label} (${d.weightLabel})`
).join("; ");

export const PANCE_SYSTEM_AUGMENTATION = `
PANCE (Physician Assistant National Certifying Examination) — ${PANCE_OUTLINE_SOURCE}:
- 300 multiple-choice questions over 5 hours — primary care across the lifespan.
- Clinical vignettes with 2–4 sentence scenarios; stem is the lead-in question only ("A 45-year-old presents with…").
- Task areas: ${TASK_SUMMARY}.
- Knowledge areas (organ systems): ${KNOWLEDGE_SUMMARY}.
- Cardiovascular (13%) and pulmonary (10%) are highest-yield systems; include pediatrics, women's health, and emergency stabilization in mixed blocks.
- Integrate pharmacology (indications, contraindications, monitoring, adverse effects) across all systems.
- Distractors must be plausible alternatives a PA student would consider — never joke answers or mutually exclusive nonsense.
- Apply batch diversity: no two questions in a set should test the same diagnosis, drug class, or management step.
- Explanations: why correct fits vignette + why each distractor fails (UWorld-style).
`;

export function getPanceUserAugmentation(ctx: ExamGenerationContext): string {
  const subject = ctx.subjectId?.replace(/-/g, " ") ?? "general medicine";
  const focusAreas = PANCE_HIGH_YIELD_FOCUS_AREAS.slice(0, 4).join(" · ");
  return `
Generate PANCE-style items for: ${subject}.
Align to an NCCPA knowledge area and a realistic task (diagnosis, pharmacotherapy, labs, health maintenance, or clinical intervention).
Vignette must contain all data needed to answer — do not hide criteria only in the explanation.
Cross-cutting priorities: ${focusAreas}.
`;
}
