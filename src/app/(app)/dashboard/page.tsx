import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { requireAppPage } from "@/lib/require-premium-page";
import { getStudyUsageSnapshot } from "@/lib/study/usage-limits";
import { resolveDashboardUpgradeContext } from "@/lib/dashboard/upgrade-banner";
import type { UserAccess } from "@/lib/access-control";
import { DashboardPageContent } from "@/components/app/DashboardPageContent";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { resolveCanonicalPracticeFieldId } from "@/lib/edtech/question-bank-scope";
import { getUserEdtechMetadata, getExamTestDate } from "@/lib/edtech/user-metadata";
import { getExamScopedStats } from "@/lib/edtech/stats";
import { getExamRoadmapData } from "@/lib/learning/exam-roadmap";
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";
import { enrichWeakTopicsWithStudyLinks } from "@/lib/learning/enrich-weak-topics";
import { runPageDb } from "@/lib/page-access-error";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

export const metadata = {
  title: "Dashboard — Any Exam Easy",
  description: "Your personalized NCLEX, USMLE, NAPLEX, and PANCE study dashboard.",
};

/** Neon cold starts + parallel dashboard queries can exceed the default 10s on Vercel. */
export const maxDuration = 60;

function DashboardSkeleton() {
  return (
    <div className="dashboard-ui mx-auto w-full min-w-0 max-w-5xl space-y-5 pb-10">
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-36 w-full rounded-2xl" />
      <Skeleton className="h-48 w-full rounded-2xl" />
    </div>
  );
}

async function settled<T>(promise: Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.warn(`[dashboard] ${label} degraded:`, error instanceof Error ? error.message : error);
    return fallback;
  }
}

async function DashboardContent({
  userId,
  userName,
  access,
  examSlug,
}: {
  userId: string;
  userName?: string | null;
  access: UserAccess;
  examSlug: ExamSlug;
}) {
  // USMLE-aware field so stats, weak topics, and roadmap match the question bank.
  const fieldId = await resolveCanonicalPracticeFieldId(userId, examSlug);

  // Wave 1: core study state (keep concurrency low — Prisma connection_limit=1 on Vercel).
  const [stats, dashboard] = await runPageDb(() =>
    Promise.all([
      getExamScopedStats(userId, examSlug, fieldId),
      getStudentDashboardData(userId, [fieldId]),
    ])
  );

  // Wave 2: secondary panels — degrade instead of blanking the whole dashboard.
  const [roadmap, metadata, usage] = await Promise.all([
    settled(
      getExamRoadmapData(userId, examSlug, {
        usmleFieldId: examSlug === "usmle" ? fieldId : undefined,
      }),
      null,
      "roadmap"
    ),
    settled(getUserEdtechMetadata(userId), null, "metadata"),
    settled(getStudyUsageSnapshot(access), null, "usage"),
  ]);

  const testDate = metadata ? getExamTestDate(metadata, examSlug) : null;

  const weakTopics = enrichWeakTopicsWithStudyLinks(
    examSlug,
    dashboard.weakTopics.slice(0, 6),
    { fieldId }
  );

  return (
    <DashboardPageContent
      examSlug={examSlug}
      stats={stats}
      headline={{
        readinessScore: dashboard.headline.readinessScore,
        motivationalMessage: dashboard.headline.motivationalMessage,
        trendDelta: dashboard.headline.trendDelta,
      }}
      weakTopics={weakTopics}
      spacedReview={dashboard.spacedReview}
      roadmap={roadmap}
      recentTests={dashboard.recentTests}
      userName={userName}
      testDate={testDate}
      hasPremiumAccess={access.hasPremiumAccess}
      upgrade={usage ? resolveDashboardUpgradeContext(access, usage) : null}
      practiceFieldId={fieldId}
    />
  );
}

export default async function DashboardPage() {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.dashboard)}`);
  }

  const [access, pref] = await runPageDb(() =>
    Promise.all([
      requireAppPage(ROUTES.dashboard),
      getUserExamPreference(session.user.id),
    ])
  );
  if (!pref) redirect(ROUTES.selectExam);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent
        key={pref.examSlug}
        userId={session.user.id}
        userName={session.user.name}
        access={access}
        examSlug={pref.examSlug}
      />
    </Suspense>
  );
}
