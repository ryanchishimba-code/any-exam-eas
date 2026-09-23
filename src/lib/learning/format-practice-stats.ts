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
