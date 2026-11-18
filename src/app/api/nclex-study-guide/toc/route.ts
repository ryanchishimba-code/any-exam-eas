import { NextResponse } from "next/server";
import {
  getGuideToc,
  getPublishedGuide,
  getPublishedUsmleGuide,
} from "@/lib/nclex-study-guide";
import { isStudyGuideExam, isUsmleStudyStep, usmleStudyBook } from "@/lib/nclex-study-guide/guide-registry";
import { requireStudyGuidePremium } from "@/lib/nclex-study-guide/premium-api";
import { usmleStudyGuideVisibility } from "@/lib/nclex-study-guide/usmle-guide-access";

export const runtime = "nodejs";

/** GET /api/nclex-study-guide/toc?exam=nclex */
export async function GET(req: Request) {
  try {
    // No fallback to the NCLEX guide on an unknown exam: silently serving the
    // wrong book is worse than a 404, and the client always knows its exam.
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
        return NextResponse.json(
          { error: "Study guide not found. Run migrations / ingest.", code: "SG_GUIDE_MISSING" },
          { status: 404 }
        );
      }
      const chapters = await getGuideToc(guide.id);
      return NextResponse.json({
        ok: true,
        guide: {
          id: guide.id,
          title: guide.title,
          examSlug: guide.examSlug,
          examTrack: guide.examTrack,
          edition: guide.edition,
          version: guide.version,
        },
        chapters,
        guideId: guide.id,
      });
    }

    // Same bar as the reader pages. TOC is part of the premium book.
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
      return NextResponse.json(
        { error: "Study guide not found. Run migrations / ingest.", code: "SG_GUIDE_MISSING" },
        { status: 404 }
      );
    }
    const chapters = await getGuideToc(guide.id);
    return NextResponse.json({
      ok: true,
      guide: {
        id: guide.id,
        title: guide.title,
        examSlug: guide.examSlug,
        examTrack: guide.examTrack,
        edition: guide.edition,
        version: guide.version,
      },
      chapters,
      guideId: guide.id,
    });
  } catch (e) {
    console.error("[sg/toc]", e);
    return NextResponse.json({ error: "Could not load table of contents." }, { status: 500 });
  }
}
