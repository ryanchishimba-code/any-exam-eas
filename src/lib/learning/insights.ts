import { cleanOptionText } from "@/lib/question-format";
import type { StudyQuestion } from "@/lib/questions/types";
import { clipRationaleSection } from "@/lib/engine/rationale/parse-rationale-display";
import { explanatoryRationaleSummary } from "@/lib/study/rationale-disclosure";
import type { AttemptInput, LearningInsight, MistakeAnalysis } from "./types";
import { analyzeMistake } from "./mistake-analysis";

/** First real explanatory sentence across stored rationale fields. */
function studentWhyCorrect(
  candidates: Array<string | null | undefined>,
  fallback: string
): string {
  for (const candidate of candidates) {
    const summary = explanatoryRationaleSummary(candidate);
    if (summary) return summary;
  }
  return fallback;
}

/** Prefer expert clinical pearl, then explanationDetail pearls. */
export function pearlsFromQuestion(q: StudyQuestion): string[] {
  const fromExpert = q.expertRationale?.clinicalPearl?.trim();
  const fromDetail = q.explanationDetail?.pearls ?? [];
  const pearls = [...(fromExpert ? [fromExpert] : []), ...fromDetail]
    .map((p) => clipRationaleSection(p))
    .filter(Boolean);
  return [...new Set(pearls)];
}

const GENERIC_TRAP =
  /^(watch for look-alike distractors|rushing past the stem qualifier|choosing the true statement that does not answer|compare each wrong option to the priority action)/i;

/** Item-specific traps only. Generic filler is omitted so the section can hide. */
export function trapsFromQuestion(q: StudyQuestion, _correct: boolean): string[] {
  const fromExpert = (q.expertRationale?.commonPitfalls ?? [])
    .map((t) => t.trim())
    .filter((t) => t && !GENERIC_TRAP.test(t));
  return [...new Set(fromExpert)];
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

  const whyCorrect = studentWhyCorrect(
    [detail?.whyCorrect, expert?.whyCorrect?.headline, q.explanation],
    "See the full explanation below."
  );

  const pearls = pearlsFromQuestion(q);
  const explanationLead = explanatoryRationaleSummary(q.explanation);
  const keyTakeaways =
    detail?.keyTakeaways ??
    (expert?.keyTakeaway ? [expert.keyTakeaway] : explanationLead ? [explanationLead] : []);

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
