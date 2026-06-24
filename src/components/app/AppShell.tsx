"use client";

import { useCallback, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { AppTopNav } from "@/components/app/AppTopNav";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppMobileDrawer } from "@/components/app/AppMobileDrawer";
import { MobileBottomNav } from "@/components/app/MobileBottomNav";
import { shellUi } from "@/lib/layout/shell-ui";
import {
  SHELL_CHROME_SPRING,
  SHELL_LAYOUT_TRANSITION,
} from "@/lib/layout/nav-motion";
import { isFullExamSessionRoute } from "@/lib/navigation/app-shell";
import { cn } from "@/lib/utils";

const SIDEBAR_WIDTH = 224; // w-56

export function AppShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: ReactNode;
}) {
  const pathname = usePathname();
  const immersiveFullExam = isFullExamSessionRoute(pathname);
  const reduceMotion = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const chromeTransition = reduceMotion ? { duration: 0 } : SHELL_CHROME_SPRING;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
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
        <motion.div
          initial={false}
          animate={{
            width: immersiveFullExam ? 0 : SIDEBAR_WIDTH,
            opacity: immersiveFullExam ? 0 : 1,
          }}
          transition={chromeTransition}
          className="hidden shrink-0 overflow-hidden lg:block"
          aria-hidden={immersiveFullExam}
        >
          <div className="w-56">
            <AppSidebar />
          </div>
        </motion.div>
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
