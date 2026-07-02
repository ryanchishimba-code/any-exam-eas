import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCachedSession } from "@/lib/auth/session";
import { AppShell } from "@/components/app/AppShell";
import { SettingsClient } from "@/components/settings/SettingsClient";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { isExamSlug } from "@/lib/edtech/exams";
import { checkAndRecordAccountIp } from "@/lib/account-ip-limit";
import { getUserAccess } from "@/lib/access-control";
import { isAccountDisabled } from "@/lib/account-security";

export const metadata = {
  title: "Settings — Any Exam Easy",
  description: "Manage your exam preference and subscription.",
};

function SettingsSkeleton() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="mt-8 h-96 w-full rounded-2xl" />
      </div>
    </AppShell>
  );
}

async function SettingsPageInner() {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`/auth/login?callbackUrl=${encodeURIComponent("/settings")}`);
  }

  const ipCheck = await checkAndRecordAccountIp(
    session.user.id,
    session.user.role,
    undefined,
    await headers(),
    session.user.email
  );
  if (!ipCheck.ok) {
    redirect(
      `/login?error=${ipCheck.reason}&callbackUrl=${encodeURIComponent("/settings")}`
    );
  }

  const [access, pref] = await Promise.all([
    getUserAccess(session.user.id),
    getUserExamPreference(session.user.id),
  ]);

  if (isAccountDisabled(access.accountStatus)) {
    redirect("/login?error=account_disabled&callbackUrl=%2Fsettings");
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-ink)]">
          Settings
        </h1>
        <p className="mt-2 text-[var(--color-ink-muted)]">
          Exam preferences, billing, and account.
        </p>
        <div className="mt-8">
          <SettingsClient
            email={session.user.email ?? ""}
            name={session.user.name}
            examSlug={pref?.examSlug && isExamSlug(pref.examSlug) ? pref.examSlug : null}
          />
        </div>
      </div>
    </AppShell>
  );
}

export default async function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsPageInner />
    </Suspense>
  );
}
