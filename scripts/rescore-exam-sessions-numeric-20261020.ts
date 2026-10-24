#!/usr/bin/env node
/**
 * Re-grade completed NAPLEX sessions for **numeric / calculation** answers only (#240).
 *
 * Session answers often store sealed `questionId` values. Full `gradeExamAnswerRecords`
 * reloads by that id, fails, and marks rows incorrect — causing score collapses.
 *
 * Rules:
 * - Canonical id from `prefetchedQuestionIds[questionIndex]`.
 * - Only constructed_response / calculation (or calculate-style stems).
 * - Skip unloadable bank rows.
 * - Only upgrade false → true (never downgrade stored correct).
 *
 *   npx tsx scripts/rescore-exam-sessions-numeric-20261020.ts
 *   npx tsx scripts/rescore-exam-sessions-numeric-20261020.ts --apply
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import { administeredQuestionIdAtIndex } from "@/lib/exam-sessions/align-administered-items";
import {
  gradeStudySelection,
  overlayServerRationales,
} from "@/lib/exam-sessions/grade-stored-answer";
import { practiceResultsTotals, practiceScorePercent } from "@/lib/full-exam/administered-score";
import { buildTopicBreakdown } from "@/lib/full-exam/topic-breakdown";
import { loadStoredStudyQuestion } from "@/lib/questions/reveal-stored-item";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import type { FullExamQuestion } from "@/types/full-exam";
import type { StudyQuestion } from "@/lib/questions/types";

const BACKUP_TABLE = "exam_sessions_numeric_rescore_backup_20261020";
const prisma = new PrismaClient();

const NUMERIC_ITEM_TYPES = new Set(["constructed_response", "calculation"]);
const NUMERIC_STEM = /\b(calculate|round to|nearest whole|how many mL|mL\/min|mg\/mL|AUC)\b/i;

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
  return [...(raw as ExamAnswerRecord[])].sort((a, b) => a.questionIndex - b.questionIndex);
}

function snapshotsFromAnalysis(analysis: unknown): FullExamQuestion[] {
  if (!analysis || typeof analysis !== "object") return [];
  const snaps = (analysis as { questionSnapshots?: unknown }).questionSnapshots;
  if (!Array.isArray(snaps)) return [];
  return snaps as FullExamQuestion[];
}

async function numericBankIds(ids: string[]): Promise<Set<string>> {
  const unique = [...new Set(ids.filter(Boolean))];
  if (!unique.length) return new Set();
  const rows = await prisma.questionBankItem.findMany({
    where: { id: { in: unique } },
    select: { id: true, itemType: true, question: true },
  });
  const numeric = new Set<string>();
  for (const row of rows) {
    if (NUMERIC_ITEM_TYPES.has(row.itemType) || NUMERIC_STEM.test(row.question)) {
      numeric.add(row.id);
    }
  }
  return numeric;
}

async function regradeSessionNumeric(
  stored: ExamAnswerRecord[],
  prefetchedQuestionIds?: readonly string[] | null
): Promise<{ answers: ExamAnswerRecord[]; upgrades: number; skippedUnloadable: number }> {
  const canonicalIds = stored.map((answer) =>
    administeredQuestionIdAtIndex(answer.questionIndex, answer.questionId, prefetchedQuestionIds)
  );
  const numericIds = await numericBankIds(canonicalIds.filter((id): id is string => Boolean(id)));
  const studyCache = new Map<string, StudyQuestion | null>();

  async function loadStudy(canonical: string): Promise<StudyQuestion | null> {
    if (!studyCache.has(canonical)) {
      studyCache.set(canonical, await loadStoredStudyQuestion(canonical));
    }
    return studyCache.get(canonical) ?? null;
  }

  let upgrades = 0;
  let skippedUnloadable = 0;
  const answers: ExamAnswerRecord[] = [];

  for (const answer of stored) {
    const canonical = administeredQuestionIdAtIndex(
      answer.questionIndex,
      answer.questionId,
      prefetchedQuestionIds
    );
    if (!canonical || !numericIds.has(canonical)) {
      answers.push(answer);
      continue;
    }

    const study = await loadStudy(canonical);
    if (!study) {
      skippedUnloadable += 1;
      answers.push(answer);
      continue;
    }

    if (answer.correct === true) {
      answers.push(answer);
      continue;
    }

    const newCorrect = gradeStudySelection(study, answer.selected ?? "");
    if (newCorrect) {
      upgrades += 1;
      answers.push({ ...answer, questionId: canonical, correct: true });
    } else {
      answers.push(answer);
    }
  }

  return { answers, upgrades, skippedUnloadable };
}

async function ensureBackupTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "${BACKUP_TABLE}" AS
    SELECT id, "userId", score, answers, analysis, "updatedAt", now() AS backed_up_at
    FROM exam_sessions
    WHERE false
  `);
}

async function main() {
  const apply = process.argv.includes("--apply");
  if (apply) {
    await ensureBackupTable();
  }
  const sessions = (await prisma.$queryRawUnsafe(`
    SELECT id, "userId", score, answers, analysis, "questionCount", status
    FROM exam_sessions
    WHERE "examType" = 'naplex'
      AND status IN ('completed', 'ended_early')
      AND answers IS NOT NULL
  `)) as SessionRow[];

  let sessionsChanged = 0;
  const usersChanged = new Set<string>();
  let answerRowsUpgraded = 0;
  let scoreDeltaSum = 0;
  let minDelta = Infinity;
  let maxDelta = 0;
  const samples: string[] = [];

  for (const session of sessions) {
    const stored = asAnswers(session.answers);
    if (!stored.length) continue;

    const prefetched = (session.analysis as { prefetchedQuestionIds?: string[] } | null)
      ?.prefetchedQuestionIds;
    const { answers: nextAnswers, upgrades } = await regradeSessionNumeric(stored, prefetched);
    if (upgrades === 0) continue;

    const questions = snapshotsFromAnalysis(session.analysis);
    const totals = practiceResultsTotals({
      delivered: questions.length || session.questionCount,
      answers: nextAnswers,
      cat: false,
    });
    const correct = nextAnswers.filter((a) => a.correct && a.selected?.trim()).length;
    const newScore = practiceScorePercent(correct, totals.denominator || correct);
    const oldScore = session.score ?? 0;
    const delta = newScore - oldScore;

    if (delta < 0) {
      console.warn(`skip ${session.id}: would lower score ${oldScore}→${newScore}`);
      continue;
    }

    sessionsChanged += 1;
    usersChanged.add(session.userId);
    answerRowsUpgraded += upgrades;
    scoreDeltaSum += delta;
    minDelta = Math.min(minDelta, delta);
    maxDelta = Math.max(maxDelta, delta);
    if (samples.length < 8) {
      samples.push(
        `${session.id} user=${session.userId.slice(0, 8)}… upgrades=${upgrades} score ${oldScore}→${newScore} (+${delta})`
      );
    }

    if (!apply) continue;

    const analysisBase =
      session.analysis && typeof session.analysis === "object"
        ? { ...(session.analysis as Record<string, unknown>) }
        : {};
    const topicBreakdown = questions.length
      ? buildTopicBreakdown(questions, nextAnswers, { examSlug: "naplex" })
      : (analysisBase.topicBreakdown as unknown);
    const overlaid = await overlayServerRationales(
      { ...analysisBase, topicBreakdown },
      nextAnswers,
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
        answers: nextAnswers as unknown as Prisma.JsonValue,
        analysis: overlaid as unknown as Prisma.JsonValue,
      },
    });
  }

  console.log(apply ? "APPLY" : "DRY RUN (numeric upgrades only)");
  console.log(`scanned sessions: ${sessions.length}`);
  console.log(`sessions with numeric upgrades: ${sessionsChanged}`);
  console.log(`distinct users affected: ${usersChanged.size}`);
  console.log(`answer rows upgraded false→true: ${answerRowsUpgraded}`);
  if (sessionsChanged > 0) {
    console.log(
      `score delta range: +${minDelta} to +${maxDelta} (mean +${(scoreDeltaSum / sessionsChanged).toFixed(2)})`
    );
  }
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
