import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { JUDGMENT10_BATCH_ID } from "@/lib/judgment-pilot/constants";

export type JudgmentPilotItemRow = {
  bankItemId: string;
  pilotItemId: string;
  fieldId: string;
  itemType: string;
  topicCategory: string | null;
  attempts: number;
  uniqueStudents: number;
  correctCount: number;
  pctCorrect: number | null;
  avgDurationMs: number | null;
};

export type JudgmentPilotPerformance = {
  batchId: string;
  generatedAt: string;
  items: JudgmentPilotItemRow[];
  totals: {
    attempts: number;
    uniqueStudents: number;
    correctCount: number;
    pctCorrect: number | null;
  };
};

/**
 * Per-question student performance for the judgment10 pilot batch.
 * Uses persisted QuestionAttempt.bankItemId rows only (no client tracking).
 */
export async function loadJudgmentPilotPerformance(
  batchId = JUDGMENT10_BATCH_ID
): Promise<JudgmentPilotPerformance> {
  const rows = await prisma.$queryRaw<
    {
      bank_item_id: string;
      pilot_item_id: string;
      field_id: string;
      item_type: string;
      topic_category: string | null;
      attempts: number;
      unique_students: number;
      correct_count: number;
      avg_duration_ms: number | null;
    }[]
  >(Prisma.sql`
    WITH pilot_items AS (
      SELECT
        q.id AS bank_item_id,
        COALESCE(q."generationMeta"->>'pilotItemId', q.id) AS pilot_item_id,
        q."fieldId" AS field_id,
        q."itemType" AS item_type,
        q."topicCategory" AS topic_category
      FROM "QuestionBankItem" q
      WHERE q.tags ILIKE ${`%${batchId}%`}
        AND q.active
    )
    SELECT
      p.bank_item_id,
      p.pilot_item_id,
      p.field_id,
      p.item_type,
      p.topic_category,
      COUNT(a.id)::int AS attempts,
      COUNT(DISTINCT a."userId")::int AS unique_students,
      COALESCE(SUM(CASE WHEN a.correct THEN 1 ELSE 0 END), 0)::int AS correct_count,
      AVG(a."durationMs")::float AS avg_duration_ms
    FROM pilot_items p
    LEFT JOIN "QuestionAttempt" a ON a."bankItemId" = p.bank_item_id
    GROUP BY 1, 2, 3, 4, 5
    ORDER BY p.pilot_item_id
  `);

  const items: JudgmentPilotItemRow[] = rows.map((row) => {
    const attempts = row.attempts;
    const correctCount = row.correct_count;
    return {
      bankItemId: row.bank_item_id,
      pilotItemId: row.pilot_item_id,
      fieldId: row.field_id,
      itemType: row.item_type,
      topicCategory: row.topic_category,
      attempts,
      uniqueStudents: row.unique_students,
      correctCount,
      pctCorrect: attempts > 0 ? Math.round((correctCount / attempts) * 1000) / 10 : null,
      avgDurationMs: row.avg_duration_ms != null ? Math.round(row.avg_duration_ms) : null,
    };
  });

  const attempts = items.reduce((sum, row) => sum + row.attempts, 0);
  const correctCount = items.reduce((sum, row) => sum + row.correctCount, 0);
  const uniqueStudents =
    attempts > 0
      ? await prisma.$queryRaw<{ cnt: number }[]>(Prisma.sql`
          SELECT COUNT(DISTINCT a."userId")::int AS cnt
          FROM "QuestionAttempt" a
          INNER JOIN "QuestionBankItem" q ON q.id = a."bankItemId"
          WHERE q.tags ILIKE ${`%${batchId}%`}
        `).then((r) => r[0]?.cnt ?? 0)
      : 0;

  return {
    batchId,
    generatedAt: new Date().toISOString(),
    items,
    totals: {
      attempts,
      uniqueStudents,
      correctCount,
      pctCorrect: attempts > 0 ? Math.round((correctCount / attempts) * 1000) / 10 : null,
    },
  };
}
