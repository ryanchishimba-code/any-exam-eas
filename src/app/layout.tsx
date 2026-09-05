import type { Metadata } from "next";
import "./globals.css";
import { VercelWebAnalytics } from "@/components/analytics/VercelWebAnalytics";
import { AppProviders } from "@/components/providers/AppProviders";
import { ThemeScript } from "@/components/theme/ThemeScript";
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
        <AppProviders>{children}</AppProviders>
        <VercelWebAnalytics />
      </body>
    </html>
  );
}
