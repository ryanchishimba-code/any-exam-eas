"use client";

import { useCallback, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppTopNav } from "@/components/app/AppTopNav";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppMobileDrawer } from "@/components/app/AppMobileDrawer";
import { MobileBottomNav } from "@/components/app/MobileBottomNav";
import { shellUi } from "@/lib/layout/shell-ui";
import { SHELL_LAYOUT_TRANSITION } from "@/lib/layout/nav-motion";
import { isFullExamSessionRoute } from "@/lib/navigation/app-shell";
import { cn } from "@/lib/utils";

const SIDEBAR_WIDTH_CLASS = "w-60";

export function AppShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: ReactNode;
}) {
  const pathname = usePathname();
  const immersiveFullExam = isFullExamSessionRoute(pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] [background-image:radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent)]">
      <AppTopNav onMenuClick={openDrawer} />
      <AppMobileDrawer open={drawerOpen} onClose={closeDrawer} />
      <div
        className={cn(
          shellUi.container,
          "flex",
          SHELL_LAYOUT_TRANSITION,
          immersiveFullExam
            ? "max-w-none gap-0 px-0 pb-0 pt-[var(--nav-height)]"
            : cn(
                "gap-6 px-4 pt-[var(--page-top)] sm:px-6 xl:gap-8 xl:px-8",
                "pb-[calc(6rem+env(safe-area-inset-bottom,0px))] lg:pb-8"
              )
        )}
      >
        <div
          className={cn(
            "hidden shrink-0 overflow-hidden transition-[width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block",
            immersiveFullExam ? "w-0 opacity-0" : cn(SIDEBAR_WIDTH_CLASS, "opacity-100")
          )}
          aria-hidden={immersiveFullExam}
        >
          <div className={SIDEBAR_WIDTH_CLASS}>
            <AppSidebar />
          </div>
        </div>
        <main
          id="main-content"
          className={cn(
            "min-w-0 flex-1",
            SHELL_LAYOUT_TRANSITION,
            immersiveFullExam ? "max-w-none" : ""
          )}
        >
          {children}
          {!immersiveFullExam ? footer : null}
        </main>
      </div>
      <MobileBottomNav concealed={immersiveFullExam} />
    </div>
  );
}
