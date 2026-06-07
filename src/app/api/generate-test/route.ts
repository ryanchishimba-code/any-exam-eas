import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { gatherStudyMaterial } from "@/lib/research";
import { generateExam } from "@/lib/ai";
import { buildScopedTopic, getFieldSubject } from "@/lib/field-subjects";
import { getUserAccess } from "@/lib/access-control";
import { requireAuthenticatedApi } from "@/lib/api-access";
import { enforceRateLimit, enforceUserRateLimit } from "@/lib/api-rate-limit";
import { checkGenerateTestUsage } from "@/lib/generate-test/usage-limits";
import { generateTestBodySchema } from "@/lib/generate-test/validation";
import {
  logActivity,
  recordGeneration,
  trackEvent,
} from "@/lib/analytics/events";
import { EVENT_TYPES } from "@/lib/analytics/types";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  const ipLimited = enforceRateLimit(req, "generate-test", 40, 60_000);
  if (ipLimited) return ipLimited;

  const authResult = await requireAuthenticatedApi();
  if (!authResult.ok) return authResult.response;

  const { userId } = authResult;

  const userLimited = enforceUserRateLimit(userId, "generate-test", 6, 60_000);
  if (userLimited) return userLimited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body", code: "INVALID_JSON" }, { status: 400 });
  }

  let input;
  try {
    input = generateTestBodySchema.parse(body);
  } catch (e) {
    const message =
      e instanceof ZodError ? e.errors[0]?.message ?? "Invalid request" : "Invalid request";
    return NextResponse.json({ error: message, code: "VALIDATION_ERROR" }, { status: 400 });
  }

  const access = await getUserAccess(userId);
  if (access.accountStatus === "suspended") {
    return NextResponse.json(
      { error: "Account suspended", code: "ACCOUNT_SUSPENDED" },
      { status: 403 }
    );
  }

  const usage = await checkGenerateTestUsage({
    userId,
    access,
    questionCount: input.questionCount,
    difficulty: input.difficulty,
  });
  if (!usage.ok) return usage.response;

  const subject = getFieldSubject(input.field, input.subjectId);
  if (!subject) {
    return NextResponse.json(
      { error: "Invalid subject for this field", code: "INVALID_SUBJECT" },
      { status: 400 }
    );
  }

  const resolvedTopic = buildScopedTopic(input.field, input.subjectId, input.topic?.trim());
  const started = Date.now();

  let material;
  try {
    material = await gatherStudyMaterial(input.field, resolvedTopic, input.subjectId);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to gather study material";
    return NextResponse.json({ error: message, code: "RESEARCH_FAILED" }, { status: 502 });
  }

  const { sources, researchBrief, sourceCounts } = material;

  const notesBlock =
    typeof input.userNotes === "string" && input.userNotes.trim().length > 0
      ? `\n\nUSER-PROVIDED MATERIAL (${input.generatorMode ?? "upload"}):\n${input.userNotes.trim().slice(0, 12_000)}`
      : "";
  const enrichedBrief = `${researchBrief}${notesBlock}`;

  let exam;
  try {
    exam = await generateExam({
      field: input.field,
      topic: resolvedTopic,
      subjectId: input.subjectId,
      difficulty: input.difficulty,
      questionCount: input.questionCount,
      sources,
      researchBrief: enrichedBrief,
      advancedContext: material.advanced,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Generation failed";
    trackEvent({
      userId,
      eventType: EVENT_TYPES.QUESTION_GENERATION_FAILED,
      category: "education",
      metadata: {
        field: input.field,
        subjectId: input.subjectId,
        topic: resolvedTopic,
        error: message,
        route: "generate-test",
      },
      req,
    });
    void recordGeneration({
      userId,
      field: input.field,
      subjectId: input.subjectId,
      topic: resolvedTopic,
      difficulty: input.difficulty,
      questionCount: input.questionCount,
      status: "failed",
      durationMs: Date.now() - started,
      errorMessage: message,
    });
    return NextResponse.json({ error: message, code: "GENERATION_FAILED" }, { status: 500 });
  }

  let saved;
  try {
    saved = await prisma.generatedExam.create({
      data: {
        userId,
        lessonPlanId: input.lessonPlanId ?? null,
        title: exam.title,
        field: exam.field,
        topic: exam.topic,
        difficulty: input.difficulty,
        questionCount: exam.questions.length,
        content: JSON.stringify(exam),
        sources: JSON.stringify(sources.map((s) => ({ title: s.title, url: s.url }))),
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to save test";
    return NextResponse.json({ error: message, code: "SAVE_FAILED" }, { status: 500 });
  }

  await prisma.progressRecord.create({
    data: {
      userId,
      entityType: "exam",
      entityId: saved.id,
      metadata: JSON.stringify({
        action: "generated",
        subjectId: input.subjectId,
        subjectLabel: subject.label,
        questionCount: exam.questions.length,
        route: "generate-test",
        timed: input.timed ?? false,
      }),
    },
  });

  const durationMs = Date.now() - started;

  trackEvent({
    userId,
    eventType: EVENT_TYPES.QUESTION_GENERATED,
    category: "education",
    metadata: {
      field: input.field,
      subject: subject.label,
      subjectId: input.subjectId,
      topic: resolvedTopic,
      difficulty: input.difficulty,
      questionCount: exam.questions.length,
      durationMs,
      route: "generate-test",
      tier: usage.tier,
    },
    req,
  });

  void logActivity({
    userId,
    action: "test_generated",
    summary: `Generated test — ${subject.label} (${exam.questions.length} Q)`,
    metadata: { testId: saved.id, field: input.field, subjectId: input.subjectId },
  });

  void recordGeneration({
    userId,
    examId: saved.id,
    field: input.field,
    subjectId: input.subjectId,
    topic: resolvedTopic,
    difficulty: input.difficulty,
    questionCount: exam.questions.length,
    durationMs,
  });

  return NextResponse.json({
    testId: saved.id,
    examId: saved.id,
    title: exam.title,
    questionCount: exam.questions.length,
    tier: usage.tier,
    usage: {
      usedThisMonth: usage.usedThisMonth + 1,
      limit: usage.limit,
      remaining: usage.remaining,
    },
    navigateTo: `/generate?testId=${saved.id}`,
    subject: { id: subject.id, label: subject.label },
    sourcesReviewed: sources.length,
    sourceCounts,
    qualityReport: exam.qualityReport,
    retrievalMeta: material.advanced?.retrievalMeta,
  });
}
