/**
 * Ask the existing reveal route for the answer after the student submits.
 * This module stays free of Node crypto so the exam player can import it.
 */
import type { RevealedAnswerFields } from "@/lib/questions/reveal-study-answer";

export async function fetchRevealedAnswer(input: {
  itemId: string;
  selected: string[];
  options: string[];
  /**
   * Exam-mode reveal must send the exam session id. Omitting it is practice
   * and is not blocked by the student's other unfinished exams.
   */
  sessionId?: string;
}): Promise<{ correct: boolean; answer: RevealedAnswerFields } | null> {
  const res = await fetch("/api/study/ngn-reveal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      itemId: input.itemId,
      version: 1,
      response: input.selected,
      options: input.options,
      ...(input.sessionId ? { sessionId: input.sessionId } : {}),
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json().catch(() => null)) as {
    correct?: boolean;
    answer?: RevealedAnswerFields;
  } | null;
  if (!data?.answer || typeof data.answer.correctAnswer !== "string") return null;
  return { correct: data.correct === true, answer: data.answer };
}
