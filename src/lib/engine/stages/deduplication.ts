import type { GeneratedExam } from "../../ai";

/** Remove duplicate question stems (case-insensitive prefix match). */
export function deduplicateExamQuestions(exam: GeneratedExam): GeneratedExam {
  const seen = new Set<string>();
  const questions = exam.questions.filter((q) => {
    const key = q.question.trim().toLowerCase().slice(0, 120);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return { ...exam, questions };
}
