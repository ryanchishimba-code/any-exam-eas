import type { BankItem } from "@/lib/question-bank";
import { hasGenericPlaceholderOptions } from "@/lib/question-format";

/** Board-aligned quality dimensions (1–10 each). */
export const QUALITY_CRITERIA = [
  "blueprintRelevance",
  "questionStyle",
  "distractorQuality",
  "difficultyLevel",
  "explanationDepth",
  "examUsefulness",
  "accuracyCurrency",
] as const;

export type QualityCriterion = (typeof QUALITY_CRITERIA)[number];

export type QualityCriterionScores = Record<QualityCriterion, number>;

export type QuestionQualityRating = {
  criteria: QualityCriterionScores;
  overall: number;
  grade: "Excellent" | "Strong" | "Adequate" | "Needs work" | "Weak";
  feedback: Partial<Record<QualityCriterion, string>>;
  needsImprovement: boolean;
  weakCriteria: QualityCriterion[];
};

export const CRITERION_LABELS: Record<QualityCriterion, string> = {
  blueprintRelevance: "Blueprint / high-yield relevance",
  questionStyle: "Question style & wording",
  distractorQuality: "Distractor quality",
  difficultyLevel: "Difficulty calibration",
  explanationDepth: "Explanation depth",
  examUsefulness: "Exam usefulness",
  accuracyCurrency: "Accuracy & currency",
};

const WEAK_THRESHOLD = 6;
const IMPROVE_THRESHOLD = 7;

function clampScore(n: number): number {
  return Math.max(1, Math.min(10, Math.round(n)));
}

function gradeFromOverall(overall: number): QuestionQualityRating["grade"] {
  if (overall >= 9) return "Excellent";
  if (overall >= 8) return "Strong";
  if (overall >= 7) return "Adequate";
  if (overall >= 5) return "Needs work";
  return "Weak";
}

function scoreBlueprint(item: BankItem): { score: number; note?: string } {
  let score = 5;
  if (item.blueprintTopic?.trim()) score += 2;
  if (item.blueprintDomain?.trim()) score += 1;
  if (item.topicCategory?.trim()) score += 1;
  if (item.tags?.some((t) => /high.?yield/i.test(t))) score += 1;
  if (!item.blueprintTopic && !item.topicCategory) {
    return { score: clampScore(score), note: "Add blueprint topic or category for exam alignment." };
  }
  return { score: clampScore(score) };
}

function scoreStyle(item: BankItem): { score: number; note?: string } {
  const stem = item.scenario?.trim()
    ? `${item.scenario}\n${item.question}`
    : item.question;
  let score = 6;
  if (stem.length >= 40 && stem.length <= 420) score += 1;
  if (!/^(case:|question:|q:)/i.test(item.question.trim())) score += 1;
  if (!/which of the following|most appropriate|best (next )?step|priority/i.test(stem)) {
    score += 0.5;
  } else {
    score += 1.5;
  }
  if (stem.length < 25) {
    return { score: clampScore(4), note: "Stem may be too brief for board-style assessment." };
  }
  return { score: clampScore(score) };
}

function scoreDistractors(item: BankItem): { score: number; note?: string } {
  const opts = item.options ?? [];
  if (opts.length !== 4) {
    return { score: clampScore(3), note: "Board MCQs should have four distinct options." };
  }
  if (hasGenericPlaceholderOptions(opts)) {
    return { score: clampScore(2), note: "Replace placeholder options with clinical distractors." };
  }
  let score = 6;
  const unique = new Set(opts.map((o) => o.trim().toLowerCase()));
  if (unique.size === 4) score += 2;
  const rationales = Object.keys(item.distractorRationale ?? {}).length;
  if (rationales >= 3) score += 2;
  else if (rationales >= 1) score += 1;
  return { score: clampScore(score) };
}

function scoreDifficulty(item: BankItem): { score: number; note?: string } {
  if (typeof item.difficulty === "number" && item.difficulty >= 1 && item.difficulty <= 5) {
    return { score: clampScore(7 + (item.difficulty === 3 ? 1 : 0)) };
  }
  return { score: 6, note: "Set difficulty 1–5 for adaptive routing." };
}

function scoreExplanation(item: BankItem): { score: number; note?: string } {
  const exp = item.explanation?.trim() ?? "";
  let score = 4;
  if (exp.length >= 80) score += 2;
  if (exp.length >= 160) score += 2;
  if (item.clinicalReasoning && item.clinicalReasoning.length > 40) score += 1;
  if (item.keyTakeaways?.length) score += 1;
  if (item.references?.length) score += 1;
  if (exp.length < 60) {
    return { score: clampScore(score), note: "Expand rationale with teaching points and evidence." };
  }
  return { score: clampScore(score) };
}

function scoreUsefulness(item: BankItem): { score: number; note?: string } {
  let score = 5;
  if (item.correctAnswer && item.options?.includes(item.correctAnswer)) score += 2;
  if (item.explanation.length > 100) score += 1;
  if (item.blueprintTopic || item.topicCategory) score += 1;
  if (item.source === "curated" || item.source === "polished") score += 1;
  return { score: clampScore(score) };
}

function scoreAccuracy(item: BankItem): { score: number; note?: string } {
  let score = 7;
  if (item.reviewStatus === "approved") score += 2;
  if (item.reviewStatus === "flagged" || item.reviewStatus === "rejected") score -= 3;
  if (!item.correctAnswer?.trim()) {
    return { score: 2, note: "Missing keyed correct answer." };
  }
  return { score: clampScore(score) };
}

/** Rate a bank item against board-exam quality criteria (1–10 per dimension). */
export function rateQuestionQuality(item: BankItem): QuestionQualityRating {
  const scored = {
    blueprintRelevance: scoreBlueprint(item),
    questionStyle: scoreStyle(item),
    distractorQuality: scoreDistractors(item),
    difficultyLevel: scoreDifficulty(item),
    explanationDepth: scoreExplanation(item),
    examUsefulness: scoreUsefulness(item),
    accuracyCurrency: scoreAccuracy(item),
  } satisfies Record<QualityCriterion, { score: number; note?: string }>;

  const criteria = Object.fromEntries(
    QUALITY_CRITERIA.map((key) => [key, scored[key].score])
  ) as QualityCriterionScores;

  const overall = clampScore(
    QUALITY_CRITERIA.reduce((sum, key) => sum + criteria[key], 0) / QUALITY_CRITERIA.length
  );

  const feedback: Partial<Record<QualityCriterion, string>> = {};
  for (const key of QUALITY_CRITERIA) {
    if (scored[key].note) feedback[key] = scored[key].note;
  }

  const weakCriteria = QUALITY_CRITERIA.filter((key) => criteria[key] < WEAK_THRESHOLD);

  return {
    criteria,
    overall,
    grade: gradeFromOverall(overall),
    feedback,
    needsImprovement: overall < IMPROVE_THRESHOLD || weakCriteria.length > 0,
    weakCriteria,
  };
}

export function qualityScoreToMeta(rating: QuestionQualityRating): Record<string, unknown> {
  return {
    rubricVersion: 1,
    ratedAt: new Date().toISOString(),
    overall: rating.overall,
    grade: rating.grade,
    criteria: rating.criteria,
    weakCriteria: rating.weakCriteria,
  };
}
