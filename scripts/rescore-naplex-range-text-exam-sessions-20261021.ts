#!/usr/bin/env node
/**
 * Re-score completed exam sessions for the NAPLEX range-text MCQ grading bug
 * (fixed in main a7e5cae). Affected bank items are pharmacy MCQs whose
 * correctAnswer parses as a numeric span but is option text (e.g. "4-5 half-lives").
 *
 * Dry run is the default — reports only, no writes.
 *
 *   npx tsx scripts/rescore-naplex-range-text-exam-sessions-20261021.ts
 *   npx tsx scripts/rescore-naplex-range-text-exam-sessions-20261021.ts --apply
 *
 * --apply creates backup tables, then updates only answers that were stored
 * incorrect while the fixed grader marks the same selection correct (no downgrades).
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import type { ExamAnswerRecord } from "../src/lib/exam-sessions/service";
import { calculateExamScorePercent } from "../src/lib/exam-sessions/scoring";
import { gradeStudySelection } from "../src/lib/exam-sessions/grade-stored-answer";
import { loadStoredStudyQuestionsBatch } from "../src/lib/questions/reveal-stored-item";
import {
  numericValuesMatch,
  parseNumericEntry,
  parseNumericSpan,
} from "../src/lib/questions/numeric-grade";

const PINNED_Q91 = "cmrlillls000c1ybl24s9e4qy";
const SESSION_BACKUP = "exam_sessions_naplex_range_text_rescore_backup_20261021";
const ANSWER_BACKUP = "exam_session_answers_naplex_range_text_rescore_backup_20261021";

const prisma = new PrismaClient();

/** Pre-fix numeric fallback returned false when only the key parsed as numeric. */
function legacyGradeNumericAnswer(
  studentRaw: string,
  keyRaw: string,
  instruction: string
): boolean | null {
  const student = parseNumericEntry(studentRaw);
  const key = parseNumericSpan(keyRaw);
  if (student == null && key == null) return null;
  if (student == null || key == null) return false;
  return numericValuesMatch(student, key.min, key.max, instruction, keyRaw);
}

function isRangeTextMcqKey(correctAnswer: string): boolean {
  if (parseNumericSpan(correctAnswer) == null) return false;
  const trimmed = correctAnswer.trim();
  if (/^[+-]?\d+(?:\.\d+)?\s*[-–]\s*[+-]?\d+(?:\.\d+)?$/.test(trimmed)) {
    return false;
  }
  if (parseNumericEntry(trimmed) != null) return false;
  return true;
}

type BankRow = {
  id: string;
  correctAnswer: string;
  itemType: string;
  fieldId: string;
  active: boolean;
  qaPassed: boolean;
};

async function loadAffectedQuestionIds(): Promise<string[]> {
  const rows = (await prisma.$queryRawUnsafe(`
    SELECT id, "correctAnswer", "itemType", "fieldId", active, "qaPassed"
    FROM "QuestionBankItem"
    WHERE "fieldId" = 'pharmacy'
      AND active = true
      AND "qaPassed" = true
      AND lower("itemType") NOT IN (
        'calculation', 'numeric', 'numeric_entry', 'constructed_response', 'short_answer'
      )
  `)) as BankRow[];

  const ids = rows
    .filter((row) => isRangeTextMcqKey(row.correctAnswer))
    .map((row) => row.id);
  if (!ids.includes(PINNED_Q91)) {
    throw new Error(`pinned item ${PINNED_Q91} missing from affected-id scan`);
  }
  return [...new Set(ids)].sort();
}

function parseAnswers(raw: unknown): ExamAnswerRecord[] {
  if (!Array.isArray(raw)) return [];
  const out: ExamAnswerRecord[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const rec = row as Partial<ExamAnswerRecord>;
    if (typeof rec.questionIndex !== "number") continue;
    out.push({
      questionIndex: rec.questionIndex,
      questionId: typeof rec.questionId === "string" ? rec.questionId : undefined,
      selected: typeof rec.selected === "string" ? rec.selected : "",
      correct: rec.correct === true,
      flagged: rec.flagged === true,
      eliminated: Array.isArray(rec.eliminated) ? rec.eliminated.map(String) : undefined,
      notes: typeof rec.notes === "string" ? rec.notes : undefined,
      topicCategory: typeof rec.topicCategory === "string" ? rec.topicCategory : undefined,
      answeredAt: typeof rec.answeredAt === "string" ? rec.answeredAt : "",
    });
  }
  return out;
}

type AnswerFix = {
  questionIndex: number;
  questionId: string;
  selected: string;
  correctBefore: boolean;
  correctAfter: true;
};

type SessionPlan = {
  sessionId: string;
  userId: string;
  examType: string;
  scoreBefore: number | null;
  scoreAfter: number;
  questionCount: number;
  answerFixes: AnswerFix[];
};

async function loadCompletedSessionsWithItems(questionIds: string[]): Promise<
  Array<{
    id: string;
    userId: string;
    examType: string;
    score: number | null;
    questionCount: number;
    answers: unknown;
  }>
> {
  if (questionIds.length === 0) return [];
  const likeClauses = questionIds.map((id) => `answers::text LIKE '%${id}%'`).join(" OR ");
  return (await prisma.$queryRawUnsafe(`
    SELECT id, "userId", "examType", score, "questionCount", answers
    FROM exam_sessions
    WHERE status = 'completed'
      AND (${likeClauses})
  `)) as Array<{
    id: string;
    userId: string;
    examType: string;
    score: number | null;
    questionCount: number;
    answers: unknown;
  }>;
}

async function buildSessionPlans(questionIds: Set<string>): Promise<SessionPlan[]> {
  const sessions = await loadCompletedSessionsWithItems([...questionIds]);
  const plans: SessionPlan[] = [];

  for (const session of sessions) {
    const answers = parseAnswers(session.answers);
    const touched = answers.filter(
      (a) => a.questionId && questionIds.has(a.questionId.trim())
    );
    if (touched.length === 0) continue;

    const studyIds = [...new Set(touched.map((a) => a.questionId!.trim()))];
    const studies = await loadStoredStudyQuestionsBatch(studyIds);

    const answerFixes: AnswerFix[] = [];
    for (const row of touched) {
      const qid = row.questionId!.trim();
      const selected = row.selected?.trim() ?? "";
      if (!selected || row.correct) continue;
      const study = studies.get(qid);
      if (!study) continue;
      const legacy = legacyGradeNumericAnswer(
        selected,
        study.correctAnswers[0] ?? "",
        study.stem
      );
      if (legacy !== false) continue;
      if (!gradeStudySelection(study, selected)) continue;
      answerFixes.push({
        questionIndex: row.questionIndex,
        questionId: qid,
        selected,
        correctBefore: false,
        correctAfter: true,
      });
    }

    if (answerFixes.length === 0) continue;

    const nextAnswers = answers.map((row) => {
      const fix = answerFixes.find((f) => f.questionIndex === row.questionIndex);
      return fix ? { ...row, correct: true } : row;
    });
    const scoreAfter = calculateExamScorePercent(nextAnswers, session.questionCount);

    plans.push({
      sessionId: session.id,
      userId: session.userId,
      examType: session.examType,
      scoreBefore: session.score,
      scoreAfter,
      questionCount: session.questionCount,
      answerFixes,
    });
  }

  return plans;
}

async function backupExists(name: string): Promise<boolean> {
  const reg = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${name}')::text AS reg`
  )) as Array<{ reg: string | null }>;
  return Boolean(reg[0]?.reg);
}

async function main() {
  const apply = process.argv.includes("--apply");
  const questionIds = await loadAffectedQuestionIds();
  const idSet = new Set(questionIds);

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`affected bank items: ${questionIds.length}`);
  console.log(`pinned Q91 present: ${questionIds.includes(PINNED_Q91)}`);
  for (const id of questionIds) console.log(`  ${id}`);

  const plans = await buildSessionPlans(idSet);
  const rowChanges = plans.reduce((n, p) => n + p.answerFixes.length, 0);
  const scoreUp = plans.filter(
    (p) => (p.scoreBefore ?? 0) < p.scoreAfter
  ).length;
  const scoreDown = plans.filter(
    (p) => p.scoreBefore != null && p.scoreBefore > p.scoreAfter
  ).length;
  const scoreSame = plans.length - scoreUp - scoreDown;

  console.log(`\ncompleted sessions with at least one fix: ${plans.length}`);
  console.log(`answer rows to flip incorrect→correct: ${rowChanges}`);
  console.log(`score changes: up ${scoreUp}, down ${scoreDown}, unchanged ${scoreSame}`);
  if (scoreDown > 0) {
    throw new Error("unexpected score decreases — aborting");
  }

  for (const plan of plans) {
    console.log(
      `\nsession ${plan.sessionId} (${plan.examType}) user=${plan.userId}`
    );
    console.log(
      `  score ${plan.scoreBefore ?? "null"} → ${plan.scoreAfter} (${plan.questionCount} Q)`
    );
    for (const fix of plan.answerFixes) {
      console.log(
        `  Q#${fix.questionIndex + 1} ${fix.questionId} selected="${fix.selected}" correct false→true`
      );
    }
  }

  if (!apply) {
    console.log("\nNo rows written (dry run). Use --apply to create backup tables and update sessions.");
    return;
  }

  if (await backupExists(SESSION_BACKUP) || await backupExists(ANSWER_BACKUP)) {
    throw new Error("backup table(s) already exist; refusing --apply");
  }

  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`
      CREATE TABLE ${SESSION_BACKUP} (
        session_id text PRIMARY KEY,
        user_id text NOT NULL,
        exam_type text NOT NULL,
        score_before double precision,
        question_count integer NOT NULL,
        answers_before jsonb NOT NULL,
        score_after double precision NOT NULL,
        backed_up_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await tx.$executeRawUnsafe(`
      CREATE TABLE ${ANSWER_BACKUP} (
        session_id text NOT NULL,
        question_index integer NOT NULL,
        question_id text NOT NULL,
        selected text NOT NULL,
        correct_before boolean NOT NULL,
        correct_after boolean NOT NULL,
        PRIMARY KEY (session_id, question_index)
      )
    `);

    for (const plan of plans) {
      const live = (await tx.$queryRawUnsafe(
        `SELECT answers, score FROM exam_sessions WHERE id = $1 AND status = 'completed'`,
        plan.sessionId
      )) as Array<{ answers: unknown; score: number | null }>;
      const row = live[0];
      if (!row) throw new Error(`session ${plan.sessionId} missing`);

      await tx.$executeRawUnsafe(
        `
        INSERT INTO ${SESSION_BACKUP}
          (session_id, user_id, exam_type, score_before, question_count, answers_before, score_after)
        VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)
        `,
        plan.sessionId,
        plan.userId,
        plan.examType,
        plan.scoreBefore,
        plan.questionCount,
        JSON.stringify(row.answers),
        plan.scoreAfter
      );

      for (const fix of plan.answerFixes) {
        await tx.$executeRawUnsafe(
          `
          INSERT INTO ${ANSWER_BACKUP}
            (session_id, question_index, question_id, selected, correct_before, correct_after)
          VALUES ($1, $2, $3, $4, false, true)
          `,
          plan.sessionId,
          fix.questionIndex,
          fix.questionId,
          fix.selected
        );
      }

      const answers = parseAnswers(row.answers).map((ans) => {
        const fix = plan.answerFixes.find((f) => f.questionIndex === ans.questionIndex);
        return fix ? { ...ans, correct: true } : ans;
      });

      await tx.$executeRawUnsafe(
        `
        UPDATE exam_sessions
        SET score = $2,
            answers = $3::jsonb,
            "updatedAt" = now()
        WHERE id = $1 AND status = 'completed'
        `,
        plan.sessionId,
        plan.scoreAfter,
        JSON.stringify(answers)
      );
    }
  });

  console.log(`\nApplied ${plans.length} session(s), ${rowChanges} answer row(s).`);
  console.log(`Backup tables: ${SESSION_BACKUP}, ${ANSWER_BACKUP}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
