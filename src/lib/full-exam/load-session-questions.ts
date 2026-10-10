import { prisma } from "@/lib/prisma";
import { getExamSession } from "@/lib/exam-sessions/service";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { filterBankRowsForPracticeField } from "@/lib/edtech/exam-item-scope";
import { preparedTimedExamItemsForClient } from "@/lib/exam-prep/prepare-timed-exam-client-payload";
import { mergePrefetchedBankItems, publishedCatalogToBankItems } from "@/lib/full-exam/catalog-exam-items";
import { loadPublishedClinicalBank } from "@/lib/assessment/serve-db";
import type { BankItem } from "@/lib/question-bank";
import type { FullExamSessionConfig } from "@/types/full-exam";
import type { ExamQuestion } from "@/lib/ai";

type SessionAnalysis = {
  sessionConfig?: FullExamSessionConfig;
  prefetchedQuestionIds?: string[];
};

function hashSessionShuffleSeed(sessionId: string): number {
  let hash = 0x51ed270b;
  for (let i = 0; i < sessionId.length; i++) {
    hash = Math.imul(hash ^ sessionId.charCodeAt(i), 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

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

  const bankIds = ids.filter((id) => !id.startsWith("ngn:"));
  const rows = filterBankRowsForPracticeField(
    bankIds.length === 0
      ? []
      : await prisma.questionBankItem.findMany({
          where: { id: { in: bankIds } },
        }),
    resolvedFieldId
  );
  const byId = new Map(rows.map((row) => [row.id, enrichBankItemFromRow(row)]));
  let catalogItems: BankItem[] = [];
  if (ids.some((id) => id.startsWith("ngn:"))) {
    try {
      const bank = await loadPublishedClinicalBank(resolvedFieldId);
      catalogItems = publishedCatalogToBankItems(bank.catalog);
    } catch (error) {
      console.warn(
        "[full-exam] clinical NGN catalog unavailable",
        error instanceof Error ? error.message : error
      );
    }
  }
  const items = mergePrefetchedBankItems(ids, byId, catalogItems);

  if (items.length < limit) {
    return {
      ok: false,
      status: 503,
      code: "SESSION_QUESTIONS_MISSING",
      error: "Stored session questions are unavailable.",
    };
  }

  const storedSeed = config?.optionShuffleSeed;
  const clientPayload = preparedTimedExamItemsForClient(
    resolvedFieldId,
    resolvedFieldId,
    items,
    limit,
    {
      shuffleSeed:
        typeof storedSeed === "number"
          ? storedSeed
          : hashSessionShuffleSeed(sessionId),
      sessionId,
    }
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
