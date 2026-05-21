import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { gatherStudyMaterial } from "@/lib/research";
import { generateExam } from "@/lib/ai";
import { buildScopedTopic, getFieldSubject } from "@/lib/field-subjects";
import { isValidQuestionCount } from "@/lib/medicine-subjects";

export const maxDuration = 120;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!sub || !["trialing", "active"].includes(sub.status)) {
    return NextResponse.json(
      { error: "Active subscription or trial required" },
      { status: 403 }
    );
  }

  const { field, topic, subjectId, difficulty, questionCount, lessonPlanId } =
    await req.json();

  if (!field || !subjectId) {
    return NextResponse.json(
      { error: "Field and subject/topic are required" },
      { status: 400 }
    );
  }

  const subject = getFieldSubject(field, subjectId);
  if (!subject) {
    return NextResponse.json({ error: "Invalid subject for this field" }, { status: 400 });
  }

  const resolvedTopic = buildScopedTopic(field, subjectId, topic?.trim());

  const count = Number(questionCount ?? 10);
  if (!isValidQuestionCount(count)) {
    return NextResponse.json(
      { error: "Question count must be 10, 15, 20, … up to 50 (steps of 5)" },
      { status: 400 }
    );
  }

  const { sources, researchBrief, sourceCounts } = await gatherStudyMaterial(
    field,
    resolvedTopic,
    subjectId
  );

  const exam = await generateExam({
    field,
    topic: resolvedTopic,
    subjectId,
    difficulty: difficulty ?? "medium",
    questionCount: count,
    sources,
    researchBrief,
  });

  const saved = await prisma.exam.create({
    data: {
      userId: session.user.id,
      lessonPlanId: lessonPlanId ?? null,
      title: exam.title,
      field: exam.field,
      topic: exam.topic,
      difficulty: difficulty ?? "medium",
      questionCount: exam.questions.length,
      content: JSON.stringify(exam),
      sources: JSON.stringify(sources.map((s) => ({ title: s.title, url: s.url }))),
    },
  });

  await prisma.progressRecord.create({
    data: {
      userId: session.user.id,
      entityType: "exam",
      entityId: saved.id,
      metadata: JSON.stringify({
        action: "generated",
        subjectId,
        subjectLabel: subject.label,
        questionCount: count,
      }),
    },
  });

  return NextResponse.json({
    exam,
    examId: saved.id,
    subject: { id: subject.id, label: subject.label },
    sources: sources.map((s) => ({
      title: s.title,
      url: s.url,
      sourceType: s.sourceType,
    })),
    sourceCounts,
    sourcesReviewed: sources.length,
  });
}
