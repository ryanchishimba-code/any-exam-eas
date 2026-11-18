import { NextResponse } from "next/server";
import {
  getChapterBySlug,
  getPublishedGuide,
  getPublishedUsmleGuide,
} from "@/lib/nclex-study-guide";
import { isStudyGuideExam, isUsmleStudyStep, usmleStudyBook } from "@/lib/nclex-study-guide/guide-registry";
import { requireStudyGuidePremium } from "@/lib/nclex-study-guide/premium-api";
import { usmleStudyGuideVisibility } from "@/lib/nclex-study-guide/usmle-guide-access";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ slug: string }> };

/** GET /api/nclex-study-guide/chapters/[slug]?exam=nclex */
export async function GET(req: Request, ctx: Ctx) {
  try {
    const { slug } = await ctx.params;
    // Chapter slugs collide across books, so an unknown exam must 404 rather
    // than fall back — otherwise /chapters/endocrine returns the wrong book's.
    const url = new URL(req.url);
    const requested = url.searchParams.get("exam") ?? "nclex";
    if (requested === "usmle") {
      const step = url.searchParams.get("step");
      if (!isUsmleStudyStep(step)) {
        return NextResponse.json(
          { error: "USMLE study guide requires a step.", code: "SG_EXAM_UNKNOWN" },
          { status: 404 }
        );
      }
      const visibility = await usmleStudyGuideVisibility();
      if (visibility === "hidden") {
        return NextResponse.json({ error: "Not found." }, { status: 404 });
      }
      if (visibility === "open") {
        const access = await requireStudyGuidePremium(req);
        if (!access.ok) return access.response;
      }
      const book = usmleStudyBook(step);
      const guide = await getPublishedUsmleGuide(book);
      if (!guide) {
        return NextResponse.json({ error: "Guide missing." }, { status: 404 });
      }
      const chapter = await getChapterBySlug(guide.id, slug, "usmle");
      if (!chapter) {
        return NextResponse.json({ error: "Chapter not found." }, { status: 404 });
      }
      return NextResponse.json({ ok: true, guideId: guide.id, chapter });
    }

    // Same bar as the reader pages (`requirePremiumPage` → hasPremiumAccess).
    // Guests must not receive published chapter HTML from this endpoint.
    const access = await requireStudyGuidePremium(req);
    if (!access.ok) return access.response;

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
