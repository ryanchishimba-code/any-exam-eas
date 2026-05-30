import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserAccess } from "@/lib/access-control";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { DashboardClient } from "@/components/DashboardClient";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";

export const metadata = {
  title: "Dashboard — Any Exam Easy",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");

  await requirePremiumPage("/dashboard");
  const access = await getUserAccess(session.user.id);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-[var(--page-top)]">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
          Dashboard
        </p>
        <h1 className="apple-display mt-2 text-[clamp(2rem,5vw,2.75rem)]">
          Hello{session.user.name ? `, ${session.user.name}` : ""}.
        </h1>
        <p className="apple-subhead mt-3 max-w-xl text-[1.0625rem]">
          Track your accuracy, target weak topics, and jump back into studying.
        </p>

        <SubscriptionBanner access={access.subscription} />

        <StudentDashboard />

        <DashboardClient access={access.subscription} compact />
      </div>
    </div>
  );
}
