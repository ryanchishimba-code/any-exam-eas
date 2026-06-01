import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserAccess } from "@/lib/access-control";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { DashboardClient } from "@/components/DashboardClient";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout";

export const metadata = {
  title: "Dashboard — Any Exam Easy",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");

  await requirePremiumPage("/dashboard");
  const access = await getUserAccess(session.user.id);
  const hasPremiumAccess = access.hasPremiumAccess;

  return (
    <DashboardPageLayout userName={session.user.name} hasPremiumAccess={hasPremiumAccess}>
      {!hasPremiumAccess && <SubscriptionBanner access={access.subscription} />}
      <StudentDashboard />
      {!hasPremiumAccess && <DashboardClient access={access.subscription} compact />}
    </DashboardPageLayout>
  );
}
