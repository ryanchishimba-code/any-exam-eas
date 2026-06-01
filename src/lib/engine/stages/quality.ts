import type { ExamQuestion } from "../../ai";
import type { ExamGenerationContext, SubjectModule } from "../../subjects/types";
import { scoreClinicalRichness } from "../prompts/clinical-reasoning";
import { scoreDrugProfileCompleteness } from "../prompts/pharm-drug-profile";
import { scoreVignetteRichness } from "../prompts/vignette";

const NGN_TYPES = new Set([
  "select_all",
  "bow_tie",
  "matrix",
  "unfolding_case",
  "highlight",
  "ordered_response",
  "drag_drop",
]);

export function scoreExamQuality(
  exam: { questions: ExamQuestion[] },
  subjectModule: SubjectModule,
  ctx: ExamGenerationContext
): { average: number; perQuestion: number[] } {
  const perQuestion = exam.questions.map((q) => {
    const custom = subjectModule.scoreQuestionQuality?.(q, ctx);
    if (custom !== undefined) return custom;
    return scoreQuestionHeuristic(q, subjectModule, ctx.fieldId);
  });
  const average =
    perQuestion.length === 0
      ? 0
      : perQuestion.reduce((a, b) => a + b, 0) / perQuestion.length;
  return { average, perQuestion };
}

function scoreQuestionHeuristic(
  q: ExamQuestion,
  subjectModule: SubjectModule,
  fieldId: string
): number {
  let score = 0.5;

  const hasVignette =
    Boolean(q.vignette?.trim()) ||
    q.question.length > 120 ||
    /\d{1,3}[-‑]year|client|patient|vitals|lab|BP|HR|SpO2/i.test(q.question);

  if (hasVignette && subjectModule.capabilities.supportsClinicalVignettes !== false) {
    score += 0.1;
  } else if (!subjectModule.capabilities.supportsClinicalVignettes) {
    score += 0.05;
  }

  if (q.options?.length === 4 || (NGN_TYPES.has(q.type) && (q.options?.length ?? 0) >= 4)) {
    score += 0.08;
  }

  if (q.explanation.length > 100) score += 0.1;
  else if (q.explanation.length > 60) score += 0.05;

  const distractorCount = Object.keys(q.distractorRationale ?? {}).length;
  if (distractorCount >= 3) score += 0.1;
  else if (distractorCount >= 2) score += 0.05;

  if (q.clinicalReasoning && q.clinicalReasoning.length > 60) score += 0.08;
  else if (q.clinicalReasoning && q.clinicalReasoning.length > 30) score += 0.04;

  if (q.references?.length) score += 0.04;

  if (q.correctAnswer && q.options?.includes(q.correctAnswer)) score += 0.04;

  if (q.highYield) score += 0.02;

  if (q.bloomLevel === "apply" || q.bloomLevel === "analyze") score += 0.03;

  if (q.topicCategory?.trim()) score += 0.02;

  score += scoreVignetteRichness(q);
  score += scoreClinicalRichness(q, fieldId);
  score += scoreDrugProfileCompleteness(q);

  return Math.min(1, score);
}
