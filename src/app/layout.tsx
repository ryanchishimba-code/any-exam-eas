import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { LoginModalRoot } from "@/components/auth/LoginModalRoot";
import { PageViewTrackerBoundary } from "@/components/analytics/PageViewTrackerBoundary";
import { ShareFabLazy } from "@/components/share/ShareFabLazy";
import { RootChrome } from "@/components/layout/RootChrome";
import { ClientRecovery } from "@/components/ClientRecovery";
import { buildRootMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--color-bg)] font-sans antialiased text-[var(--color-ink)]">
        <a href="#main-content" className="skip-link sr-only">
          Skip to main content
        </a>
        <SessionProvider>
          <LoginModalRoot>
            <ClientRecovery />
            <PageViewTrackerBoundary />
            <RootChrome>{children}</RootChrome>
            <ShareFabLazy />
          </LoginModalRoot>
        </SessionProvider>
      </body>
    </html>
  );
}
