import { Suspense } from "react";
import { PremiumGate } from "@/components/PremiumGate";
import { PageShell } from "@/components/PageShell";
import { StudySubnav } from "@/components/StudySubnav";
import { StudentAnalyticsDashboard } from "@/components/analytics/StudentAnalyticsDashboard";

export const metadata = {
  title: "Study Analytics — Any Exam Easy",
  description:
    "Adaptive learning analytics: weak areas, pass probability, accuracy trends, and remediation plans.",
};

export default function StudyAnalyticsPage() {
  return (
    <PageShell
      eyebrow="Study Hub"
      title="Analytics & progress"
      description="Track readiness, weak topics, and predicted pass probability across NCLEX, USMLE, NAPLEX, and MPJE."
      maxWidth="max-w-5xl"
    >
      <StudySubnav />
      <PremiumGate callbackPath="/study/analytics">
        <Suspense
          fallback={
            <p className="mt-8 text-sm text-[var(--color-ink-muted)]">Loading analytics…</p>
          }
        >
          <StudentAnalyticsDashboard />
        </Suspense>
      </PremiumGate>
    </PageShell>
  );
}
