import { NextResponse } from "next/server";
import {
  getChapterBySlug,
  getPublishedGuide,
} from "@/lib/nclex-study-guide";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ slug: string }> };

/** GET /api/nclex-study-guide/chapters/[slug] */
export async function GET(req: Request, ctx: Ctx) {
  try {
    const { slug } = await ctx.params;
    const track = new URL(req.url).searchParams.get("track") === "pn" ? "pn" : "rn";
    const guide = (await getPublishedGuide(track)) ?? (await getPublishedGuide("rn"));
    if (!guide) {
      return NextResponse.json({ error: "Guide missing." }, { status: 404 });
    }
    const chapter = await getChapterBySlug(guide.id, slug);
    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, guideId: guide.id, chapter });
  } catch (e) {
    console.error("[sg/chapter]", e);
    return NextResponse.json({ error: "Could not load chapter." }, { status: 500 });
  }
}
