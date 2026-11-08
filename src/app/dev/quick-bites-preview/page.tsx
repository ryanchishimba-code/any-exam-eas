import { notFound } from "next/navigation";
import { QuickBitesNavShot } from "@/app/dev/quick-bites-preview/nav-shot";
import { DashboardPageContent } from "@/components/app/DashboardPageContent";
import { VideoQuickBitesSection } from "@/components/quick-bites/VideoQuickBitesSection";
import { postTrialCheckoutHref, trialUpgradeCheckoutHref } from "@/lib/dashboard/upgrade-banner";
import { buildExamDayPlan } from "@/lib/learning/exam-day-plan";
import { QUICK_BITE_BOARDS } from "@/lib/quick-bites/boards";

export const metadata = {
  title: "Video Quick Bites preview",
  robots: { index: false, follow: false },
};

const plan = buildExamDayPlan({
  examSlug: "nclex",
  examName: "NCLEX-RN",
  fieldId: "nursing",
  now: new Date("2026-11-08T12:00:00.000Z"),
  totalAttempts: 80,
  recentAccuracyPct: 76,
  recentWindowAttempts: 80,
  openIncorrect: 6,
  topics: [
    {
      id: "management-of-care",
      label: "Management of Care",
      blueprintWeightPct: 18,
      attempts: 40,
      accuracyPct: 82,
      coveragePct: 55,
      practiceHref: "/question-bank?subjectId=management-of-care",
    },
  ],
});

/** Local fixture for Video Quick Bites screenshots. Not available in production. */
export default async function QuickBitesPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ access?: string; view?: string }>;
}) {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_TOUR_PREVIEW !== "1") {
    notFound();
  }

  const params = await searchParams;
  if (params.view === "nav") return <QuickBitesNavShot />;

  if (params.view === "dashboard") {
    return (
      <DashboardPageContent
        examSlug="nclex"
        stats={{ questionsAnswered: 80, questionsToday: 12, accuracyPct: 76, streakDays: 4 }}
        weakTopics={[]}
        spacedReview={{ dueCount: 0, weakDueCount: 0 }}
        roadmap={null}
        recentTests={[]}
        userName="Alex"
        examDayPlan={plan}
        tourSeen
        accountAttemptCount={80}
        hasPremiumAccess
        hasStudyAccess
        accuracyTrend={[{ date: "2026-11-08", label: "D1", accuracy: 70, attempts: 12 }]}
      />
    );
  }

  const locked = params.access === "free";
  const route = QUICK_BITE_BOARDS.nclex.route;

  return (
    <main id="main-content" className="dashboard-ui mx-auto min-h-screen w-full max-w-5xl px-3 py-4 sm:px-6">
      <VideoQuickBitesSection
        titleAs="h1"
        canPlay={!locked}
        upgradeHref={locked ? postTrialCheckoutHref(route) : trialUpgradeCheckoutHref(route)}
        upgradeLabel={locked ? "Subscribe to watch" : "Upgrade to watch"}
      />
    </main>
  );
}
