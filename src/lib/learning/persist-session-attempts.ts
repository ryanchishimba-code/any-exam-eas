import { resolveQuestionBankFieldId } from "@/lib/edtech/question-bank-scope";
import { prisma } from "@/lib/prisma";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";
import { invalidateStudentReadCaches } from "@/lib/learning/invalidate-read-caches";
import {
  recordAttemptWithMastery,
  refreshLearningProfile,
} from "@/lib/learning/profile-service";
import {
  sessionReceiptLinks,
  summarizeAttemptDrafts,
  type SessionAttemptDraft,
  type SessionWeakTopic,
} from "@/lib/learning/session-attempt-plan";
import type { AttemptInput } from "@/lib/learning/types";
import type { StudyQuestionType } from "@/lib/questions/types";

export type SessionPersistResult = {
  persisted: true;
  fieldId: string;
  attemptsSaved: number;
  newlySaved: number;
  alreadySaved: number;
  correct: number;
  accuracy: number;
  answered: number;
  weakTopics: SessionWeakTopic[];
  studyStreakDays: number;
  reviewIncorrectHref: string;
  analyticsHref: string;
};

function labelWeakTopics(fieldId: string, topics: SessionWeakTopic[]): SessionWeakTopic[] {
  let subjects: { id: string; label: string }[] = [];
  try {
    subjects = getSubjectsForFieldId(fieldId);
  } catch {
    subjects = [];
  }
  return topics.map((topic) => {
    const slug = topic.id.replace(/^(subject|tag):/, "");
    const match = subjects.find((subject) => subject.id === slug);
    return match ? { ...topic, label: match.label } : topic;
  });
}

export function draftToAttemptInput(params: {
  userId: string;
  fieldId: string;
  sessionId: string;
  studyMode?: string;
  practiceFormat?: "ngn" | "case";
  draft: SessionAttemptDraft;
}): AttemptInput {
  const { draft } = params;
  const questionType = (draft.questionType || "multiple_choice") as StudyQuestionType;
  return {
    userId: params.userId,
    fieldId: params.fieldId,
    sessionId: params.sessionId,
    studyMode: params.studyMode,
    practiceFormat: params.practiceFormat,
    correct: draft.correct,
    confidence: draft.confidence,
    durationMs: draft.durationMs,
    selectedAnswer: draft.selectedAnswer,
    question: {
      id: draft.questionKey,
      sourceIndex: 0,
      type: questionType,
      stem: draft.stemPreview ?? "",
      options: [],
      correctAnswers: [],
      explanation: "",
      bankItemId: draft.bankItemId ?? draft.questionKey,
      subjectId: draft.subjectId,
      tags: draft.tags,
      difficulty: draft.difficulty,
    },
  };
}

/**
 * Idempotent session-end write. Existing (user, session, question) rows are
 * not inserted again, so a retried end cannot double-count analytics.
 */
export async function persistCompletedSessionAttempts(params: {
  userId: string;
  field: string;
  sessionId: string;
  studyMode?: string;
  practiceFormat?: "ngn" | "case";
  subjectId?: string | null;
  drafts: SessionAttemptDraft[];
}): Promise<SessionPersistResult> {
  const fieldId = resolveQuestionBankFieldId(params.field);
  const drafts = params.drafts.filter((draft) => draft.questionKey.trim());
  let newlySaved = 0;
  let alreadySaved = 0;

  const { recordUniformCellAttempt } = await import("@/lib/engine/mastery/uniform-engine");

  for (const draft of drafts) {
    const input = draftToAttemptInput({
      userId: params.userId,
      fieldId,
      sessionId: params.sessionId,
      studyMode: params.studyMode,
      practiceFormat: params.practiceFormat,
      draft,
    });
    const result = await recordAttemptWithMastery(input, { refreshProfile: false });
    if (result.alreadySaved) {
      alreadySaved += 1;
      continue;
    }
    newlySaved += 1;
    try {
      const cellResult = await recordUniformCellAttempt(input);
      if (!cellResult.ok) {
        console.warn("[session-persist] uniform cell write:", cellResult.error);
      }
    } catch (error) {
      console.warn("[session-persist] uniform cell write failed", error);
    }
  }

  if (newlySaved + alreadySaved !== drafts.length) {
    throw new Error("Not all session attempts were saved.");
  }

  const profile = drafts.length > 0
    ? await refreshLearningProfile(params.userId)
    : await (async () => {
        const row = await prisma.learningProfile.findUnique({
          where: { userId: params.userId },
          select: { studyStreakDays: true, readinessScore: true },
        });
        return {
          studyStreakDays: row?.studyStreakDays ?? 0,
          readinessScore: Math.round(row?.readinessScore ?? 0),
        };
      })();

  if (drafts.length > 0) {
    await invalidateStudentReadCaches(params.userId, fieldId);
  }

  const summary = summarizeAttemptDrafts(drafts);
  const links = sessionReceiptLinks(fieldId, params.subjectId);

  console.info("[session-persist] session saved", {
    userId: params.userId,
    sessionId: params.sessionId,
    fieldId,
    attemptsSaved: newlySaved + alreadySaved,
    newlySaved,
    alreadySaved,
  });

  return {
    persisted: true,
    fieldId,
    attemptsSaved: newlySaved + alreadySaved,
    newlySaved,
    alreadySaved,
    correct: summary.correct,
    accuracy: summary.accuracy,
    answered: summary.answered,
    weakTopics: labelWeakTopics(fieldId, summary.weakTopics),
    studyStreakDays: profile.studyStreakDays,
    reviewIncorrectHref: links.reviewIncorrectHref,
    analyticsHref: links.analyticsHref,
  };
}
