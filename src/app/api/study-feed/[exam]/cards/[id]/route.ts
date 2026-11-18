import { NextResponse } from "next/server";
import { privateFeedHeaders, requireFlashcardFeedRead } from "@/lib/pance-feed/api-guard";
import { getStudyFeedCard, loadStudyFeedCards, loadStudyFeedSvg } from "@/lib/pance-feed/load-cards";
import { isTrialFlashcardAllowed } from "@/lib/pance-feed/trial-slice";
import { isStudyFeedCardId, studyFeedApiBoard } from "@/lib/study-feed/catalog";
import { isUsmleFeedStep } from "@/lib/study-feed/usmle-feed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ exam: string; id: string }> }
) {
  const { exam, id } = await ctx.params;
  const board = studyFeedApiBoard(exam);
  if (!board || !isStudyFeedCardId(board.idPrefix, id)) {
    return NextResponse.json({ error: "Card not found" }, { status: 404, headers: privateFeedHeaders });
  }
  if (isUsmleFeedStep(board.exam)) {
    const { usmleFeedGate } = await import("@/lib/study-feed/usmle-feed-access");
    if ((await usmleFeedGate(board.exam)) === "hidden") {
      return NextResponse.json({ error: "Card not found" }, { status: 404, headers: privateFeedHeaders });
    }
  }
  const authResult = await requireFlashcardFeedRead();
  if (!authResult.ok) return authResult.response;
  const ids = loadStudyFeedCards(board.exam).map((card) => card.id);
  if (!ids.includes(id)) {
    return NextResponse.json({ error: "Card not found" }, { status: 404, headers: privateFeedHeaders });
  }
  if (authResult.level === "trial" && !isTrialFlashcardAllowed(ids, id)) {
    return NextResponse.json(
      { error: "A paid plan is required for this card.", code: "FEED_CARD_LOCKED" },
      { status: 403, headers: privateFeedHeaders }
    );
  }
  const card = getStudyFeedCard(board.exam, id);
  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404, headers: privateFeedHeaders });
  }
  // A missing graphic is a text-only card, not a missing card. Returning 404
  // made the feed request a broken image for every NCLEX and NAPLEX card
  // that has no svg file.
  const svg = loadStudyFeedSvg(board.exam, id);
  return NextResponse.json({ ...card, svg: svg ?? null }, { headers: privateFeedHeaders });
}
