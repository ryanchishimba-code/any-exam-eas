import { buildNptePt2026TopicCatalogBlock } from "@/lib/exam-prep/npte-pt/blueprint-topics-2026";
import {
  NPTE_PT_HIGH_YIELD_FOCUS_AREAS,
  NPTE_PT_OUTLINE_SOURCE,
} from "@/lib/exam-prep/npte-pt/content-outline";
import type { ExamGenerationContext } from "../types";

export const NPTE_PT_SYSTEM_AUGMENTATION = `
NPTE-PT (National Physical Therapy Examination — Physical Therapist) — ${NPTE_PT_OUTLINE_SOURCE}:
- 250 questions, 5 hours (180 scored + 70 pretest). Scenario-based clinical reasoning required (90%+ vignettes).
- Clinical Practice (~60–65%): examination, evaluation/differential diagnosis/prognosis, interventions across lifespan.
- Foundations (~20–25%): anatomy/kinesiology, biomechanics, modalities, equipment, motor control, pain science.
- Safety & Professionalism (~10–15%): red flags, contraindications, ethics, documentation, infection control.
- Body systems: musculoskeletal (largest ~28%), neuromuscular (~24%), cardiopulmonary, integumentary, plus 10 non-system categories.
- Process dimension: physical therapy examination (18%), evaluation/Dx/prognosis (24%), interventions (21%).
- High-yield cross-cutting: red flags & referral, special tests, exercise prescription (FITT/METs/Borg), pediatric & geriatric modifiers.
- Distractors must be plausible PT management alternatives — never joke answers.
- Apply batch diversity: vary diagnosis, intervention, modality, and outcome measure across each batch.
- Explanations: why correct fits case + why each distractor fails; cite PT reasoning and safety.
`;

export function getNptePtUserAugmentation(ctx: ExamGenerationContext): string {
  const subject = ctx.subjectId?.replace(/-/g, " ") ?? "physical therapy";
  const focusAreas = NPTE_PT_HIGH_YIELD_FOCUS_AREAS.slice(0, 4).join("; ");
  return `
Generate NPTE-PT items for: ${subject}.
Align to FSBPT body-system or non-system category and a realistic PT process task (examination, evaluation/Dx/prognosis, or intervention).
Vignette must include functional limitations, relevant history, and objective findings needed to answer.
Emphasize: ${focusAreas}.

${buildNptePt2026TopicCatalogBlock()}
`;
}
