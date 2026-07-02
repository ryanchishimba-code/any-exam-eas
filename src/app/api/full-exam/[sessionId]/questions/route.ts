import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getExamSession } from "@/lib/exam-sessions/service";
import { requirePremiumApi } from "@/lib/api-access";
import { respondDbUnavailable } from "@/lib/api-db-error";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { preparedTimedExamItemsForClient } from "@/lib/exam-prep/prepare-timed-exam-client-payload";
import type { FullExamSessionConfig } from "@/types/full-exam";

export const runtime = "nodejs";
export const maxDuration = 120;

type SessionAnalysis = {
  sessionConfig?: FullExamSessionConfig;
  prefetchedQuestionIds?: string[];
};

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ sessionId: string }> }
) {
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const { sessionId } = await ctx.params;

  try {
    const session = await getExamSession(sessionId, premium.userId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const analysis = (session.analysis ?? {}) as SessionAnalysis;
    const config = analysis.sessionConfig;
    const ids = analysis.prefetchedQuestionIds ?? [];
    const resolvedFieldId = session.fieldId;
    const limit = config?.questionCount ?? session.questionCount;

    if (!resolvedFieldId || !limit || ids.length === 0) {
      return NextResponse.json(
        { error: "Session questions are not prefetched.", code: "SESSION_QUESTIONS_MISSING" },
        { status: 404 }
      );
    }

    const rows = await prisma.questionBankItem.findMany({
      where: { id: { in: ids } },
    });
    const byId = new Map(rows.map((row) => [row.id, row]));
    const items = ids
      .map((id) => {
        const row = byId.get(id);
        return row ? enrichBankItemFromRow(row) : null;
      })
      .filter((item): item is NonNullable<typeof item> => item != null);

    if (items.length < limit) {
      return NextResponse.json(
        { error: "Stored session questions are unavailable.", code: "SESSION_QUESTIONS_MISSING" },
        { status: 503 }
      );
    }

    const clientPayload = preparedTimedExamItemsForClient(
      resolvedFieldId,
      resolvedFieldId,
      items,
      limit
    );

    return NextResponse.json({
      fieldId: resolvedFieldId,
      questions: clientPayload.questions,
      bankItemIds: clientPayload.bankItemIds,
      requested: limit,
    });
  } catch (e) {
    const dbResponse = respondDbUnavailable(e);
    if (dbResponse) return dbResponse;
    const message = e instanceof Error ? e.message : "Could not load session questions";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
