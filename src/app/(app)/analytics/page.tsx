import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PremiumGate } from "@/components/PremiumGate";
import { ProUpgradeGate } from "@/components/ProUpgradeGate";
import { StudentAnalyticsDashboard } from "@/components/analytics/StudentAnalyticsDashboard";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { getUserExamPreference, resolveExamFieldId } from "@/lib/edtech/exam-preference";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getLearningProfileSnapshot } from "@/lib/learning/profile-service";
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";
import { studyUi } from "@/lib/study/study-ui";
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
  const fieldId = resolveExamFieldId(examSlug);

  const [dashboard, profile] = await Promise.all([
    getStudentDashboardData(session.user.id, [fieldId]),
    getLearningProfileSnapshot(session.user.id),
  ]);

  return (
    <div className={studyUi.page}>
      <PremiumGate callbackPath={ROUTES.analytics}>
        <ProUpgradeGate feature="advanced_analytics" callbackPath={ROUTES.pricing}>
          <StudentAnalyticsDashboard
            examSlug={examSlug}
            examName={examName}
            initialData={{ dashboard, profile }}
          />
        </ProUpgradeGate>
      </PremiumGate>
    </div>
  );
}
