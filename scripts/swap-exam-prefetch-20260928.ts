#!/usr/bin/env node
/**
 * Replace two hidden NCLEX ids inside in-progress exam prefetch lists.
 *
 * The ids stay hidden. This only edits exam_sessions.analysis.prefetchedQuestionIds,
 * in place, for sessions that already stored them. Answers, scores, question
 * counts, and other analysis keys are not written.
 *
 *   npx tsx scripts/swap-exam-prefetch-20260928.ts
 *   npx tsx scripts/swap-exam-prefetch-20260928.ts --apply
 *
 * --apply copies the six session rows into exam_prefetch_swap_backup_20260928
 * and then swaps. Dry run rolls the same writes back. Restore with
 * scripts/restore-exam-prefetch-20260928.ts.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { studentEligibleAndSql } from "../src/lib/exam-prep/student-eligibility-sql";

const BACKUP = "exam_prefetch_swap_backup_20260928";
const EXPECTED = 6;
const HIDDEN = ["cmqwrccdh00051yjhwypju4zv", "cmqx01cla000k1ydsi9wvoati"] as const;
const ID_RE = /^[a-z0-9]+$/;

const prisma = new PrismaClient();

class DryRunRollback extends Error {
  constructor() {
    super("dry-run");
  }
}

type AnswerRow = {
  questionIndex?: number;
  questionId?: string;
  selected?: string;
};

type SessionRow = {
  id: string;
  userId: string;
  status: string;
  examType: string;
  fieldId: string | null;
  questionCount: number;
  score: number | null;
  updatedAt: Date;
  answers: unknown;
  analysis: { prefetchedQuestionIds?: unknown } | null;
  weakAreas: unknown;
};

type Swap = {
  index: number;
  from: string;
  to: string;
  subjectId: string;
  itemType: string;
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

function answeredHidden(answers: AnswerRow[], index: number, hiddenId: string): boolean {
  return answers.some((row) => row?.questionId === hiddenId || row?.questionIndex === index);
}

async function main() {
  const apply = process.argv.includes("--apply");
  for (const id of HIDDEN) assertId(id);

  const existing = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${BACKUP}')::text AS reg`
  )) as Array<{ reg: string | null }>;
  if (existing[0]?.reg) throw new Error(`${BACKUP} already exists`);

  const found = (await prisma.$queryRawUnsafe(
    `
    SELECT id
    FROM exam_sessions
    WHERE EXISTS (
      SELECT 1
      FROM jsonb_array_elements_text(analysis->'prefetchedQuestionIds') elem
      WHERE elem = ANY ($1::text[])
    )
    ORDER BY id
    `,
    HIDDEN
  )) as Array<{ id: string }>;
  if (found.length !== EXPECTED) {
    throw new Error(`found ${found.length} sessions containing the hidden ids, expected ${EXPECTED}`);
  }
  for (const row of found) assertId(row.id);

  try {
    await prisma.$transaction(async (tx) => {
      const sessions = (await tx.$queryRawUnsafe(
        `
        SELECT
          id,
          "userId",
          status,
          "examType",
          "fieldId",
          "questionCount",
          score,
          "updatedAt",
          answers,
          analysis,
          "weakAreas"
        FROM exam_sessions
        WHERE id = ANY ($1::text[])
        ORDER BY id
        FOR UPDATE
        `,
        found.map((row) => row.id)
      )) as SessionRow[];
      if (sessions.length !== EXPECTED) throw new Error("locked session count changed");

      const occupied = new Set<string>(HIDDEN);
      const plans: Array<{ session: SessionRow; ids: string[]; swaps: Swap[] }> = [];

      for (const session of sessions) {
        if (session.status !== "in_progress") {
          throw new Error(`${session.id} is ${session.status}`);
        }
        if (session.examType !== "nclex" || session.fieldId !== "nursing") {
          throw new Error(`${session.id} is not an NCLEX nursing session`);
        }
        const ids = prefetchIds(session.analysis);
        for (const id of ids) assertId(id);
        if (ids.length !== session.questionCount) {
          throw new Error(`${session.id} list length ${ids.length} does not match questionCount`);
        }
        const answers = asAnswers(session.answers);
        const hits = ids
          .map((id, index) => ({ id, index }))
          .filter((hit) => (HIDDEN as readonly string[]).includes(hit.id));
        if (hits.length !== 1) throw new Error(`${session.id} has ${hits.length} hidden ids`);
        for (const hit of hits) {
          if (answeredHidden(answers, hit.index, hit.id)) {
            const answered = answers.filter(
              (row) => row?.questionId === hit.id || row?.questionIndex === hit.index
            );
            console.log(
              `ANSWERED ${session.id} index ${hit.index} ${hit.id} records ${answered.length}; not changed`
            );
            throw new Error("a hidden id is already answered; no session was changed");
          }
        }
        for (const id of ids) occupied.add(id);
        plans.push({ session, ids, swaps: [] });
      }

      const removed = plans.map((plan) => {
        const hit = plan.ids
          .map((id, index) => ({ id, index }))
          .find((row) => (HIDDEN as readonly string[]).includes(row.id));
        if (!hit) throw new Error("hidden id missing after the lock");
        return hit;
      });
      const hiddenRows = (await tx.$queryRawUnsafe(
        `
        SELECT id, "subjectId", "itemType"
        FROM "QuestionBankItem"
        WHERE id = ANY ($1::text[])
        `,
        HIDDEN
      )) as Array<{ id: string; subjectId: string; itemType: string }>;
      const hiddenById = new Map(hiddenRows.map((row) => [row.id, row]));
      const subjects = [...new Set(removed.map((hit) => hiddenById.get(hit.id)?.subjectId).filter(Boolean))];
      const pool = (await tx.$queryRawUnsafe(
        `
        SELECT id, "subjectId", "itemType"
        FROM "QuestionBankItem"
        WHERE "fieldId" = 'nursing'
          AND active = true
          AND "qaPassed" = true
          AND "itemType" = 'vignette'
          AND "subjectId" = ANY ($1::text[])
          ${studentEligibleAndSql()}
        ORDER BY id
        `,
        subjects
      )) as Array<{ id: string; subjectId: string; itemType: string }>;
      const used = new Set<string>();
      for (const plan of plans) {
        const hit = plan.ids
          .map((id, index) => ({ id, index }))
          .find((row) => (HIDDEN as readonly string[]).includes(row.id));
        if (!hit) throw new Error("hidden id missing");
        const source = hiddenById.get(hit.id);
        if (!source || source.itemType !== "vignette") {
          throw new Error(`${hit.id} is not a nursing vignette`);
        }
        const replacement = pool.find(
          (row) =>
            row.subjectId === source.subjectId &&
            row.itemType === source.itemType &&
            !occupied.has(row.id) &&
            !used.has(row.id)
        );
        if (!replacement) {
          throw new Error(`no eligible ${source.subjectId} vignette is free for ${plan.session.id}`);
        }
        assertId(replacement.id);
        used.add(replacement.id);
        plan.swaps.push({
          index: hit.index,
          from: hit.id,
          to: replacement.id,
          subjectId: replacement.subjectId,
          itemType: replacement.itemType,
        });
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

      for (const plan of plans) {
        const swap = plan.swaps[0];
        if (!swap) throw new Error("missing swap");
        const next = plan.ids.slice();
        if (next[swap.index] !== swap.from) throw new Error("swap index moved");
        next[swap.index] = swap.to;
        if (next.length !== plan.ids.length) throw new Error("list length changed");
        if (new Set(next).size !== next.length) throw new Error("replacement is already in the session");
        if (next.some((id) => (HIDDEN as readonly string[]).includes(id))) {
          throw new Error("hidden id remained in the new list");
        }

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
          plan.session.id,
          JSON.stringify(plan.swaps)
        )) as Array<{ session_id: string }>;
        if (inserted.length !== 1) throw new Error(`backup insert failed for ${plan.session.id}`);

        const updated = await tx.$executeRawUnsafe(
          `
          UPDATE exam_sessions
          SET analysis = jsonb_set(analysis, '{prefetchedQuestionIds}', $1::jsonb, false)
          WHERE id = $2
            AND status = 'in_progress'
            AND analysis->'prefetchedQuestionIds' = $3::jsonb
          `,
          JSON.stringify(next),
          plan.session.id,
          JSON.stringify(plan.ids)
        );
        if (updated !== 1) throw new Error(`session update failed for ${plan.session.id}`);

        const answeredIndexes = asAnswers(plan.session.answers)
          .map((row) => row.questionIndex)
          .filter((index): index is number => typeof index === "number")
          .sort((a, b) => a - b);
        console.log(
          `${plan.session.id} index ${swap.index} ${swap.from} -> ${swap.to} ${swap.itemType} ${swap.subjectId} length ${plan.ids.length} answered [${answeredIndexes.join(",")}]`
        );
      }

      const check = (await tx.$queryRawUnsafe(
        `
        SELECT
          (SELECT COUNT(*)::int FROM ${BACKUP}) AS backup_rows,
          (
            SELECT COUNT(*)::int
            FROM exam_sessions
            WHERE analysis::text LIKE '%' || $1 || '%'
               OR analysis::text LIKE '%' || $2 || '%'
               OR answers::text LIKE '%' || $1 || '%'
               OR answers::text LIKE '%' || $2 || '%'
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
          ) AS drifted,
          (
            SELECT COUNT(*)::int
            FROM ${BACKUP} b
            JOIN exam_sessions s ON s.id = b.session_id
            JOIN LATERAL jsonb_array_elements(b.swaps) swap ON true
            WHERE (s.analysis->'prefetchedQuestionIds' -> ((swap->>'index')::int))
                    IS DISTINCT FROM to_jsonb(swap->>'to')
          ) AS missed_slots
        `,
        HIDDEN[0],
        HIDDEN[1]
      )) as Array<{
        backup_rows: number;
        still_present: number;
        drifted: number;
        missed_slots: number;
      }>;
      const row = check[0];
      console.log(
        `backup rows: ${row?.backup_rows} still_present: ${row?.still_present} drifted: ${row?.drifted} missed_slots: ${row?.missed_slots}`
      );
      if (
        row?.backup_rows !== EXPECTED ||
        row.still_present !== 0 ||
        row.drifted !== 0 ||
        row.missed_slots !== 0
      ) {
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

  const after = (await prisma.$queryRawUnsafe(
    `
    SELECT
      (SELECT COUNT(*)::int FROM ${BACKUP}) AS backup_rows,
      (
        SELECT COUNT(*)::int
        FROM exam_sessions
        WHERE analysis::text LIKE '%' || $1 || '%'
           OR analysis::text LIKE '%' || $2 || '%'
           OR answers::text LIKE '%' || $1 || '%'
           OR answers::text LIKE '%' || $2 || '%'
      ) AS still_present,
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
    HIDDEN[0],
    HIDDEN[1]
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
