import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { ExamRoadmapDashboard } from "@/components/roadmap/ExamRoadmapDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { isExamSlug } from "@/lib/edtech/exams";
import { getExamRoadmapData } from "@/lib/learning/exam-roadmap";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";
import { resolveUsmleRoadmapFieldId } from "@/lib/edtech/question-bank-scope";
import { UsmleStepTabs } from "@/components/usmle/UsmleStepTabs";

export const metadata = {
  title: "Exam Roadmap — Any Exam Easy",
  description:
    "Blueprint-aligned readiness tracker for USMLE Step 1, Step 2 CK, Step 3, NCLEX, NAPLEX, PANCE, and AANP FNP.",
};

function RoadmapSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}

async function RoadmapContent({
  userId,
  examSlug,
  usmleFieldId,
}: {
  userId: string;
  examSlug: ExamSlug;
  usmleFieldId?: string;
}) {
  const roadmap = await getExamRoadmapData(userId, examSlug, {
    usmleFieldId: examSlug === "usmle" ? usmleFieldId : undefined,
  });
  if (!roadmap) {
    return (
      <p className="text-sm text-[var(--color-ink-muted)]">
        Roadmap is not available for this exam yet.
      </p>
    );
  }
  return <ExamRoadmapDashboard data={roadmap} />;
}

async function RoadmapPageInner({
  examParam,
  stepParam,
}: {
  examParam?: string;
  stepParam?: string;
}) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.roadmap)}`);
  }

  await requirePremiumPage(ROUTES.roadmap);

  let examSlug: ExamSlug | null = isExamSlug(examParam ?? "") ? (examParam as ExamSlug) : null;
  if (!examSlug) {
    const pref = await getUserExamPreference(session.user.id);
    examSlug = pref?.examSlug ?? "nclex";
  }

  const usmleFieldId =
    examSlug === "usmle" ? resolveUsmleRoadmapFieldId(stepParam) : undefined;

  return (
    <>
      {examSlug === "usmle" ? (
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            USMLE step
          </p>
          <Suspense fallback={null}>
            <UsmleStepTabs />
          </Suspense>
        </div>
      ) : null}
      <RoadmapContent
        userId={session.user.id}
        examSlug={examSlug}
        usmleFieldId={usmleFieldId}
      />
    </>
  );
}

export default async function ExamRoadmapPage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string; step?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-[var(--page-top)] sm:px-6">
      <Suspense fallback={<RoadmapSkeleton />}>
        <RoadmapPageInner examParam={params.exam} stepParam={params.step} />
      </Suspense>
    </div>
  );
}
