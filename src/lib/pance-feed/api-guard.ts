import { NextResponse } from "next/server";
import { requireAuthenticatedApi, type ApiAuthResult } from "@/lib/api-access";
import { canUsePanceFeed, flashcardFeedLevel, type FlashcardFeedLevel } from "@/lib/pance-feed/access";

export const PANCE_FEED_LOCKED = {
  error: "A paid plan is required for this feed.",
  code: "PANCE_FEED_LOCKED",
} as const;

export const privateFeedHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
} as const;

export async function requirePanceFeedApi(): Promise<ApiAuthResult> {
  const authResult = await requireAuthenticatedApi();
  if (!authResult.ok) return authResult;
  if (!canUsePanceFeed(authResult.access)) {
    return {
      ok: false,
      response: NextResponse.json(PANCE_FEED_LOCKED, {
        status: 403,
        headers: privateFeedHeaders,
      }),
    };
  }
  return authResult;
}

export type FlashcardFeedAuth =
  | { ok: true; userId: string; level: Exclude<FlashcardFeedLevel, "locked"> }
  | { ok: false; response: NextResponse };

/** Full deck, or the trial slice. Post-trial free accounts stay locked. No writes. */
export async function requireFlashcardFeedRead(): Promise<FlashcardFeedAuth> {
  const authResult = await requireAuthenticatedApi();
  if (!authResult.ok) return authResult;
  const level = flashcardFeedLevel(authResult.access);
  if (level === "locked") {
    return {
      ok: false,
      response: NextResponse.json(PANCE_FEED_LOCKED, {
        status: 403,
        headers: privateFeedHeaders,
      }),
    };
  }
  return { ok: true, userId: authResult.userId, level };
}
