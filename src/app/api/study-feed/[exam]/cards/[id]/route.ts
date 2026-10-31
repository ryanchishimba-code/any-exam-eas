import { NextResponse } from "next/server";
import { privateFeedHeaders, requirePanceFeedApi } from "@/lib/pance-feed/api-guard";
import { getStudyFeedCard, loadStudyFeedSvg } from "@/lib/pance-feed/load-cards";
import { isStudyFeedCardId, studyFeedApiBoard } from "@/lib/study-feed/catalog";

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
  const authResult = await requirePanceFeedApi();
  if (!authResult.ok) return authResult.response;
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
