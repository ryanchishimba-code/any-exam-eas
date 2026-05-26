import type { ExamQuestion } from "../../ai";
import type { ExamGenerationContext, SubjectModule } from "../../subjects/types";

export function scoreExamQuality(
  exam: { questions: ExamQuestion[] },
  subjectModule: SubjectModule,
  ctx: ExamGenerationContext
): { average: number; perQuestion: number[] } {
  const perQuestion = exam.questions.map((q) => {
    const custom = subjectModule.scoreQuestionQuality?.(q, ctx);
    if (custom !== undefined) return custom;
    let score = 0.7;
    if (q.options?.length === 4) score += 0.1;
    if (q.explanation.length > 40) score += 0.1;
    if (q.correctAnswer && q.options?.includes(q.correctAnswer)) score += 0.1;
    return Math.min(1, score);
  });
  const average =
    perQuestion.length === 0
      ? 0
      : perQuestion.reduce((a, b) => a + b, 0) / perQuestion.length;
  return { average, perQuestion };
}
