import { NextResponse } from "next/server";
import { skipReadinessOffer } from "@/lib/learning/readiness-check/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const { requireAuthenticatedApi } = await import("@/lib/api-access");
  const authResult = await requireAuthenticatedApi();
  if (!authResult.ok) return authResult.response;

  try {
    const { resolveReadinessBoard } = await import("@/lib/learning/readiness-check/service");
    const board = await resolveReadinessBoard(authResult.userId);
    if (!board) {
      return NextResponse.json({ error: "Choose an exam first." }, { status: 400 });
    }
    await skipReadinessOffer(authResult.userId, board.examSlug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[readiness] skip", error);
    return NextResponse.json({ error: "Could not save that choice." }, { status: 500 });
  }
}
