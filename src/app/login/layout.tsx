import type { Metadata } from "next";
import "@/styles/landing-theme.css";
import { AuthMarketingShell } from "@/components/marketing/AuthMarketingShell";
import { NOINDEX_ROBOTS } from "@/lib/seo/public-tool-metadata";

export const metadata: Metadata = {
  robots: NOINDEX_ROBOTS,
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <AuthMarketingShell>{children}</AuthMarketingShell>;
}
