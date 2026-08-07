import { redirect } from "next/navigation";
import { Suspense } from "react";
import { QuestionBankPracticeLoader } from "@/components/study/question-bank/QuestionBankPracticeLoader";
import { StudyBankPracticeLazy } from "@/components/study/StudyBankPracticeLazy";
import { Skeleton } from "@/components/ui/skeleton";
import { getCachedSession } from "@/lib/auth/session";
import { requireStudyPage } from "@/lib/require-premium-page";
import { runPageDb } from "@/lib/page-access-error";
import { ROUTES } from "@/lib/routes";
import { resolveQuestionBankRoute } from "@/lib/study/question-bank-route";
import type { ExamSlug } from "@/types/edtech";

export const metadata = {
  title: "Question Bank — Any Exam Easy",
  description: "Adaptive question bank with topic filters and detailed rationales.",
};

/** Nursing/NCLEX subject counts + preference lookups can cold-start Neon. */
export const maxDuration = 60;
export const dynamic = "force-dynamic";

function QuestionBankPracticeSkeleton() {
  return (
    <div className="question-bank-ui mx-auto w-full min-w-0 max-w-5xl space-y-5 pb-10">
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-10 w-48 rounded-xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  );
}

async function QuestionBankContent({
  userId,
  examSlug,
  fieldParam,
  usmleStepLabel,
}: {
  userId: string;
  examSlug: ExamSlug;
  fieldParam: string;
  usmleStepLabel?: string;
}) {
  try {
    return (
      <QuestionBankPracticeLoader
        userId={userId}
        examSlug={examSlug}
        fieldParam={fieldParam}
        usmleStepLabel={usmleStepLabel}
      />
    );
  } catch (error) {
    // Last-resort shell so NCLEX/NAPLEX never blank on a loader race.
    console.error(
      "[question-bank] loader crashed; rendering empty setup shell:",
      error instanceof Error ? error.message : error
    );
    return (
      <StudyBankPracticeLazy
        preferredExamSlug={examSlug}
        lockExam
        initialFieldId={fieldParam}
        initialSubjectCounts={null}
        weakTopics={[]}
        usmleStepLabel={usmleStepLabel}
        topicCount={null}
        totalQuestions={null}
      />
    );
  }
}

export default async function QuestionBankPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.questionBank)}`);
  }

  await requireStudyPage(ROUTES.questionBank);
  const route = await runPageDb(() => resolveQuestionBankRoute(session.user.id, sp));

  return (
    <div className="w-full space-y-5">
      <Suspense fallback={<QuestionBankPracticeSkeleton />}>
        <QuestionBankContent userId={session.user.id} {...route} />
      </Suspense>
    </div>
  );
}
