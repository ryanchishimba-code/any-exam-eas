import {
  buildCandidateFromQuestion,
  selectQuestions as coreSelectQuestions,
  type AdaptiveEngineConfig,
} from "@/lib/core/adaptive-engine";
import { studyModeToAdaptive } from "@/lib/core/types";
import { adjustDifficulty, type TopicWeakness } from "@/lib/questions/adaptive";
import type { StudyQuestion } from "@/lib/questions/types";

export type DifficultyLevel = "easy" | "medium" | "hard";

/** Accuracy and volume for one topic/tag/subject area. */
export type TopicPerformance = {
  topic: string;
  attempts: number;
  accuracy: number;
};

export type AdaptiveSessionConfig = {
  /** Question pool to draw from */
  questions: StudyQuestion[];
  /** Per-topic accuracy (0–1). Empty = treat all topics as unseen. */
  topicPerformance: TopicPerformance[];
  currentDifficulty: DifficultyLevel;
  count: number;
  /** Share of slots reserved for weak topics (default 0.55) */
  weakFocusRatio?: number;
  /** Minimum questions per topic when pool allows (default 1) */
  minPerTopic?: number;
  /** Question keys already seen this session — excluded from selection */
  excludeKeys?: Set<string>;
};

export type TopicAllocation = {
  topic: string;
  count: number;
  accuracy: number | null;
  priority: "weak" | "balance" | "unseen";
};

export type QuestionSelectionReasoning = {
  questionKey: string;
  reasoning: string;
  score: number;
};

export type AdaptiveSessionResult = {
  questions: StudyQuestion[];
  recommendedDifficulty: DifficultyLevel;
  previousDifficulty: DifficultyLevel;
  overallAccuracy: number | null;
  topicAllocation: TopicAllocation[];
  rationale: string;
  selectionReasoning: QuestionSelectionReasoning[];
};

const WEAK_ACCURACY_THRESHOLD = 0.6;
const MIN_ATTEMPTS_FOR_WEAK = 2;

export function topicPerformanceFromWeakness(
  weakness: TopicWeakness[]
): TopicPerformance[] {
  return weakness.map((w) => ({
    topic: w.tag,
    attempts: w.attempts,
    accuracy: w.attempts > 0 ? 1 - w.missRate : 0,
  }));
}

export function computeOverallAccuracy(
  performance: TopicPerformance[]
): number | null {
  const withData = performance.filter((p) => p.attempts > 0);
  if (withData.length === 0) return null;
  const totalAttempts = withData.reduce((s, p) => s + p.attempts, 0);
  if (totalAttempts === 0) return null;
  const weighted = withData.reduce((s, p) => s + p.accuracy * p.attempts, 0);
  return weighted / totalAttempts;
}

export function recommendDifficulty(
  current: DifficultyLevel,
  overallAccuracy: number | null
): DifficultyLevel {
  if (overallAccuracy == null) return current;
  const next = adjustDifficulty(current, overallAccuracy);
  if (next === "easy" || next === "medium" || next === "hard") return next;
  return current;
}

/** Primary topic key for grouping — subjectId preferred, else first tag. */
export function questionTopicKey(q: StudyQuestion): string {
  if (q.subjectId) return `subject:${q.subjectId}`;
  const tag = q.tags?.[0];
  if (tag) return tag.toLowerCase();
  return "general";
}

function isWeakTopic(p: TopicPerformance | undefined): boolean {
  if (!p || p.attempts < MIN_ATTEMPTS_FOR_WEAK) return false;
  return p.accuracy < WEAK_ACCURACY_THRESHOLD;
}

function performanceMap(performance: TopicPerformance[]): Map<string, TopicPerformance> {
  const map = new Map<string, TopicPerformance>();
  for (const p of performance) {
    map.set(p.topic.toLowerCase(), p);
    map.set(p.topic.replace(/^subject:/, "").toLowerCase(), p);
  }
  return map;
}

function matchesDifficulty(q: StudyQuestion, level: DifficultyLevel): boolean {
  if (!q.difficulty) return true;
  return q.difficulty.toLowerCase() === level;
}

function questionKey(q: StudyQuestion): string {
  return q.bankItemId ?? q.id;
}

function weaknessScoreForTopic(
  topic: string,
  perfByTopic: Map<string, TopicPerformance>
): number {
  const p =
    perfByTopic.get(topic.toLowerCase()) ??
    perfByTopic.get(topic.replace(/^subject:/, "").toLowerCase());
  if (!p || p.attempts < MIN_ATTEMPTS_FOR_WEAK) return 0.25;
  return Math.min(1, 1 - p.accuracy);
}

/**
 * Goat-tier multi-factor selection via core engine, with legacy topic allocation metadata.
 */
export function selectAdaptiveQuestionsWithCore(
  config: AdaptiveSessionConfig & { studyMode?: string }
): AdaptiveSessionResult {
  const {
    questions,
    topicPerformance,
    currentDifficulty,
    count,
    excludeKeys = new Set<string>(),
    studyMode = "adaptive",
  } = config;

  const perfByTopic = performanceMap(topicPerformance);
  const overallAccuracy = computeOverallAccuracy(topicPerformance);

  const candidates = questions
    .filter((q) => !excludeKeys.has(questionKey(q)))
    .map((q) => {
      const topic = questionTopicKey(q).toLowerCase();
      return buildCandidateFromQuestion({
        questionKey: questionKey(q),
        fieldId: q.field ?? "general",
        subjectId: q.subjectId,
        tags: q.tags,
        difficulty: q.difficulty,
        highYield: q.highYield,
        mastery: null,
        weaknessScore: weaknessScoreForTopic(topic, perfByTopic),
      });
    });

  const engineConfig: AdaptiveEngineConfig = {
    mode: studyModeToAdaptive(studyMode),
    targetDifficulty: currentDifficulty,
    count,
    weakAreaBoost: studyMode === "weak_area" ? 0.2 : undefined,
  };

  const engineResult = coreSelectQuestions(candidates, engineConfig, excludeKeys);
  const keyToQuestion = new Map(questions.map((q) => [questionKey(q), q]));
  const selected: StudyQuestion[] = [];
  const selectionReasoning: QuestionSelectionReasoning[] = [];

  for (const sel of engineResult.selections) {
    const q = keyToQuestion.get(sel.questionKey);
    if (!q) continue;
    selected.push(q);
    selectionReasoning.push({
      questionKey: sel.questionKey,
      reasoning: sel.reasoning,
      score: sel.totalScore,
    });
  }

  const topicAllocation = buildTopicAllocationFromSelections(selected, perfByTopic);
  const recommendedDifficulty = recommendDifficulty(currentDifficulty, overallAccuracy);

  return {
    questions: selected,
    recommendedDifficulty,
    previousDifficulty: currentDifficulty,
    overallAccuracy,
    topicAllocation,
    rationale: engineResult.sessionRationale,
    selectionReasoning,
  };
}

/**
 * Select the next question set: weak-area focus, difficulty progression, topic balance.
 */
export function selectAdaptiveQuestions(
  config: AdaptiveSessionConfig
): AdaptiveSessionResult {
  return selectAdaptiveQuestionsWithCore({ ...config, studyMode: "adaptive" });
}

function buildTopicAllocationFromSelections(
  selected: StudyQuestion[],
  perfByTopic: Map<string, TopicPerformance>
): TopicAllocation[] {
  const counts = new Map<string, number>();
  for (const q of selected) {
    const topic = questionTopicKey(q).toLowerCase();
    counts.set(topic, (counts.get(topic) ?? 0) + 1);
  }
  return [...counts.entries()].map(([topic, count]) => {
    const p = perfByTopic.get(topic);
    const priority: TopicAllocation["priority"] =
      p && p.attempts >= MIN_ATTEMPTS_FOR_WEAK && p.accuracy < WEAK_ACCURACY_THRESHOLD
        ? "weak"
        : !p || p.attempts === 0
          ? "unseen"
          : "balance";
    return {
      topic,
      count,
      accuracy: p?.attempts ? p.accuracy : null,
      priority,
    };
  });
}

/** @deprecated Legacy allocator — prefer selectAdaptiveQuestionsWithCore */
export function selectAdaptiveQuestionsLegacy(
  config: AdaptiveSessionConfig
): AdaptiveSessionResult {
  const {
    questions,
    topicPerformance,
    currentDifficulty,
    count,
    weakFocusRatio = 0.55,
    minPerTopic = 1,
    excludeKeys = new Set<string>(),
  } = config;

  const perfByTopic = performanceMap(topicPerformance);
  const overallAccuracy = computeOverallAccuracy(topicPerformance);
  const recommendedDifficulty = recommendDifficulty(currentDifficulty, overallAccuracy);

  const pool = questions.filter((q) => !excludeKeys.has(questionKey(q)));
  const byTopic = new Map<string, StudyQuestion[]>();

  for (const q of pool) {
    const key = questionTopicKey(q).toLowerCase();
    const list = byTopic.get(key) ?? [];
    list.push(q);
    byTopic.set(key, list);
  }

  const topics = [...byTopic.keys()];
  if (topics.length === 0) {
    return {
      questions: [],
      recommendedDifficulty,
      previousDifficulty: currentDifficulty,
      overallAccuracy,
      topicAllocation: [],
      rationale: "No questions available in pool.",
      selectionReasoning: [],
    };
  }

  const weakTopics = topics.filter((t) => {
    const p = perfByTopic.get(t) ?? perfByTopic.get(`subject:${t}`);
    return isWeakTopic(p);
  });
  const unseenTopics = topics.filter((t) => {
    const p = perfByTopic.get(t) ?? perfByTopic.get(`subject:${t}`);
    return !p || p.attempts === 0;
  });

  const weakSlots = Math.round(count * weakFocusRatio);
  const balanceSlots = count - weakSlots;

  const allocation: TopicAllocation[] = [];
  const selected: StudyQuestion[] = [];
  const usedKeys = new Set<string>();

  function pickFromTopic(
    topic: string,
    n: number,
    priority: TopicAllocation["priority"]
  ): number {
    const available = (byTopic.get(topic) ?? []).filter(
      (q) => !usedKeys.has(questionKey(q))
    );
    const preferDifficulty = available.filter((q) =>
      matchesDifficulty(q, recommendedDifficulty)
    );
    const source =
      preferDifficulty.length >= n ? preferDifficulty : available;

    shuffleInPlace(source);
    let picked = 0;
    for (const q of source) {
      if (picked >= n) break;
      const k = questionKey(q);
      if (usedKeys.has(k)) continue;
      usedKeys.add(k);
      selected.push(q);
      picked++;
    }

    if (picked > 0) {
      const p = perfByTopic.get(topic);
      allocation.push({
        topic,
        count: picked,
        accuracy: p?.attempts ? p.accuracy : null,
        priority,
      });
    }
    return picked;
  }

  // Phase 1: weak topics (weighted by inverse accuracy)
  const weakWeights = weakTopics.map((t) => {
    const p = perfByTopic.get(t);
    const weakness = p ? 1 - p.accuracy : 0.5;
    return { topic: t, weight: weakness + 0.1 };
  });
  distributeSlots(weakSlots, weakWeights, (topic, n) =>
    pickFromTopic(topic, n, "weak")
  );

  // Phase 2: unseen topics for breadth
  const unseenWeights = unseenTopics
    .filter((t) => !weakTopics.includes(t))
    .map((t) => ({ topic: t, weight: 1.2 }));
  const unseenBudget = Math.min(
    balanceSlots,
    Math.ceil(balanceSlots * 0.4)
  );
  distributeSlots(unseenBudget, unseenWeights, (topic, n) =>
    pickFromTopic(topic, n, "unseen")
  );

  // Phase 3: round-robin balance across remaining topics
  const remaining = count - selected.length;
  if (remaining > 0) {
    const balanceTopics = topics.filter((t) => {
      const allocated = allocation.find((a) => a.topic === t)?.count ?? 0;
      return allocated < minPerTopic + 2;
    });
    const rot = balanceTopics.length > 0 ? balanceTopics : topics;
    let idx = 0;
    for (let i = 0; i < remaining && rot.length > 0; i++) {
      const topic = rot[idx % rot.length];
      pickFromTopic(topic, 1, "balance");
      idx++;
    }
  }

  // Fill any leftover slots from any topic
  if (selected.length < count) {
    const rest = pool.filter((q) => !usedKeys.has(questionKey(q)));
    shuffleInPlace(rest);
    for (const q of rest) {
      if (selected.length >= count) break;
      usedKeys.add(questionKey(q));
      selected.push(q);
    }
  }

  const rationale = buildRationale({
    overallAccuracy,
    recommendedDifficulty,
    currentDifficulty,
    weakTopics,
    unseenTopics,
  });

  const selectionReasoning: QuestionSelectionReasoning[] = selected
    .slice(0, count)
    .map((q) => ({
      questionKey: questionKey(q),
      reasoning: rationale,
      score: 0,
    }));

  return {
    questions: selected.slice(0, count),
    recommendedDifficulty,
    previousDifficulty: currentDifficulty,
    overallAccuracy,
    topicAllocation: allocation,
    rationale,
    selectionReasoning,
  };
}

function distributeSlots(
  totalSlots: number,
  weights: { topic: string; weight: number }[],
  pick: (topic: string, n: number) => number
): void {
  if (totalSlots <= 0 || weights.length === 0) return;

  const sum = weights.reduce((s, w) => s + w.weight, 0);
  let assigned = 0;

  for (let i = 0; i < weights.length; i++) {
    const w = weights[i];
    const isLast = i === weights.length - 1;
    const n = isLast
      ? totalSlots - assigned
      : Math.max(0, Math.round((w.weight / sum) * totalSlots));
    assigned += pick(w.topic, n);
  }
}

function buildRationale(params: {
  overallAccuracy: number | null;
  recommendedDifficulty: DifficultyLevel;
  currentDifficulty: DifficultyLevel;
  weakTopics: string[];
  unseenTopics: string[];
}): string {
  const parts: string[] = [];
  if (params.weakTopics.length > 0) {
    parts.push(`Prioritized ${params.weakTopics.length} weak topic(s).`);
  }
  if (params.unseenTopics.length > 0) {
    parts.push(`Included coverage for ${params.unseenTopics.length} unseen topic(s).`);
  }
  if (params.overallAccuracy != null) {
    const pct = Math.round(params.overallAccuracy * 100);
    parts.push(`Overall accuracy ${pct}%.`);
    if (params.recommendedDifficulty !== params.currentDifficulty) {
      parts.push(
        `Difficulty ${params.currentDifficulty} → ${params.recommendedDifficulty}.`
      );
    } else {
      parts.push(`Maintaining ${params.recommendedDifficulty} difficulty.`);
    }
  } else {
    parts.push("Insufficient history — balanced topic sampling at medium difficulty.");
  }
  return parts.join(" ");
}

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
