import { NextResponse } from "next/server";
import { privateFeedHeaders, requirePanceFeedApi } from "@/lib/pance-feed/api-guard";
import { loadStudyFeedCards } from "@/lib/pance-feed/load-cards";
import { studyFeedApiBoard } from "@/lib/study-feed/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ exam: string }> }
) {
  const { exam } = await ctx.params;
  const board = studyFeedApiBoard(exam);
  if (!board) {
    return NextResponse.json({ error: "Feed not found" }, { status: 404, headers: privateFeedHeaders });
  }
  const authResult = await requirePanceFeedApi();
  if (!authResult.ok) return authResult.response;
  const cards = loadStudyFeedCards(board.exam);
  return NextResponse.json({ total: cards.length, cards }, { headers: privateFeedHeaders });
}
