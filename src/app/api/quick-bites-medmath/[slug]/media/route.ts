import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import {
  getMedmathEpisode,
  medmathCaptionsPath,
  medmathVideoPath,
} from "@/lib/quick-bites/medmath-catalog";
import { requireMedmathPlayer } from "@/lib/quick-bites/medmath-playback";
import { signPrivateQuickBiteGet } from "@/lib/quick-bites/sign-media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const gate = await requireMedmathPlayer(request);
  if (!gate.ok) return gate.response;

  const episode = getMedmathEpisode(slug);
  if (!episode || episode.held) {
    return NextResponse.json({ error: "Episode not found" }, { status: 404 });
  }

  const part = new URL(request.url).searchParams.get("part");
  if (part === "captions") {
    try {
      const result = await get(medmathCaptionsPath(episode.slug), { access: "private" });
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
      console.error("[quick-bites-medmath] captions failed:", error instanceof Error ? error.message : error);
      return NextResponse.json({ error: "Captions are temporarily unavailable." }, { status: 503 });
    }
  }
  if (part) return NextResponse.json({ error: "Unknown media part" }, { status: 400 });

  try {
    const videoUrl = await signPrivateQuickBiteGet(medmathVideoPath(episode.slug));
    return NextResponse.json(
      { videoUrl, captionsUrl: `/api/quick-bites-medmath/${episode.slug}/media?part=captions` },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("[quick-bites-medmath] sign failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Video is temporarily unavailable." }, { status: 503 });
  }
}
