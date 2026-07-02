import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { LoginModalRoot } from "@/components/auth/LoginModalRoot";
import { PageViewTrackerBoundary } from "@/components/analytics/PageViewTrackerBoundary";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ShareFabLazy } from "@/components/share/ShareFabLazy";
import { RootChrome } from "@/components/layout/RootChrome";
import { ClientRecovery } from "@/components/ClientRecovery";
import { PwaRegister } from "@/components/PwaRegister";
import { AppQueryProvider } from "@/lib/client/query-provider";
import {
  UserAccessProvider,
  type UserAccessState,
} from "@/lib/client/user-access-context";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { buildRootMetadata } from "@/lib/seo";
import { getCachedSession } from "@/lib/auth/session";
import { getUserAccess } from "@/lib/access-control";

export const metadata: Metadata = buildRootMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialAccess: UserAccessState | null = null;
  const session = await getCachedSession();
  if (session?.user?.id) {
    try {
      const access = await getUserAccess(session.user.id);
      initialAccess = {
        loading: false,
        hasPremiumAccess: access.hasPremiumAccess,
        hasAppAccess: access.hasAppAccess,
        status: access.subscription.status,
        role: access.role,
      };
    } catch {
      /* client will retry via /api/subscription/status */
    }
  }

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-[var(--color-bg)] font-sans antialiased text-[var(--color-ink)]">
        <a href="#main-content" className="skip-link sr-only">
          Skip to main content
        </a>
        <ThemeProvider>
          <AppQueryProvider>
            <GoogleAnalytics />
            <SessionProvider>
              <UserAccessProvider initialAccess={initialAccess}>
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
      </body>
    </html>
  );
}
