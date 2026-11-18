import { NextResponse } from "next/server";
import {
  getChapterBySlug,
  getPublishedGuide,
} from "@/lib/nclex-study-guide";
import { isStudyGuideExam, usmleGuideStepFromTrack } from "@/lib/nclex-study-guide/guide-registry";
import { requireStudyGuidePremium } from "@/lib/nclex-study-guide/premium-api";
import { loadUsmleBook } from "@/lib/nclex-study-guide/usmle-load";
import { usmleGuideGate } from "@/lib/nclex-study-guide/usmle-guide-access";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ slug: string }> };

/** GET /api/nclex-study-guide/chapters/[slug]?exam=nclex */
export async function GET(req: Request, ctx: Ctx) {
  try {
    const { slug } = await ctx.params;
    const url = new URL(req.url);
    const requested = url.searchParams.get("exam") ?? "nclex";
    if (requested === "usmle") {
      const step = usmleGuideStepFromTrack(url.searchParams.get("step"));
      const gate = await usmleGuideGate();
      if (!step || gate === "hidden") {
        return NextResponse.json({ error: "Guide not found." }, { status: 404 });
      }
      if (gate === "open") {
        const access = await requireStudyGuidePremium(req);
        if (!access.ok) return access.response;
      }
      const loaded = await loadUsmleBook(step, slug);
      if (!loaded.chapter) {
        return NextResponse.json({ error: "Chapter not found." }, { status: 404 });
      }
      return NextResponse.json({
        ok: true,
        guideId: loaded.guideId,
        chapter: loaded.chapter,
      });
    }

    // Same bar as the reader pages (`requirePremiumPage` → hasPremiumAccess).
    // Guests must not receive published chapter HTML from this endpoint.
    const access = await requireStudyGuidePremium(req);
    if (!access.ok) return access.response;

    // Chapter slugs collide across books, so an unknown exam must 404 rather
    // than fall back — otherwise /chapters/endocrine returns the wrong book's.
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
