import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { RootChrome } from "@/components/layout/RootChrome";

/** Server shell so the shared footer is not pulled into the client bundle. */
export function SiteShell({ children }: { children: ReactNode }) {
  return <RootChrome footer={<Footer />}>{children}</RootChrome>;
}
