import { NextResponse } from "next/server";
import { requireAuthenticatedApi, type ApiAuthResult } from "@/lib/api-access";
import { canUsePanceFeed } from "@/lib/pance-feed/access";

export const PANCE_FEED_LOCKED = {
  error: "A paid plan is required for the PANCE feed.",
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
