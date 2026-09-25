import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ReadinessBoard } from "@/components/readiness/ReadinessBoard";
import { Skeleton } from "@/components/ui/skeleton";
import { getCachedSession } from "@/lib/auth/session";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { canonicalPracticeFieldId } from "@/lib/edtech/question-bank-scope";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import { loadReadinessPage } from "@/lib/learning/readiness-check/service";
import { requireAppPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Readiness — Any Exam Easy",
  description: "Baseline and progress across your board, without a pass prediction.",
};

export const maxDuration = 60;

function ReadinessSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 pb-10" aria-busy="true" aria-label="Loading readiness">
      <Skeleton className="h-4 w-28 rounded-full" />
      <Skeleton className="h-12 w-4/5 max-w-xl rounded-xl" />
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
      <Skeleton className="h-48 w-full rounded-2xl" />
    </div>
  );
}

async function ReadinessContent({ userId }: { userId: string }) {
  const pref = await getUserExamPreference(userId);
  if (!pref) redirect(ROUTES.selectExam);
  const access = await requireAppPage(ROUTES.readiness);
  const metadata = pref.examSlug === "usmle" ? await getUserEdtechMetadata(userId) : null;
  const fieldId = canonicalPracticeFieldId(pref.examSlug, metadata?.usmleFieldId);
  const data = await loadReadinessPage({
    userId,
    examSlug: pref.examSlug,
    fieldId,
    examName: EXAM_CATALOG[pref.examSlug].shortName,
    hasStudyAccess: access.hasStudyAccess,
  });
  return <ReadinessBoard data={data} />;
}

export default async function ReadinessPage() {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.readiness)}`);
  }

  return (
    <Suspense fallback={<ReadinessSkeleton />}>
      <ReadinessContent userId={session.user.id} />
    </Suspense>
  );
}
