import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const records = await prisma.progressRecord.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const exams = await prisma.exam.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, title: true, field: true, topic: true, questionCount: true, createdAt: true },
  });

  const quilts = await prisma.learningQuilt.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, title: true, field: true, topic: true, preferredMode: true, createdAt: true },
  });

  const completedExams = records.filter(
    (r) => r.entityType === "exam" && r.completed
  ).length;
  const quiltSessions = records.filter((r) => r.entityType === "quilt").length;
  const scores = records
    .map((r) => r.score)
    .filter((s): s is number => s != null);
  const avgScore =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  return NextResponse.json({
    summary: {
      totalEvents: records.length,
      examsCompleted: completedExams,
      quiltSessions,
      avgScorePercent: avgScore,
    },
    recent: records.map((r) => ({
      id: r.id,
      entityType: r.entityType,
      entityId: r.entityId,
      score: r.score,
      completed: r.completed,
      metadata: r.metadata ? safeParse(r.metadata) : null,
      createdAt: r.createdAt.toISOString(),
    })),
    exams,
    quilts,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { entityType, entityId, score, completed, metadata } = body;

  if (!entityType || !entityId) {
    return NextResponse.json({ error: "entityType and entityId required" }, { status: 400 });
  }

  const record = await prisma.progressRecord.create({
    data: {
      userId: session.user.id,
      entityType: String(entityType),
      entityId: String(entityId),
      score: score != null ? Number(score) : null,
      completed: Boolean(completed),
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });

  return NextResponse.json({
    id: record.id,
    createdAt: record.createdAt.toISOString(),
  });
}

function safeParse(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}
