"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { AppTopNav } from "@/components/app/AppTopNav";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppMobileDrawer } from "@/components/app/AppMobileDrawer";
import { MobileBottomNav } from "@/components/app/MobileBottomNav";
import { SiteBottomBar } from "@/components/layout/SiteBottomBar";
import { shellUi } from "@/lib/layout/shell-ui";
import { isFullExamSessionRoute } from "@/lib/navigation/app-shell";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const immersiveFullExam = isFullExamSessionRoute(pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <AppTopNav onMenuClick={openDrawer} />
      <AppMobileDrawer open={drawerOpen} onClose={closeDrawer} />
      <div
        className={cn(
          shellUi.container,
          "flex gap-6 px-4 pt-[var(--page-top)] sm:px-6 xl:gap-8 xl:px-8",
          immersiveFullExam
            ? "pb-4 lg:pb-8"
            : "pb-[calc(6rem+env(safe-area-inset-bottom,0px))] lg:pb-8"
        )}
      >
        {!immersiveFullExam ? <AppSidebar /> : null}
        <main
          id="main-content"
          className={cn("min-w-0 flex-1", immersiveFullExam && "max-w-none")}
        >
          {children}
          {!immersiveFullExam ? (
            <SiteBottomBar className="mt-10 border-black/[0.05] pt-8" />
          ) : null}
        </main>
      </div>
      {!immersiveFullExam ? <MobileBottomNav /> : null}
    </div>
  );
}
