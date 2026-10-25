import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthenticatedApi } from "@/lib/api-access";
import { canPlayQuickBites } from "@/lib/quick-bites/access";
import {
  getPharmacyQuickBiteBySlug,
  isOpenPharmacyQuickBite,
} from "@/lib/quick-bites/pharmacy-catalog";
import { upsertQuickBiteProgress } from "@/lib/quick-bites/progress-server";

export const runtime = "nodejs";

const bodySchema = z.object({
  watchPct: z.number().min(0).max(100),
  watchSecondsDelta: z.number().min(0).max(120).default(0),
});

export async function POST(
  request: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const episode = getPharmacyQuickBiteBySlug(slug);
  if (!episode) {
    return NextResponse.json({ error: "Episode not found" }, { status: 404 });
  }

  const authResult = await requireAuthenticatedApi(request);
  if (!authResult.ok) return authResult.response;

  const sample = isOpenPharmacyQuickBite(slug);
  if (!sample && !canPlayQuickBites(authResult.access)) {
    return NextResponse.json({ error: "Quick Bites require a paid membership." }, { status: 403 });
  }

  const body = bodySchema.parse(await request.json());
  const progress = await upsertQuickBiteProgress(authResult.userId, slug, body);
  return NextResponse.json({ ok: true, progress });
}
