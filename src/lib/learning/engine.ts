import { runAdaptiveSelection } from "@/lib/core/prisma-adapter";
import { prioritizeForReview } from "@/lib/questions/adaptive";
import type { StudyQuestion } from "@/lib/questions/types";
import { buildLearningInsight } from "./insights";
import { analyzeMistake } from "./mistake-analysis";
import { getLearningProfileSnapshot, recordAttemptWithMastery } from "./profile-service";
import { buildRemediationRecommendations } from "./recommendations";
import type { AttemptInput, ProcessAttemptResult } from "./types";
import { buildTopicWeakness } from "./weakness";

/**
 * Central adaptive learning orchestrator — all attempt side-effects flow here.
 * AI hooks: pass metadataJson on LearningProfile or call external LLM from insights.ts.
 */
export async function processLearningAttempt(
  input: AttemptInput
): Promise<ProcessAttemptResult> {
  const mistake = analyzeMistake(input);
  const insight = buildLearningInsight(input, mistake);

  let attemptId: string | undefined;
  try {
    const result = await recordAttemptWithMastery(input);
    attemptId = result.attemptId;
  } catch {
    /* non-blocking for UI */
  }

  const profile = await getLearningProfileSnapshot(input.userId);

  const remediation = buildRemediationRecommendations({
    fieldId: input.fieldId,
    subjectId: input.question.subjectId,
    correct: input.correct,
    mistakeCategory: mistake.category,
    weakConcepts: mistake.weakConcepts,
    weakest: profile.weakestConcepts.filter((c) => c.fieldId === input.fieldId),
  });

  return { attemptId, insight, remediation };
}

/** Order questions for adaptive / weak-area sessions using the core engine. */
export async function adaptQuestionOrder(
  userId: string,
  fieldId: string,
  questions: StudyQuestion[],
  mode: "adaptive" | "weak_area" | "default" = "adaptive"
): Promise<StudyQuestion[]> {
  if (mode === "default") return questions;

  try {
    const { orderedQuestions } = await runAdaptiveSelection({
      userId,
      fieldId,
      questions,
      count: questions.length,
      studyMode: mode === "weak_area" ? "weak_area" : "adaptive",
    });
    if (orderedQuestions.length > 0) return orderedQuestions;
  } catch {
    /* fallback below */
  }

  const weakness = await buildTopicWeakness(userId, fieldId);
  if (mode === "weak_area") {
    return prioritizeForReview(questions, weakness).filter((_, i, arr) => {
      const weakCount = Math.ceil(arr.length * 0.7);
      return i < weakCount;
    });
  }
  return prioritizeForReview(questions, weakness);
}

export { getLearningProfileSnapshot };
