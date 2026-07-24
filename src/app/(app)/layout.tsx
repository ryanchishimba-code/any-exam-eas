import { getCachedSession } from "@/lib/auth/session";
import { AppPreferencesProvider } from "@/lib/client/app-preferences-context";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { AppShell } from "@/components/app/AppShell";
import { AppQueryNotices } from "@/components/app/AppQueryNotices";
import { TrialWelcomeRoot } from "@/components/auth/TrialWelcomeRoot";
import { SiteBottomBar } from "@/components/layout/SiteBottomBar";
import type { ExamSlug } from "@/types/edtech";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getCachedSession();
  let prefExamSlug: ExamSlug | null = null;
  if (session?.user?.id) {
    try {
      const pref = await getUserExamPreference(session.user.id);
      prefExamSlug = pref?.examSlug ?? null;
    } catch (error) {
      // Don't take down every app page for a transient Neon pref lookup failure.
      console.warn(
        "[app/layout] exam preference unavailable:",
        error instanceof Error ? error.message : error
      );
    }
  }

  return (
    <AppPreferencesProvider initialExamSlug={prefExamSlug}>
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
