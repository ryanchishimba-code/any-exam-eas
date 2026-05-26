import { NextResponse } from "next/server";
import { getFieldMeta } from "@/lib/fields";
import { getFieldSubject } from "@/lib/field-subjects";
import { countActiveQuestions, fetchQuestionBankItems } from "@/lib/question-bank-db";
import { MIN_QUESTIONS_PER_SUBJECT } from "@/lib/bulk-question-generator";
import {
  getLastQuestionBankSync,
  getSubjectQuestionCount,
} from "@/lib/sync-question-bank";
import { prepareQuestionsForSession } from "@/lib/questions/prepare";
import type { ExamQuestion } from "@/lib/ai";
import { trackEvent } from "@/lib/analytics/events";
import { EVENT_TYPES } from "@/lib/analytics/types";

export async function GET(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;
  const userId = premium.userId;

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
  const raw: ExamQuestion[] = items.slice(0, limit).map((item, i) => ({
    id: i + 1,
    type: "multiple_choice" as const,
    question: item.question,
    options: [...item.options],
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    solutionSteps: item.solutionSteps,
    tags: item.tags,
    highYield: true,
  }));

  const prepared = prepareQuestionsForSession(
    raw.map((q, i) => ({
      ...q,
      field,
      subjectId,
      bankItemId: items[i]?.id ?? undefined,
    })),
    { shuffleOrder: true }
  );

  const questions: ExamQuestion[] = prepared.map((p, i) => ({
    id: i + 1,
    type: p.type === "true_false" ? "true_false" : "multiple_choice",
    question: p.stem,
    options: p.options,
    correctAnswer: p.correctAnswers[0] ?? "",
    explanation: p.explanation,
    solutionSteps: p.solutionSteps,
    tags: p.tags,
    highYield: p.highYield,
  }));

  const [totalActive, subjectTotal, lastSync] = await Promise.all([
    countActiveQuestions(fieldId),
    getSubjectQuestionCount(fieldId, subjectId),
    getLastQuestionBankSync(),
  ]);

  trackEvent({
    userId,
    eventType: EVENT_TYPES.QUESTION_BANK_FETCH,
    category: "education",
    metadata: {
      field,
      fieldId,
      subjectId,
      requestedLimit: limit,
      returned: questions.length,
    },
    req,
  });

  return NextResponse.json({
    field,
    fieldId,
    subjectId,
    subjectLabel: subject.label,
    questions,
    bankItemIds: prepared.map((p) => p.bankItemId).filter(Boolean),
    meta: {
      returned: questions.length,
      availableForSubject: subjectTotal,
      minimumPerSubject: MIN_QUESTIONS_PER_SUBJECT,
      meetsMinimum: subjectTotal >= MIN_QUESTIONS_PER_SUBJECT,
      totalActiveInField: totalActive,
      lastSyncedAt: lastSync?.finishedAt ?? null,
      lastSyncStatus: lastSync?.status ?? null,
    },
  });
}
