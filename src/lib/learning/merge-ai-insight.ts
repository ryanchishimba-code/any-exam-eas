import type { AIExplanation } from "@/lib/core/types";
import type { LearningInsight } from "@/lib/learning/types";

/** Merge AI Tutor output over the rule-based insight for display. */
export function mergeAiTutorInsight(
  base: LearningInsight,
  ai: AIExplanation
): LearningInsight {
  return {
    ...base,
    summary: ai.summary || base.summary,
    whyCorrect: ai.whyCorrect || base.whyCorrect,
    whyIncorrect: {
      ...base.whyIncorrect,
      ...(ai.whyIncorrect ?? {}),
    },
    keyTakeaways:
      ai.keyTakeaways && ai.keyTakeaways.length > 0 ? ai.keyTakeaways : base.keyTakeaways,
    pearls: ai.pearls && ai.pearls.length > 0 ? ai.pearls : base.pearls,
    relatedConcepts:
      ai.relatedConcepts && ai.relatedConcepts.length > 0
        ? ai.relatedConcepts
        : base.relatedConcepts,
    difficultyLabel: ai.difficultyLabel ?? base.difficultyLabel,
  };
}
