import type { ReactNode } from "react";
import { AdminStaffGate } from "@/components/admin/AdminStaffGate";
import { AdminPortalShell } from "@/components/admin/AdminPortalShell";
import { isNgnPilotEnabled } from "@/lib/assessment/pilot-flag";

export default function AdminPortalLayout({ children }: { children: ReactNode }) {
  return (
    <AdminStaffGate>
      <AdminPortalShell showNgnReview={isNgnPilotEnabled()}>{children}</AdminPortalShell>
    </AdminStaffGate>
  );
}
