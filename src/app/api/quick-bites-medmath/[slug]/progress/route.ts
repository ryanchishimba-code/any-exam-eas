import { NextResponse } from "next/server";
import { getMedmathEpisode } from "@/lib/quick-bites/medmath-catalog";
import { requireMedmathPlayer } from "@/lib/quick-bites/medmath-playback";
import { quickBiteProgressBodySchema } from "@/lib/quick-bites/progress-body";
import { upsertQuickBiteProgress } from "@/lib/quick-bites/progress-server";

export const runtime = "nodejs";

export async function POST(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  if (!getMedmathEpisode(slug)) {
    return NextResponse.json({ error: "Episode not found" }, { status: 404 });
  }
  const gate = await requireMedmathPlayer(request);
  if (!gate.ok) return gate.response;
  const body = quickBiteProgressBodySchema.parse(await request.json());
  const progress = await upsertQuickBiteProgress(gate.userId, slug, body);
  return NextResponse.json({ ok: true, progress });
}
