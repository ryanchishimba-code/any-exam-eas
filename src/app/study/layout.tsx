import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/signed-in-utilities.css";
import { requireStudyPage } from "@/lib/require-premium-page";
import { NOINDEX_ROBOTS } from "@/lib/seo/public-tool-metadata";

export const metadata: Metadata = {
  robots: NOINDEX_ROBOTS,
};

export default async function StudyLayout({ children }: { children: ReactNode }) {
  await requireStudyPage("/study");
  return <>{children}</>;
}
