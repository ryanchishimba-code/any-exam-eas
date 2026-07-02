import { NextResponse } from "next/server";
import { and, eq, lte } from "drizzle-orm";
import { requireDb } from "@/db";
import { flashcards } from "@/db/schema";
import { requireProFeatureApi } from "@/lib/api-access";
import { respondDbUnavailable } from "@/lib/api-db-error";
import { withDrizzle } from "@/lib/db-resilience";
import { scheduleReview, type ReviewGrade } from "@/lib/flashcards/fsrs";
import { createId } from "@/lib/id";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(req: Request) {
  try {
    const authResult = await requireProFeatureApi("spaced_repetition", req);
    if (!authResult.ok) return authResult.response;

    const examType = new URL(req.url).searchParams.get("examType") ?? "top500";
    const db = requireDb();
    const due = await withDrizzle("flashcards.due", () =>
      db
        .select()
        .from(flashcards)
        .where(
          and(
            eq(flashcards.userId, authResult.userId),
            eq(flashcards.examType, examType),
            lte(flashcards.dueDate, new Date())
          )
        )
        .limit(50)
    );

    return NextResponse.json({ cards: due });
  } catch (error) {
    const dbResponse = respondDbUnavailable(error);
    if (dbResponse) return dbResponse;
    console.error("[api/flashcards] GET failed:", error);
    return NextResponse.json({ error: "Could not load flashcards." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authResult = await requireProFeatureApi("spaced_repetition", req);
    if (!authResult.ok) return authResult.response;

    const body = await req.json();
    const db = requireDb();
    const now = new Date();

    if (body.action === "review" && body.cardId && body.grade) {
      const [card] = await withDrizzle("flashcards.get", () =>
        db
          .select()
          .from(flashcards)
          .where(
            and(eq(flashcards.id, body.cardId), eq(flashcards.userId, authResult.userId))
          )
          .limit(1)
      );

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

      await withDrizzle("flashcards.review", () =>
        db
          .update(flashcards)
          .set({
            interval: next.interval,
            easeFactor: next.easeFactor,
            repetitions: next.repetitions,
            dueDate: next.dueDate,
            updatedAt: now,
          })
          .where(eq(flashcards.id, card.id))
      );

      return NextResponse.json({ ok: true, next });
    }

    const id = createId();
    await withDrizzle("flashcards.create", () =>
      db.insert(flashcards).values({
        id,
        userId: authResult.userId,
        examType: body.examType ?? "top500",
        front: String(body.front ?? ""),
        back: String(body.back ?? ""),
        topic: body.topic,
        dueDate: now,
        createdAt: now,
        updatedAt: now,
      })
    );

    return NextResponse.json({ id });
  } catch (error) {
    const dbResponse = respondDbUnavailable(error);
    if (dbResponse) return dbResponse;
    console.error("[api/flashcards] POST failed:", error);
    return NextResponse.json({ error: "Could not save flashcard." }, { status: 500 });
  }
}
