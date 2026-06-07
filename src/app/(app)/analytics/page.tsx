import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PremiumGate } from "@/components/PremiumGate";
import { StudentAnalyticsDashboard } from "@/components/analytics/StudentAnalyticsDashboard";
import { requirePremiumPage } from "@/lib/require-premium-page";
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

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-600">Analytics</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-ink)]">
          Track progress &amp; insights
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--color-ink-muted)]">
          Accuracy trends, weak areas, and readiness signals for your primary exam.
        </p>
      </header>

      <PremiumGate callbackPath={ROUTES.analytics}>
        <Suspense
          fallback={<p className="text-sm text-[var(--color-ink-muted)]">Loading analytics…</p>}
        >
          <StudentAnalyticsDashboard />
        </Suspense>
      </PremiumGate>
    </div>
  );
}
