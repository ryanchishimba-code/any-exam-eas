import { auth } from "@/auth";
import { AppPreferencesProvider } from "@/lib/client/app-preferences-context";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { AppShell } from "@/components/app/AppShell";
import { AppQueryNotices } from "@/components/app/AppQueryNotices";
import { TrialWelcomeRoot } from "@/components/auth/TrialWelcomeRoot";
import { SiteBottomBar } from "@/components/layout/SiteBottomBar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const pref = session?.user?.id ? await getUserExamPreference(session.user.id) : null;

  return (
    <AppPreferencesProvider initialExamSlug={pref?.examSlug ?? null}>
      <TrialWelcomeRoot />
      <AppShell
        footer={<SiteBottomBar className="mt-10 border-black/[0.05] pt-8" />}
      >
        <AppQueryNotices />
        {children}
      </AppShell>
    </AppPreferencesProvider>
  );
}
