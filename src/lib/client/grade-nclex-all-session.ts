import {
  decodeNgnStoredResponse,
  encodeNgnStoredResponse,
  readNclexAllNgnSlot,
} from "@/lib/assessment/nclex-all-ngn-slot";
import type { RevealedNgnItem } from "@/lib/client/reveal-nclex-all-ngn";
import { applyRevealedAnswer } from "@/lib/questions/apply-revealed-answer";
import type { RevealedAnswerFields } from "@/lib/questions/reveal-study-answer";
import { recordSessionAnswer, recordSessionGrade } from "@/lib/questions/session-engine";
import type { StudyQuestion, StudySessionState } from "@/lib/questions/types";
import type { NgnItem } from "@/lib/assessment/types";

/**
 * Score a timed All-questions mix at the end of the session timer.
 * Standard items use the bank reveal. NGN items use official partial credit.
 * Already revealed rows are left as they are.
 */
export async function gradeWithheldNclexAllSession(params: {
  session: StudySessionState;
  questions: StudyQuestion[];
  responses: Record<string, unknown>;
  revealNgn: (
    item: { id: string; version: number },
    response: unknown
  ) => Promise<RevealedNgnItem | null>;
  revealBank: (input: {
    itemId: string;
    selected: string[];
    options: string[];
  }) => Promise<{ correct: boolean; answer: RevealedAnswerFields } | null>;
}): Promise<{
  session: StudySessionState;
  questions: StudyQuestion[];
  revealed: Record<string, NgnItem>;
}> {
  let session = params.session;
  let questions = params.questions;
  const revealed: Record<string, NgnItem> = {};
  const duration = Math.max(0, Date.now() - Date.parse(params.session.startedAt));
  const perItem = Math.round(duration / Math.max(1, questions.length));

  for (const question of questions) {
    if (session.answers[question.id]?.revealed) continue;
    const slot = readNclexAllNgnSlot(question);
    if (slot) {
      const response =
        params.responses[slot.item.id] ??
        decodeNgnStoredResponse(session.answers[question.id]?.selected);
      const grade = await params.revealNgn(slot.item, response ?? null);
      if (grade) revealed[question.id] = grade.item;
      session = recordSessionGrade(session, question.id, {
        selected: [
          encodeNgnStoredResponse(
            response ?? null,
            grade ? { points: grade.points, maxPoints: grade.maxPoints } : undefined
          ),
        ],
        correct: grade?.correct ?? false,
        revealed: true,
        unanswered: false,
        durationMs: perItem,
      });
      continue;
    }

    const choices = session.answers[question.id]?.selected ?? [];
    const bank = await params.revealBank({
      itemId: question.bankItemId || question.id,
      selected: choices,
      options: question.options,
    });
    const graded = bank ? applyRevealedAnswer(question, bank.answer) : question;
    if (bank) {
      questions = questions.map((row) => (row.id === graded.id ? graded : row));
    }
    session = recordSessionAnswer(session, graded, choices, { durationMs: perItem });
  }

  return { session, questions, revealed };
}
