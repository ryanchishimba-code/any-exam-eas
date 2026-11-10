import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  emptyFormatPracticeStats,
  formatPracticeStatsFromRows,
  type FormatPracticeStats,
} from "@/lib/study/practice-format";

/**
 * Attempts saved from deliberate NGN / case sets.
 * Tagged practice-format:ngn or practice-format:case on QuestionAttempt.tagsJson.
 */
export type SavedFormatSet = {
  id: string;
  format: "ngn" | "case";
  score: number | null;
  completedAt: string;
  itemCount: number;
};

/** Completed NGN and case sets, newest first, so Analytics can reopen them. */
export async function loadSavedFormatSets(
  userId: string,
  fieldIds: string[] | null
): Promise<SavedFormatSet[]> {
  const rows = await prisma.studySession.findMany({
    where: {
      userId,
      completed: true,
      ...(fieldIds && fieldIds.length > 0 ? { fieldId: { in: fieldIds } } : {}),
      OR: [
        { stateJson: { contains: '"practiceFormat":"case"' } },
        { stateJson: { contains: '"practiceFormat":"ngn"' } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    take: 12,
    select: { id: true, score: true, updatedAt: true, stateJson: true },
  });
  return rows.flatMap((row) => {
    const format = row.stateJson.includes('"practiceFormat":"case"')
      ? "case"
      : row.stateJson.includes('"practiceFormat":"ngn"')
        ? "ngn"
        : null;
    if (!format) return [];
    let itemCount = 0;
    try {
      const parsed = JSON.parse(row.stateJson) as { attempts?: unknown[] };
      itemCount = Array.isArray(parsed.attempts) ? parsed.attempts.length : 0;
    } catch {
      itemCount = 0;
    }
    return [
      {
        id: row.id,
        format,
        score: row.score == null ? null : Math.round(row.score),
        completedAt: row.updatedAt.toISOString(),
        itemCount,
      },
    ];
  });
}

export async function loadFormatPracticeStats(
  userId: string,
  fieldIds: string[] | null
): Promise<FormatPracticeStats> {
  try {
    const fieldClause =
      fieldIds && fieldIds.length > 0
        ? Prisma.sql`AND "fieldId" IN (${Prisma.join(fieldIds)})`
        : Prisma.empty;

    const rows = await prisma.$queryRaw<
      { bucket: string | null; attempts: number; correct: number }[]
    >(Prisma.sql`
      SELECT
        CASE
          WHEN "tagsJson" ILIKE ${"%practice-format:case%"} THEN 'case'
          WHEN "tagsJson" ILIKE ${"%practice-format:ngn%"} THEN 'ngn'
          ELSE NULL
        END AS bucket,
        COUNT(*)::int AS attempts,
        COALESCE(SUM(CASE WHEN "correct" THEN 1 ELSE 0 END), 0)::int AS correct
      FROM "QuestionAttempt"
      WHERE "userId" = ${userId}
        AND (
          "tagsJson" ILIKE ${"%practice-format:ngn%"}
          OR "tagsJson" ILIKE ${"%practice-format:case%"}
        )
        ${fieldClause}
      GROUP BY 1
    `);

    return formatPracticeStatsFromRows(rows);
  } catch (error) {
    console.error("[analytics] format practice stats failed", error);
    return emptyFormatPracticeStats();
  }
}
