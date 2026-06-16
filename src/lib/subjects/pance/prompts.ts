import type { ExamGenerationContext } from "../types";

export const PANCE_SYSTEM_AUGMENTATION = `
PANCE (Physician Assistant National Certifying Examination) — NCCPA Content Blueprint (2025):
- Clinical vignettes with 2–4 sentence scenarios; stem is the lead-in question only.
- Test tasks: history/physical (16%), diagnosis (18%), labs/imaging (10%), prevention/education (11%), clinical intervention (16%), pharmacotherapy (15%), foundational science (8%), professional practice (6%).
- Medical content spans 15 organ-system categories weighted per NCCPA (cardiovascular 11%, pulmonary 9%, GI 8%, etc.).
- Include pediatric and surgical presentations where clinically appropriate (blueprint notes 12–15% pediatric, 8–10% surgical).
- Distractors must be plausible alternatives a PA student would consider — never joke answers or mutually exclusive nonsense.
- Apply batch diversity: no two questions in a set should test the same diagnosis, drug class, or management step.
- Explanations: why correct fits vignette + why each distractor fails (UWorld-style).
`;

export function getPanceUserAugmentation(ctx: ExamGenerationContext): string {
  const subject = ctx.subjectId?.replace(/-/g, " ") ?? "general medicine";
  return `
Generate PANCE-style items for: ${subject}.
Align to NCCPA medical content category and a realistic task (diagnosis, next step, pharmacotherapy, or prevention).
Vignette must contain all data needed to answer — do not hide criteria only in the explanation.
`;
}
