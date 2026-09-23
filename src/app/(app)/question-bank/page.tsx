import { redirect } from "next/navigation";
import { Suspense } from "react";
import { RemediationLaunchNotice } from "@/components/study/RemediationLaunchNotice";
import { QuestionBankPracticeLoader } from "@/components/study/question-bank/QuestionBankPracticeLoader";
import { Skeleton } from "@/components/ui/skeleton";
import { getCachedSession } from "@/lib/auth/session";
import { loadStillIncorrectBankItemIds } from "@/lib/learning/review-incorrect";
import { buildTopicWeakness } from "@/lib/learning/weakness";
import { requireStudyPage } from "@/lib/require-premium-page";
import { runPageDb } from "@/lib/page-access-error";
import { ROUTES } from "@/lib/routes";
import { resolveQuestionBankRoute } from "@/lib/study/question-bank-route";
import {
  countEligibleWeakTopics,
  questionBankEmptyLaunch,
  type RemediationMode,
} from "@/lib/study/remediation-launch";
import type { ExamSlug } from "@/types/edtech";

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export const metadata = {
  title: "Question Bank — Any Exam Easy",
  description: "Adaptive question bank with topic filters and detailed rationales.",
};

/** Nursing/NCLEX subject counts + preference lookups can cold-start Neon. */
export const maxDuration = 60;
export const dynamic = "force-dynamic";

function QuestionBankRemediationEmpty({
  mode,
  fieldId,
  subjectId,
}: {
  mode: RemediationMode;
  fieldId: string;
  subjectId: string | null;
}) {
  return (
    <div className="question-bank-ui mx-auto w-full min-w-0 max-w-5xl px-1 pb-10">
      <RemediationLaunchNotice mode={mode} fieldId={fieldId} subjectId={subjectId} />
    </div>
  );
}

function QuestionBankPracticeSkeleton() {
  return (
    <div
      className="question-bank-ui mx-auto w-full min-w-0 max-w-5xl space-y-5 pb-10"
      aria-busy="true"
      aria-label="Loading question bank"
    >
      <div className="space-y-3">
        <Skeleton className="h-3 w-40 rounded-full" />
        <Skeleton className="h-10 w-64 max-w-full rounded-xl" />
        <Skeleton className="h-4 w-80 max-w-full rounded-full" />
      </div>
      <Skeleton className="h-12 w-56 rounded-xl" />
      <Skeleton className="h-72 w-full rounded-2xl" />
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
  // Retries live in the loader / Neon HTTP path. After they are exhausted,
  // this throws into question-bank/error.tsx (final fallback UI).
  return (
    <QuestionBankPracticeLoader
      userId={userId}
      examSlug={examSlug}
      fieldParam={fieldParam}
      usmleStepLabel={usmleStepLabel}
    />
  );
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
  const style = firstParam(sp.style);
  const subjectId = firstParam(sp.subjectId);

  // Same preflight for Review incorrect and Weak areas: 0 eligible returns the
  // empty notice here, before the practice Suspense skeleton.
  if (style === "review_incorrect" || style === "weak_areas") {
    try {
      const eligible =
        style === "review_incorrect"
          ? (
              await loadStillIncorrectBankItemIds({
                userId: session.user.id,
                fieldId: route.fieldParam,
                subjectId,
                limit: 1,
              })
            ).length
          : countEligibleWeakTopics(
              await buildTopicWeakness(session.user.id, route.fieldParam),
              subjectId
            );
      const emptyMode = questionBankEmptyLaunch(style, eligible);
      if (emptyMode) {
        return (
          <QuestionBankRemediationEmpty
            mode={emptyMode}
            fieldId={route.fieldParam}
            subjectId={subjectId}
          />
        );
      }
    } catch (error) {
      console.error("[question-bank] remediation empty check", error);
    }
  }

  return (
    <div className="w-full space-y-5">
      <Suspense fallback={<QuestionBankPracticeSkeleton />}>
        <QuestionBankContent userId={session.user.id} {...route} />
      </Suspense>
    </div>
  );
}
