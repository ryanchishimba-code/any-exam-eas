import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { DeferredPlatformScripts } from "@/components/analytics/DeferredPlatformScripts";
import { GoogleTagBootstrap } from "@/components/analytics/GoogleTagBootstrap";
import { FirstTouchCapture } from "@/components/analytics/FirstTouchCapture";
import { SiteShell } from "@/components/layout/SiteShell";
import { AppProviders } from "@/components/providers/AppProviders";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { inter, marketingFontVariables } from "@/lib/fonts/marketing-fonts";
import { buildRootMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRootMetadata();

/**
 * No session read here. Reading the session cookie would force every public
 * page to render per request. The client session provider loads the signed-in
 * menu after hydration. Signed-in routes still read the session themselves.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${marketingFontVariables}`} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        <ThemeScript />
        <GoogleTagBootstrap />
        {/*
          Photo heroes must not leave room for the fold offer. The homepage
          static shell can include that bar (its client pathname is not "/"
          during prerender). The bar's top margin collapses onto the body,
          then hydration removes it and the hero jumps. This rule is in the
          head so the bar takes no space on the first paint.
        */}
        <style href="hero-cls" precedence="default">{`
          body:has([data-hero]) [data-public-offer]{display:none}
          body:has([data-hero]) header.pointer-events-none{background:transparent;border-bottom-color:transparent}
          .mkt-photo-hero{box-sizing:border-box;height:100svh;min-height:100svh;overflow:hidden}
        `}</style>
      </head>
      <body
        className={`${inter.className} min-h-screen bg-[var(--color-bg)] font-sans antialiased text-[var(--color-ink)]`}
      >
        <a href="#main-content" className="skip-link sr-only">
          Skip to main content
        </a>
        <AppProviders>
          <FirstTouchCapture />
          <SiteShell>{children}</SiteShell>
        </AppProviders>
        <DeferredPlatformScripts />
        <SpeedInsights />
      </body>
    </html>
  );
}
