import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/signed-in-utilities.css";
import { InternalStaffGate } from "@/components/internal/InternalStaffGate";
import { NOINDEX_ROBOTS } from "@/lib/seo/public-tool-metadata";

export const metadata: Metadata = {
  robots: NOINDEX_ROBOTS,
};
import { InternalPortalShell } from "@/components/internal/InternalPortalShell";

export default function InternalLayout({ children }: { children: ReactNode }) {
  return (
    <InternalStaffGate>
      <InternalPortalShell>{children}</InternalPortalShell>
    </InternalStaffGate>
  );
}
