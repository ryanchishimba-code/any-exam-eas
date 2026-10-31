import { NextResponse } from "next/server";
import { privateFeedHeaders, requirePanceFeedApi } from "@/lib/pance-feed/api-guard";
import { loadStudyFeedCards } from "@/lib/pance-feed/load-cards";
import { readExamFeedProgress, writeExamFeedProgress } from "@/lib/pance-feed/progress-store";
import { studyFeedApiBoard, type StudyFeedExam } from "@/lib/study-feed/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function knownIds(exam: StudyFeedExam): Set<string> {
  return new Set(loadStudyFeedCards(exam).map((card) => card.id));
}

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ exam: string }> }
) {
  const { exam } = await ctx.params;
  const board = studyFeedApiBoard(exam);
  if (!board || board.exam === "pance") {
    return NextResponse.json({ error: "Feed not found" }, { status: 404, headers: privateFeedHeaders });
  }
  const authResult = await requirePanceFeedApi();
  if (!authResult.ok) return authResult.response;
  const progress = await readExamFeedProgress(board.exam, authResult.userId, knownIds(board.exam));
  return NextResponse.json(progress, { headers: privateFeedHeaders });
}

export async function PUT(
  request: Request,
  ctx: { params: Promise<{ exam: string }> }
) {
  const { exam } = await ctx.params;
  const board = studyFeedApiBoard(exam);
  if (!board || board.exam === "pance") {
    return NextResponse.json({ error: "Feed not found" }, { status: 404, headers: privateFeedHeaders });
  }
  const authResult = await requirePanceFeedApi();
  if (!authResult.ok) return authResult.response;
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const progress = await writeExamFeedProgress(
    board.exam,
    authResult.userId,
    knownIds(board.exam),
    body
  );
  return NextResponse.json(progress, { headers: privateFeedHeaders });
}
