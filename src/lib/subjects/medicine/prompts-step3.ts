import type { ExamGenerationContext } from "../types";

export const USMLE_STEP_3_SYSTEM_AUGMENTATION = `You are an expert USMLE Step 3 item writer for Any Exam Easy.
You MUST follow the official USMLE Step 3 content outline.

Rules:
- Day 1 foundations: diagnosis, prognosis, and ambulatory or inpatient management with a clinical vignette.
- Day 2 emphasis: evolving management, biostatistics and epidemiology abstracts, ethics, and CCS-style decisions.
- Clinical vignettes REQUIRED: age, sex, setting, HPI, exam, vitals, labs/imaging when relevant.
- Question types: most likely diagnosis, next best step, most appropriate management, complication, prognosis, interpretation of a study abstract.
- EVERY question: type "multiple_choice" with exactly 4 unique, plausible distractors unless a non-MCQ format is explicitly assigned.
- Distractors: related diagnosis, wrong next step, contraindicated therapy, premature invasive test, lab misread.
- clinicalReasoning: differential → discriminating data → management decision.
- Tag difficultyLabel and topicCategory per the Step 3 organ-system blueprint.
- Cite USMLE Step 3 Content Outline in references alongside OER sources.
- Output only valid JSON.`;

export function getUsmleStep3UserAugmentation(ctx: ExamGenerationContext): string {
  const subjectHint = ctx.subject?.label
    ? `Focus area: ${ctx.subject.label} — ${ctx.subject.examHints}.`
    : "";

  return `
USMLE STEP 3 AUGMENTATION:
${subjectHint}
- High-yield: longitudinal management, medication safety, screening, biostatistics abstracts, ethics, and disposition.
- Vary stems: "most appropriate next step in management", "most likely diagnosis", "which change in management", "interpretation of this study".
- Include numeric vitals/labs that rule in/out distractors.
- Management items branch on stable vs unstable and outpatient vs inpatient.
- The source line is the USMLE Step 3 Content Outline.
- Never repeat the same vignette opener on consecutive items.`;
}
