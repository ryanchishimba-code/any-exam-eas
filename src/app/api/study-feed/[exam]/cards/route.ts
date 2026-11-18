import { NextResponse } from "next/server";
import { privateFeedHeaders, requireFlashcardFeedRead } from "@/lib/pance-feed/api-guard";
import { loadStudyFeedCards } from "@/lib/pance-feed/load-cards";
import { feedCardsPayload } from "@/lib/pance-feed/trial-slice";
import { studyFeedApiBoard } from "@/lib/study-feed/catalog";
import { isUsmleFeedStep } from "@/lib/study-feed/usmle-feed";

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
  if (isUsmleFeedStep(board.exam)) {
    const { usmleFeedGate } = await import("@/lib/study-feed/usmle-feed-access");
    if ((await usmleFeedGate(board.exam)) === "hidden") {
      return NextResponse.json({ error: "Feed not found" }, { status: 404, headers: privateFeedHeaders });
    }
  }
  const authResult = await requireFlashcardFeedRead();
  if (!authResult.ok) return authResult.response;
  const cards = loadStudyFeedCards(board.exam);
  return NextResponse.json(feedCardsPayload(cards, authResult.level), { headers: privateFeedHeaders });
}
