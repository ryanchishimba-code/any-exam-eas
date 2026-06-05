import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserAccess } from "@/lib/access-control";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";
import { DashboardClient } from "@/components/DashboardClient";
import { StudyGubPageLayout } from "@/components/studygub/StudyGubPageLayout";
import { ExamQuestionBankCards } from "@/components/studygub/ExamQuestionBankCards";
import { Top500DrugsCard } from "@/components/studygub/Top500DrugsCard";
import { STUDYGUB_PATH } from "@/lib/studygub/config";

export const metadata = {
  title: "StudyGub — Any Exam Easy",
  description: "NCLEX, USMLE, and NAPLEX question banks plus the Top 500 drug list.",
};

export default async function StudyGubPage() {
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?callbackUrl=${STUDYGUB_PATH}`);

  await requirePremiumPage(STUDYGUB_PATH);
  const access = await getUserAccess(session.user.id);
  const hasPremiumAccess = access.hasPremiumAccess;

  return (
    <StudyGubPageLayout userName={session.user.name}>
      {!hasPremiumAccess && <SubscriptionBanner access={access.subscription} />}
      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Question banks</h2>
          <p className="mt-1 text-sm text-slate-600">
            Pick your exam — each bank is tailored to NCLEX, USMLE, or NAPLEX.
          </p>
          <div className="mt-4">
            <ExamQuestionBankCards />
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Top 500 drugs</h2>
          <p className="mt-1 text-sm text-slate-600">
            One high-yield drug list for every exam — generic, brand, class, and indications.
          </p>
          <div className="mt-4">
            <Top500DrugsCard />
          </div>
        </section>
      </div>
      {!hasPremiumAccess && <DashboardClient access={access.subscription} compact />}
    </StudyGubPageLayout>
  );
}
