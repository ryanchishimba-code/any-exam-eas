import { NextResponse } from "next/server";
import {
  appendExamAnswer,
  completeExamSession,
  getExamSession,
} from "@/lib/exam-sessions/service";
import { administeredQuestionCount, practiceResultsTotals, practiceScorePercent } from "@/lib/full-exam/administered-score";
import { mergeExamAnswers } from "@/lib/exam-sessions/scoring";
import { requirePremiumApi } from "@/lib/api-access";
import { examSlugToFieldId } from "@/lib/exams/catalog";
import type { ExamSlug } from "@/lib/exams/catalog";
import {
  analysisWithAnsweredCount,
  draftsFromFullExamAnswers,
  fullExamStudyMode,
  parseFullExamAnswerLog,
  snapshotsFromAnalysis,
} from "@/lib/learning/full-exam-pass-path";
import { persistCompletedSessionAttempts } from "@/lib/learning/persist-session-attempts";
import { summarySaysEndedEarly } from "@/lib/full-exam/results-title";
import { preservePresetFormOnAnalysis } from "@/lib/exam-prep/preset-form-progress";
import {
  gradeExamAnswerRecords,
  overlayServerRationales,
  weakAreasFromGradedAnswers,
} from "@/lib/exam-sessions/grade-stored-answer";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const { id } = await params;
  const body = await req.json();

  if (body.complete) {
    const session = await getExamSession(id, premium.userId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const stored = (Array.isArray(session.answers)
      ? session.answers
      : []) as ExamAnswerRecord[];
    const submitted = parseFullExamAnswerLog(body.answers);
    const merged = (
      submitted
        ? submitted.reduce((acc, answer) => mergeExamAnswers(acc, answer), stored)
        : stored
    ) as ExamAnswerRecord[];
    const answers = await gradeExamAnswerRecords(merged);
    const snapshots = snapshotsFromAnalysis(body.analysis);
    const drafts = draftsFromFullExamAnswers({
      answers,
      snapshots,
    });
    const summary =
      body.analysis && typeof body.analysis === "object"
        ? (body.analysis as { summary?: unknown }).summary
        : undefined;
    const endedEarly = Boolean(body.endedEarly) || summarySaysEndedEarly(
      typeof summary === "string" ? summary : undefined
    );
    const gradedAnalysis = await overlayServerRationales(
      analysisWithAnsweredCount(body.analysis, drafts.length),
      answers
    );
    const analysis = preservePresetFormOnAnalysis(session.analysis, {
      ...(gradedAnalysis as Record<string, unknown>),
      endedEarly,
    });
    const totalQuestions = administeredQuestionCount({
      snapshotCount: snapshots.length,
      answers,
      plannedCount: session.questionCount,
    });
    const cat = Boolean(
      body.analysis &&
        typeof body.analysis === "object" &&
        (body.analysis as { catOutcome?: unknown }).catOutcome
    );
    const totals = practiceResultsTotals({
      delivered: totalQuestions,
      answers,
      cat,
    });
    const correct = answers.filter((answer) => answer.correct && answer.selected?.trim()).length;
    const weakAreas = weakAreasFromGradedAnswers(answers);
    const score = practiceScorePercent(correct, totals.denominator || totalQuestions);
    const fieldId =
      session.fieldId ??
      examSlugToFieldId(session.examType as ExamSlug);
    const persisted = await persistCompletedSessionAttempts({
      userId: premium.userId,
      field: fieldId,
      sessionId: id,
      examSessionId: id,
      studyMode: fullExamStudyMode(analysis),
      drafts,
    });

    await completeExamSession(id, premium.userId, {
      score,
      weakAreas,
      analysis,
      endedEarly,
      answers,
    });
    return NextResponse.json({
      ok: true,
      score,
      attemptsSaved: persisted.attemptsSaved,
      reviewIncorrectHref: persisted.reviewIncorrectHref,
    });
  }

  const selected = String(body.selected ?? "");
  const [graded] = await gradeExamAnswerRecords([
    {
      questionIndex: Number(body.questionIndex),
      questionId: typeof body.questionId === "string" ? body.questionId : undefined,
      selected,
      correct: false,
      flagged: Boolean(body.flagged),
      eliminated: Array.isArray(body.eliminated) ? body.eliminated : undefined,
      notes: typeof body.notes === "string" ? body.notes : undefined,
      topicCategory: typeof body.topicCategory === "string" ? body.topicCategory : undefined,
      answeredAt: new Date().toISOString(),
    },
  ]);
  const answers = await appendExamAnswer(id, premium.userId, graded!);

  if (!answers) {
    return NextResponse.json({ error: "Session not found or already completed" }, { status: 404 });
  }

  return NextResponse.json({ answers });
  } catch (error) {
    const { respondDbUnavailable } = await import("@/lib/api-db-error");
    const dbResponse = respondDbUnavailable(error);
    if (dbResponse) return dbResponse;
    throw error;
  }
}
