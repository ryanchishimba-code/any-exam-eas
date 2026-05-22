import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/DashboardClient";

export const metadata = {
  title: "Dashboard — Any Exam Easy",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [exams, quilts, progress, subscription] = await Promise.all([
    prisma.exam.count({ where: { userId: session.user.id } }),
    prisma.learningQuilt.count({ where: { userId: session.user.id } }),
    prisma.progressRecord.count({ where: { userId: session.user.id } }),
    prisma.subscription.findUnique({ where: { userId: session.user.id } }),
  ]);

  const trialEnd = subscription?.trialEndsAt
    ? new Date(subscription.trialEndsAt).toLocaleDateString()
    : null;

  return (
    <div className="apple-page">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-[var(--page-top)]">
        <p className="apple-eyebrow">Dashboard</p>
        <h1 className="apple-title mt-2">
          Hello{session.user.name ? `, ${session.user.name}` : ""}.
        </h1>
        <p className="apple-lede mt-3">
          Track progress, manage lesson plans, and jump back into studying.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Stat label="Exams generated" value={exams} />
          <Stat label="Learning quilts" value={quilts} />
          <Stat label="Progress events" value={progress} />
        </div>

        <p className="mt-6 text-[0.875rem] text-[var(--color-ink-muted)]">
          Subscription:{" "}
          <span className="font-medium text-[var(--color-ink)]">
            {subscription?.status ?? "none"}
          </span>
          {trialEnd && subscription?.status === "trialing" && (
            <> · Trial ends {trialEnd}</>
          )}
        </p>

        <DashboardClient />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="apple-card p-6">
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{label}</p>
    </div>
  );
}
