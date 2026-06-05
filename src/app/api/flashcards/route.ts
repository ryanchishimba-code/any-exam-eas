import { NextResponse } from "next/server";
import { and, eq, lte } from "drizzle-orm";
import { auth } from "@/auth";
import { requireDb } from "@/db";
import { flashcards } from "@/db/schema";
import { createId } from "@/lib/id";
import { scheduleReview, type ReviewGrade } from "@/lib/flashcards/fsrs";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const examType = new URL(req.url).searchParams.get("examType") ?? "top500";
  const db = requireDb();
  const due = await db
    .select()
    .from(flashcards)
    .where(
      and(
        eq(flashcards.userId, session.user.id),
        eq(flashcards.examType, examType),
        lte(flashcards.dueDate, new Date())
      )
    )
    .limit(50);

  return NextResponse.json({ cards: due });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const db = requireDb();
  const now = new Date();

  if (body.action === "review" && body.cardId && body.grade) {
    const [card] = await db
      .select()
      .from(flashcards)
      .where(
        and(eq(flashcards.id, body.cardId), eq(flashcards.userId, session.user.id))
      )
      .limit(1);

    if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const next = scheduleReview(
      {
        interval: card.interval,
        easeFactor: card.easeFactor,
        repetitions: card.repetitions,
        dueDate: card.dueDate,
      },
      Math.min(5, Math.max(1, Number(body.grade))) as ReviewGrade
    );

    await db
      .update(flashcards)
      .set({
        interval: next.interval,
        easeFactor: next.easeFactor,
        repetitions: next.repetitions,
        dueDate: next.dueDate,
        updatedAt: now,
      })
      .where(eq(flashcards.id, card.id));

    return NextResponse.json({ ok: true, next });
  }

  const id = createId();
  await db.insert(flashcards).values({
    id,
    userId: session.user.id,
    examType: body.examType ?? "top500",
    front: String(body.front ?? ""),
    back: String(body.back ?? ""),
    topic: body.topic,
    dueDate: now,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ id });
}
