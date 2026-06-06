import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/auth";
import { getAdminSession } from "@/lib/admin/auth";
import { adminLoginUrl } from "@/lib/admin/routes";

/** Server gate — only admin+ roles can view admin dashboard pages. */
export async function AdminStaffGate({ children }: { children: ReactNode }) {
  const admin = await getAdminSession();
  if (!admin) {
    const session = await auth();
    if (!session?.user?.id) {
      redirect(adminLoginUrl());
    }
    redirect("/study?error=admin_only");
  }
  return <>{children}</>;
}
