import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Suspense } from "react";
import { PremiumGate } from "@/components/PremiumGate";
import { StudyBankPractice } from "@/components/study/StudyBankPractice";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Question Bank — Any Exam Easy",
  description: "Adaptive question bank with topic filters and detailed rationales.",
};

export default async function QuestionBankPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.questionBank)}`);
  }

  await requirePremiumPage(ROUTES.questionBank);

  const pref = await getUserExamPreference(session.user.id);
  if (!pref) redirect(ROUTES.selectExam);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-600">
          Question Bank
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-ink)]">
          Browse &amp; practice questions
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--color-ink-muted)]">
          Pick a topic, choose how many questions you want, and review rationales — adaptive to
          your {EXAM_CATALOG[pref.examSlug].shortName} exam.
        </p>
      </header>

      <PremiumGate callbackPath={ROUTES.questionBank}>
        <Suspense fallback={<p className="text-sm text-[var(--color-ink-muted)]">Loading…</p>}>
          <StudyBankPractice />
        </Suspense>
      </PremiumGate>
    </div>
  );
}
