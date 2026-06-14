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

  const exam = EXAM_CATALOG[pref.examSlug];

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <header className="px-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
          Question Bank
        </p>
        <h1 className="mt-1.5 text-[28px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[32px]">
          Practice {exam.shortName}
        </h1>
        <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
          Pick a topic, tune your session, and start — every question matches your exam.
        </p>
      </header>

      <PremiumGate callbackPath={ROUTES.questionBank}>
        <Suspense fallback={<p className="text-sm text-[var(--color-ink-muted)]">Loading…</p>}>
          <StudyBankPractice preferredExamSlug={pref.examSlug} lockExam />
        </Suspense>
      </PremiumGate>
    </div>
  );
}
