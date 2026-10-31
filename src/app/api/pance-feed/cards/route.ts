import { NextResponse } from "next/server";
import { privateFeedHeaders, requirePanceFeedApi } from "@/lib/pance-feed/api-guard";
import { loadPanceFeedCards } from "@/lib/pance-feed/load-cards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Card text for a paid session. SVGs load from the per-card route. Never public. */
export async function GET() {
  const authResult = await requirePanceFeedApi();
  if (!authResult.ok) return authResult.response;

  const cards = loadPanceFeedCards();
  return NextResponse.json(
    { total: cards.length, cards },
    { headers: privateFeedHeaders }
  );
}
