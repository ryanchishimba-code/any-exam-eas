import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAuthenticatedApi } from "@/lib/api-access";
import { canPlayQuickBites } from "@/lib/quick-bites/access";
import {
  getQuickBiteBySlug,
  isQuickBiteHeld,
  quickBiteCaptionsPath,
  quickBiteVideoPath,
} from "@/lib/quick-bites/catalog";
import { signPrivateQuickBiteGet } from "@/lib/quick-bites/sign-media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCKED = {
  error: "A paid membership is required to watch Video Quick Bites.",
  code: "QUICK_BITES_LOCKED",
} as const;

export async function GET(
  request: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const authResult = await requireAuthenticatedApi(request);
  if (!authResult.ok) return authResult.response;

  if (!canPlayQuickBites(authResult.access)) {
    return NextResponse.json(LOCKED, { status: 403 });
  }

  const { slug } = await ctx.params;
  const episode = getQuickBiteBySlug(slug);
  if (!episode || isQuickBiteHeld(slug)) {
    return NextResponse.json({ error: "Episode not found" }, { status: 404 });
  }

  const part = new URL(request.url).searchParams.get("part");
  if (part === "captions") {
    try {
      const result = await get(quickBiteCaptionsPath(episode.slug), { access: "private" });
      if (!result || result.statusCode !== 200) {
        return NextResponse.json({ error: "Captions not found" }, { status: 404 });
      }
      return new NextResponse(result.stream, {
        headers: {
          "Content-Type": "text/vtt; charset=utf-8",
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (error) {
      console.error(
        "[quick-bites] captions failed:",
        error instanceof Error ? error.message : error
      );
      return NextResponse.json({ error: "Captions are temporarily unavailable." }, { status: 503 });
    }
  }

  if (part) {
    return NextResponse.json({ error: "Unknown media part" }, { status: 400 });
  }

  try {
    const videoUrl = await signPrivateQuickBiteGet(quickBiteVideoPath(episode.slug));
    return NextResponse.json(
      {
        videoUrl,
        captionsUrl: `/api/quick-bites/${episode.slug}/media?part=captions`,
      },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error(
      "[quick-bites] sign failed:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json({ error: "Video is temporarily unavailable." }, { status: 503 });
  }
}
