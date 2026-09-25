import { NextResponse } from "next/server";
import { ReadinessCheckError, loadReadinessPrompt, startReadinessCheck } from "@/lib/learning/readiness-check/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  const { requireStudyApi } = await import("@/lib/api-access");
  const authResult = await requireStudyApi();
  if (!authResult.ok) return authResult.response;

  try {
    const { resolveReadinessBoard } = await import("@/lib/learning/readiness-check/service");
    const board = await resolveReadinessBoard(authResult.userId);
    if (!board) {
      return NextResponse.json({ error: "Choose an exam first." }, { status: 400 });
    }
    const prompt = await loadReadinessPrompt(authResult.userId, board.examSlug);
    return NextResponse.json(prompt, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof ReadinessCheckError && error.code === "no_check") {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 404 });
    }
    console.error("[readiness] prompt", error);
    return NextResponse.json({ error: "Could not open the check." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { requireStudyApi } = await import("@/lib/api-access");
  const authResult = await requireStudyApi();
  if (!authResult.ok) return authResult.response;

  let restart = false;
  try {
    const body = (await req.json()) as { restart?: unknown };
    restart = body?.restart === true;
  } catch {
    restart = false;
  }

  try {
    const { resolveReadinessBoard } = await import("@/lib/learning/readiness-check/service");
    const board = await resolveReadinessBoard(authResult.userId);
    if (!board) {
      return NextResponse.json({ error: "Choose an exam first." }, { status: 400 });
    }
    const started = await startReadinessCheck({
      userId: authResult.userId,
      examSlug: board.examSlug,
      fieldId: board.fieldId,
      restart,
    });
    return NextResponse.json(started, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof ReadinessCheckError) {
      const status = error.code === "thin_bank" ? 409 : 400;
      return NextResponse.json({ error: error.message, code: error.code }, { status });
    }
    console.error("[readiness] start", error);
    return NextResponse.json({ error: "Could not start the check." }, { status: 500 });
  }
}
