import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { gatherStudyMaterial } from "@/lib/research";
import { generateExam } from "@/lib/ai";
import { buildScopedTopic, getFieldSubject } from "@/lib/field-subjects";
import { isValidQuestionCount } from "@/lib/medicine-subjects";
import {
  trackEvent,
  logActivity,
  recordGeneration,
} from "@/lib/analytics/events";
import { EVENT_TYPES } from "@/lib/analytics/types";

export const maxDuration = 120;

export async function POST(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;
  const userId = premium.userId;

  const { enforceUserRateLimit } = await import("@/lib/api-rate-limit");
  const limited = enforceUserRateLimit(userId, "exam-generate", 8, 60_000);
  if (limited) return limited;

  const { field, topic, subjectId, difficulty, questionCount, lessonPlanId, userNotes, generatorMode } =
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

  const started = Date.now();

  const { sources, researchBrief, sourceCounts, advanced } = await gatherStudyMaterial(
    field,
    resolvedTopic,
    subjectId
  );

  const notesBlock =
    typeof userNotes === "string" && userNotes.trim().length > 0
      ? `\n\nUSER-PROVIDED MATERIAL (${generatorMode ?? "upload"}):\n${userNotes.trim().slice(0, 12_000)}`
      : "";

  const enrichedBrief = `${researchBrief}${notesBlock}`;

  let exam;
  try {
    exam = await generateExam({
      field,
      topic: resolvedTopic,
      subjectId,
      difficulty: difficulty ?? "medium",
      questionCount: count,
      sources,
      researchBrief: enrichedBrief,
      advancedContext: advanced,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Generation failed";
    trackEvent({
      userId: userId,
      eventType: EVENT_TYPES.QUESTION_GENERATION_FAILED,
      category: "education",
      metadata: { field, subjectId, topic: resolvedTopic, error: message },
      req,
    });
    void recordGeneration({
      userId: userId,
      field,
      subjectId,
      topic: resolvedTopic,
      difficulty: difficulty ?? "medium",
      questionCount: count,
      status: "failed",
      durationMs: Date.now() - started,
      errorMessage: message,
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const saved = await prisma.generatedExam.create({
    data: {
      userId: userId,
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
      userId: userId,
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

  const durationMs = Date.now() - started;
  trackEvent({
    userId: userId,
    eventType: EVENT_TYPES.QUESTION_GENERATED,
    category: "education",
    metadata: {
      field,
      subject: subject.label,
      subjectId,
      topic: resolvedTopic,
      difficulty: difficulty ?? "medium",
      questionCount: exam.questions.length,
      durationMs,
    },
    req,
  });
  void logActivity({
    userId: userId,
    action: "exam_generated",
    summary: `Generated ${exam.questions.length} questions — ${subject.label}`,
    metadata: { examId: saved.id, field, subjectId },
  });
  void recordGeneration({
    userId: userId,
    examId: saved.id,
    field,
    subjectId,
    topic: resolvedTopic,
    difficulty: difficulty ?? "medium",
    questionCount: exam.questions.length,
    durationMs,
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
    qualityReport: exam.qualityReport,
    retrievalMeta: advanced?.retrievalMeta,
  });
}
