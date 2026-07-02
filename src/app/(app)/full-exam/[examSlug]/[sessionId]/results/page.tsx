import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { FullExamResults } from "@/components/exam/FullExamResults";
import { SocialShareBar } from "@/components/social/SocialShareBar";
import { Skeleton } from "@/components/ui/skeleton";
import { contentWidth } from "@/lib/layout/shell-ui";
import { isExamSlug } from "@/lib/edtech/exams";
import { getExamSession } from "@/lib/exam-sessions/service";
import { requirePremiumPage } from "@/lib/require-premium-page";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamQuestion, FullExamResultsAnalysis } from "@/types/full-exam";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";

export const maxDuration = 60;

function ResultsSkeleton() {
  return (
    <div className={`mx-auto ${contentWidth.content} space-y-4 px-4 py-8 sm:px-6`}>
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}

async function FullExamResultsContent({
  examSlug,
  sessionId,
  userId,
  reviewOpen,
}: {
  examSlug: ExamSlug;
  sessionId: string;
  userId: string;
  reviewOpen: boolean;
}) {
  const examSession = await getExamSession(sessionId, userId);
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
    <>
      <FullExamResults
        examSlug={examSlug}
        sessionId={sessionId}
        score={examSession.score ?? 0}
        analysis={analysis}
        answers={answers}
        questions={questions}
        initialReviewOpen={reviewOpen}
      />

      <div className="mt-6 flex justify-center">
        <SocialShareBar
          entityType="result"
          entityId={sessionId}
          text={`I scored ${examSession.score ?? 0}% on my ${examSlug.toUpperCase()} mock exam with AnyExamEasy! 🎓`}
          url="https://www.anyexameasy.com"
        />
      </div>
    </>
  );
}

export default async function FullExamResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ examSlug: string; sessionId: string }>;
  searchParams: Promise<{ review?: string }>;
}) {
  const { examSlug, sessionId } = await params;
  const sp = await searchParams;
  if (!isExamSlug(examSlug)) notFound();

  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`/auth/login?callbackUrl=/full-exam/${examSlug}/${sessionId}/results`);
  }

  await requirePremiumPage(`/full-exam/${examSlug}/${sessionId}/results`);

  return (
    <div className="bg-[var(--color-bg)]">
      <div className={`mx-auto ${contentWidth.content} px-4 pb-8 sm:px-6`}>
        <Suspense fallback={<ResultsSkeleton />}>
          <FullExamResultsContent
            examSlug={examSlug as ExamSlug}
            sessionId={sessionId}
            userId={session.user.id}
            reviewOpen={sp.review === "1"}
          />
        </Suspense>
      </div>
    </div>
  );
}
