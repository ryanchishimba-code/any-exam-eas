import type { ExamGenerationContext, SubjectModule } from "../../subjects/types";
import {
  buildBlueprintPromptBlock,
  buildDetailedSlotAllocationBlock,
} from "../blueprints";
import { buildClinicalReasoningBlock } from "./clinical-reasoning";
import { buildOerGroundingBlock } from "./oer-grounding";
import { buildVignetteJsonHint, VIGNETTE_REQUIREMENTS } from "./vignette";
import {
  buildPharmDrugRequirementsBlock,
  PHARM_DRUG_PROFILE_JSON,
  requiresDrugProfileOnEveryQuestion,
} from "./pharm-drug-profile";
import { BATCH_DIVERSITY_RULES } from "./batch-diversity";
import { buildNclexBoardQualityBlock } from "@/lib/exam-prep/nclex/item-writer-prompt";

const DETAILED_RATIONALE_SCHEMA = `
DETAILED RATIONALE (required for every item):
- explanation: 3–5 sentences — why the correct answer is best; cite specific signs/symptoms from the vignette AND etiology/pathophysiology or mechanism.
- clinicalReasoning: numbered steps using the field-specific framework (CJMM for nursing; mechanism→diagnosis→management for USMLE; therapeutic chain for NAPLEX).
- distractorRationale: object mapping EACH incorrect option text → 1 sentence why it fails, referencing stem findings and why the misconception is wrong.
- references: array citing BOTH retrieved OER sources ("Source [n]") AND the official blueprint:
  • Nursing: NCSBN NCLEX-RN Test Plan / Clinical Judgment Measurement Model
  • USMLE Step 1 & Step 2: USMLE Content Outline / NBME-style items
  • Pharmacy: NABP NAPLEX Content Outline (2025)
- bloomLevel: remember | understand | apply | analyze (most items should be apply or analyze).
- difficultyLabel: "Easy" | "Medium" | "Hard" (Easy = single finding/priority; Medium = 2-step reasoning; Hard = competing priorities or multi-step integration).
- topicCategory: blueprint category label (e.g. "Management of Care", "Cardiovascular", "Medication Use Process").`;


const STRONG_DISTRACTOR_RULES = `
STRONG DISTRACTOR RULES (mandatory for MCQ):
- Exactly 4 UNIQUE options; exactly 1 best answer (unless select_all / ordered_response).
- Each distractor plausible to a partially prepared student — reflect REAL exam traps.
- Trap types: wrong priority, wrong scope, wrong timing, wrong population, partial truth, correct in another context, mechanism confusion, interaction/dose error.
- Options parallel in grammar, tense, and approximate length.
- Rotate correct-answer position — avoid more than 2 consecutive items with the same correct index.
- Never use "all of the above", "none of the above", or duplicate options.`;

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
- Optional: select_all (5–6 options, comma-separated correctAnswer) when clinically appropriate (~10% max outside nursing).`;
  }

  const ngnTarget = Math.max(1, Math.round(questionCount * 0.3));
  return `
NGN ITEM REQUIREMENTS (NCLEX Next Gen — ~${ngnTarget} of ${questionCount} items):
Follow the ITEM-BY-ITEM ALLOCATION for assigned ngnFormat per question.
- unfolding_case: progressive case across 2–3 linked items; caseStep 1/2/3; new assessment data each step; CJMM at each step.
- bow_tie: central condition in stem; options = actions TO take AND conditions TO monitor; explain both domains in rationale.
- select_all (SATA): 5–6 options; multiple correct; correctAnswer = comma-separated; rationale for each option.
- matrix: row/column clinical judgments as labeled select_all options.
- ordered_response / drag_drop: priority sequencing or delegation scope; correctAnswer = comma-separated ordered list.
- highlight: key finding recognition in vignette text when assigned.
- Set ngnFormat and type on every NGN item; classic MCQ vignettes for the remainder.`;
}

export function buildHighYieldJsonShape(ctx?: ExamGenerationContext): string {
  const drugProfileLine = ctx && requiresDrugProfileOnEveryQuestion(ctx)
    ? `${PHARM_DRUG_PROFILE_JSON} (REQUIRED on every question)`
    : `${PHARM_DRUG_PROFILE_JSON} (required on every pharmacology / drug-centered item)`;

  return `,
  "questions": [
    {
      "id": number,
      "type": "multiple_choice" | "select_all" | "bow_tie" | "matrix" | "unfolding_case" | "highlight" | "ordered_response",
      ${buildVignetteJsonHint()},
      "question": string (lead-in stem ONLY — e.g. "Which action should the nurse take first?"),
      "options": [string, ...] (4 for MCQ; 5-6 for select_all),
      "correctAnswer": string (verbatim option text, or comma-separated for select_all / ordered_response),
      "explanation": string (detailed — why correct; cite signs/symptoms + etiology/pathophysiology),
      "clinicalReasoning": string (step-by-step CJMM or clinical chain),
      "distractorRationale": { "incorrect option text": "why wrong — reference stem data", ... },
      "references": [string],
      "bloomLevel": "remember" | "understand" | "apply" | "analyze",
      "difficultyLabel": "Easy" | "Medium" | "Hard",
      "topicCategory": string,
      "ngnFormat": string (optional),
      "caseStep": number (optional, for unfolding_case),
      "solutionSteps": string[] (optional),
      ${drugProfileLine},
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
  const slotBlock = buildDetailedSlotAllocationBlock(
    ctx.fieldId,
    ctx.questionCount,
    ctx.subjectId
  );
  const clinicalBlock = buildClinicalReasoningBlock(ctx.fieldId);
  const pharmDrugBlock = buildPharmDrugRequirementsBlock(ctx);

  return [
    "HIGH-YIELD BOARD EXAM REQUIREMENTS:",
    blueprintBlock,
    slotBlock,
    clinicalBlock,
    pharmDrugBlock,
    ctx.fieldId === "nursing" ? buildNclexBoardQualityBlock() : "",
    VIGNETTE_REQUIREMENTS,
    buildOerGroundingBlock(),
    STRONG_DISTRACTOR_RULES,
    BATCH_DIVERSITY_RULES,
    buildDistractorPatternBlock(subjectModule),
    buildNgnRequirementsBlock(ctx.fieldId, ctx.questionCount),
    DETAILED_RATIONALE_SCHEMA,
    subjectModule.capabilities.defaultHighYield
      ? "Mark highYield: true on safety-critical, frequently tested, or commonly missed concepts."
      : "",
    `Cognitive framework (${subjectModule.cognitiveFramework.name}): ${subjectModule.cognitiveFramework.levels.join(" → ")}.`,
    `Difficulty (${ctx.difficulty}): ${subjectModule.cognitiveFramework.difficultyMapping[ctx.difficulty] ?? ctx.difficulty}.`,
  ]
    .filter(Boolean)
    .join("\n");
}
