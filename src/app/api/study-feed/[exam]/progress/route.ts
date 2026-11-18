import { NextResponse } from "next/server";
import { privateFeedHeaders, requirePanceFeedApi } from "@/lib/pance-feed/api-guard";
import { loadStudyFeedCards } from "@/lib/pance-feed/load-cards";
import { readExamFeedProgress, writeExamFeedProgress } from "@/lib/pance-feed/progress-store";
import { studyFeedApiBoard, type FeedCatalogExam } from "@/lib/study-feed/catalog";
import { isUsmleFeedStep } from "@/lib/study-feed/usmle-feed";
import { sanitizeProgress } from "@/lib/pance-feed/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function knownIds(exam: FeedCatalogExam): Set<string> {
  return new Set(loadStudyFeedCards(exam).map((card) => card.id));
}

/** Hidden USMLE decks 404 for everyone except an admin preview. Preview does not persist. */
async function usmleAccess(exam: string): Promise<"open" | "preview" | NextResponse> {
  if (!isUsmleFeedStep(exam)) return "open";
  const { usmleFeedGate } = await import("@/lib/study-feed/usmle-feed-access");
  const gate = await usmleFeedGate(exam);
  if (gate === "hidden") {
    return NextResponse.json({ error: "Feed not found" }, { status: 404, headers: privateFeedHeaders });
  }
  return gate;
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
  const access = await usmleAccess(exam);
  if (access instanceof NextResponse) return access;
  const authResult = await requirePanceFeedApi();
  if (!authResult.ok) return authResult.response;
  if (access === "preview") {
    return NextResponse.json(
      { mastered: [], reviewQueue: [], lastSeenCardId: null, lastSeenAt: null },
      { headers: privateFeedHeaders }
    );
  }
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
  const access = await usmleAccess(exam);
  if (access instanceof NextResponse) return access;
  const authResult = await requirePanceFeedApi();
  if (!authResult.ok) return authResult.response;
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const ids = knownIds(board.exam);
  if (access === "preview") {
    const clean = sanitizeProgress(body, ids);
    return NextResponse.json({ ...clean, lastSeenAt: null }, { headers: privateFeedHeaders });
  }
  const progress = await writeExamFeedProgress(board.exam, authResult.userId, ids, body);
  return NextResponse.json(progress, { headers: privateFeedHeaders });
}
