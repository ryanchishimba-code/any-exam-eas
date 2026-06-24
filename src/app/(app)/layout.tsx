import { AppShell } from "@/components/app/AppShell";
import { AppQueryNotices } from "@/components/app/AppQueryNotices";
import { TrialWelcomeRoot } from "@/components/auth/TrialWelcomeRoot";
import { SiteBottomBar } from "@/components/layout/SiteBottomBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TrialWelcomeRoot />
      <AppShell
        footer={<SiteBottomBar className="mt-10 border-black/[0.05] pt-8" />}
      >
        <AppQueryNotices />
        {children}
      </AppShell>
    </>
  );
}
