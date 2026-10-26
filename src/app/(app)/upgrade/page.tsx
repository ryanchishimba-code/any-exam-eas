import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { requireAppPage } from "@/lib/require-premium-page";
import { TrialUpgradeScreen } from "@/components/trial/TrialUpgradeScreen";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getExamScopedStats } from "@/lib/edtech/stats";
import { fieldIdForExamSlug } from "@/lib/edtech/question-bank-scope";
import { consentedTestimonialForExam } from "@/lib/trial/consented-testimonial";
import { runPageDb } from "@/lib/page-access-error";
import { ROUTES } from "@/lib/routes";
import type { UserAccess } from "@/lib/access-control";

export const metadata = {
  title: "Upgrade — Any Exam Easy",
  description: "Subscribe to keep your board prep progress.",
};

function shouldShowUpgrade(access: UserAccess): boolean {
  if (access.role === "staff") return false;
  if (access.role === "subscriber" && access.subscription.status === "active") return false;
  return access.role === "trial" || access.role === "free";
}

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: Promise<{ return?: string; reason?: string }>;
}) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.upgrade)}`);
  }

  const sp = await searchParams;
  const returnPath =
    typeof sp.return === "string" && sp.return.startsWith("/") ? sp.return : ROUTES.dashboard;
  const capReached = sp.reason === "trial_total";

  const [access, pref] = await runPageDb(() =>
    Promise.all([
      requireAppPage(ROUTES.upgrade),
      getUserExamPreference(session.user.id),
    ])
  );

  if (!shouldShowUpgrade(access)) {
    redirect(returnPath);
  }

  if (!pref) redirect(ROUTES.selectExam);

  const fieldId = fieldIdForExamSlug(pref.examSlug);
  const stats = await runPageDb(() =>
    getExamScopedStats(session.user.id, pref.examSlug, fieldId)
  );
  const exam = EXAM_CATALOG[pref.examSlug];
  const testimonial = consentedTestimonialForExam(pref.examSlug);

  return (
    <TrialUpgradeScreen
      examSlug={pref.examSlug}
      boardName={exam.shortName}
      questionsAnswered={stats.questionsAnswered}
      accuracyPct={stats.accuracyPct}
      testimonial={testimonial}
      returnPath={returnPath}
      capReached={capReached}
    />
  );
}
