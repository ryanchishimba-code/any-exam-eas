import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getFieldMeta } from "@/lib/fields";
import { getFieldSubject } from "@/lib/field-subjects";
import { countActiveQuestions, fetchQuestionBankItems } from "@/lib/question-bank-db";
import { getLastQuestionBankSync } from "@/lib/sync-question-bank";
import { toQuizletStyleQuestion } from "@/lib/question-format";
import type { ExamQuestion } from "@/lib/ai";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const field = searchParams.get("field");
  const subjectId = searchParams.get("subjectId");
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);

  if (!field || !subjectId) {
    return NextResponse.json(
      { error: "Query params field and subjectId are required" },
      { status: 400 }
    );
  }

  const subject = getFieldSubject(field, subjectId);
  if (!subject) {
    return NextResponse.json({ error: "Invalid subject for this field" }, { status: 400 });
  }

  const meta = getFieldMeta(field);
  const fieldId = meta?.id ?? field.toLowerCase().replace(/\s+/g, "-");

  const items = await fetchQuestionBankItems({ fieldId, subjectId });
  const questions: ExamQuestion[] = items
    .slice(0, limit)
    .map((item, i) =>
      toQuizletStyleQuestion({
        id: i + 1,
        type: "multiple_choice",
        question: item.question,
        options: [...item.options],
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        solutionSteps: item.solutionSteps,
        tags: item.tags,
        highYield: true,
      })
    );

  const [totalActive, lastSync] = await Promise.all([
    countActiveQuestions(fieldId),
    getLastQuestionBankSync(),
  ]);

  return NextResponse.json({
    field,
    fieldId,
    subjectId,
    subjectLabel: subject.label,
    questions,
    meta: {
      returned: questions.length,
      availableForSubject: items.length,
      totalActiveInField: totalActive,
      lastSyncedAt: lastSync?.finishedAt ?? null,
      lastSyncStatus: lastSync?.status ?? null,
    },
  });
}
