import type { ReactNode } from "react";
import { InternalStaffGate } from "@/components/internal/InternalStaffGate";
import { InternalPortalShell } from "@/components/internal/InternalPortalShell";

export default function InternalLayout({ children }: { children: ReactNode }) {
  return (
    <InternalStaffGate>
      <InternalPortalShell>{children}</InternalPortalShell>
    </InternalStaffGate>
  );
}
