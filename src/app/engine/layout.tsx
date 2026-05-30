import type { ReactNode } from "react";
import { requirePremiumPage } from "@/lib/require-premium-page";

export default async function EngineLayout({ children }: { children: ReactNode }) {
  await requirePremiumPage("/engine/test");
  return <>{children}</>;
}
