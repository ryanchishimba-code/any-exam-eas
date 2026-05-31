import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/auth";
import { getInternalSession } from "@/lib/internal/auth";
import { staffLoginUrl } from "@/lib/staff-routes";

/** Server gate — non-staff users cannot view internal portal pages. */
export async function InternalStaffGate({ children }: { children: ReactNode }) {
  const internal = await getInternalSession();
  if (!internal) {
    const session = await auth();
    if (!session?.user?.id) {
      redirect(staffLoginUrl());
    }
    redirect("/study?error=staff_only");
  }
  return <>{children}</>;
}
