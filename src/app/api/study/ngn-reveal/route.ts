import { NextResponse } from "next/server";
import { z } from "zod";
import { explainPointsLost } from "@/lib/assessment/scoring/registry";
import { gradeNgnResponse } from "@/lib/assessment/attempt-grade";
import { studentRevealedItem } from "@/lib/assessment/serve";
import { openStudentRef } from "@/lib/assessment/student-item-ref";
import { findServedItem } from "@/lib/assessment/serve-db";

export const runtime = "nodejs";

const bodySchema = z.object({
  itemId: z.string().trim().min(1).max(500),
  version: z.number().int().positive(),
  response: z.unknown(),
});

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
    if (!ref || ref.version !== parsed.data.version) {
      return NextResponse.json({ error: "This item is not available." }, { status: 404 });
    }
    const item = await findServedItem(ref.id, ref.version);
    if (!item) {
      return NextResponse.json({ error: "This item is not available." }, { status: 404 });
    }
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
  } catch (error) {
    console.error("[ngn-reveal]", error);
    return NextResponse.json({ error: "Could not score this item." }, { status: 500 });
  }
}
