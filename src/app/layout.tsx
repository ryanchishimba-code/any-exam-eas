import type { Metadata } from "next";
import "./globals.css";
import { BetaBanner } from "@/components/BetaBanner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";
import { LoginModalRoot } from "@/components/auth/LoginModalRoot";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { PageViewTrackerBoundary } from "@/components/analytics/PageViewTrackerBoundary";
import { EmployeeAccessFab } from "@/components/EmployeeAccessFab";
import { buildRootMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <a href="#main-content" className="skip-link sr-only">
          Skip to main content
        </a>
        <ThemeProvider>
          <SessionProvider>
            <LoginModalRoot>
              <PageViewTrackerBoundary />
              <Navigation />
              <BetaBanner />
              <main id="main-content">{children}</main>
              <Footer />
              <EmployeeAccessFab />
            </LoginModalRoot>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
