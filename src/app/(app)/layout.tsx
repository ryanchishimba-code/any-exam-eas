import { AppShell } from "@/components/app/AppShell";
import { SiteBottomBar } from "@/components/layout/SiteBottomBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      footer={<SiteBottomBar className="mt-10 border-black/[0.05] pt-8" />}
    >
      {children}
    </AppShell>
  );
}
