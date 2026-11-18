import { NextResponse } from "next/server";
import {
  getGuideToc,
  getPublishedGuide,
} from "@/lib/nclex-study-guide";
import { isStudyGuideExam, usmleGuideStepFromTrack } from "@/lib/nclex-study-guide/guide-registry";
import { requireStudyGuidePremium } from "@/lib/nclex-study-guide/premium-api";
import { loadUsmleBook } from "@/lib/nclex-study-guide/usmle-load";
import { usmleGuideGate } from "@/lib/nclex-study-guide/usmle-guide-access";

export const runtime = "nodejs";

/** GET /api/nclex-study-guide/toc?exam=nclex */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const requested = url.searchParams.get("exam") ?? "nclex";
    if (requested === "usmle") {
      const step = usmleGuideStepFromTrack(url.searchParams.get("step"));
      const gate = await usmleGuideGate();
      if (!step || gate === "hidden") {
        return NextResponse.json(
          { error: "Study guide not found.", code: "SG_GUIDE_MISSING" },
          { status: 404 }
        );
      }
      if (gate === "open") {
        const access = await requireStudyGuidePremium(req);
        if (!access.ok) return access.response;
      }
      const loaded = await loadUsmleBook(step, null);
      return NextResponse.json({
        ok: true,
        guide: {
          id: loaded.guideId,
          title: loaded.guideTitle,
          examSlug: "usmle",
          examTrack: step,
        },
        chapters: loaded.toc,
      });
    }

    // Same bar as the reader pages. TOC is part of the premium book.
    const access = await requireStudyGuidePremium(req);
    if (!access.ok) return access.response;

    // No fallback to the NCLEX guide on an unknown exam: silently serving the
    // wrong book is worse than a 404, and the client always knows its exam.
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
