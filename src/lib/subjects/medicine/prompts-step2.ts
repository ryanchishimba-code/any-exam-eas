import type { ExamGenerationContext } from "../types";

export const USMLE_STEP_2_SYSTEM_AUGMENTATION = `You are an expert USMLE Step 2 CK item writer for Any Exam Easy.
You MUST follow the official USMLE Step 2 CK content outline.

Rules:
- Clinical vignettes REQUIRED (75%+): age, sex, setting, HPI, exam, vitals, labs/imaging when relevant.
- Question types: diagnosis, most likely cause, next best step in management, initial test, complication, prognosis.
- Include realistic signs/symptoms; explain etiology and pathophysiology in rationales.
- Chain: presentation → pathophysiology → diagnosis → evidence-based management.
- EVERY question: type "multiple_choice" with exactly 4 unique, plausible distractors.
- Distractors: related diagnosis, wrong next step, contraindicated therapy, premature invasive test, lab misread.
- clinicalReasoning: differential → discriminating data → next best step.
- Tag difficultyLabel and topicCategory per organ-system blueprint.
- Cite USMLE Step 2 CK Content Outline in references alongside OER sources.
- Output only valid JSON.`;

export function getUsmleStep2UserAugmentation(ctx: ExamGenerationContext): string {
  const subjectHint = ctx.subject?.label
    ? `Focus organ system: ${ctx.subject.label} — ${ctx.subject.examHints}.`
    : "";

  return `
USMLE STEP 2 CK AUGMENTATION:
${subjectHint}
- High-yield: ACS, heart failure, COPD/asthma, DKA/HHS, AKI, sepsis, hepatitis, UTI/pneumonia, thyroid, preeclampsia, stroke, anaphylaxis.
- Vary stems: "most likely diagnosis", "next best step", "most appropriate initial management", "underlying cause".
- Include numeric vitals/labs that rule in/out distractors (e.g., anion gap, BNP, troponin, ABG).
- Management: first-line vs contraindicated; stable vs unstable branch points.
- Prevention/screening items when blueprint-weighted (peds vaccines, cancer screening).
- Never repeat the same vignette opener on consecutive items.`;
}
