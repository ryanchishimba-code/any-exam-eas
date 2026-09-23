import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { respondDbUnavailable } from "@/lib/api-db-error";
import { persistCompletedSessionAttempts } from "@/lib/learning/persist-session-attempts";
import type { SessionAttemptDraft } from "@/lib/learning/session-attempt-plan";

export const runtime = "nodejs";
export const maxDuration = 30;

const draftSchema = z.object({
  questionKey: z.string().min(1).max(512),
  bankItemId: z.string().max(512).nullish(),
  subjectId: z.string().max(160).nullish(),
  questionType: z.string().max(64).nullish(),
  stemPreview: z.string().max(500).nullish(),
  correct: z.boolean(),
  confidence: z.number().int().min(1).max(5).nullish(),
  durationMs: z.number().int().min(0).max(60 * 60 * 1000).nullish(),
  selectedAnswer: z.string().max(12000).nullish(),
  tags: z.array(z.string().max(200)).max(80).nullish(),
  difficulty: z.string().max(64).nullish(),
});

const bodySchema = z.object({
  session: z
    .object({
      sessionId: z.string().min(1).max(80),
      sourceType: z.string().min(1).max(40),
      sourceId: z.string().max(80).nullish(),
      field: z.string().min(1).max(80),
      subjectId: z.string().max(160).nullish(),
      mode: z.string().min(1).max(40),
      practiceFormat: z.enum(["ngn", "case"]).nullish(),
    })
    .passthrough(),
  attempts: z.array(draftSchema).max(300),
  completed: z.boolean().optional(),
  endedEarly: z.boolean().optional(),
  score: z.number().min(0).max(100).optional(),
});

export async function POST(req: Request) {
  const { requireStudyApi } = await import("@/lib/api-access");
  const premium = await requireStudyApi();
  if (!premium.ok) return premium.response;

  let sessionId = "";
  let answered = 0;
  try {
    const body = bodySchema.parse(await req.json());
    sessionId = body.session.sessionId;
    answered = body.attempts.length;
    const sessionPayload = body.endedEarly
      ? { ...body.session, endedEarly: true }
      : body.session;

    const result = await persistCompletedSessionAttempts({
      userId: premium.userId,
      field: body.session.field,
      sessionId,
      studyMode: body.session.mode,
      practiceFormat: body.session.practiceFormat ?? undefined,
      subjectId: body.session.subjectId,
      drafts: body.attempts as SessionAttemptDraft[],
    });

    try {
      await prisma.studySession.upsert({
        where: { id: sessionId },
        create: {
          id: sessionId,
          userId: premium.userId,
          sourceType: body.session.sourceType,
          sourceId: body.session.sourceId ?? null,
          fieldId: result.fieldId,
          subjectId: body.session.subjectId ?? null,
          mode: body.session.mode,
          stateJson: JSON.stringify({
            session: sessionPayload,
            attempts: body.attempts,
          }),
          completed: body.completed ?? false,
          score: body.score ?? result.accuracy,
        },
        update: {
          stateJson: JSON.stringify({
            session: sessionPayload,
            attempts: body.attempts,
          }),
          completed: body.completed ?? false,
          score: body.score ?? result.accuracy,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("[session-persist] study session row failed after attempts", {
        userId: premium.userId,
        sessionId,
        error: error instanceof Error ? error.message : error,
      });
    }

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[session-persist] completion payload rejected", error.flatten());
      return NextResponse.json(
        { ok: false, persisted: false, error: "Invalid session payload." },
        { status: 400 }
      );
    }
    const dbResponse = respondDbUnavailable(error);
    if (dbResponse) {
      console.error("[session-persist] persistence failed", {
        userId: premium.userId,
        sessionId,
        answered,
        error: "database unavailable",
      });
      return dbResponse;
    }
    console.error("[session-persist] persistence failed", {
      userId: premium.userId,
      sessionId,
      answered,
      error: error instanceof Error ? error.message : error,
    });
    return NextResponse.json(
      {
        ok: false,
        persisted: false,
        error: "Could not save this session. Analytics will stay empty until it saves.",
      },
      { status: 500 }
    );
  }
}
