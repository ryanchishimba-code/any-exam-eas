import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireUsmleVideoPlayer } from "@/lib/quick-bites/usmle-video-playback";
import {
  getUsmleVideoQuickBiteBySlug,
  usmleVideoQuickBiteCaptionsPath,
  usmleVideoQuickBiteVideoPath,
} from "@/lib/quick-bites/usmle-video-catalog";
import { signPrivateQuickBiteGet } from "@/lib/quick-bites/sign-media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const gate = await requireUsmleVideoPlayer(request);
  if (!gate.ok) return gate.response;

  const episode = getUsmleVideoQuickBiteBySlug(slug);
  if (!episode || episode.held) {
    return NextResponse.json({ error: "Episode not found" }, { status: 404 });
  }

  const part = new URL(request.url).searchParams.get("part");
  if (part === "captions") {
    try {
      const result = await get(usmleVideoQuickBiteCaptionsPath(episode.slug), { access: "private" });
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
        "[quick-bites-usmle] captions failed:",
        error instanceof Error ? error.message : error
      );
      return NextResponse.json({ error: "Captions are temporarily unavailable." }, { status: 503 });
    }
  }

  if (part) {
    return NextResponse.json({ error: "Unknown media part" }, { status: 400 });
  }

  try {
    const videoUrl = await signPrivateQuickBiteGet(usmleVideoQuickBiteVideoPath(episode.slug));
    return NextResponse.json(
      {
        videoUrl,
        captionsUrl: `/api/quick-bites-usmle/${episode.slug}/media?part=captions`,
      },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error(
      "[quick-bites-usmle] sign failed:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json({ error: "Video is temporarily unavailable." }, { status: 503 });
  }
}
