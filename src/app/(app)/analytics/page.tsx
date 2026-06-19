import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PremiumGate } from "@/components/PremiumGate";
import { ProUpgradeGate } from "@/components/ProUpgradeGate";
import { StudentAnalyticsDashboard } from "@/components/analytics/StudentAnalyticsDashboard";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Analytics — Any Exam Easy",
  description: "Track readiness, weak topics, and accuracy trends across your board exam.",
};

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.analytics)}`);
  }

  await requirePremiumPage(ROUTES.analytics);

  const pref = await getUserExamPreference(session.user.id);
  if (!pref) redirect(ROUTES.selectExam);
  const examSlug = pref.examSlug;
  const examName = EXAM_CATALOG[examSlug].shortName;

  return (
    <div className="space-y-6">
      <PremiumGate callbackPath={ROUTES.analytics}>
        <ProUpgradeGate feature="advanced_analytics" callbackPath={ROUTES.pricing}>
          <div className="space-y-6">
            <header>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-accent)]">
                Analytics
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-ink)]">
                Track progress &amp; insights
              </h1>
              <p className="mt-2 max-w-2xl text-[var(--color-ink-muted)]">
                Accuracy trends, weak areas, and readiness signals for {examName}.
              </p>
            </header>
            <Suspense
              fallback={<p className="text-sm text-[var(--color-ink-muted)]">Loading analytics…</p>}
            >
              <StudentAnalyticsDashboard examSlug={examSlug} examName={examName} />
            </Suspense>
          </div>
        </ProUpgradeGate>
      </PremiumGate>
    </div>
  );
}
