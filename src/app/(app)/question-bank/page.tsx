import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Suspense } from "react";
import { PremiumGate } from "@/components/PremiumGate";
import { ProBenefitsCallout } from "@/components/ProBenefitsCallout";
import { StudyBankPractice } from "@/components/study/StudyBankPractice";
import { StudyPageHeader } from "@/components/study/StudyPageHeader";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import {
  fieldIdForExamSlug,
  fieldMatchesExamSlug,
  resolveQuestionBankFieldId,
} from "@/lib/edtech/question-bank-scope";
import { loadSubjectCountsForUser } from "@/lib/study/load-subject-counts";
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Question Bank — Any Exam Easy",
  description: "Adaptive question bank with topic filters and detailed rationales.",
};

export default async function QuestionBankPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.questionBank)}`);
  }

  await requirePremiumPage(ROUTES.questionBank);

  const sp = await searchParams;
  const pref = await getUserExamPreference(session.user.id);
  if (!pref) redirect(ROUTES.selectExam);

  const exam = EXAM_CATALOG[pref.examSlug];
  const defaultFieldId = fieldIdForExamSlug(pref.examSlug);
  let fieldParam = defaultFieldId;

  if (sp.field) {
    const resolvedFieldId = resolveQuestionBankFieldId(String(sp.field));
    if (fieldMatchesExamSlug(resolvedFieldId, pref.examSlug)) {
      fieldParam = resolvedFieldId;
    } else {
      const qs = new URLSearchParams();
      for (const [key, value] of Object.entries(sp)) {
        if (key === "field" || value == null) continue;
        qs.set(key, Array.isArray(value) ? value[0]! : value);
      }
      qs.set("field", defaultFieldId);
      redirect(`${ROUTES.questionBank}?${qs.toString()}`);
    }
  }
  const [countsPayload, dashboard] = await Promise.all([
    loadSubjectCountsForUser(session.user.id, fieldParam),
    getStudentDashboardData(session.user.id),
  ]);

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
          <StudyBankPractice
            preferredExamSlug={pref.examSlug}
            lockExam
            initialSubjectCounts={countsPayload?.counts}
            initialSubjectCountsFieldId={countsPayload?.fieldId}
            weakTopics={dashboard.weakTopics}
          />
        </Suspense>
      </PremiumGate>
    </div>
  );
}
