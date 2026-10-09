import { NextResponse } from "next/server";
import { z } from "zod";
import { explainPointsLost } from "@/lib/assessment/scoring/registry";
import { gradeNgnResponse } from "@/lib/assessment/attempt-grade";
import { studentRevealedItem } from "@/lib/assessment/serve";
import { openStudentRef } from "@/lib/assessment/student-item-ref";
import { findServedItem } from "@/lib/assessment/serve-db";
import { revealStoredItem } from "@/lib/questions/reveal-stored-item";

export const runtime = "nodejs";

const bodySchema = z.object({
  itemId: z.string().trim().min(1).max(2000),
  version: z.number().int().positive(),
  response: z.unknown(),
  options: z.array(z.string().max(4000)).max(80).optional(),
});

function selectedChoices(response: unknown): string[] {
  if (Array.isArray(response)) {
    return response.filter((entry): entry is string => typeof entry === "string");
  }
  if (typeof response === "string" && response.trim()) {
    return response.includes("|||") ? response.split("|||") : [response];
  }
  return [];
}

export async function POST(req: Request) {
  const { requireStudyApi } = await import("@/lib/api-access");
  const premium = await requireStudyApi();
  if (!premium.ok) return premium.response;

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the response and try again." }, { status: 400 });
  }

  try {
    const ref = openStudentRef(parsed.data.itemId);
    if (ref && ref.version === parsed.data.version) {
      const item = await findServedItem(ref.id, ref.version);
      if (item) {
        const grade = gradeNgnResponse(item, parsed.data.response);
        let lines: string[] = [];
        try {
          lines = explainPointsLost(item, parsed.data.response);
        } catch {
          lines = [];
        }
        return NextResponse.json({
          item: studentRevealedItem(item, parsed.data.itemId),
          points: grade.points,
          maxPoints: grade.maxPoints,
          correct: grade.correct,
          lines,
        });
      }
    }

    const revealed = await revealStoredItem({
      itemId: parsed.data.itemId,
      selected: selectedChoices(parsed.data.response),
      options: parsed.data.options,
    });
    if (!revealed) {
      return NextResponse.json({ error: "This item is not available." }, { status: 404 });
    }
    return NextResponse.json({
      points: revealed.correct ? 1 : 0,
      maxPoints: 1,
      correct: revealed.correct,
      lines: [],
      answer: {
        correctAnswer: revealed.correctAnswer,
        explanation: revealed.explanation,
        solutionSteps: revealed.solutionSteps,
        clinicalReasoning: revealed.clinicalReasoning,
        distractorRationale: revealed.distractorRationale,
        expertRationale: revealed.expertRationale,
        ngnPayload: revealed.ngnPayload,
        chartData: revealed.chartData,
      },
    });
  } catch (error) {
    console.error("[ngn-reveal]", error);
    return NextResponse.json({ error: "Could not score this item." }, { status: 500 });
  }
}
