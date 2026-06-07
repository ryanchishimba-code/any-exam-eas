"use client";

import { useCallback, useState } from "react";
import { AppTopNav } from "@/components/app/AppTopNav";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppMobileDrawer } from "@/components/app/AppMobileDrawer";
import { MobileBottomNav } from "@/components/app/MobileBottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <AppTopNav onMenuClick={openDrawer} />
      <AppMobileDrawer open={drawerOpen} onClose={closeDrawer} />
      <div className="mx-auto flex max-w-6xl gap-8 px-4 pb-24 pt-[var(--page-top)] sm:px-6 lg:pb-8">
        <AppSidebar />
        <main id="main-content" className="min-w-0 flex-1">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
