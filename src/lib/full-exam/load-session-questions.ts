import { prisma } from "@/lib/prisma";
import { getExamSession } from "@/lib/exam-sessions/service";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { filterBankRowsForPracticeField } from "@/lib/edtech/exam-item-scope";
import { preparedTimedExamItemsForClient } from "@/lib/exam-prep/prepare-timed-exam-client-payload";
import type { FullExamSessionConfig } from "@/types/full-exam";
import type { ExamQuestion } from "@/lib/ai";

type SessionAnalysis = {
  sessionConfig?: FullExamSessionConfig;
  prefetchedQuestionIds?: string[];
};

export type FullExamSessionQuestionsPayload = {
  fieldId: string;
  questions: ExamQuestion[];
  bankItemIds: string[];
  requested: number;
};

/**
 * Hydrate an in-progress full-exam session's question set from stored bank IDs.
 * Shared by resume start + the session questions API.
 */
export async function loadFullExamSessionQuestionsPayload(
  userId: string,
  sessionId: string
): Promise<
  | { ok: true; payload: FullExamSessionQuestionsPayload }
  | { ok: false; status: number; code?: string; error: string }
> {
  const session = await getExamSession(sessionId, userId);
  if (!session) {
    return { ok: false, status: 404, error: "Session not found" };
  }

  const resolvedFieldId = session.fieldId;
  if (!resolvedFieldId) {
    return {
      ok: false,
      status: 404,
      code: "SESSION_FIELD_MISSING",
      error: "Session has no exam field.",
    };
  }

  const analysis = (session.analysis ?? {}) as SessionAnalysis;
  const config = analysis.sessionConfig;
  const ids = analysis.prefetchedQuestionIds ?? [];
  const limit = config?.questionCount ?? session.questionCount;

  if (!limit || ids.length === 0) {
    return {
      ok: false,
      status: 404,
      code: "SESSION_QUESTIONS_MISSING",
      error: "Session questions are not prefetched.",
    };
  }

  const rows = filterBankRowsForPracticeField(
    await prisma.questionBankItem.findMany({
      where: { id: { in: ids } },
    }),
    resolvedFieldId
  );
  const byId = new Map(rows.map((row) => [row.id, row]));
  const items = ids
    .map((id) => {
      const row = byId.get(id);
      return row ? enrichBankItemFromRow(row) : null;
    })
    .filter((item): item is NonNullable<typeof item> => item != null);

  if (items.length < limit) {
    return {
      ok: false,
      status: 503,
      code: "SESSION_QUESTIONS_MISSING",
      error: "Stored session questions are unavailable.",
    };
  }

  const clientPayload = preparedTimedExamItemsForClient(
    resolvedFieldId,
    resolvedFieldId,
    items,
    limit
  );

  return {
    ok: true,
    payload: {
      fieldId: resolvedFieldId,
      questions: clientPayload.questions,
      bankItemIds: clientPayload.bankItemIds,
      requested: limit,
    },
  };
}
