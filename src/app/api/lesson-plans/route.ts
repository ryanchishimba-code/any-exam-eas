import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plans = await prisma.lessonPlan.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ plans });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, field, gradeLevel, subjects, goals, schedule } = await req.json();

  if (!title || !field || !subjects) {
    return NextResponse.json(
      { error: "Title, field, and subjects are required" },
      { status: 400 }
    );
  }

  const plan = await prisma.lessonPlan.create({
    data: {
      userId: session.user.id,
      title,
      field,
      gradeLevel: gradeLevel ?? null,
      subjects,
      goals: goals ?? null,
      schedule: schedule ?? null,
    },
  });

  return NextResponse.json({ plan });
}
