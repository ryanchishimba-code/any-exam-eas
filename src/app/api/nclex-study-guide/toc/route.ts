import { NextResponse } from "next/server";
import {
  getGuideToc,
  getPublishedGuide,
} from "@/lib/nclex-study-guide";
import { isStudyGuideExam } from "@/lib/nclex-study-guide/guide-registry";

export const runtime = "nodejs";

/** GET /api/nclex-study-guide/toc?exam=nclex */
export async function GET(req: Request) {
  try {
    // No fallback to the NCLEX guide on an unknown exam: silently serving the
    // wrong book is worse than a 404, and the client always knows its exam.
    const requested = new URL(req.url).searchParams.get("exam") ?? "nclex";
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
