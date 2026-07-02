import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { respondDbUnavailable } from "@/lib/api-db-error";

export const runtime = "nodejs";
export const maxDuration = 30;

const saveSchema = z.object({
  session: z.record(z.unknown()),
  questions: z.array(z.record(z.unknown())).optional(),
  completed: z.boolean().optional(),
  score: z.number().optional(),
});

export async function POST(req: Request) {
  const { requireStudyApi } = await import("@/lib/api-access");
  const premium = await requireStudyApi();
  if (!premium.ok) return premium.response;

  try {
    const body = saveSchema.parse(await req.json());
    const session = body.session as {
      sessionId: string;
      sourceType: string;
      sourceId?: string;
      field: string;
      subjectId?: string;
      mode: string;
    };

    await prisma.studySession.upsert({
      where: { id: session.sessionId },
      create: {
        id: session.sessionId,
        userId: premium.userId,
        sourceType: session.sourceType,
        sourceId: session.sourceId ?? null,
        fieldId: session.field,
        subjectId: session.subjectId ?? null,
        mode: session.mode,
        stateJson: JSON.stringify({ session: body.session, questions: body.questions }),
        completed: body.completed ?? false,
        score: body.score ?? null,
      },
      update: {
        stateJson: JSON.stringify({ session: body.session, questions: body.questions }),
        completed: body.completed ?? false,
        score: body.score ?? null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid session payload." }, { status: 400 });
    }
    const dbResponse = respondDbUnavailable(error);
    if (dbResponse) return dbResponse;
    console.error("[api/study/session] POST failed:", error);
    return NextResponse.json({ error: "Could not save session." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { requireStudyApi } = await import("@/lib/api-access");
  const premium = await requireStudyApi();
  if (!premium.ok) return premium.response;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  try {
    const row = await prisma.studySession.findFirst({
      where: { id, userId: premium.userId },
    });
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const parsed = JSON.parse(row.stateJson) as Record<string, unknown>;
    return NextResponse.json({ session: parsed, meta: row });
  } catch (error) {
    const dbResponse = respondDbUnavailable(error);
    if (dbResponse) return dbResponse;
    console.error("[api/study/session] GET failed:", error);
    return NextResponse.json({ error: "Could not load session." }, { status: 500 });
  }
}
