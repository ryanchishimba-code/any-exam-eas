import { prisma } from "@/lib/prisma";
import {
  buildCandidateFromQuestion,
  srsDueScore,
  updateMasteryAfterAttempt,
  type AdaptiveEngineConfig,
  type AdaptiveSelectionResult,
  selectQuestions,
} from "./adaptive-engine";
import type { AttemptOutcome, MasteryRecord, QuestionCandidate } from "./types";
import { asFieldId, asQuestionKey, asUserId, studyModeToAdaptive } from "./types";
import type { StudyQuestion } from "@/lib/questions/types";

export function masteryFromDb(row: {
  questionKey: string;
  fieldId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextDue: Date;
  abilityEstimate: number;
  lastAttemptAt: Date | null;
  correctStreak: number;
}): MasteryRecord {
  return {
    questionKey: row.questionKey,
    fieldId: row.fieldId,
    easeFactor: row.easeFactor,
    intervalDays: row.intervalDays,
    repetitions: row.repetitions,
    nextDue: row.nextDue,
    abilityEstimate: row.abilityEstimate,
    lastAttemptAt: row.lastAttemptAt,
    correctStreak: row.correctStreak,
  };
}

export async function loadQuestionMasteries(
  userId: string,
  questionKeys: string[]
): Promise<Map<string, MasteryRecord>> {
  if (questionKeys.length === 0) return new Map();

  const rows = await prisma.questionMastery.findMany({
    where: { userId, questionKey: { in: questionKeys } },
  });

  return new Map(rows.map((r) => [r.questionKey, masteryFromDb(r)]));
}

export async function loadWeaknessScores(
  userId: string,
  fieldId: string,
  tags: string[]
): Promise<Map<string, number>> {
  const uniqueTags = [...new Set(tags.map((t) => t.toLowerCase()).filter(Boolean))];
  if (uniqueTags.length === 0) return new Map();

  const conceptKeys = uniqueTags.flatMap((tag) => [
    tag,
    `tag:${tag}`,
    `subject:${tag}`,
  ]);

  const masteries = await prisma.conceptMastery.findMany({
    where: {
      userId,
      fieldId,
      conceptKey: { in: conceptKeys },
    },
  });

  const byKey = new Map(
    masteries.map((m) => [m.conceptKey.toLowerCase(), m] as const)
  );

  const map = new Map<string, number>();
  for (const tag of uniqueTags) {
    const concept =
      byKey.get(tag) ??
      byKey.get(`tag:${tag}`) ??
      byKey.get(`subject:${tag}`);
    if (concept && concept.attempts > 0) {
      const missRate = 1 - concept.correct / concept.attempts;
      map.set(
        tag,
        Math.min(1, missRate * 0.7 + ((100 - concept.masteryScore) / 100) * 0.3)
      );
    } else {
      map.set(tag, 0.25);
    }
  }
  return map;
}

export function weaknessForQuestion(
  q: StudyQuestion,
  weaknessMap: Map<string, number>
): number {
  const keys = [
    q.subjectId?.toLowerCase(),
    ...(q.tags ?? []).map((t) => t.toLowerCase()),
  ].filter(Boolean) as string[];

  if (keys.length === 0) return 0.3;
  const scores = keys.map((k) => weaknessMap.get(k) ?? 0.25);
  return Math.max(...scores);
}

export async function buildCandidates(
  userId: string,
  fieldId: string,
  questions: StudyQuestion[],
  now: Date = new Date()
): Promise<QuestionCandidate[]> {
  const keys = questions.map((q) => q.bankItemId ?? q.id);
  const [masteryMap, weaknessMap] = await Promise.all([
    loadQuestionMasteries(userId, keys),
    loadWeaknessScores(userId, fieldId, [
      ...new Set(
        questions.flatMap((q) => [
          ...(q.tags ?? []),
          ...(q.subjectId ? [q.subjectId] : []),
        ])
      ),
    ]),
  ]);

  return questions.map((q) => {
    const questionKey = q.bankItemId ?? q.id;
    const mastery = masteryMap.get(questionKey) ?? null;
    const candidate = buildCandidateFromQuestion({
      questionKey,
      fieldId,
      subjectId: q.subjectId,
      tags: q.tags,
      difficulty: q.difficulty,
      highYield: q.highYield,
      mastery,
      weaknessScore: weaknessForQuestion(q, weaknessMap),
      now,
    });
    return {
      ...candidate,
      srsDueScore: srsDueScore(mastery, now),
    };
  });
}

export async function runAdaptiveSelection(params: {
  userId: string;
  fieldId: string;
  questions: StudyQuestion[];
  count: number;
  studyMode?: string;
  targetDifficulty?: "easy" | "medium" | "hard";
  excludeKeys?: Set<string>;
}): Promise<{
  result: AdaptiveSelectionResult;
  orderedQuestions: StudyQuestion[];
  reasoningByQuestionId: Record<string, string>;
}> {
  const candidates = await buildCandidates(params.userId, params.fieldId, params.questions);
  const config: AdaptiveEngineConfig = {
    mode: studyModeToAdaptive(params.studyMode ?? "adaptive"),
    targetDifficulty: params.targetDifficulty ?? "medium",
    count: params.count,
  };

  const engineResult = selectQuestions(candidates, config, params.excludeKeys ?? new Set());
  const keyToQuestion = new Map(
    params.questions.map((q) => [q.bankItemId ?? q.id, q])
  );

  const orderedQuestions: StudyQuestion[] = [];
  const reasoningByQuestionId: Record<string, string> = {};

  for (const sel of engineResult.selections) {
    const q = keyToQuestion.get(sel.questionKey);
    if (!q) continue;
    orderedQuestions.push(q);
    reasoningByQuestionId[q.id] = sel.reasoning;
  }

  return { result: engineResult, orderedQuestions, reasoningByQuestionId };
}

export async function persistQuestionMastery(
  userId: string,
  fieldId: string,
  questionKey: string,
  outcome: AttemptOutcome
): Promise<MasteryRecord> {
  const existing = await prisma.questionMastery.findUnique({
    where: { userId_questionKey: { userId, questionKey } },
  });

  const updated = updateMasteryAfterAttempt(
    existing ? masteryFromDb(existing) : null,
    outcome
  );

  await prisma.questionMastery.upsert({
    where: { userId_questionKey: { userId, questionKey } },
    create: {
      userId,
      questionKey,
      fieldId,
      easeFactor: updated.easeFactor,
      intervalDays: updated.intervalDays,
      repetitions: updated.repetitions,
      nextDue: updated.nextDue,
      abilityEstimate: updated.abilityEstimate,
      lastAttemptAt: updated.lastAttemptAt,
      correctStreak: updated.correctStreak,
    },
    update: {
      easeFactor: updated.easeFactor,
      intervalDays: updated.intervalDays,
      repetitions: updated.repetitions,
      nextDue: updated.nextDue,
      abilityEstimate: updated.abilityEstimate,
      lastAttemptAt: updated.lastAttemptAt,
      correctStreak: updated.correctStreak,
    },
  });

  return { ...updated, questionKey, fieldId };
}

export function brandedIds(userId: string, fieldId: string) {
  return { userId: asUserId(userId), fieldId: asFieldId(fieldId) };
}

export function keyOf(questionKey: string) {
  return asQuestionKey(questionKey);
}
