import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ExamRoadmapDashboard } from "@/components/roadmap/ExamRoadmapDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { isExamSlug } from "@/lib/edtech/exams";
import { getExamRoadmapData } from "@/lib/learning/exam-roadmap";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

export const metadata = {
  title: "Exam Roadmap — Any Exam Easy",
  description:
    "Blueprint-aligned readiness tracker for NCLEX, USMLE, NAPLEX, and PANCE — see exactly what to focus on to pass.",
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
}: {
  userId: string;
  examSlug: ExamSlug;
}) {
  const roadmap = await getExamRoadmapData(userId, examSlug);
  if (!roadmap) {
    return (
      <p className="text-sm text-[var(--color-ink-muted)]">
        Roadmap is not available for this exam yet.
      </p>
    );
  }
  return <ExamRoadmapDashboard data={roadmap} />;
}

export default async function ExamRoadmapPage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.roadmap)}`);
  }

  await requirePremiumPage(ROUTES.roadmap);

  const params = await searchParams;
  let examSlug: ExamSlug | null = isExamSlug(params.exam ?? "") ? (params.exam as ExamSlug) : null;
  if (!examSlug) {
    const pref = await getUserExamPreference(session.user.id);
    examSlug = pref?.examSlug ?? "nclex";
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-[var(--page-top)] sm:px-6">
      <Suspense fallback={<RoadmapSkeleton />}>
        <RoadmapContent userId={session.user.id} examSlug={examSlug} />
      </Suspense>
    </div>
  );
}
