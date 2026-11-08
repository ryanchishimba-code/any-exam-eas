"use client";

import { SessionProvider } from "next-auth/react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppPreferencesProvider } from "@/lib/client/app-preferences-context";

/** Signed-in NCLEX menu so the Quick Bites nav entry can be screenshotted at 375px. */
export function QuickBitesNavShot() {
  return (
    <SessionProvider
      session={{
        user: { id: "preview", name: "Preview", email: "preview@example.com" },
        expires: "2099-01-01T00:00:00.000Z",
      }}
    >
      <AppPreferencesProvider initialExamSlug="nclex">
        <div className="study-home-accent dashboard-ui min-h-screen bg-[var(--color-bg)] p-3">
          <AppSidebar />
        </div>
      </AppPreferencesProvider>
    </SessionProvider>
  );
}
