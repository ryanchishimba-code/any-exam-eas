import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Suspense } from "react";
import { PremiumGate } from "@/components/PremiumGate";
import { ProBenefitsCallout } from "@/components/ProBenefitsCallout";
import { StudyBankPractice } from "@/components/study/StudyBankPractice";
import { StudyPageHeader } from "@/components/study/StudyPageHeader";
import { getUserExamPreference, setUserExamPreference } from "@/lib/edtech/exam-preference";
import { EXAM_CATALOG, examSlugFromFieldId, isExamSlug } from "@/lib/edtech/exams";
import { resolveQuestionBankFieldId } from "@/lib/edtech/question-bank-scope";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Question Bank — Any Exam Easy",
  description: "Adaptive question bank with topic filters and detailed rationales.",
};

export default async function QuestionBankPage({
  searchParams,
}: {
  searchParams: Promise<{ field?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.questionBank)}`);
  }

  await requirePremiumPage(ROUTES.questionBank);

  const sp = await searchParams;
  if (sp.field) {
    const fieldId = resolveQuestionBankFieldId(sp.field);
    const examSlug = examSlugFromFieldId(fieldId);
    if (examSlug && isExamSlug(examSlug)) {
      await setUserExamPreference(session.user.id, examSlug);
    }
  }

  const pref = await getUserExamPreference(session.user.id);
  if (!pref) redirect(ROUTES.selectExam);

  const exam = EXAM_CATALOG[pref.examSlug];

  return (
    <div className="w-full space-y-5">
      <StudyPageHeader
        eyebrow="Question Bank"
        title={`Practice ${exam.shortName}`}
        subtitle="Pick a topic, tune your session, and start — every question matches your exam."
        breadcrumbs={[{ label: "Dashboard", href: ROUTES.dashboard }]}
      />

      <ProBenefitsCallout />

      <PremiumGate callbackPath={ROUTES.questionBank}>
        <Suspense fallback={<p className="text-sm text-[var(--color-ink-muted)]">Loading…</p>}>
          <StudyBankPractice preferredExamSlug={pref.examSlug} lockExam />
        </Suspense>
      </PremiumGate>
    </div>
  );
}
