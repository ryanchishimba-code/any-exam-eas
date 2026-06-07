import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { FullExamResults } from "@/components/exam/FullExamResults";
import { isExamSlug } from "@/lib/edtech/exams";
import { getExamSession } from "@/lib/exam-sessions/service";
import { requirePremiumPage } from "@/lib/require-premium-page";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamQuestion, FullExamResultsAnalysis } from "@/types/full-exam";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";

export default async function FullExamResultsPage({
  params,
}: {
  params: Promise<{ examSlug: string; sessionId: string }>;
}) {
  const { examSlug, sessionId } = await params;
  if (!isExamSlug(examSlug)) notFound();

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/auth/login?callbackUrl=/full-exam/${examSlug}/${sessionId}/results`);
  }

  await requirePremiumPage(`/full-exam/${examSlug}/${sessionId}/results`);

  const examSession = await getExamSession(sessionId, session.user.id);
  if (!examSession) notFound();

  if (examSession.status === "in_progress") {
    redirect(`/full-exam/${examSlug}/${sessionId}`);
  }

  const analysis = examSession.analysis as FullExamResultsAnalysis | null;
  if (!analysis?.sessionConfig) notFound();

  const answers = (Array.isArray(examSession.answers)
    ? examSession.answers
    : []) as ExamAnswerRecord[];

  const questions: FullExamQuestion[] =
    analysis.questionSnapshots?.length > 0
      ? analysis.questionSnapshots
      : answers.map((a, i) => ({
          id: a.questionId ?? `q-${i}`,
          question: `Question ${i + 1}`,
          options: [a.selected],
          correctAnswer: a.selected,
          explanation: "Rationale unavailable for this session.",
          topicCategory: a.topicCategory,
        }));

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-[var(--page-top)]">
        <FullExamResults
          examSlug={examSlug as ExamSlug}
          sessionId={sessionId}
          score={examSession.score ?? 0}
          analysis={analysis}
          answers={answers}
          questions={questions}
        />
      </div>
    </div>
  );
}
