import type {
  AdaptiveMode,
  AttemptOutcome,
  DifficultyLevel,
  FactorScore,
  MasteryRecord,
  QuestionCandidate,
  ScoredSelection,
  SelectionFactor,
} from "./types";
import { parseDifficulty } from "./types";

/** Multi-factor weights — must sum to 1.0 */
export const SELECTION_WEIGHTS: Record<SelectionFactor, number> = {
  weakness: 0.35,
  srs_due: 0.25,
  yield: 0.2,
  difficulty_match: 0.1,
  novelty: 0.05,
  recency_penalty: 0.05,
};

export type AdaptiveEngineConfig = {
  mode: AdaptiveMode;
  targetDifficulty: DifficultyLevel;
  count: number;
  now?: Date;
  /** Boost weak-area weight in WEAK_AREAS mode */
  weakAreaBoost?: number;
};

export type AdaptiveSelectionResult = {
  selections: ScoredSelection[];
  sessionRationale: string;
  recommendedDifficulty: DifficultyLevel;
};

const DIFFICULTY_INDEX: Record<DifficultyLevel, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

export function scoreQuestion(
  candidate: QuestionCandidate,
  config: AdaptiveEngineConfig
): ScoredSelection {
  const factors: FactorScore[] = [];
  const mode = config.mode;
  const target = config.targetDifficulty;

  const weakness = clamp01(candidate.weaknessScore);
  factors.push({
    factor: "weakness",
    score: weakness,
    weight: SELECTION_WEIGHTS.weakness,
    detail:
      weakness >= 0.6
        ? "Topic is a known weak area"
        : weakness >= 0.3
          ? "Moderate topic gap"
          : "Topic is relatively strong",
  });

  const srs = clamp01(candidate.srsDueScore);
  factors.push({
    factor: "srs_due",
    score: srs,
    weight: SELECTION_WEIGHTS.srs_due,
    detail:
      srs >= 0.7
        ? "Spaced repetition — due for review"
        : srs >= 0.35
          ? "Approaching review window"
          : "Recently reviewed",
  });

  const yieldScore = candidate.highYield ? 1 : 0.45;
  factors.push({
    factor: "yield",
    score: yieldScore,
    weight: SELECTION_WEIGHTS.yield,
    detail: candidate.highYield ? "High-yield board content" : "Standard yield",
  });

  const diffMatch = 1 - Math.abs(DIFFICULTY_INDEX[candidate.difficulty] - DIFFICULTY_INDEX[target]) / 2;
  factors.push({
    factor: "difficulty_match",
    score: diffMatch,
    weight: SELECTION_WEIGHTS.difficulty_match,
    detail: `Matches ${target} difficulty target`,
  });

  const novelty = candidate.daysSinceLastAttempt == null ? 1 : clamp01(candidate.daysSinceLastAttempt / 14);
  factors.push({
    factor: "novelty",
    score: novelty,
    weight: SELECTION_WEIGHTS.novelty,
    detail:
      candidate.daysSinceLastAttempt == null
        ? "Unseen question — broadens coverage"
        : `Last seen ${Math.round(candidate.daysSinceLastAttempt)}d ago`,
  });

  const recencyPenalty =
    candidate.daysSinceLastAttempt != null && candidate.daysSinceLastAttempt < 0.5 ? 1 : 0;
  factors.push({
    factor: "recency_penalty",
    score: 1 - recencyPenalty,
    weight: SELECTION_WEIGHTS.recency_penalty,
    detail: recencyPenalty ? "Skipped — answered moments ago" : "Not a immediate repeat",
  });

  let totalScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0);

  if (mode === "WEAK_AREAS") {
    totalScore += weakness * (config.weakAreaBoost ?? 0.15);
  }
  if (mode === "FULL_SIM") {
    totalScore += yieldScore * 0.08 + diffMatch * 0.05;
  }
  if (mode === "MIXED_REVIEW") {
    totalScore += srs * 0.1 + novelty * 0.05;
  }

  const topFactors = [...factors]
    .sort((a, b) => b.score * b.weight - a.score * a.weight)
    .slice(0, 2)
    .map((f) => f.detail);

  return {
    questionKey: candidate.questionKey,
    totalScore,
    factors,
    reasoning: topFactors.join(" · "),
  };
}

export function selectQuestions(
  candidates: QuestionCandidate[],
  config: AdaptiveEngineConfig,
  excludeKeys: Set<string> = new Set()
): AdaptiveSelectionResult {
  const pool = candidates.filter((c) => !excludeKeys.has(c.questionKey));
  const scored = pool
    .map((c) => scoreQuestion(c, config))
    .sort((a, b) => b.totalScore - a.totalScore);

  const mode = config.mode;
  let picks: ScoredSelection[];

  if (mode === "WEAK_AREAS") {
    const weak = scored.filter((s) => {
      const c = pool.find((p) => p.questionKey === s.questionKey);
      return (c?.weaknessScore ?? 0) >= 0.35;
    });
    picks = (weak.length >= config.count ? weak : scored).slice(0, config.count);
  } else if (mode === "FULL_SIM") {
    picks = diversifyByTag(scored, pool, config.count);
  } else {
    picks = scored.slice(0, config.count);
  }

  const recommendedDifficulty = recommendDifficultyFromPool(pool, config.targetDifficulty);
  const sessionRationale = buildSessionRationale(picks, pool, config, recommendedDifficulty);

  return {
    selections: picks,
    sessionRationale,
    recommendedDifficulty,
  };
}

export function updateMasteryAfterAttempt(
  record: MasteryRecord | null,
  outcome: AttemptOutcome,
  now: Date = new Date()
): MasteryRecord {
  const base: MasteryRecord = record ?? {
    questionKey: "",
    fieldId: "",
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    nextDue: now,
    abilityEstimate: 0.5,
    lastAttemptAt: null,
    correctStreak: 0,
  };

  let { easeFactor, intervalDays, repetitions, correctStreak, abilityEstimate } = base;

  if (outcome.correct) {
    repetitions += 1;
    correctStreak += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 3;
    else intervalDays = Math.round(intervalDays * easeFactor);

    const confidenceBoost = outcome.confidence ? (outcome.confidence - 3) * 0.02 : 0;
    easeFactor = clamp(easeFactor + 0.1 + confidenceBoost, 1.3, 3.0);
    abilityEstimate = clamp(abilityEstimate + 0.08 + confidenceBoost, 0, 1);
  } else {
    repetitions = 0;
    correctStreak = 0;
    intervalDays = 1;
    easeFactor = clamp(easeFactor - 0.2, 1.3, 3.0);
    const penalty = outcome.timePressure ? 0.12 : 0.08;
    abilityEstimate = clamp(abilityEstimate - penalty, 0, 1);
  }

  const nextDue = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return {
    ...base,
    easeFactor,
    intervalDays,
    repetitions,
    nextDue,
    abilityEstimate,
    lastAttemptAt: now,
    correctStreak,
  };
}

export function srsDueScore(record: MasteryRecord | null, now: Date = new Date()): number {
  if (!record) return 0.85;
  const dueMs = record.nextDue.getTime() - now.getTime();
  if (dueMs <= 0) return clamp01(1 + Math.min(3, -dueMs / (24 * 60 * 60 * 1000)) * 0.15);
  const daysUntil = dueMs / (24 * 60 * 60 * 1000);
  return clamp01(1 - daysUntil / 7);
}

export function buildCandidateFromQuestion(params: {
  questionKey: string;
  fieldId: string;
  subjectId?: string;
  tags?: string[];
  difficulty?: string;
  highYield?: boolean;
  mastery: MasteryRecord | null;
  weaknessScore: number;
  now?: Date;
}): QuestionCandidate {
  const now = params.now ?? new Date();
  const last = params.mastery?.lastAttemptAt;
  const daysSinceLastAttempt = last
    ? (now.getTime() - last.getTime()) / (24 * 60 * 60 * 1000)
    : null;

  return {
    questionKey: params.questionKey,
    fieldId: params.fieldId,
    subjectId: params.subjectId,
    tags: params.tags ?? [],
    difficulty: parseDifficulty(params.difficulty),
    highYield: params.highYield ?? false,
    daysSinceLastAttempt,
    weaknessScore: clamp01(params.weaknessScore),
    srsDueScore: srsDueScore(params.mastery, now),
    abilityEstimate: params.mastery?.abilityEstimate ?? 0.5,
  };
}

export function generateFullExamSimulation(
  candidates: QuestionCandidate[],
  count: number,
  targetDifficulty: DifficultyLevel = "medium"
): AdaptiveSelectionResult {
  return selectQuestions(candidates, {
    mode: "FULL_SIM",
    targetDifficulty,
    count,
  });
}

function diversifyByTag(
  scored: ScoredSelection[],
  pool: QuestionCandidate[],
  count: number
): ScoredSelection[] {
  const byTag = new Map<string, ScoredSelection[]>();
  for (const s of scored) {
    const c = pool.find((p) => p.questionKey === s.questionKey);
    const tag = c?.tags[0] ?? c?.subjectId ?? "general";
    const list = byTag.get(tag) ?? [];
    list.push(s);
    byTag.set(tag, list);
  }

  const picks: ScoredSelection[] = [];
  const tags = [...byTag.keys()];
  let round = 0;
  while (picks.length < count && tags.length > 0) {
    const tag = tags[round % tags.length];
    const list = byTag.get(tag) ?? [];
    const next = list.shift();
    if (next) picks.push(next);
    if (list.length === 0) {
      byTag.delete(tag);
      tags.splice(tags.indexOf(tag), 1);
    }
    round++;
    if (round > count * tags.length * 2) break;
  }

  if (picks.length < count) {
    for (const s of scored) {
      if (picks.length >= count) break;
      if (!picks.some((p) => p.questionKey === s.questionKey)) picks.push(s);
    }
  }
  return picks.slice(0, count);
}

function recommendDifficultyFromPool(
  pool: QuestionCandidate[],
  current: DifficultyLevel
): DifficultyLevel {
  if (pool.length === 0) return current;
  const avgAbility =
    pool.reduce((s, c) => s + c.abilityEstimate, 0) / Math.max(pool.length, 1);
  if (avgAbility >= 0.75) return "hard";
  if (avgAbility <= 0.4) return "easy";
  return current;
}

function buildSessionRationale(
  picks: ScoredSelection[],
  pool: QuestionCandidate[],
  config: AdaptiveEngineConfig,
  recommendedDifficulty: DifficultyLevel
): string {
  const weakCount = picks.filter((p) => {
    const c = pool.find((x) => x.questionKey === p.questionKey);
    return (c?.weaknessScore ?? 0) >= 0.5;
  }).length;
  const dueCount = picks.filter((p) => {
    const c = pool.find((x) => x.questionKey === p.questionKey);
    return (c?.srsDueScore ?? 0) >= 0.6;
  }).length;
  const unseen = picks.filter((p) => {
    const c = pool.find((x) => x.questionKey === p.questionKey);
    return c?.daysSinceLastAttempt == null;
  }).length;

  const parts = [
    `${config.mode.replace(/_/g, " ").toLowerCase()} session`,
    `${picks.length} questions`,
    weakCount > 0 ? `${weakCount} weak-area` : null,
    dueCount > 0 ? `${dueCount} SRS-due` : null,
    unseen > 0 ? `${unseen} unseen` : null,
    recommendedDifficulty !== config.targetDifficulty
      ? `difficulty → ${recommendedDifficulty}`
      : `${recommendedDifficulty} difficulty`,
  ].filter(Boolean);

  return parts.join(" · ");
}

function clamp01(n: number): number {
  return clamp(n, 0, 1);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
