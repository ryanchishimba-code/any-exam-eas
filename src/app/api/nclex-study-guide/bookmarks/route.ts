import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOptionalStudyGuideUser, requireStudyGuideUser } from "@/lib/nclex-study-guide";

export const runtime = "nodejs";

const createSchema = z.object({
  chapterId: z.string().min(1),
  anchorId: z.string().min(1).max(200),
  label: z.string().max(200).default(""),
  scrollPct: z.number().min(0).max(100).default(0),
});

export async function GET(req: Request) {
  const user = await getOptionalStudyGuideUser();
  if (!user) return NextResponse.json({ ok: true, bookmarks: [] });
  const chapterId = new URL(req.url).searchParams.get("chapterId");
  if (!chapterId) {
    return NextResponse.json({ error: "chapterId required" }, { status: 400 });
  }
  const bookmarks = await prisma.sgBookmark.findMany({
    where: { userId: user.userId, chapterId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, bookmarks });
}

export async function POST(req: Request) {
  const authResult = await requireStudyGuideUser();
  if (!authResult.ok) return authResult.response;
  const body = createSchema.parse(await req.json());
  try {
    const bookmark = await prisma.sgBookmark.upsert({
      where: {
        userId_chapterId_anchorId: {
          userId: authResult.userId,
          chapterId: body.chapterId,
          anchorId: body.anchorId,
        },
      },
      create: {
        userId: authResult.userId,
        chapterId: body.chapterId,
        anchorId: body.anchorId,
        label: body.label,
        scrollPct: body.scrollPct,
      },
      update: { label: body.label, scrollPct: body.scrollPct },
    });
    return NextResponse.json({ ok: true, bookmark });
  } catch (e) {
    console.error("[sg/bookmarks]", e);
    return NextResponse.json({ error: "Could not save bookmark." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const authResult = await requireStudyGuideUser();
  if (!authResult.ok) return authResult.response;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.sgBookmark.deleteMany({ where: { id, userId: authResult.userId } });
  return NextResponse.json({ ok: true });
}
