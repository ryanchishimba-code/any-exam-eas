import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { upsertSgChapterProgress } from "@/lib/nclex-study-guide/chapter-progress-server";
import { requireStudyGuidePremium } from "@/lib/nclex-study-guide/premium-api";

export const runtime = "nodejs";

const upsertSchema = z.object({
  guideId: z.string().min(1),
  chapterId: z.string().min(1),
  scrollPct: z.number().min(0).max(100),
  heartbeatSeconds: z.number().min(0).max(120).optional(),
  tabVisible: z.boolean().optional(),
});

export async function GET(req: Request) {
  const user = await requireStudyGuidePremium(req);
  if (!user.ok) return user.response;
  const guideId = new URL(req.url).searchParams.get("guideId");
  if (!guideId) {
    return NextResponse.json({ error: "guideId required" }, { status: 400 });
  }
  const progress = await prisma.sgReadingProgress.findUnique({
    where: { userId_guideId: { userId: user.userId, guideId } },
  });
  return NextResponse.json({ ok: true, progress });
}

export async function POST(req: Request) {
  const authResult = await requireStudyGuidePremium(req);
  if (!authResult.ok) return authResult.response;
  const body = upsertSchema.parse(await req.json());
  const [progress, chapterProgress] = await Promise.all([
    prisma.sgReadingProgress.upsert({
      where: {
        userId_guideId: { userId: authResult.userId, guideId: body.guideId },
      },
      create: {
        userId: authResult.userId,
        guideId: body.guideId,
        chapterId: body.chapterId,
        scrollPct: body.scrollPct,
        lastReadAt: new Date(),
      },
      update: {
        chapterId: body.chapterId,
        scrollPct: body.scrollPct,
        lastReadAt: new Date(),
      },
    }),
    upsertSgChapterProgress(authResult.userId, body.chapterId, {
      scrollPct: body.scrollPct,
      heartbeatSeconds: body.heartbeatSeconds,
      tabVisible: body.tabVisible,
    }),
  ]);
  return NextResponse.json({ ok: true, progress, chapterProgress });
}
