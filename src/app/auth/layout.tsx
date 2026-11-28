import type { Metadata } from "next";
import "@/styles/landing-theme.css";
import { AuthMarketingShell } from "@/components/marketing/AuthMarketingShell";
import { NOINDEX_ROBOTS } from "@/lib/seo/public-tool-metadata";

export const metadata: Metadata = {
  robots: NOINDEX_ROBOTS,
};

/**
 * `/login` redirects here. These routes sit outside `(marketing)`, so without
 * this wrapper `--color-accent` stays the app indigo.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthMarketingShell>{children}</AuthMarketingShell>;
}
