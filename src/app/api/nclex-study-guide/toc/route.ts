import { NextResponse } from "next/server";
import {
  DEFAULT_NCLEX_GUIDE_ID,
  getGuideToc,
  getPublishedGuide,
} from "@/lib/nclex-study-guide";

export const runtime = "nodejs";

/** GET /api/nclex-study-guide/toc?track=rn */
export async function GET(req: Request) {
  try {
    const track = new URL(req.url).searchParams.get("track") === "pn" ? "pn" : "rn";
    const guide = (await getPublishedGuide(track)) ?? (await getPublishedGuide("rn"));
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
        examTrack: guide.examTrack,
        edition: guide.edition,
        version: guide.version,
      },
      chapters,
      guideId: guide.id || DEFAULT_NCLEX_GUIDE_ID,
    });
  } catch (e) {
    console.error("[sg/toc]", e);
    return NextResponse.json({ error: "Could not load table of contents." }, { status: 500 });
  }
}
