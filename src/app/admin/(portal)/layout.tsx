import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminStaffGate } from "@/components/admin/AdminStaffGate";
import { NOINDEX_ROBOTS } from "@/lib/seo/public-tool-metadata";

export const metadata: Metadata = {
  robots: NOINDEX_ROBOTS,
};
import { AdminPortalShell } from "@/components/admin/AdminPortalShell";
import { isNgnPilotEnabled } from "@/lib/assessment/pilot-flag";

export default function AdminPortalLayout({ children }: { children: ReactNode }) {
  return (
    <AdminStaffGate>
      <AdminPortalShell showNgnReview={isNgnPilotEnabled()}>{children}</AdminPortalShell>
    </AdminStaffGate>
  );
}
