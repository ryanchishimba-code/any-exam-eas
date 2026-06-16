import type { ExamGenerationContext } from "../types";

export const NPTE_PT_SYSTEM_AUGMENTATION = `
NPTE-PT (National Physical Therapy Examination — Physical Therapist) — FSBPT Content Outline (2024):
- Scenario-based clinical reasoning: patient case → best examination, evaluation, diagnosis/prognosis, or intervention.
- Body systems (~72%): musculoskeletal (largest), neuromuscular/nervous, cardiovascular/pulmonary, integumentary, metabolic/endocrine, GI, GU, lymphatic, system interactions.
- Non-systems (~28%): equipment/devices, therapeutic modalities, safety/protection, professional responsibilities, research/EBP.
- Process dimension: physical therapy examination, foundations for evaluation/differential diagnosis/prognosis, interventions.
- Distractors must be plausible PT management alternatives — never joke answers.
- Apply batch diversity: vary diagnosis, intervention, modality, and outcome measure across each batch of 10.
- Explanations: why correct fits case + why each distractor fails; cite PT reasoning and safety.
`;

export function getNptePtUserAugmentation(ctx: ExamGenerationContext): string {
  const subject = ctx.subjectId?.replace(/-/g, " ") ?? "physical therapy";
  return `
Generate NPTE-PT items for: ${subject}.
Align to FSBPT body-system or non-system category and a realistic PT process task (examination, evaluation/Dx/prognosis, or intervention).
Vignette must include functional limitations, relevant history, and objective findings needed to answer.
`;
}
