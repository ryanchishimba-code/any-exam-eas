import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SettingsClient } from "@/components/settings/SettingsClient";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import { ROUTES } from "@/lib/routes";
import { isExamSlug } from "@/lib/edtech/exams";

export const metadata = {
  title: "Settings — Any Exam Easy",
  description: "Manage your exam preference, MPJE state, and subscription.",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/auth/login?callbackUrl=${encodeURIComponent("/settings")}`);
  }

  const pref = await getUserExamPreference(session.user.id);
  const meta = await getUserEdtechMetadata(session.user.id);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-lg px-6 pb-24 pt-[var(--page-top)]">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Exam preferences, billing, and account.
        </p>
        <div className="mt-8">
          <SettingsClient
            email={session.user.email ?? ""}
            name={session.user.name}
            examSlug={pref?.examSlug && isExamSlug(pref.examSlug) ? pref.examSlug : null}
            mpjeStateCode={meta.mpjeStateCode}
            mpjeVariant={meta.mpjeVariant}
          />
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          <a href={ROUTES.practiceHub} className="text-teal-600 hover:underline dark:text-teal-400">
            Back to Study Hub
          </a>
        </p>
      </div>
    </div>
  );
}
