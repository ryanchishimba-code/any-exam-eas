import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { requireAppPage } from "@/lib/require-premium-page";
import { getStudyUsageSnapshot } from "@/lib/study/usage-limits";
import { resolveDashboardUpgradeContext } from "@/lib/dashboard/upgrade-banner";
import type { UserAccess } from "@/lib/access-control";
import { DashboardPageContent } from "@/components/app/DashboardPageContent";
import { AccessBlockedNotice } from "@/components/AccessBlockedNotice";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import {
  canonicalPracticeFieldId,
  fieldIdForExamSlug,
} from "@/lib/edtech/question-bank-scope";
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
  // Kick metadata early so non-USMLE wave-1 work overlaps the preference read;
  // USMLE still awaits it for the step-aware field id (React-cached within the request).
  const metadataPromise = getUserEdtechMetadata(userId);
  const fieldId =
    examSlug === "usmle"
      ? canonicalPracticeFieldId(
          "usmle",
          (await settled(metadataPromise, {}, "metadata")).usmleFieldId
        )
      : fieldIdForExamSlug(examSlug);

  // Wave 1: core study state (keep concurrency low — Prisma connection_limit=1 on Vercel).
  const [stats, dashboard] = await runPageDb(() =>
    Promise.all([
      getExamScopedStats(userId, examSlug, fieldId),
      getStudentDashboardData(userId, [fieldId], { skipAccuracyTrend: true }),
    ])
  );

  // Wave 2: secondary panels — degrade instead of blanking the whole dashboard.
  const [roadmap, metadata, usage, mastery] = await Promise.all([
    settled(
      getExamRoadmapData(userId, examSlug, {
        usmleFieldId: examSlug === "usmle" ? fieldId : undefined,
      }),
      null,
      "roadmap"
    ),
    settled(metadataPromise, null, "metadata"),
    settled(getStudyUsageSnapshot(access), null, "usage"),
    examSlug === "nclex"
      ? settled(
          import("@/lib/engine/mastery/dashboard").then((m) =>
            m.loadNclexMasteryDashboard(userId)
          ),
          null,
          "mastery"
        )
      : examSlug === "naplex"
        ? settled(
            import("@/lib/engine/mastery/dashboard").then((m) =>
              m.loadNaplexMasteryDashboard(userId)
            ),
            null,
            "mastery"
          )
        : examSlug === "usmle"
          ? settled(
              import("@/lib/engine/mastery/dashboard").then((m) => {
                const step =
                  fieldId === "usmle-step-1"
                    ? "step1"
                    : fieldId === "usmle-step-3"
                      ? "step3"
                      : "step2";
                return m.loadUsmleMasteryDashboard(userId, step);
              }),
              null,
              "mastery"
            )
          : Promise.resolve(null),
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
      masteryRollup={mastery?.rollup ?? null}
      masteryMapTiles={mastery?.mapTiles ?? null}
    />
  );
}

export default async function DashboardPage() {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.dashboard)}`);
  }

  // Access + exam pref in parallel (session/pref are React-cached with layout).
  const [access, pref] = await Promise.all([
    runPageDb(() => requireAppPage(ROUTES.dashboard)),
    runPageDb(() => getUserExamPreference(session.user.id)),
  ]);

  if (access.blockReason === "email_unverified") {
    return (
      <AccessBlockedNotice reason="email_unverified" email={session.user.email} />
    );
  }

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
