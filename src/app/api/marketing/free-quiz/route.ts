import { NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import {
  getFreeQuizBank,
  isFreeQuizBoardSlug,
  toPublicFreeQuizPayload,
  type FreeQuizBoardSlug,
} from "@/lib/marketing/free-quiz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PUBLIC_CACHE =
  "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400";

export async function GET(req: Request) {
  const limited = await enforceRateLimit(req, "marketing-free-quiz", 40, 60_000);
  if (limited) return limited;

  const url = new URL(req.url);
  const boardParam = url.searchParams.get("board")?.trim().toLowerCase() ?? "";
  if (!isFreeQuizBoardSlug(boardParam)) {
    return NextResponse.json({ error: "Unknown board." }, { status: 400 });
  }
  const board = boardParam as FreeQuizBoardSlug;

  try {
    const payload = toPublicFreeQuizPayload(await getFreeQuizBank(board));
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": PUBLIC_CACHE,
      },
    });
  } catch (error) {
    console.error("[api/marketing/free-quiz]", error);
    return NextResponse.json({ error: "Quiz unavailable." }, { status: 503 });
  }
}
