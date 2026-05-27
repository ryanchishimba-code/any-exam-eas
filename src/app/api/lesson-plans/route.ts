import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const plans = await prisma.lessonPlan.findMany({
    where: { userId: premium.userId },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ plans });
}

export async function POST(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;
  const userId = premium.userId;

  const { title, field, gradeLevel, subjects, goals, schedule } = await req.json();

  if (!title || !field || !subjects) {
    return NextResponse.json(
      { error: "Title, field, and subjects are required" },
      { status: 400 }
    );
  }

  const plan = await prisma.lessonPlan.create({
    data: {
      userId,
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
