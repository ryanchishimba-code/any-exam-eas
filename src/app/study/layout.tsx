import type { ReactNode } from "react";
import { requireStudyPage } from "@/lib/require-premium-page";

export default async function StudyLayout({ children }: { children: ReactNode }) {
  await requireStudyPage("/study");
  return <>{children}</>;
}
