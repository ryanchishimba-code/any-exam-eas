#!/usr/bin/env node
/**
 * Replace six hidden NCLEX ids in in-progress exam prefetch lists with the
 * owner-verified replacements. Same index. Unanswered slots only.
 *
 *   npx tsx scripts/swap-exam-prefetch2-20260928.ts
 *   npx tsx scripts/swap-exam-prefetch2-20260928.ts --apply
 *
 * --apply copies the six session rows into exam_prefetch_swap2_backup_20260928
 * and then swaps. Dry run rolls the same writes back. Restore with
 * scripts/restore-exam-prefetch2-20260928.ts.
 * Answers, scores, question counts, and other analysis keys are not written.
 * The earlier exam_prefetch_swap_backup_20260928 table is not touched.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { studentEligibleAndSql } from "../src/lib/exam-prep/student-eligibility-sql";

const BACKUP = "exam_prefetch_swap2_backup_20260928";
const EXPECTED = 6;
const PLAN = [
  { sessionId: "cmtqil4mlv2p851b7", index: 148, from: "cmqwwjg3n00061y5k2emykv0n", to: "cmr12flb6007m1y1us0dyb0d0" },
  { sessionId: "cmttf3cac1mvyxtwz", index: 62, from: "cmqwwumv700031y25hf8p4bg8", to: "cmr8q98ho00861yvf6x934okx" },
  { sessionId: "cmuesh2dhphqo77ku", index: 45, from: "cmqwxkhdj00041ytvdp03mntj", to: "cmr7f9vkq00071y596pytpv0q" },
  { sessionId: "cmuhvzv7vgi2jyzeh", index: 64, from: "cmqwxkhdj00041ytvdp03mntj", to: "cmr112ief007d1y8alxiilycj" },
  { sessionId: "cmuhiyg0951aqzj4a", index: 141, from: "cmqwl59dz000i1yqxptqro3pn", to: "cmr8naldt002q1yh6xjcr8iap" },
  { sessionId: "cmuhqoo1egsyw9iqh", index: 20, from: "cmqwl59dz000i1yqxptqro3pn", to: "cmqwuqnvd000g1yx170ul4kh9" },
] as const;
const HIDDEN = [
  "cmqwwjg3n00061y5k2emykv0n",
  "cmqwxkhdj00041ytvdp03mntj",
  "cmqwl59dz000i1yqxptqro3pn",
  "cmqwwumv700031y25hf8p4bg8",
  "cmqwrccdh00051yjhwypju4zv",
  "cmqx01cla000k1ydsi9wvoati",
] as const;
const ID_RE = /^[a-z0-9]+$/;
const prisma = new PrismaClient();

class DryRunRollback extends Error {
  constructor() {
    super("dry-run");
  }
}

type AnswerRow = { questionIndex?: number; questionId?: string };
type SessionRow = {
  id: string;
  status: string;
  examType: string;
  fieldId: string | null;
  questionCount: number;
  score: number | null;
  answers: unknown;
  analysis: { prefetchedQuestionIds?: unknown } | null;
};

function assertId(id: string) {
  if (!ID_RE.test(id)) throw new Error("refusing a non-alphanumeric id");
}

function asAnswers(raw: unknown): AnswerRow[] {
  if (!Array.isArray(raw)) throw new Error("session answers are not an array");
  return raw as AnswerRow[];
}

function prefetchIds(analysis: SessionRow["analysis"]): string[] {
  const ids = analysis?.prefetchedQuestionIds;
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    throw new Error("prefetchedQuestionIds is missing");
  }
  return ids as string[];
}

async function main() {
  const apply = process.argv.includes("--apply");
  for (const row of PLAN) {
    assertId(row.sessionId);
    assertId(row.from);
    assertId(row.to);
  }
  if (new Set(PLAN.map((row) => row.sessionId)).size !== EXPECTED) throw new Error("duplicate session");
  if (new Set(PLAN.map((row) => row.to)).size !== EXPECTED) throw new Error("duplicate replacement");

  const existing = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${BACKUP}')::text AS reg`
  )) as Array<{ reg: string | null }>;
  if (existing[0]?.reg) throw new Error(`${BACKUP} already exists`);

  try {
    await prisma.$transaction(async (tx) => {
      const sessions = (await tx.$queryRawUnsafe(
        `
        SELECT id, status, "examType", "fieldId", "questionCount", score, answers, analysis
        FROM exam_sessions
        WHERE id = ANY ($1::text[])
        ORDER BY id
        FOR UPDATE
        `,
        PLAN.map((row) => row.sessionId)
      )) as SessionRow[];
      if (sessions.length !== EXPECTED) throw new Error(`locked ${sessions.length} sessions, expected ${EXPECTED}`);
      const byId = new Map(sessions.map((row) => [row.id, row]));

      const replacements = (await tx.$queryRawUnsafe(
        `
        SELECT id,
          (
            active = true AND "qaPassed" = true AND "fieldId" = 'nursing'
            ${studentEligibleAndSql()}
          ) AS eligible
        FROM "QuestionBankItem"
        WHERE id = ANY ($1::text[])
        `,
        PLAN.map((row) => row.to)
      )) as Array<{ id: string; eligible: boolean }>;
      const eligible = new Map(replacements.map((row) => [row.id, row.eligible]));

      const nextBySession = new Map<string, string[]>();
      for (const step of PLAN) {
        const session = byId.get(step.sessionId);
        if (!session) throw new Error(`${step.sessionId} is missing`);
        if (session.status !== "in_progress") throw new Error(`${step.sessionId} is ${session.status}`);
        if (session.examType !== "nclex" || session.fieldId !== "nursing") {
          throw new Error(`${step.sessionId} is not an NCLEX nursing session`);
        }
        const ids = prefetchIds(session.analysis);
        if (ids.length !== session.questionCount) {
          throw new Error(`${step.sessionId} list length ${ids.length} does not match questionCount`);
        }
        if (ids[step.index] !== step.from) {
          throw new Error(`${step.sessionId} index ${step.index} is ${ids[step.index] ?? "missing"}`);
        }
        if (ids.includes(step.to)) {
          throw new Error(`${step.to} is already in ${step.sessionId}; no session was changed`);
        }
        if (eligible.get(step.to) !== true) {
          throw new Error(`${step.to} is not an eligible NCLEX item; no session was changed`);
        }
        const answered = asAnswers(session.answers).some(
          (row) => row.questionIndex === step.index || row.questionId === step.from
        );
        if (answered) {
          throw new Error(`${step.sessionId} index ${step.index} is answered; no session was changed`);
        }
        const next = ids.slice();
        next[step.index] = step.to;
        if (next.length !== ids.length || new Set(next).size !== next.length) {
          throw new Error(`${step.sessionId} replacement would change the list length or duplicate an id`);
        }
        if (next.some((id) => (HIDDEN as readonly string[]).includes(id))) {
          throw new Error(`${step.sessionId} would still contain a hidden id`);
        }
        nextBySession.set(step.sessionId, next);
        const answeredIndexes = asAnswers(session.answers)
          .map((row) => row.questionIndex)
          .filter((index): index is number => typeof index === "number")
          .sort((a, b) => a - b);
        console.log(
          `${step.sessionId} index ${step.index} ${step.from} -> ${step.to} length ${ids.length} answered [${answeredIndexes.join(",")}]`
        );
      }

      await tx.$executeRawUnsafe(`
        CREATE TABLE ${BACKUP} (
          session_id text PRIMARY KEY,
          user_id text NOT NULL,
          status text NOT NULL,
          exam_type text NOT NULL,
          field_id text,
          question_count integer NOT NULL,
          score double precision,
          updated_at timestamp(3) NOT NULL,
          answers jsonb NOT NULL,
          analysis jsonb NOT NULL,
          weak_areas jsonb,
          prefetched_question_ids jsonb NOT NULL,
          swaps jsonb NOT NULL,
          backed_up_at timestamptz NOT NULL DEFAULT now()
        )
      `);

      for (const step of PLAN) {
        const session = byId.get(step.sessionId);
        if (!session) throw new Error(`${step.sessionId} disappeared`);
        const ids = prefetchIds(session.analysis);
        const next = nextBySession.get(step.sessionId);
        if (!next) throw new Error(`missing new list for ${step.sessionId}`);
        const inserted = (await tx.$queryRawUnsafe(
          `
          INSERT INTO ${BACKUP} (
            session_id, user_id, status, exam_type, field_id, question_count, score,
            updated_at, answers, analysis, weak_areas, prefetched_question_ids, swaps
          )
          SELECT
            id, "userId", status, "examType", "fieldId", "questionCount", score,
            "updatedAt", answers, analysis, "weakAreas", analysis->'prefetchedQuestionIds', $2::jsonb
          FROM exam_sessions
          WHERE id = $1
          RETURNING session_id
          `,
          step.sessionId,
          JSON.stringify([{ index: step.index, from: step.from, to: step.to }])
        )) as Array<{ session_id: string }>;
        if (inserted.length !== 1) throw new Error(`backup insert failed for ${step.sessionId}`);

        const updated = await tx.$executeRawUnsafe(
          `
          UPDATE exam_sessions
          SET analysis = jsonb_set(analysis, '{prefetchedQuestionIds}', $1::jsonb, false)
          WHERE id = $2
            AND status = 'in_progress'
            AND analysis->'prefetchedQuestionIds' = $3::jsonb
          `,
          JSON.stringify(next),
          step.sessionId,
          JSON.stringify(ids)
        );
        if (updated !== 1) throw new Error(`session update failed for ${step.sessionId}`);
      }

      const hiddenChecks = HIDDEN.map((_, index) => `analysis::text LIKE '%' || $${index + 1} || '%' OR answers::text LIKE '%' || $${index + 1} || '%'`).join(" OR ");
      const check = (await tx.$queryRawUnsafe(
        `
        SELECT
          (SELECT COUNT(*)::int FROM ${BACKUP}) AS backup_rows,
          (
            SELECT COUNT(*)::int
            FROM exam_sessions
            WHERE ${hiddenChecks}
          ) AS still_present,
          (
            SELECT COUNT(*)::int
            FROM exam_sessions s
            JOIN ${BACKUP} b ON b.session_id = s.id
            WHERE s.answers IS DISTINCT FROM b.answers
               OR s.score IS DISTINCT FROM b.score
               OR s."questionCount" IS DISTINCT FROM b.question_count
               OR s.status IS DISTINCT FROM b.status
               OR s."updatedAt" IS DISTINCT FROM b.updated_at
               OR s."weakAreas" IS DISTINCT FROM b.weak_areas
               OR (s.analysis - 'prefetchedQuestionIds') IS DISTINCT FROM (b.analysis - 'prefetchedQuestionIds')
               OR jsonb_array_length(s.analysis->'prefetchedQuestionIds')
                    IS DISTINCT FROM jsonb_array_length(b.prefetched_question_ids)
          ) AS drifted
        `,
        ...HIDDEN
      )) as Array<{ backup_rows: number; still_present: number; drifted: number }>;
      const row = check[0];
      console.log(
        `backup rows: ${row?.backup_rows} still_present: ${row?.still_present} drifted: ${row?.drifted}`
      );
      if (row?.backup_rows !== EXPECTED || row.still_present !== 0 || row.drifted !== 0) {
        throw new Error("verification failed");
      }
      if (!apply) throw new DryRunRollback();
    }, { timeout: 60_000 });
  } catch (error) {
    if (error instanceof DryRunRollback) {
      const left = (await prisma.$queryRawUnsafe(
        `SELECT to_regclass('public.${BACKUP}')::text AS reg`
      )) as Array<{ reg: string | null }>;
      if (left[0]?.reg) throw new Error("dry run left the backup table behind");
      console.log("Rolled back. No table left. Session lists unchanged.");
      return;
    }
    throw error;
  }

  const hiddenChecks = HIDDEN.map((_, index) => `analysis::text LIKE '%' || $${index + 1} || '%' OR answers::text LIKE '%' || $${index + 1} || '%'`).join(" OR ");
  const after = (await prisma.$queryRawUnsafe(
    `
    SELECT
      (SELECT COUNT(*)::int FROM ${BACKUP}) AS backup_rows,
      (SELECT COUNT(*)::int FROM exam_sessions WHERE ${hiddenChecks}) AS still_present,
      (
        SELECT COUNT(*)::int
        FROM exam_sessions s
        JOIN ${BACKUP} b ON b.session_id = s.id
        WHERE jsonb_array_length(s.analysis->'prefetchedQuestionIds')
              IS DISTINCT FROM jsonb_array_length(b.prefetched_question_ids)
           OR s.answers IS DISTINCT FROM b.answers
           OR s.score IS DISTINCT FROM b.score
           OR s."questionCount" IS DISTINCT FROM b.question_count
      ) AS drifted
    `,
    ...HIDDEN
  )) as Array<{ backup_rows: number; still_present: number; drifted: number }>;
  console.log(
    `Committed ${BACKUP}. Re-read backup rows: ${after[0]?.backup_rows} still_present: ${after[0]?.still_present} drifted: ${after[0]?.drifted}`
  );
  if (after[0]?.backup_rows !== EXPECTED || after[0]?.still_present !== 0 || after[0]?.drifted !== 0) {
    throw new Error("post-commit verification failed");
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
