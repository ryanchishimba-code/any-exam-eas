import { Prisma } from "@prisma/client";
import { persistQuestionMastery } from "@/lib/core/prisma-adapter";
import { prisma } from "@/lib/prisma";
import {
  applyRetentionDecay,
  computeMasteryDelta,
  computeReadinessScore,
} from "./mastery";
import type {
  ConceptMasterySnapshot,
  LearningProfileSnapshot,
} from "./types";
import { analyzeMistake } from "./mistake-analysis";
import type { AttemptInput } from "./types";
import { tagsToJson } from "./weakness";
import {
  tagsForStoredAttempt,
  tagsJsonIncludesPracticeFormat,
} from "@/lib/study/practice-format";

export async function upsertLearningProfile(userId: string): Promise<void> {
  await prisma.learningProfile.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

function isUniqueViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

async function reuseExistingAttempt(
  existing: { id: string; confidence: number | null; tagsJson: string | null },
  input: AttemptInput,
  tagsJson: string | null
): Promise<{ attemptId: string; alreadySaved: true }> {
  const data: { confidence?: number; tagsJson?: string } = {};
  if (input.confidence != null && existing.confidence !== input.confidence) {
    data.confidence = input.confidence;
  }
  if (
    input.practiceFormat &&
    tagsJson &&
    !tagsJsonIncludesPracticeFormat(existing.tagsJson, input.practiceFormat)
  ) {
    data.tagsJson = tagsJson;
  }
  if (Object.keys(data).length > 0) {
    await prisma.questionAttempt.update({ where: { id: existing.id }, data });
  }
  return { attemptId: existing.id, alreadySaved: true };
}

export async function recordAttemptWithMastery(
  input: AttemptInput,
  opts?: { refreshProfile?: boolean }
): Promise<{ attemptId: string; alreadySaved: boolean }> {
  const storedTags = tagsForStoredAttempt(input.question.tags, input.practiceFormat);
  const analysis = analyzeMistake({
    ...input,
    question: {
      ...input.question,
      tags: storedTags.filter((tag) => !tag.startsWith("practice-format:")),
    },
  });
  const tagsJson = tagsToJson(storedTags);
  const questionKey = input.question.bankItemId ?? input.question.id;

  if (input.sessionId && questionKey) {
    const existing = await prisma.questionAttempt.findFirst({
      where: {
        userId: input.userId,
        sessionId: input.sessionId,
        questionKey,
      },
      select: { id: true, confidence: true, tagsJson: true },
    });
    if (existing) {
      return reuseExistingAttempt(existing, input, tagsJson);
    }
  }

  let attempt: { id: string };
  try {
    attempt = await prisma.questionAttempt.create({
      data: {
        userId: input.userId,
        questionKey,
        bankItemId: input.question.bankItemId ?? null,
        fieldId: input.fieldId,
        subjectId: input.question.subjectId ?? null,
        questionType: input.question.type,
        stemPreview: input.question.stem.slice(0, 200),
        correct: input.correct,
        confidence: input.confidence ?? null,
        durationMs: input.durationMs ?? null,
        selectedAnswer: input.selectedAnswer ?? null,
        sessionId: input.sessionId ?? null,
        tagsJson,
        mistakeCategory: input.correct ? null : analysis.category,
        guessedCorrect: analysis.guessedCorrect,
        difficultyAtAttempt: input.question.difficulty ?? null,
      },
      select: { id: true },
    });
  } catch (error) {
    if (isUniqueViolation(error) && input.sessionId && questionKey) {
      const existing = await prisma.questionAttempt.findFirst({
        where: {
          userId: input.userId,
          sessionId: input.sessionId,
          questionKey,
        },
        select: { id: true, confidence: true, tagsJson: true },
      });
      if (existing) return reuseExistingAttempt(existing, input, tagsJson);
    }
    throw error;
  }

  const conceptKeys = analysis.weakConcepts
    .map((k) => (k.startsWith("tag:") || k.startsWith("subject:") ? k : `tag:${k}`))
    .filter((k) => !k.toLowerCase().includes("practice-format:"));

  for (const conceptKey of conceptKeys) {
    const existing = await prisma.conceptMastery.findUnique({
      where: {
        userId_fieldId_conceptKey: {
          userId: input.userId,
          fieldId: input.fieldId,
          conceptKey,
        },
      },
    });

    const current = existing?.masteryScore ?? 0;
    const delta = computeMasteryDelta({
      currentScore: current,
      correct: input.correct,
      confidence: input.confidence,
      mistakeCategory: analysis.category,
    });

    await prisma.conceptMastery.upsert({
      where: {
        userId_fieldId_conceptKey: {
          userId: input.userId,
          fieldId: input.fieldId,
          conceptKey,
        },
      },
      create: {
        userId: input.userId,
        fieldId: input.fieldId,
        conceptKey,
        masteryScore: delta.masteryScore,
        retentionStrength: delta.retentionStrength,
        confidenceReliability: delta.confidenceReliability,
        attempts: 1,
        correct: input.correct ? 1 : 0,
        lastAttemptAt: new Date(),
      },
      update: {
        masteryScore: delta.masteryScore,
        retentionStrength: delta.retentionStrength,
        confidenceReliability: delta.confidenceReliability,
        attempts: { increment: 1 },
        correct: input.correct ? { increment: 1 } : undefined,
        lastAttemptAt: new Date(),
      },
    });
  }

  try {
    await persistQuestionMastery(input.userId, input.fieldId, questionKey, {
      correct: input.correct,
      confidence: input.confidence,
      durationMs: input.durationMs,
      timePressure: input.durationMs != null && input.durationMs < 15_000,
    });
  } catch {
    /* non-blocking */
  }

  if (opts?.refreshProfile !== false) {
    await refreshProfileReadiness(input.userId);
  }
  return { attemptId: attempt.id, alreadySaved: false };
}

export async function refreshLearningProfile(userId: string): Promise<{
  studyStreakDays: number;
  readinessScore: number;
}> {
  await refreshProfileReadiness(userId);
  const profile = await prisma.learningProfile.findUnique({
    where: { userId },
    select: { studyStreakDays: true, readinessScore: true },
  });
  return {
    studyStreakDays: profile?.studyStreakDays ?? 0,
    readinessScore: Math.round(profile?.readinessScore ?? 0),
  };
}

async function refreshProfileReadiness(userId: string): Promise<void> {
  const masteries = await prisma.conceptMastery.findMany({
    where: { userId },
    select: {
      masteryScore: true,
      retentionStrength: true,
      confidenceReliability: true,
      attempts: true,
      lastAttemptAt: true,
    },
  });

  const decayed = masteries.map((m) => ({
    masteryScore: applyRetentionDecay(m.masteryScore, m.lastAttemptAt),
    retentionStrength: m.retentionStrength,
    confidenceReliability: m.confidenceReliability,
    attempts: m.attempts,
  }));

  const readinessScore = computeReadinessScore(decayed);

  const profile = await prisma.learningProfile.findUnique({ where: { userId } });
  const now = new Date();
  let studyStreakDays = profile?.studyStreakDays ?? 0;

  if (profile?.lastStudiedAt) {
    const daysSince =
      (now.getTime() - profile.lastStudiedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince <= 1.5) studyStreakDays = Math.max(studyStreakDays, 1);
    else if (daysSince > 2) studyStreakDays = 1;
    else studyStreakDays += 1;
  } else {
    studyStreakDays = 1;
  }

  await prisma.learningProfile.upsert({
    where: { userId },
    create: {
      userId,
      readinessScore,
      studyStreakDays,
      lastStudiedAt: now,
    },
    update: {
      readinessScore,
      studyStreakDays,
      lastStudiedAt: now,
    },
  });
}

export async function getLearningProfileSnapshot(
  userId: string
): Promise<LearningProfileSnapshot> {
  const [profile, masteries] = await Promise.all([
    prisma.learningProfile.findUnique({ where: { userId } }),
    prisma.conceptMastery.findMany({
      where: { userId },
      orderBy: { masteryScore: "asc" },
    }),
  ]);

  const snapshots: ConceptMasterySnapshot[] = masteries.map((m) => ({
    conceptKey: m.conceptKey,
    fieldId: m.fieldId,
    masteryScore: Math.round(m.masteryScore),
    retentionStrength: Math.round(m.retentionStrength),
    confidenceReliability: Math.round(m.confidenceReliability),
    attempts: m.attempts,
    trend:
      m.correct / Math.max(m.attempts, 1) >= 0.7
        ? "improving"
        : m.attempts >= 5 && m.correct / m.attempts < 0.4
          ? "declining"
          : "stable",
  }));

  // Per-field readiness uses the same formula as LearningProfile.readinessScore
  // so scoped dashboards stay consistent with the uniform engine.
  const byField = new Map<
    string,
    {
      masteryScore: number;
      retentionStrength: number;
      confidenceReliability: number;
      attempts: number;
    }[]
  >();
  for (const m of masteries) {
    const list = byField.get(m.fieldId) ?? [];
    list.push({
      masteryScore: applyRetentionDecay(m.masteryScore, m.lastAttemptAt),
      retentionStrength: m.retentionStrength,
      confidenceReliability: m.confidenceReliability,
      attempts: m.attempts,
    });
    byField.set(m.fieldId, list);
  }

  const fieldReadiness = Array.from(byField.entries()).map(([fieldId, rows]) => ({
    fieldId,
    score: computeReadinessScore(rows),
  }));

  return {
    readinessScore: Math.round(profile?.readinessScore ?? 0),
    studyStreakDays: profile?.studyStreakDays ?? 0,
    lastStudiedAt: profile?.lastStudiedAt?.toISOString() ?? null,
    weakestConcepts: snapshots.slice(0, 8),
    strongestConcepts: [...snapshots].sort((a, b) => b.masteryScore - a.masteryScore).slice(0, 8),
    fieldReadiness,
  };
}
