import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getExamHub, type ExamSlug } from "@/lib/exams/catalog";
import { getExamSession } from "@/lib/exam-sessions/service";
import { TimedPracticeExam } from "@/components/exam/TimedPracticeExam";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";

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

  const subjects = getSubjectsForFieldId(hub.fieldId);
  const defaultSubjectId = subjects[0]?.id ?? "";

  return (
    <TimedPracticeExam
      sessionId={sessionId}
      examType={examType}
      fieldId={hub.fieldId}
      subjectId={defaultSubjectId}
    />
  );
}
