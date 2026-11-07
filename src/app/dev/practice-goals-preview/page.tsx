import { notFound } from "next/navigation";
import { StudentAnalyticsDashboard } from "@/components/analytics/StudentAnalyticsDashboard";
import { ReadinessProofPanel } from "@/components/dashboard/ReadinessProofPanel";
import { buildExamDayPlan } from "@/lib/learning/exam-day-plan";
import { emptyFormatPracticeStats } from "@/lib/study/practice-format";

export const metadata = {
  title: "Practice goals preview",
  robots: { index: false, follow: false },
};

const now = new Date("2026-11-07T12:00:00.000Z");

const plan = buildExamDayPlan({
  examSlug: "nclex",
  examName: "NCLEX-RN",
  fieldId: "nursing",
  now,
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
    {
      id: "pharmacology",
      label: "Pharmacological Therapies",
      blueprintWeightPct: 16,
      attempts: 4,
      accuracyPct: 50,
      coveragePct: 12,
      practiceHref: "/question-bank?subjectId=pharmacology",
    },
    {
      id: "safety",
      label: "Safety and Infection Control",
      blueprintWeightPct: 12,
      attempts: 20,
      accuracyPct: 70,
      coveragePct: 30,
      practiceHref: "/question-bank?subjectId=safety",
    },
  ],
});

/** Local fixture for 375px screenshots. Not available in production. */
export default function PracticeGoalsPreviewPage() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_TOUR_PREVIEW !== "1") {
    notFound();
  }

  return (
    <main id="main-content" className="mx-auto max-w-lg space-y-8 px-4 py-6">
      <section id="dashboard-practice-goals" aria-label="Dashboard">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          Dashboard
        </p>
        <ReadinessProofPanel
          readiness={plan.readiness}
          domainsLabel="Client Needs"
          coverage={plan.coverage}
          showLeadReason={false}
        />
      </section>
      <section id="analytics-practice-goals" aria-label="Analytics" className="space-y-4">
        <ReadinessProofPanel
          readiness={plan.readiness}
          domainsLabel="Client Needs"
          coverage={plan.coverage}
          showLeadReason={false}
        />
        <StudentAnalyticsDashboard
          examSlug="nclex"
          examName="NCLEX-RN"
          fieldId="nursing"
          initialData={{
            dashboard: {
              headline: {
                readinessScore: 91,
                studyStreakDays: 4,
                overallAccuracy: 76,
                totalAttempts: 80,
                trendDelta: 2,
                motivationalMessage: "Keep the mixed set going.",
              },
              accuracyTrend: [],
              weakTopics: [],
              recentTests: [],
              spacedReview: { dueCount: 0, weakDueCount: 0 },
              formatPractice: emptyFormatPracticeStats(),
            },
            profile: null,
          }}
          practice={plan.readiness}
        />
      </section>
    </main>
  );
}
