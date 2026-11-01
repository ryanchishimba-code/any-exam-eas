import { NextResponse } from "next/server";
import { privateFeedHeaders, requireFlashcardFeedRead } from "@/lib/pance-feed/api-guard";
import { getPanceFeedCard, loadPanceFeedCards, loadPanceFeedSvg } from "@/lib/pance-feed/load-cards";
import { isPanceFeedCardId } from "@/lib/pance-feed/format";
import { isTrialFlashcardAllowed } from "@/lib/pance-feed/trial-slice";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const authResult = await requireFlashcardFeedRead();
  if (!authResult.ok) return authResult.response;

  const { id } = await ctx.params;
  if (!isPanceFeedCardId(id)) {
    return NextResponse.json({ error: "Card not found" }, { status: 404, headers: privateFeedHeaders });
  }
  const ids = loadPanceFeedCards().map((card) => card.id);
  if (!ids.includes(id)) {
    return NextResponse.json({ error: "Card not found" }, { status: 404, headers: privateFeedHeaders });
  }
  if (authResult.level === "trial" && !isTrialFlashcardAllowed(ids, id)) {
    return NextResponse.json(
      { error: "A paid plan is required for this card.", code: "FEED_CARD_LOCKED" },
      { status: 403, headers: privateFeedHeaders }
    );
  }
  const card = getPanceFeedCard(id);
  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404, headers: privateFeedHeaders });
  }
  const svg = loadPanceFeedSvg(id);
  return NextResponse.json({ ...card, svg: svg ?? null }, { headers: privateFeedHeaders });
}
