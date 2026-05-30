import { cleanOptionText } from "@/lib/question-format";
import type { AttemptInput, LearningInsight, MistakeAnalysis } from "./types";
import { analyzeMistake } from "./mistake-analysis";

/** Build premium explanation payload from question + attempt context. */
export function buildLearningInsight(
  input: AttemptInput,
  mistake?: MistakeAnalysis
): LearningInsight {
  const q = input.question;
  const analysis = mistake ?? analyzeMistake(input);
  const detail = q.explanationDetail;

  const whyIncorrect: Record<string, string> = {};
  for (const opt of q.options) {
    const isCorrect = q.correctAnswers.some(
      (c) => cleanOptionText(c).toLowerCase() === cleanOptionText(opt).toLowerCase()
    );
    if (isCorrect) continue;
    const fromDetail = detail?.whyIncorrect?.[opt];
    whyIncorrect[opt] =
      fromDetail ??
      (input.selectedAnswer?.includes(opt)
        ? `Your selection — ${analysis.reasoning}`
        : "Eliminate when it contradicts the stem's key finding.");
  }

  const whyCorrect =
    detail?.whyCorrect ??
    q.explanation.split(/[.!?]/)[0]?.trim() ??
    "See full explanation below.";

  return {
    summary: input.correct
      ? "Solid reasoning — this concept is strengthening."
      : analysis.reasoning,
    whyCorrect,
    whyIncorrect,
    keyTakeaways: detail?.keyTakeaways ?? [
      q.explanation.slice(0, 160) + (q.explanation.length > 160 ? "…" : ""),
    ],
    pearls: detail?.pearls ?? (q.highYield ? ["High-yield — revisit within 48 hours."] : []),
    relatedConcepts:
      detail?.relatedConcepts ??
      (q.tags ?? []).map((t) => t.replace(/-/g, " ")),
    commonTraps: input.correct
      ? ["Watch for look-alike distractors on exam day."]
      : [
          "Rushing past the stem qualifier (except, first, most likely).",
          "Choosing the true statement that does not answer the question asked.",
        ],
    difficultyLabel: detail?.difficultyLabel ?? q.difficulty,
    mistakeAnalysis: input.correct ? undefined : analysis,
  };
}
