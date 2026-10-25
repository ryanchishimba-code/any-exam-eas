import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAuthenticatedApi } from "@/lib/api-access";
import { canPlayQuickBites } from "@/lib/quick-bites/access";
import {
  fnpQuickBiteCaptionsPath,
  fnpQuickBiteVideoPath,
  getFnpQuickBiteBySlug,
} from "@/lib/quick-bites/fnp-catalog";
import { signPrivateQuickBiteGet } from "@/lib/quick-bites/sign-media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCKED = {
  error: "A paid membership is required to watch Quick Bites: FNP.",
  code: "FNP_QUICK_BITES_LOCKED",
} as const;

export async function GET(
  request: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const episode = getFnpQuickBiteBySlug(slug);

  const authResult = await requireAuthenticatedApi(request);
  if (!authResult.ok) return authResult.response;
  if (!canPlayQuickBites(authResult.access)) {
    return NextResponse.json(LOCKED, { status: 403 });
  }

  if (!episode || episode.held) {
    return NextResponse.json({ error: "Episode not found" }, { status: 404 });
  }

  const part = new URL(request.url).searchParams.get("part");
  if (part === "captions") {
    try {
      const result = await get(fnpQuickBiteCaptionsPath(episode.slug), { access: "private" });
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
        "[quick-bites-fnp] captions failed:",
        error instanceof Error ? error.message : error
      );
      return NextResponse.json({ error: "Captions are temporarily unavailable." }, { status: 503 });
    }
  }

  if (part) {
    return NextResponse.json({ error: "Unknown media part" }, { status: 400 });
  }

  try {
    const videoUrl = await signPrivateQuickBiteGet(fnpQuickBiteVideoPath(episode.slug));
    return NextResponse.json(
      {
        videoUrl,
        captionsUrl: `/api/quick-bites-fnp/${episode.slug}/media?part=captions`,
      },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error(
      "[quick-bites-fnp] sign failed:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json({ error: "Video is temporarily unavailable." }, { status: 503 });
  }
}
