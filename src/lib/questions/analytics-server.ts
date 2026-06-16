import { prisma } from "@/lib/prisma";
import type { StudyQuestion } from "./types";

export async function recordQuestionAttempt(params: {
  userId: string;
  question: StudyQuestion;
  correct: boolean;
  confidence?: number;
  durationMs?: number;
  selectedAnswer?: string;
  sessionId?: string;
}): Promise<void> {
  try {
    await prisma.questionAttempt.create({
      data: {
        userId: params.userId,
        questionKey: params.question.bankItemId ?? params.question.id,
        bankItemId: params.question.bankItemId ?? null,
        fieldId: params.question.field ?? "general",
        subjectId: params.question.subjectId ?? null,
        questionType: params.question.type,
        stemPreview: params.question.stem.slice(0, 200),
        correct: params.correct,
        confidence: params.confidence ?? null,
        durationMs: params.durationMs ?? null,
        selectedAnswer: params.selectedAnswer ?? null,
        sessionId: params.sessionId ?? null,
        tagsJson: JSON.stringify({
          tags: params.question.tags ?? [],
          taskCategory:
            (params.question.ngnPayload?.taskCategory as string | undefined) ??
            params.question.tags?.find((t) => t.startsWith("task-")),
          blueprintTopic: params.question.ngnPayload?.blueprintTopic,
        }),
      },
    });
  } catch {
    /* non-blocking */
  }
}

export async function getQuestionAnalyticsOverview(days = 30) {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);

  const attempts = await prisma.questionAttempt.findMany({
    where: { createdAt: { gte: since } },
    select: {
      correct: true,
      durationMs: true,
      confidence: true,
      fieldId: true,
      subjectId: true,
      questionKey: true,
      stemPreview: true,
      bankItemId: true,
    },
  });

  const total = attempts.length;
  const correct = attempts.filter((a) => a.correct).length;
  const durations = attempts
    .map((a) => a.durationMs)
    .filter((d): d is number => d != null);
  const avgDurationMs =
    durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : null;

  const byField = new Map<string, { total: number; correct: number }>();
  for (const a of attempts) {
    const f = a.fieldId;
    const entry = byField.get(f) ?? { total: 0, correct: 0 };
    entry.total++;
    if (a.correct) entry.correct++;
    byField.set(f, entry);
  }

  const missed = new Map<string, { count: number; preview: string }>();
  for (const a of attempts) {
    if (a.correct) continue;
    const key = a.bankItemId ?? a.questionKey;
    const entry = missed.get(key) ?? { count: 0, preview: a.stemPreview ?? key };
    entry.count++;
    missed.set(key, entry);
  }

  const mostMissed = Array.from(missed.entries())
    .map(([key, v]) => ({ questionKey: key, missCount: v.count, preview: v.preview }))
    .sort((a, b) => b.missCount - a.missCount)
    .slice(0, 15);

  return {
    totalAttempts: total,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    avgDurationMs,
    byField: Array.from(byField.entries()).map(([field, v]) => ({
      field,
      attempts: v.total,
      accuracy: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
    })),
    mostMissed,
  };
}
