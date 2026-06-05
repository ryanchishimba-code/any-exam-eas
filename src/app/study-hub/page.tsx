import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserAccess } from "@/lib/access-control";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";
import { DashboardClient } from "@/components/DashboardClient";
import { StudyHubPageLayout } from "@/components/study-hub/StudyHubPageLayout";
import { StudyHubModeSelector } from "@/components/study-hub/StudyHubModeSelector";
import { StudyHubExamBanks } from "@/components/study-hub/StudyHubExamBanks";
import { Top500DrugsCard } from "@/components/study-hub/Top500DrugsCard";
import { ProgressOverview } from "@/components/study-hub/ProgressOverview";
import { getDashboardQuickStats } from "@/lib/dashboard/stats";
import { STUDY_HUB_PATH, STUDY_HUB_PROGRESS_ID } from "@/lib/study-hub/config";
import { StudyHubSessionSummary } from "@/components/study-hub/StudyHubSessionSummary";

export const metadata = {
  title: "Study Hub — Any Exam Easy",
  description: "NCLEX, USMLE, NAPLEX, and MPJE — timed exams and custom question bank practice.",
};

export default async function StudyHubPage() {
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?callbackUrl=${STUDY_HUB_PATH}`);

  await requirePremiumPage(STUDY_HUB_PATH);
  const access = await getUserAccess(session.user.id);
  const hasPremiumAccess = access.hasPremiumAccess;

  const progress = await getDashboardQuickStats(session.user.id);

  return (
    <StudyHubPageLayout userName={session.user.name}>
      {!hasPremiumAccess && <SubscriptionBanner access={access.subscription} />}
      <div className="space-y-12">
        <Suspense fallback={null}>
          <StudyHubSessionSummary />
        </Suspense>

        <Suspense fallback={null}>
          <StudyHubExamBanks />
        </Suspense>

        <StudyHubModeSelector />

        <section>
          <h2 className="text-lg font-semibold text-slate-900">Top 500 drugs</h2>
          <p className="mt-1 text-sm text-slate-600">One high-yield list shared across NCLEX, USMLE, NAPLEX, and MPJE.</p>
          <div className="mt-4">
            <Top500DrugsCard />
          </div>
        </section>

        <section id={STUDY_HUB_PROGRESS_ID} className="scroll-mt-28">
          <h2 className="text-lg font-semibold text-slate-900">Progress</h2>
          <p className="mt-1 text-sm text-slate-600">Last 30 days at a glance.</p>
          <div className="mt-4">
            <ProgressOverview stats={progress} />
          </div>
        </section>
      </div>
      {!hasPremiumAccess && <DashboardClient access={access.subscription} compact />}
    </StudyHubPageLayout>
  );
}
