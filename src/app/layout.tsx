import type { Metadata } from "next";
import "./globals.css";
import { DeferredPlatformScripts } from "@/components/analytics/DeferredPlatformScripts";
import { SiteShell } from "@/components/layout/SiteShell";
import { AppProviders } from "@/components/providers/AppProviders";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { inter, marketingFontVariables } from "@/lib/fonts/marketing-fonts";
import { buildRootMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${marketingFontVariables}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-[var(--color-bg)] font-sans antialiased text-[var(--color-ink)]`}
      >
        <a href="#main-content" className="skip-link sr-only">
          Skip to main content
        </a>
        <AppProviders>
          <SiteShell>{children}</SiteShell>
        </AppProviders>
        <DeferredPlatformScripts />
      </body>
    </html>
  );
}
