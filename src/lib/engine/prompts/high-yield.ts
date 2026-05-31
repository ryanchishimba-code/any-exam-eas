import type { ExamGenerationContext, SubjectModule } from "../../subjects/types";
import { buildBlueprintPromptBlock } from "../blueprints";

const DETAILED_RATIONALE_SCHEMA = `
DETAILED RATIONALE (required for every item):
- explanation: 2–4 sentences — why the correct answer is best; cite mechanism, priority, or guideline.
- clinicalReasoning: numbered steps (recognize cues → analyze → prioritize → act → evaluate) when clinical.
- distractorRationale: object mapping EACH incorrect option text → 1 sentence why it fails (common misconception or why it is lower priority / unsafe).
- references: array of "Source [n]" or brief OER titles from provided sources.
- bloomLevel: remember | understand | apply | analyze (most items should be apply or analyze).`;

const CLINICAL_VIGNETTE_RULES = `
CLINICAL VIGNETTE RULES:
- 65–80% of items in clinical fields MUST open with a vignette field (2–5 sentences) BEFORE the question stem.
- Vignette must include: age/sex (or client descriptor), setting, pertinent history, objective findings (vitals, labs, exam) when relevant.
- Vary openings — do NOT repeat "A patient presents" or "Case:" on consecutive items.
- For nursing: use "client" terminology; include nurse-relevant data (IVs, drains, orders, isolation).
- For medicine: include discriminating findings that rule in/out distractors.
- For pharmacy: patient case with meds, allergies, labs, or counseling scenario.
- For dentistry: include tooth/site, radiograph finding, or procedure context when applicable.
- Basic-science recall items may omit vignette ONLY when a direct fact question is more appropriate.`;

const STRONG_DISTRACTOR_RULES = `
STRONG DISTRACTOR RULES (mandatory for MCQ):
- Exactly 4 UNIQUE options; exactly 1 best answer.
- Each distractor must be plausible to a partially prepared student — not absurd or joke answers.
- Distractors should reflect REAL exam traps: wrong priority, wrong scope, wrong timing, wrong population, partial truth, or correct in another context.
- Options must be parallel in grammar, tense, and approximate length.
- Rotate correct-answer position — avoid more than 2 consecutive items with the same correct index.
- Never use "all of the above", "none of the above", or duplicate/near-duplicate options.`;

export function buildDistractorPatternBlock(subjectModule: SubjectModule): string {
  const patterns = subjectModule.distractorPatterns;
  if (!patterns.length) return "";

  const lines = patterns.map(
    (p, i) => `  ${i + 1}. ${p.label}: ${p.promptHint}`
  );

  return `
FIELD-SPECIFIC DISTRACTOR PATTERNS (use at least 2 per item set):
${lines.join("\n")}`;
}

export function buildNgnRequirementsBlock(fieldId: string, questionCount: number): string {
  if (fieldId !== "nursing") {
    return `
ITEM FORMAT MIX:
- Primary: multiple_choice with clinical vignettes.
- Optional: select_all (5–6 options, comma-separated correctAnswer) for "choose all that apply" when appropriate (~10% max outside nursing).`;
  }

  const ngnTarget = Math.max(1, Math.round(questionCount * 0.3));
  return `
NGN ITEM REQUIREMENTS (NCLEX Next Gen — ~${ngnTarget} of ${questionCount} items):
- unfolding_case: progressive case across 2–3 linked items; set caseStep 1/2/3; reveal new data each step.
- bow_tie: central condition; options split between actions TO take and conditions TO monitor (describe clearly in stem).
- select_all: 5–6 options; multiple correct; correctAnswer = comma-separated best answers.
- matrix: row/column judgments represented as labeled select_all options.
- highlight / ordered_response: use when testing priority sequencing or finding recognition.
- Set ngnFormat on every NGN item; classic MCQ for the remainder.`;
}

export function buildHighYieldJsonShape(): string {
  return `,
  "questions": [
    {
      "id": number,
      "type": "multiple_choice" | "select_all" | "bow_tie" | "matrix" | "unfolding_case" | "highlight" | "ordered_response",
      "vignette": string (clinical scenario text — required for most clinical items),
      "question": string (the actual question stem / lead-in),
      "options": [string, ...] (4 for MCQ; 5-6 for select_all),
      "correctAnswer": string (verbatim option text, or comma-separated for select_all / ordered_response),
      "explanation": string (detailed — why correct),
      "clinicalReasoning": string (step-by-step judgment),
      "distractorRationale": { "incorrect option text": "why wrong", ... },
      "references": [string],
      "bloomLevel": "remember" | "understand" | "apply" | "analyze",
      "ngnFormat": string (optional),
      "caseStep": number (optional, for unfolding_case),
      "solutionSteps": string[] (optional),
      "tags": string[],
      "highYield": boolean
    }
  ]`;
}

export function buildHighYieldRequirements(
  subjectModule: SubjectModule,
  ctx: ExamGenerationContext
): string {
  const blueprintBlock = buildBlueprintPromptBlock(
    ctx.fieldId,
    ctx.questionCount,
    ctx.subjectId
  );

  return [
    "HIGH-YIELD BOARD EXAM REQUIREMENTS:",
    blueprintBlock,
    CLINICAL_VIGNETTE_RULES,
    STRONG_DISTRACTOR_RULES,
    buildDistractorPatternBlock(subjectModule),
    buildNgnRequirementsBlock(ctx.fieldId, ctx.questionCount),
    DETAILED_RATIONALE_SCHEMA,
    subjectModule.capabilities.defaultHighYield
      ? "Mark highYield: true on items testing frequently tested, safety-critical, or commonly missed concepts."
      : "",
    `Cognitive framework (${subjectModule.cognitiveFramework.name}): ${subjectModule.cognitiveFramework.levels.join(" → ")}.`,
    `Difficulty (${ctx.difficulty}): ${subjectModule.cognitiveFramework.difficultyMapping[ctx.difficulty] ?? ctx.difficulty}.`,
  ]
    .filter(Boolean)
    .join("\n");
}
