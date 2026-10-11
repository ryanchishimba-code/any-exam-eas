"use server";

import { getQotdForExam, isQotdExamSlug } from "@/lib/demo/qotd";

export type QotdReveal = {
  correctOption: string;
  rationale: string;
  isCorrect: boolean;
};

/**
 * The key is loaded on the server when the learner checks an answer.
 * Dates after today in America/Chicago return null so tomorrow’s answer
 * is never sent.
 */
export async function revealQotdAnswer(
  exam: string,
  dateIso: string,
  selected: string
): Promise<QotdReveal | null> {
  if (!isQotdExamSlug(exam)) return null;
  const choice = selected.trim();
  if (!choice) return null;
  const item = getQotdForExam(exam, dateIso);
  if (!item || !item.options.includes(choice)) return null;
  return {
    correctOption: item.correct,
    rationale: item.rationale,
    isCorrect: choice === item.correct,
  };
}
