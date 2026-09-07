import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOptionalStudyGuideUser, requireStudyGuideUser } from "@/lib/nclex-study-guide";

export const runtime = "nodejs";

const createSchema = z.object({
  chapterId: z.string().min(1),
  highlightId: z.string().nullable().optional(),
  body: z.string().min(1).max(8000),
});

const updateSchema = z.object({
  id: z.string().min(1),
  body: z.string().min(1).max(8000),
});

export async function GET(req: Request) {
  const user = await getOptionalStudyGuideUser();
  if (!user) return NextResponse.json({ ok: true, notes: [] });
  const chapterId = new URL(req.url).searchParams.get("chapterId");
  if (!chapterId) {
    return NextResponse.json({ error: "chapterId required" }, { status: 400 });
  }
  const notes = await prisma.sgNote.findMany({
    where: { userId: user.userId, chapterId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, notes });
}

export async function POST(req: Request) {
  const authResult = await requireStudyGuideUser();
  if (!authResult.ok) return authResult.response;
  const body = createSchema.parse(await req.json());
  const note = await prisma.sgNote.create({
    data: {
      userId: authResult.userId,
      chapterId: body.chapterId,
      highlightId: body.highlightId ?? null,
      body: body.body,
    },
  });
  return NextResponse.json({ ok: true, note });
}

export async function PATCH(req: Request) {
  const authResult = await requireStudyGuideUser();
  if (!authResult.ok) return authResult.response;
  const body = updateSchema.parse(await req.json());
  const updated = await prisma.sgNote.updateMany({
    where: { id: body.id, userId: authResult.userId },
    data: { body: body.body },
  });
  if (updated.count === 0) {
    return NextResponse.json({ error: "Note not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const authResult = await requireStudyGuideUser();
  if (!authResult.ok) return authResult.response;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.sgNote.deleteMany({ where: { id, userId: authResult.userId } });
  return NextResponse.json({ ok: true });
}
