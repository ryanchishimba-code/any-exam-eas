/**
 * Merge a reveal response into the question the player already rendered.
 * Case ids on the delivered payload stay as they are.
 */
import { splitStoredCorrectAnswers } from "@/lib/questions/multi-answer";
import type { RevealedAnswerFields } from "@/lib/questions/reveal-study-answer";
import type { StudyQuestion } from "@/lib/questions/types";

const ANSWER_LAYOUT_KEYS = ["highlights", "condition", "key", "keys", "rationale"] as const;

function mergeLayout(
  current: Record<string, unknown> | undefined,
  revealed: Record<string, unknown> | undefined
): Record<string, unknown> | undefined {
  if (!revealed) return current;
  const next = { ...(current ?? {}) };
  for (const key of ANSWER_LAYOUT_KEYS) {
    if (revealed[key] !== undefined) next[key] = revealed[key];
  }
  return next;
}

export function applyRevealedAnswer(question: StudyQuestion, answer: RevealedAnswerFields): StudyQuestion {
  const stored = answer.correctAnswer.trim();
  const correctAnswers =
    question.type === "matrix"
      ? stored.split(";;").map((part) => part.trim()).filter(Boolean)
      : splitStoredCorrectAnswers(stored, question.options);
  return {
    ...question,
    correctAnswers,
    explanation: answer.explanation,
    solutionSteps: answer.solutionSteps ?? question.solutionSteps,
    clinicalReasoning: answer.clinicalReasoning ?? question.clinicalReasoning,
    distractorRationale: answer.distractorRationale ?? question.distractorRationale,
    expertRationale: answer.expertRationale ?? question.expertRationale,
    ngnPayload: mergeLayout(question.ngnPayload, answer.ngnPayload),
    chartData: mergeLayout(question.chartData, answer.chartData),
  };
}
