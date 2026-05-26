import type { Metadata } from "next";
import "./globals.css";
import { BetaBanner } from "@/components/BetaBanner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";
import { PageViewTrackerBoundary } from "@/components/analytics/PageViewTrackerBoundary";
import { EmployeeAccessFab } from "@/components/EmployeeAccessFab";
import { formatMonthlyPrice, formatTrialLabel } from "@/lib/site";

export const metadata: Metadata = {
  title: "Any Exam Easy — AI Exams & Learning Quilts",
  description:
    `USMLE, NCLEX, and NAPLEX-style practice for medicine, nursing, and pharmacy. Beta — ${formatTrialLabel()} or ${formatMonthlyPrice()}/month.`,
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
        <SessionProvider>
          <PageViewTrackerBoundary />
          <Navigation />
          <BetaBanner />
          <main>{children}</main>
          <Footer />
          <EmployeeAccessFab />
        </SessionProvider>
      </body>
    </html>
  );
}
