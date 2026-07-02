import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { FullExamSimulator } from "@/components/exam/FullExamSimulator";
import { Skeleton } from "@/components/ui/skeleton";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import { getExamSession, type ExamAnswerRecord } from "@/lib/exam-sessions/service";
import { fullExamResultsHref } from "@/lib/full-exam/config";
import { requirePremiumPage } from "@/lib/require-premium-page";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamSessionConfig } from "@/types/full-exam";

function ExamSessionSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 px-4 py-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-[70vh] w-full rounded-2xl" />
    </div>
  );
}

async function FullExamSessionInner({
  examSlug,
  sessionId,
}: {
  examSlug: ExamSlug;
  sessionId: string;
}) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`/auth/login?callbackUrl=/full-exam/${examSlug}/${sessionId}`);
  }

  await requirePremiumPage(`/full-exam/${examSlug}/${sessionId}`);

  let examSession = null;
  try {
    examSession = await getExamSession(sessionId, session.user.id);
  } catch {
    notFound();
  }

  if (!examSession) notFound();

  if (examSession.status === "completed" || examSession.status === "ended_early") {
    redirect(fullExamResultsHref(examSlug, sessionId));
  }

  const analysis = examSession.analysis as { sessionConfig?: FullExamSessionConfig } | null;
  const config = analysis?.sessionConfig;
  if (!config) notFound();

  const answers = (Array.isArray(examSession.answers)
    ? examSession.answers
    : []) as ExamAnswerRecord[];

  const exam = EXAM_CATALOG[examSlug];

  return (
    <FullExamSimulator
      sessionId={sessionId}
      examSlug={examSlug}
      fieldId={exam.fieldId}
      config={config}
      initialAnswers={answers}
      startedAt={examSession.startedAt}
    />
  );
}

export default async function FullExamSessionPage({
  params,
}: {
  params: Promise<{ examSlug: string; sessionId: string }>;
}) {
  const { examSlug, sessionId } = await params;
  if (!isExamSlug(examSlug)) notFound();

  return (
    <Suspense fallback={<ExamSessionSkeleton />}>
      <FullExamSessionInner examSlug={examSlug as ExamSlug} sessionId={sessionId} />
    </Suspense>
  );
}
