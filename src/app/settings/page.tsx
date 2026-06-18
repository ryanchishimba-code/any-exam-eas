import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { AppShell } from "@/components/app/AppShell";
import { SettingsClient } from "@/components/settings/SettingsClient";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { isExamSlug } from "@/lib/edtech/exams";
import { checkAndRecordAccountIp } from "@/lib/account-ip-limit";
import { getUserAccess } from "@/lib/access-control";
import { isAccountDisabled } from "@/lib/account-security";

export const metadata = {
  title: "Settings — Any Exam Easy",
  description: "Manage your exam preference and subscription.",
};

export default async function SettingsPage() {
  const session = await auth();
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

  const access = await getUserAccess(session.user.id);
  if (isAccountDisabled(access.accountStatus)) {
    redirect("/login?error=account_disabled&callbackUrl=%2Fsettings");
  }

  const pref = await getUserExamPreference(session.user.id);

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
