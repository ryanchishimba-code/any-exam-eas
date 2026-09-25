import { NextResponse } from "next/server";
import { ReadinessCheckError, answerReadinessItem } from "@/lib/learning/readiness-check/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { requireStudyApi } = await import("@/lib/api-access");
  const authResult = await requireStudyApi();
  if (!authResult.ok) return authResult.response;

  let itemId = "";
  let selected: string[] = [];
  try {
    const body = (await req.json()) as { itemId?: unknown; selected?: unknown };
    itemId = typeof body.itemId === "string" ? body.itemId : "";
    selected = Array.isArray(body.selected) ? body.selected.filter((value) => typeof value === "string") : [];
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!itemId) {
    return NextResponse.json({ error: "Missing question." }, { status: 400 });
  }

  try {
    const { resolveReadinessBoard } = await import("@/lib/learning/readiness-check/service");
    const board = await resolveReadinessBoard(authResult.userId);
    if (!board) {
      return NextResponse.json({ error: "Choose an exam first." }, { status: 400 });
    }
    const result = await answerReadinessItem({
      userId: authResult.userId,
      examSlug: board.examSlug,
      itemId,
      selected,
    });
    return NextResponse.json(result, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof ReadinessCheckError) {
      const status = error.code === "no_check" ? 404 : 400;
      return NextResponse.json({ error: error.message, code: error.code }, { status });
    }
    console.error("[readiness] answer", error);
    return NextResponse.json({ error: "Could not save that answer." }, { status: 500 });
  }
}
