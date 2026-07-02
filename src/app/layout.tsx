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
import { UserAccessProvider } from "@/lib/client/user-access-context";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { buildRootMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      </body>
    </html>
  );
}
