import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";
import { LoginModalRoot } from "@/components/auth/LoginModalRoot";
import { PageViewTrackerBoundary } from "@/components/analytics/PageViewTrackerBoundary";
import { buildRootMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <a href="#main-content" className="skip-link sr-only">
          Skip to main content
        </a>
        <SessionProvider>
          <LoginModalRoot>
            <PageViewTrackerBoundary />
            <Navigation />
            <main id="main-content">{children}</main>
            <Footer />
          </LoginModalRoot>
        </SessionProvider>
      </body>
    </html>
  );
}
