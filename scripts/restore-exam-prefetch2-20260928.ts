#!/usr/bin/env node
/**
 * Put the original prefetchedQuestionIds back on the six sessions swapped
 * by scripts/swap-exam-prefetch2-20260928.ts.
 *
 * Only that JSON array is written. Answers, scores, question counts, and
 * the other analysis keys stay as they are. The backup table is not dropped.
 * Refuses when a swapped index has an answer that was not in the backup,
 * or when a session is no longer in progress.
 *
 *   npx tsx scripts/restore-exam-prefetch2-20260928.ts
 *   npx tsx scripts/restore-exam-prefetch2-20260928.ts --apply
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const BACKUP = "exam_prefetch_swap2_backup_20260928";
const EXPECTED = 6;
const prisma = new PrismaClient();

type Swap = { index: number; from: string; to: string };
type BackupRow = {
  session_id: string;
  status: string;
  swaps: Swap[];
  answers: Array<{ questionIndex?: number; questionId?: string }>;
};

async function main() {
  const apply = process.argv.includes("--apply");
  const reg = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${BACKUP}')::text AS reg`
  )) as Array<{ reg: string | null }>;
  if (!reg[0]?.reg) {
    console.log(`${BACKUP} is not present. No file written.`);
    if (apply) throw new Error(`${BACKUP} is missing`);
    return;
  }

  const rows = (await prisma.$queryRawUnsafe(
    `
    SELECT session_id, status, swaps, answers
    FROM ${BACKUP}
    ORDER BY session_id
    `
  )) as BackupRow[];
  if (rows.length !== EXPECTED) throw new Error(`${BACKUP} has ${rows.length} rows, expected ${EXPECTED}`);

  const current = (await prisma.$queryRawUnsafe(
    `
    SELECT id, status, answers, analysis->'prefetchedQuestionIds' AS ids
    FROM exam_sessions
    WHERE id = ANY ($1::text[])
    ORDER BY id
    `,
    rows.map((row) => row.session_id)
  )) as Array<{
    id: string;
    status: string;
    answers: Array<{ questionIndex?: number; questionId?: string }>;
    ids: string[];
  }>;
  if (current.length !== EXPECTED) throw new Error("a backed-up session is missing");
  const byId = new Map(current.map((row) => [row.id, row]));

  for (const backup of rows) {
    const live = byId.get(backup.session_id);
    if (!live) throw new Error(`${backup.session_id} is missing`);
    if (live.status !== "in_progress") {
      throw new Error(`${backup.session_id} is ${live.status}; not restored`);
    }
    const answers = Array.isArray(live.answers) ? live.answers : [];
    const originalAnswers = Array.isArray(backup.answers) ? backup.answers : [];
    const originalIndexes = new Set(
      originalAnswers
        .map((row) => row.questionIndex)
        .filter((index): index is number => typeof index === "number")
    );
    for (const swap of backup.swaps) {
      const gained = answers.some(
        (row) =>
          (row.questionIndex === swap.index || row.questionId === swap.to || row.questionId === swap.from) &&
          !originalIndexes.has(swap.index)
      );
      if (gained) {
        throw new Error(`${backup.session_id} index ${swap.index} was answered after the swap; not restored`);
      }
      console.log(
        `${backup.session_id} index ${swap.index} ${swap.to} -> ${swap.from} length ${live.ids.length}`
      );
    }
  }

  if (!apply) {
    console.log("Dry run. No session list written.");
    return;
  }

  const sessionIds = rows.map((row) => row.session_id);
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(
      `
      CREATE TEMP TABLE restore_prior ON COMMIT DROP AS
      SELECT id, answers, score, "questionCount", "updatedAt"
      FROM exam_sessions
      WHERE id = ANY ($1::text[])
      `,
      sessionIds
    );
    const updated = await tx.$executeRawUnsafe(
      `
      UPDATE exam_sessions s
      SET analysis = jsonb_set(s.analysis, '{prefetchedQuestionIds}', b.prefetched_question_ids, false)
      FROM ${BACKUP} b
      WHERE s.id = b.session_id
        AND s.status = 'in_progress'
      `
    );
    if (updated !== EXPECTED) throw new Error(`restored ${updated} sessions, expected ${EXPECTED}`);
    const check = (await tx.$queryRawUnsafe(`
      SELECT
        (
          SELECT COUNT(*)::int
          FROM exam_sessions s
          JOIN ${BACKUP} b ON b.session_id = s.id
          WHERE s.analysis->'prefetchedQuestionIds' IS DISTINCT FROM b.prefetched_question_ids
        ) AS list_drift,
        (
          SELECT COUNT(*)::int
          FROM exam_sessions s
          JOIN restore_prior prior ON prior.id = s.id
          WHERE s.answers IS DISTINCT FROM prior.answers
             OR s.score IS DISTINCT FROM prior.score
             OR s."questionCount" IS DISTINCT FROM prior."questionCount"
             OR s."updatedAt" IS DISTINCT FROM prior."updatedAt"
        ) AS other_drift
    `)) as Array<{ list_drift: number; other_drift: number }>;
    if (check[0]?.list_drift !== 0 || check[0]?.other_drift !== 0) {
      throw new Error("restore verification failed");
    }
  }, { timeout: 60_000 });

  console.log(`Restored prefetchedQuestionIds on ${EXPECTED} sessions from ${BACKUP}.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
