import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { FullExamSimulator } from "@/components/exam/FullExamSimulator";
import { Skeleton } from "@/components/ui/skeleton";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { getExamSession, type ExamAnswerRecord } from "@/lib/exam-sessions/service";
import { fullExamResultsHref, fullExamSessionHref } from "@/lib/full-exam/config";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { fullExamHref, ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamSessionConfig } from "@/types/full-exam";

export const maxDuration = 60;

function ExamSessionSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 px-4 py-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-[70vh] w-full rounded-2xl" />
    </div>
  );
}

async function FullExamSessionContent({
  examSlug,
  sessionId,
  userId,
  preferredExamSlug,
}: {
  examSlug: ExamSlug;
  sessionId: string;
  userId: string;
  preferredExamSlug: ExamSlug;
}) {
  let examSession = null;
  try {
    examSession = await getExamSession(sessionId, userId);
  } catch {
    notFound();
  }

  if (!examSession) notFound();

  const sessionExamSlug = examSession.examType;
  if (!isExamSlug(sessionExamSlug)) notFound();
  if (sessionExamSlug !== preferredExamSlug) {
    redirect(fullExamHref(preferredExamSlug));
  }
  if (sessionExamSlug !== examSlug) {
    redirect(fullExamSessionHref(sessionExamSlug, sessionId));
  }

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
  const sessionFieldId = examSession.fieldId || exam.fieldId;

  return (
    <FullExamSimulator
      sessionId={sessionId}
      examSlug={examSlug}
      fieldId={sessionFieldId}
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

  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`/auth/login?callbackUrl=/full-exam/${examSlug}/${sessionId}`);
  }

  await requirePremiumPage(`/full-exam/${examSlug}/${sessionId}`);

  const pref = await getUserExamPreference(session.user.id);
  if (!pref) redirect(ROUTES.selectExam);

  return (
    <Suspense fallback={<ExamSessionSkeleton />}>
      <FullExamSessionContent
        examSlug={examSlug as ExamSlug}
        sessionId={sessionId}
        userId={session.user.id}
        preferredExamSlug={pref.examSlug}
      />
    </Suspense>
  );
}
