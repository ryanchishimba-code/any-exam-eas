import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOptionalStudyGuideUser, requireStudyGuideUser, isSgHighlightColor } from "@/lib/nclex-study-guide";

export const runtime = "nodejs";

const createSchema = z.object({
  chapterId: z.string().min(1),
  startOffset: z.number().int().min(0),
  endOffset: z.number().int().min(1),
  selectedText: z.string().min(1).max(4000),
  color: z.string().default("yellow"),
});

/** GET /api/nclex-study-guide/highlights?chapterId= */
export async function GET(req: Request) {
  const user = await getOptionalStudyGuideUser();
  if (!user) return NextResponse.json({ ok: true, highlights: [] });
  const chapterId = new URL(req.url).searchParams.get("chapterId");
  if (!chapterId) {
    return NextResponse.json({ error: "chapterId required" }, { status: 400 });
  }
  const highlights = await prisma.sgHighlight.findMany({
    where: { userId: user.userId, chapterId },
    orderBy: { startOffset: "asc" },
  });
  return NextResponse.json({ ok: true, highlights });
}

/** POST — create highlight */
export async function POST(req: Request) {
  const authResult = await requireStudyGuideUser();
  if (!authResult.ok) return authResult.response;
  const body = createSchema.parse(await req.json());
  if (body.endOffset <= body.startOffset) {
    return NextResponse.json({ error: "Invalid span." }, { status: 400 });
  }
  const color = isSgHighlightColor(body.color) ? body.color : "yellow";
  try {
    const highlight = await prisma.sgHighlight.create({
      data: {
        userId: authResult.userId,
        chapterId: body.chapterId,
        startOffset: body.startOffset,
        endOffset: body.endOffset,
        selectedText: body.selectedText,
        color,
      },
    });
    return NextResponse.json({ ok: true, highlight });
  } catch {
    return NextResponse.json(
      { error: "Highlight already exists for this span.", code: "DUPLICATE_HIGHLIGHT" },
      { status: 409 }
    );
  }
}

/** DELETE ?id= */
export async function DELETE(req: Request) {
  const authResult = await requireStudyGuideUser();
  if (!authResult.ok) return authResult.response;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.sgHighlight.deleteMany({ where: { id, userId: authResult.userId } });
  return NextResponse.json({ ok: true });
}
