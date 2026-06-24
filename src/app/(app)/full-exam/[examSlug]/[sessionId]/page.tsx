import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { FullExamSimulator } from "@/components/exam/FullExamSimulator";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import { getExamSession, type ExamAnswerRecord } from "@/lib/exam-sessions/service";
import { fullExamResultsHref } from "@/lib/full-exam/config";
import { requireProFeaturePage } from "@/lib/require-pro-feature";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamSessionConfig } from "@/types/full-exam";

export default async function FullExamSessionPage({
  params,
}: {
  params: Promise<{ examSlug: string; sessionId: string }>;
}) {
  const { examSlug, sessionId } = await params;
  if (!isExamSlug(examSlug)) notFound();

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/auth/login?callbackUrl=/full-exam/${examSlug}/${sessionId}`);
  }

  await requireProFeaturePage("unlimited_mock_exams", `/full-exam/${examSlug}/${sessionId}`);

  let examSession = null;
  try {
    examSession = await getExamSession(sessionId, session.user.id);
  } catch {
    notFound();
  }

  if (!examSession) notFound();

  if (examSession.status === "completed" || examSession.status === "ended_early") {
    redirect(fullExamResultsHref(examSlug as ExamSlug, sessionId));
  }

  const analysis = examSession.analysis as { sessionConfig?: FullExamSessionConfig } | null;
  const config = analysis?.sessionConfig;
  if (!config) notFound();

  const answers = (Array.isArray(examSession.answers)
    ? examSession.answers
    : []) as ExamAnswerRecord[];

  const exam = EXAM_CATALOG[examSlug as ExamSlug];

  return (
    <FullExamSimulator
      sessionId={sessionId}
      examSlug={examSlug as ExamSlug}
      fieldId={exam.fieldId}
      config={config}
      initialAnswers={answers}
      startedAt={examSession.startedAt}
    />
  );
}
