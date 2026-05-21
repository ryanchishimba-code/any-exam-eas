import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Any Exam Easy — AI Exams & Learning Quilts",
  description:
    "Generate practice exams from any field with web-informed AI. Learn with adaptive flashcard quilts. 7-day free trial, then $9/month.",
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
