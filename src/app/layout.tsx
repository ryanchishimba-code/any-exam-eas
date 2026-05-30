import type { Metadata } from "next";
import "./globals.css";
import { BetaBanner } from "@/components/BetaBanner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { PageViewTrackerBoundary } from "@/components/analytics/PageViewTrackerBoundary";
import { EmployeeAccessFab } from "@/components/EmployeeAccessFab";
import { formatMonthlyPrice, formatTrialLabel } from "@/lib/site";

export const metadata: Metadata = {
  title: "Any Exam Easy — AI Board Exam Prep",
  description:
    `NCLEX NGN, NAPLEX, USMLE, INBDE & SAT prep. Adaptive AI questions from OER sources. ${formatTrialLabel()} → ${formatMonthlyPrice()}/mo.`,
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <SessionProvider>
            <PageViewTrackerBoundary />
            <Navigation />
            <BetaBanner />
            <main>{children}</main>
            <Footer />
            <EmployeeAccessFab />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
