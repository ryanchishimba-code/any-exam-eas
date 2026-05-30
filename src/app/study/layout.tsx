import type { ReactNode } from "react";
import { requirePremiumPage } from "@/lib/require-premium-page";

export default async function StudyLayout({ children }: { children: ReactNode }) {
  await requirePremiumPage("/study");
  return <>{children}</>;
}
