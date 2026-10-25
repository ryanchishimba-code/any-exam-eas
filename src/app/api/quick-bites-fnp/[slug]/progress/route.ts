import { NextResponse } from "next/server";
import { requireAuthenticatedApi } from "@/lib/api-access";
import { canPlayQuickBites } from "@/lib/quick-bites/access";
import { getFnpQuickBiteBySlug } from "@/lib/quick-bites/fnp-catalog";
import { quickBiteProgressBodySchema } from "@/lib/quick-bites/progress-body";
import { upsertQuickBiteProgress } from "@/lib/quick-bites/progress-server";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const episode = getFnpQuickBiteBySlug(slug);
  if (!episode) {
    return NextResponse.json({ error: "Episode not found" }, { status: 404 });
  }

  const authResult = await requireAuthenticatedApi(request);
  if (!authResult.ok) return authResult.response;

  if (!canPlayQuickBites(authResult.access)) {
    return NextResponse.json({ error: "Quick Bites require a paid membership." }, { status: 403 });
  }

  const body = quickBiteProgressBodySchema.parse(await request.json());
  const progress = await upsertQuickBiteProgress(authResult.userId, slug, body);
  return NextResponse.json({ ok: true, progress });
}
