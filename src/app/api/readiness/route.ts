import { NextResponse } from "next/server";
import { loadReadinessCard } from "@/lib/learning/readiness-check/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/** Dashboard card payload. No-store so a previous board cannot be replayed from cache. */
export async function GET() {
  const { requireAuthenticatedApi } = await import("@/lib/api-access");
  const authResult = await requireAuthenticatedApi();
  if (!authResult.ok) return authResult.response;

  try {
    const { resolveReadinessBoard } = await import("@/lib/learning/readiness-check/service");
    const board = await resolveReadinessBoard(authResult.userId);
    if (!board) {
      return NextResponse.json({ error: "Choose an exam first." }, { status: 400 });
    }
    const card = await loadReadinessCard({
      userId: authResult.userId,
      examSlug: board.examSlug,
      fieldId: board.fieldId,
      hasStudyAccess: authResult.access.hasStudyAccess,
    });
    return NextResponse.json(card, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("[readiness] card", error);
    return NextResponse.json({ error: "Could not load readiness." }, { status: 500 });
  }
}
