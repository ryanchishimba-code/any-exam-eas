import { NextResponse } from "next/server";
import { privateFeedHeaders, requirePanceFeedApi } from "@/lib/pance-feed/api-guard";
import { getPanceFeedCard, loadPanceFeedSvg } from "@/lib/pance-feed/load-cards";
import { isPanceFeedCardId } from "@/lib/pance-feed/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const authResult = await requirePanceFeedApi();
  if (!authResult.ok) return authResult.response;

  const { id } = await ctx.params;
  if (!isPanceFeedCardId(id)) {
    return NextResponse.json({ error: "Card not found" }, { status: 404, headers: privateFeedHeaders });
  }
  const card = getPanceFeedCard(id);
  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404, headers: privateFeedHeaders });
  }
  const svg = loadPanceFeedSvg(id);
  return NextResponse.json({ ...card, svg: svg ?? null }, { headers: privateFeedHeaders });
}
