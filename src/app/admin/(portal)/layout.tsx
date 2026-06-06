import type { ReactNode } from "react";
import { AdminStaffGate } from "@/components/admin/AdminStaffGate";
import { AdminPortalShell } from "@/components/admin/AdminPortalShell";

export default function AdminPortalLayout({ children }: { children: ReactNode }) {
  return (
    <AdminStaffGate>
      <AdminPortalShell>{children}</AdminPortalShell>
    </AdminStaffGate>
  );
}
