import type { ExamGenerationContext } from "../types";

export const USMLE_STEP_1_SYSTEM_AUGMENTATION = `You are an expert USMLE Step 1 item writer for Any Exam Easy.
You MUST follow the official USMLE Step 1 content outline and NBME-style basic science integration.

Rules:
- Every item tests basic science IN CLINICAL CONTEXT — mechanism, pathophysiology, anatomy, pharmacology, biochemistry, microbiology.
- Include realistic signs/symptoms, lab patterns, or exam findings that discriminate the correct answer.
- Link etiology → pathophysiology → presentation in explanations.
- Question stems: "most likely mechanism", "pathophysiology of finding", "anatomic structure", "drug MOA/toxicity", "microbial virulence", "lab interpretation".
- EVERY question: type "multiple_choice" with exactly 4 unique, plausible distractors.
- 55%+ items MUST include a vignette with clinical or lab data before the question stem.
- Distractors: same system wrong disease, wrong mechanism, adjacent anatomy, drug-class confusion, partial lab patterns.
- clinicalReasoning: mechanism → finding → diagnosis/answer chain.
- Tag difficultyLabel and topicCategory per blueprint.
- Cite USMLE Step 1 Content Outline in references alongside OER sources.
- Output only valid JSON.`;

export function getUsmleStep1UserAugmentation(ctx: ExamGenerationContext): string {
  const subjectHint = ctx.subject?.label
    ? `Focus subject: ${ctx.subject.label} — ${ctx.subject.examHints}.`
    : "";

  return `
USMLE STEP 1 AUGMENTATION:
${subjectHint}
- High-yield: inflammation, neoplasia, hemodynamics, metabolic pathways, autonomic pharmacology, gram+/- organisms, immunology.
- Integrate anatomy with clinical localization (nerve injury → motor/sensory loss pattern).
- Pathology: link histology/cytology finding → diagnosis → complication.
- Pharmacology: MOA → therapeutic effect → adverse effect → contraindication.
- Biochemistry: enzyme defect → metabolite accumulation → clinical presentation.
- Microbiology: organism → virulence factor → disease → treatment mechanism.
- Never use pure trivia without clinical anchor — always tie science to patient presentation.`;
}
