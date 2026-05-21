import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { gatherStudyMaterial } from "@/lib/research";
import { generateLearningQuilt } from "@/lib/ai";

export const maxDuration = 120;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { field, topic, preferredMode } = await req.json();
  if (!field || !topic) {
    return NextResponse.json({ error: "Field and topic required" }, { status: 400 });
  }

  const { sources, researchBrief } = await gatherStudyMaterial(field, topic);
  const quilt = await generateLearningQuilt({
    field,
    topic,
    preferredMode: preferredMode ?? "mixed",
    sources,
    researchBrief,
  });

  const saved = await prisma.learningQuilt.create({
    data: {
      userId: session.user.id,
      title: quilt.title,
      field,
      topic,
      preferredMode: quilt.recommendedMode,
      tiles: JSON.stringify(quilt.tiles),
    },
  });

  return NextResponse.json({ quilt, quiltId: saved.id });
}
