import { cleanOptionText } from "@/lib/question-format";
import type { StudyQuestion } from "@/lib/questions/types";
import type { LearningInsight } from "./types";

/** Instant insight shell so AI Tutor can appear before /api/study/attempt returns. */
export function buildInsightPreview(
  question: StudyQuestion,
  correct: boolean,
  selected: string[]
): LearningInsight {
  const detail = question.explanationDetail;
  const whyIncorrect: Record<string, string> = {};

  for (const opt of question.options) {
    const isCorrect = question.correctAnswers.some(
      (c) => cleanOptionText(c).toLowerCase() === cleanOptionText(opt).toLowerCase()
    );
    if (isCorrect) continue;
    const fromDetail = detail?.whyIncorrect?.[opt];
    whyIncorrect[opt] =
      fromDetail ??
      (selected.includes(opt)
        ? "Your choice — tap AI Tutor below for a personalized walkthrough."
        : "Eliminate when it contradicts the stem's key finding.");
  }

  return {
    summary: correct
      ? "Solid work — explore AI Tutor to reinforce the clinical reasoning."
      : "Let's break down why the keyed answer wins and where your reasoning diverged.",
    whyCorrect:
      detail?.whyCorrect ??
      question.explanation.split(/[.!?]/)[0]?.trim() ??
      "See the full explanation below.",
    whyIncorrect,
    keyTakeaways: detail?.keyTakeaways ?? [],
    pearls: detail?.pearls ?? (question.highYield ? ["High-yield — revisit within 48 hours."] : []),
    relatedConcepts:
      detail?.relatedConcepts ??
      (question.tags ?? []).map((t) => t.replace(/-/g, " ")),
    commonTraps: correct
      ? ["Watch for look-alike distractors on exam day."]
      : [
          "Rushing past the stem qualifier (except, first, most likely).",
          "Choosing a true statement that does not answer the question asked.",
        ],
    difficultyLabel: detail?.difficultyLabel ?? question.difficulty,
  };
}
