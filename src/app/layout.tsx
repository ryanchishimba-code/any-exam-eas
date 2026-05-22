import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Any Exam Easy — AI Exams & Learning Quilts",
  description:
    "USMLE, NCLEX, and NAPLEX-style practice for medicine, nursing, and pharmacy. Stratified subject areas with OER-backed AI. 7-day free trial, then $9/month.",
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
          <Navigation />
          <main>{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
