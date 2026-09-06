import type { StudyQuestion } from "@/lib/questions/types";
import type { AttemptInput, MistakeAnalysis, MistakeCategory } from "./types";
import { isInternalMasteryConceptKey } from "@/lib/learning/concept-labels";

const STEM_CALC =
  /\b(calculate|dose|dosage|mg\/kg|mEq|concentration|half-life|equation|formula)\b/i;
const STEM_CLINICAL =
  /\b(prioritize|first step|most appropriate|next best|contraindicated|presentation)\b/i;

/**
 * Classify why an answer was wrong — rule-based today, LLM-ready via metadataJson hooks.
 */
export function analyzeMistake(input: AttemptInput): MistakeAnalysis {
  const { question, correct, confidence, durationMs, selectedAnswer } = input;
  const weakConcepts = extractConceptKeys(question);

  if (correct) {
    return {
      category: "unknown",
      guessedCorrect: false,
      reasoning: "Correct response — reinforcement scheduled.",
      weakConcepts,
    };
  }

  const guessedCorrect =
    confidence != null && confidence <= 2 && correct === false
      ? false
      : confidence != null && confidence >= 4 && !correct;

  let category: MistakeCategory = "concept_misunderstanding";
  let reasoning = "Review the core concept behind this item.";

  if (durationMs != null && durationMs < 4000 && question.options.length >= 4) {
    category = "time_pressure";
    reasoning = "Fast response with an error — slow down and map each option to the stem.";
  } else if (guessedCorrect) {
    category = "overconfidence";
    reasoning = "High confidence miss — compare your reasoning to the explanation line by line.";
  } else if (STEM_CALC.test(question.stem)) {
    category = "calculation_error";
    reasoning = "Numeric or dosing logic — rework units and verify each calculation step.";
  } else if (STEM_CLINICAL.test(question.stem)) {
    category = "clinical_reasoning";
    reasoning = "Clinical decision chain — identify the decisive finding before eliminating options.";
  } else if (question.type === "image_interpretation" || question.type === "chart_table") {
    category = "pattern_recognition";
    reasoning = "Visual pattern — re-scan the image/chart for the discriminating feature.";
  } else if (confidence != null && confidence <= 2) {
    category = "memorization_gap";
    reasoning = "Low confidence miss — add spaced repetition for this fact pattern.";
  } else if (selectedAnswer && isNearMiss(question, selectedAnswer)) {
    category = "clinical_reasoning";
    reasoning = "Close distractor — note what differentiates the correct option.";
  }

  return { category, guessedCorrect, reasoning, weakConcepts };
}

function extractConceptKeys(question: StudyQuestion): string[] {
  const keys = new Set<string>();
  if (question.subjectId) keys.add(`subject:${question.subjectId}`);
  for (const tag of question.tags ?? []) {
    const key = `tag:${tag.toLowerCase().trim()}`;
    if (!isInternalMasteryConceptKey(key)) keys.add(key);
  }
  if (keys.size === 0) keys.add("tag:general");
  return [...keys];
}

function isNearMiss(question: StudyQuestion, selected: string): boolean {
  const sel = selected.toLowerCase();
  return question.options.some(
    (o) =>
      o.toLowerCase() !== sel &&
      question.correctAnswers.some((c) => c.toLowerCase() === o.toLowerCase())
  );
}

export function mistakeCategoryLabel(category: MistakeCategory): string {
  const labels: Record<MistakeCategory, string> = {
    concept_misunderstanding: "Concept gap",
    memorization_gap: "Recall gap",
    clinical_reasoning: "Clinical reasoning",
    calculation_error: "Calculation",
    pattern_recognition: "Pattern recognition",
    time_pressure: "Time pressure",
    overconfidence: "Overconfidence",
    unknown: "Review needed",
  };
  return labels[category];
}
