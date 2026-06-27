import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Suspense } from "react";
import { PremiumGate } from "@/components/PremiumGate";
import { ProBenefitsCallout } from "@/components/ProBenefitsCallout";
import { QuestionBankPracticeLoader } from "@/components/study/question-bank/QuestionBankPracticeLoader";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import {
  examSlugForFieldId,
  fieldIdForExamSlug,
  fieldMatchesExamSlug,
  resolveQuestionBankFieldId,
  syncExamPreferenceForField,
} from "@/lib/edtech/question-bank-scope";
import { isPracticeFieldId } from "@/lib/subjects/field-ids";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import { isUsmleFieldId } from "@/lib/exam-prep/usmle/steps";
import { usmleStepDefinition, defaultUsmleFieldId } from "@/lib/exam-prep/usmle/steps";
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Question Bank — Any Exam Easy",
  description: "Adaptive question bank with topic filters and detailed rationales.",
};

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
}: {
  userId: string;
  examSlug: keyof typeof EXAM_CATALOG;
  fieldParam: string;
}) {
  const dashboard = await getStudentDashboardData(userId);
  const meta = examSlug === "usmle" ? await getUserEdtechMetadata(userId) : null;
  const usmleStep =
    examSlug === "usmle"
      ? usmleStepDefinition(meta?.usmleFieldId ?? defaultUsmleFieldId())
      : null;

  return (
    <QuestionBankPracticeLoader
      userId={userId}
      examSlug={examSlug}
      fieldParam={fieldParam}
      usmleStepLabel={usmleStep?.shortName}
      hubStats={{
        readinessScore: dashboard.headline.readinessScore,
        streakDays: dashboard.headline.studyStreakDays,
      }}
    />
  );
}

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

  let examSlug = pref.examSlug;
  const defaultFieldId = fieldIdForExamSlug(examSlug);
  let fieldParam = defaultFieldId;

  if (!sp.field && examSlug === "usmle") {
    const meta = await getUserEdtechMetadata(session.user.id);
    if (meta.usmleFieldId && isUsmleFieldId(meta.usmleFieldId)) {
      fieldParam = meta.usmleFieldId;
    }
  }

  if (sp.field) {
    const resolvedFieldId = resolveQuestionBankFieldId(String(sp.field));
    if (fieldMatchesExamSlug(resolvedFieldId, examSlug)) {
      fieldParam = resolvedFieldId;
    } else if (isPracticeFieldId(resolvedFieldId) && examSlugForFieldId(resolvedFieldId)) {
      const synced = await syncExamPreferenceForField(session.user.id, resolvedFieldId);
      if (synced) {
        examSlug = synced;
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

  if (!sp.field) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) {
      if (value == null) continue;
      qs.set(key, Array.isArray(value) ? value[0]! : value);
    }
    qs.set("field", fieldParam);
    if (!qs.has("mode")) qs.set("mode", "bank");
    redirect(`${ROUTES.questionBank}?${qs.toString()}`);
  }

  return (
    <div className="w-full space-y-5">
      <ProBenefitsCallout />

      <PremiumGate callbackPath={ROUTES.questionBank}>
        <Suspense fallback={<QuestionBankPracticeSkeleton />}>
          <QuestionBankContent
            userId={session.user.id}
            examSlug={examSlug}
            fieldParam={fieldParam}
          />
        </Suspense>
      </PremiumGate>
    </div>
  );
}
