import { NextResponse } from "next/server";
import { privateFeedHeaders, requireFlashcardFeedRead } from "@/lib/pance-feed/api-guard";
import { loadPanceFeedCards } from "@/lib/pance-feed/load-cards";
import { feedCardsPayload } from "@/lib/pance-feed/trial-slice";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Card text for a paid session. SVGs load from the per-card route. Never public. */
export async function GET() {
  const authResult = await requireFlashcardFeedRead();
  if (!authResult.ok) return authResult.response;

  return NextResponse.json(feedCardsPayload(loadPanceFeedCards(), authResult.level), {
    headers: privateFeedHeaders,
  });
}
