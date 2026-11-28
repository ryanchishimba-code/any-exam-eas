import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/signed-in-utilities.css";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { NOINDEX_ROBOTS } from "@/lib/seo/public-tool-metadata";

export const metadata: Metadata = {
  robots: NOINDEX_ROBOTS,
};

export default async function EngineLayout({ children }: { children: ReactNode }) {
  await requirePremiumPage("/engine/test");
  return <>{children}</>;
}
