#!/usr/bin/env node
/**
 * Re-grade completed NAPLEX exam_sessions with current server grader (#240 numeric).
 * Dry run by default.
 *
 *   npx tsx scripts/rescore-exam-sessions-numeric-20261020.ts
 *   npx tsx scripts/rescore-exam-sessions-numeric-20261020.ts --apply
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import { gradeExamAnswerRecords, overlayServerRationales } from "@/lib/exam-sessions/grade-stored-answer";
import { alignAnswersToPrefetched } from "@/lib/exam-sessions/align-administered-items";
import { practiceResultsTotals, practiceScorePercent } from "@/lib/full-exam/administered-score";
import { buildTopicBreakdown } from "@/lib/full-exam/topic-breakdown";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import type { FullExamQuestion } from "@/types/full-exam";

const BACKUP_TABLE = "exam_sessions_numeric_rescore_backup_20261020";
const prisma = new PrismaClient();

type SessionRow = {
  id: string;
  userId: string;
  score: number | null;
  answers: unknown;
  analysis: unknown;
  questionCount: number;
  status: string;
};

function asAnswers(raw: unknown): ExamAnswerRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw as ExamAnswerRecord[];
}

function snapshotsFromAnalysis(analysis: unknown): FullExamQuestion[] {
  if (!analysis || typeof analysis !== "object") return [];
  const snaps = (analysis as { questionSnapshots?: unknown }).questionSnapshots;
  if (!Array.isArray(snaps)) return [];
  return snaps as FullExamQuestion[];
}

async function main() {
  const apply = process.argv.includes("--apply");
  const sessions = (await prisma.$queryRawUnsafe(`
    SELECT id, "userId", score, answers, analysis, "questionCount", status
    FROM exam_sessions
    WHERE "examType" = 'naplex'
      AND status IN ('completed', 'ended_early')
      AND answers IS NOT NULL
  `)) as SessionRow[];

  let sessionsChanged = 0;
  let usersChanged = new Set<string>();
  let answerRowsChanged = 0;
  let scoreDeltaSum = 0;
  const samples: string[] = [];

  for (const session of sessions) {
    const stored = asAnswers(session.answers);
    if (!stored.length) continue;

    const graded = await gradeExamAnswerRecords(stored);
    let answerChanges = 0;
    for (let i = 0; i < stored.length; i++) {
      const before = stored[i]?.correct === true;
      const after = graded[i]?.correct === true;
      if (before !== after) answerChanges += 1;
    }
    if (answerChanges === 0) continue;

    const prefetched = (session.analysis as { prefetchedQuestionIds?: string[] } | null)
      ?.prefetchedQuestionIds;
    const aligned = alignAnswersToPrefetched(graded, prefetched);
    const questions = snapshotsFromAnalysis(session.analysis);
    const totals = practiceResultsTotals({
      delivered: questions.length || session.questionCount,
      answers: aligned,
      cat: false,
    });
    const correct = aligned.filter((a) => a.correct && a.selected?.trim()).length;
    const newScore = practiceScorePercent(correct, totals.denominator || correct);
    const oldScore = session.score ?? 0;

    sessionsChanged += 1;
    usersChanged.add(session.userId);
    answerRowsChanged += answerChanges;
    scoreDeltaSum += newScore - oldScore;
    if (samples.length < 8) {
      samples.push(
        `${session.id} user=${session.userId.slice(0, 8)}… answersΔ=${answerChanges} score ${oldScore}→${newScore}`
      );
    }

    if (!apply) continue;

    const analysisBase =
      session.analysis && typeof session.analysis === "object"
        ? { ...(session.analysis as Record<string, unknown>) }
        : {};
    const topicBreakdown = questions.length
      ? buildTopicBreakdown(questions, aligned, { examSlug: "naplex" })
      : (analysisBase.topicBreakdown as unknown);
    const overlaid = await overlayServerRationales(
      { ...analysisBase, topicBreakdown },
      aligned,
      prefetched
    );

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "${BACKUP_TABLE}" (id, "userId", score, answers, analysis, "updatedAt", backed_up_at)
      SELECT id, "userId", score, answers, analysis, "updatedAt", now()
      FROM exam_sessions
      WHERE id = $1
        AND NOT EXISTS (SELECT 1 FROM "${BACKUP_TABLE}" b WHERE b.id = exam_sessions.id)
      `,
      session.id
    );

    await prisma.examSession.update({
      where: { id: session.id },
      data: {
        score: newScore,
        answers: aligned as unknown as Prisma.JsonValue,
        analysis: overlaid as unknown as Prisma.JsonValue,
      },
    });
  }

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`scanned sessions: ${sessions.length}`);
  console.log(`sessions with answer flag changes: ${sessionsChanged}`);
  console.log(`distinct users affected: ${usersChanged.size}`);
  console.log(`answer rows with correct-flag change: ${answerRowsChanged}`);
  console.log(
    `mean score delta (changed sessions only): ${
      sessionsChanged ? (scoreDeltaSum / sessionsChanged).toFixed(2) : "n/a"
    }`
  );
  if (samples.length) {
    console.log("sample:");
    for (const line of samples) console.log(`  ${line}`);
  }
  if (!apply) {
    console.log("\nNo writes. Re-run with --apply after approval.");
  } else {
    console.log(`\nBackup table: ${BACKUP_TABLE}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
