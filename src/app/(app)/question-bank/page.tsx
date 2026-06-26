import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Suspense } from "react";
import { PremiumGate } from "@/components/PremiumGate";
import { ProBenefitsCallout } from "@/components/ProBenefitsCallout";
import { StudyPageHeader } from "@/components/study/StudyPageHeader";
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
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Question Bank — Any Exam Easy",
  description: "Adaptive question bank with topic filters and detailed rationales.",
};

function QuestionBankPracticeSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-72 w-full rounded-[28px]" />
    </div>
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
      // Honor explicit deep links (e.g. USMLE step picker → usmle-step-1) by
      // switching the user's active exam instead of bouncing to their old one.
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

  const activeExam = EXAM_CATALOG[examSlug];

  return (
    <div className="w-full space-y-5">
      <StudyPageHeader
        eyebrow="Question Bank"
        title={`Practice ${activeExam.shortName}`}
        subtitle="Pick a topic, tune your session, and start — every question matches your exam."
        breadcrumbs={[{ label: "Dashboard", href: ROUTES.dashboard }]}
      />

      <ProBenefitsCallout />

      <PremiumGate callbackPath={ROUTES.questionBank}>
        <Suspense fallback={<QuestionBankPracticeSkeleton />}>
          <QuestionBankPracticeLoader
            userId={session.user.id}
            examSlug={examSlug}
            fieldParam={fieldParam}
          />
        </Suspense>
      </PremiumGate>
    </div>
  );
}
