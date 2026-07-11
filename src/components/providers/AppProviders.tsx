"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "@/components/SessionProvider";
import { LoginModalRoot } from "@/components/auth/LoginModalRoot";
import { PageViewTrackerBoundary } from "@/components/analytics/PageViewTrackerBoundary";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ShareFabLazy } from "@/components/share/ShareFabLazy";
import { RootChrome } from "@/components/layout/RootChrome";
import { ClientRecovery } from "@/components/ClientRecovery";
import { PwaRegister } from "@/components/PwaRegister";
import { AppQueryProvider } from "@/components/providers/AppQueryProvider";
import { UserAccessProvider } from "@/lib/client/user-access-context";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

/** Single client boundary for root providers — avoids fragile multi-client imports in layout. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AppQueryProvider>
        <GoogleAnalytics />
        <SessionProvider>
          <UserAccessProvider>
            <LoginModalRoot>
              <ClientRecovery />
              <PwaRegister />
              <PageViewTrackerBoundary />
              <RootChrome>{children}</RootChrome>
              <ShareFabLazy />
            </LoginModalRoot>
          </UserAccessProvider>
        </SessionProvider>
      </AppQueryProvider>
    </ThemeProvider>
  );
}
