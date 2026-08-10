import { cleanOptionText } from "@/lib/question-format";
import type { StudyQuestion } from "@/lib/questions/types";
import type { AttemptInput, LearningInsight, MistakeAnalysis } from "./types";
import { analyzeMistake } from "./mistake-analysis";

/** Prefer expert clinical pearl, then explanationDetail pearls. */
export function pearlsFromQuestion(q: StudyQuestion): string[] {
  const fromExpert = q.expertRationale?.clinicalPearl?.trim();
  const fromDetail = q.explanationDetail?.pearls ?? [];
  const pearls = [...(fromExpert ? [fromExpert] : []), ...fromDetail]
    .map((p) => p.trim())
    .filter(Boolean);
  return [...new Set(pearls)];
}

/** Prefer expert common pitfalls for the miss-card trap line. */
export function trapsFromQuestion(q: StudyQuestion, correct: boolean): string[] {
  const fromExpert = (q.expertRationale?.commonPitfalls ?? [])
    .map((t) => t.trim())
    .filter(Boolean);
  if (fromExpert.length > 0) return [...new Set(fromExpert)];
  if (correct) return ["Watch for look-alike distractors on exam day."];
  return [
    "Rushing past the stem qualifier (except, first, most likely).",
    "Choosing the true statement that does not answer the question asked.",
  ];
}

/** Build premium explanation payload from question + attempt context. */
export function buildLearningInsight(
  input: AttemptInput,
  mistake?: MistakeAnalysis
): LearningInsight {
  const q = input.question;
  const analysis = mistake ?? analyzeMistake(input);
  const detail = q.explanationDetail;
  const expert = q.expertRationale;

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
    expert?.whyCorrect?.headline ??
    q.explanation.split(/[.!?]/)[0]?.trim() ??
    "See full explanation below.";

  const pearls = pearlsFromQuestion(q);
  const keyTakeaways =
    detail?.keyTakeaways ??
    (expert?.keyTakeaway
      ? [expert.keyTakeaway]
      : [q.explanation.slice(0, 160) + (q.explanation.length > 160 ? "…" : "")]);

  return {
    summary: input.correct
      ? "Solid reasoning — this concept is strengthening."
      : analysis.reasoning,
    whyCorrect,
    whyIncorrect,
    keyTakeaways,
    pearls:
      pearls.length > 0
        ? pearls
        : q.highYield
          ? ["High-yield — revisit within 48 hours."]
          : [],
    relatedConcepts:
      detail?.relatedConcepts ??
      (q.tags ?? []).map((t) => t.replace(/-/g, " ")),
    commonTraps: trapsFromQuestion(q, input.correct),
    difficultyLabel: detail?.difficultyLabel ?? q.difficulty,
    mistakeAnalysis: input.correct ? undefined : analysis,
  };
}
