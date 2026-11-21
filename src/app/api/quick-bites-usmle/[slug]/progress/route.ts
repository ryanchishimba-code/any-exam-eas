import { NextResponse } from "next/server";
import { quickBiteProgressBodySchema } from "@/lib/quick-bites/progress-body";
import { upsertQuickBiteProgress } from "@/lib/quick-bites/progress-server";
import { requireUsmleVideoPlayer } from "@/lib/quick-bites/usmle-video-playback";
import { getUsmleVideoQuickBiteBySlug } from "@/lib/quick-bites/usmle-video-catalog";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const episode = getUsmleVideoQuickBiteBySlug(slug);
  if (!episode) {
    return NextResponse.json({ error: "Episode not found" }, { status: 404 });
  }

  const gate = await requireUsmleVideoPlayer(request);
  if (!gate.ok) return gate.response;

  const body = quickBiteProgressBodySchema.parse(await request.json());
  const progress = await upsertQuickBiteProgress(gate.userId, slug, body);
  return NextResponse.json({ ok: true, progress });
}
