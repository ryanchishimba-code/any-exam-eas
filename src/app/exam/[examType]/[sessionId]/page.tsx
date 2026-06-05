import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getExamHub, type ExamSlug } from "@/lib/exams/catalog";
import { getExamSession } from "@/lib/exam-sessions/service";
import { TimedPracticeExam } from "@/components/exam/TimedPracticeExam";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { resolveTimedExamLimit } from "@/lib/exam/exam-lengths";

const SLUGS = new Set(["nclex", "usmle", "naplex", "top500"]);

export default async function ExamSessionPage({
  params,
}: {
  params: Promise<{ examType: string; sessionId: string }>;
}) {
  const { examType, sessionId } = await params;
  if (!SLUGS.has(examType)) notFound();

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/exam/${examType}/${sessionId}`);
  }

  await requirePremiumPage(`/exam/${examType}/${sessionId}`);

  const hub = getExamHub(examType as ExamSlug);
  if (!hub) notFound();

  let examSession = null;
  try {
    examSession = await getExamSession(sessionId, session.user.id);
  } catch {
    /* migration pending */
  }
  if (!examSession) notFound();

  const storedCount = examSession.questionCount || 0;
  const questionCount = resolveTimedExamLimit(
    hub.fieldId,
    storedCount > 0 ? storedCount : undefined,
    examType === "nclex" && storedCount === 150 ? "maximum" : "minimum"
  );

  return (
    <TimedPracticeExam
      sessionId={sessionId}
      examType={examType}
      fieldId={hub.fieldId}
      questionCount={questionCount}
      nclexLength={examType === "nclex" && questionCount === 150 ? "maximum" : "minimum"}
    />
  );
}
