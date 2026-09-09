import { NextResponse } from "next/server";
import {
  getChapterBySlug,
  getPublishedGuide,
} from "@/lib/nclex-study-guide";
import { isStudyGuideExam } from "@/lib/nclex-study-guide/guide-registry";
import { requirePremiumApi } from "@/lib/api-access";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ slug: string }> };

/** GET /api/nclex-study-guide/chapters/[slug]?exam=nclex */
export async function GET(req: Request, ctx: Ctx) {
  try {
    // The reader pages are premium-gated, but this endpoint serves the same
    // chapter HTML and had no check at all — the whole book was readable
    // without an account. Mirror `requirePremiumPage` from the page routes.
    const access = await requirePremiumApi(req);
    if (!access.ok) return access.response;

    const { slug } = await ctx.params;
    // Chapter slugs collide across books, so an unknown exam must 404 rather
    // than fall back — otherwise /chapters/endocrine returns the wrong book's.
    const requested = new URL(req.url).searchParams.get("exam") ?? "nclex";
    if (!isStudyGuideExam(requested)) {
      return NextResponse.json(
        { error: `No study guide for exam "${requested}".`, code: "SG_EXAM_UNKNOWN" },
        { status: 404 }
      );
    }
    const guide = await getPublishedGuide(requested);
    if (!guide) {
      return NextResponse.json({ error: "Guide missing." }, { status: 404 });
    }
    const chapter = await getChapterBySlug(guide.id, slug, requested);
    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, guideId: guide.id, chapter });
  } catch (e) {
    console.error("[sg/chapter]", e);
    return NextResponse.json({ error: "Could not load chapter." }, { status: 500 });
  }
}
