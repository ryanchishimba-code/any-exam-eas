/**
 * Convert live ExamQuestion output back into QuestionBankItem shape.
 */
import type { ExamQuestion } from "@/lib/ai";
import type { BankItem } from "@/lib/question-bank";

export function examQuestionToBankItem(
  exam: ExamQuestion,
  base: Partial<BankItem> = {}
): BankItem {
  const vignette = exam.vignette?.trim() ?? "";
  const stem = exam.question?.trim() ?? "";
  const options = [...(exam.options ?? [])];

  let explanation = exam.explanation?.trim() ?? "";
  if (exam.clinicalReasoning?.trim()) {
    explanation = `${explanation}\n\nClinical reasoning: ${exam.clinicalReasoning.trim()}`.trim();
  }
  if (exam.distractorRationale && Object.keys(exam.distractorRationale).length > 0) {
    const lines = Object.entries(exam.distractorRationale)
      .filter(([opt]) => opt !== exam.correctAnswer)
      .map(([opt, why]) => `• ${opt}: ${why}`);
    if (lines.length > 0) {
      explanation = `${explanation}\n\nWhy other options are incorrect:\n${lines.join("\n")}`.trim();
    }
  }

  const tags = [...new Set([...(base.tags ?? exam.tags ?? []), "ai-curated"])];

  return {
    ...base,
    subjectId: base.subjectId,
    question: stem,
    vignette,
    scenario: vignette,
    options,
    correctAnswer: exam.correctAnswer,
    explanation,
    clinicalReasoning: exam.clinicalReasoning,
    distractorRationale: exam.distractorRationale,
    tags,
    itemType: "vignette",
    difficulty: base.difficulty,
    topicCategory: base.topicCategory ?? exam.topicCategory,
    blueprintDomain: base.blueprintDomain,
    references: exam.references?.map((label) => ({ label })) ?? base.references,
  };
}
