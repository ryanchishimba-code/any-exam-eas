import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getInternalSession } from "@/lib/internal/auth";
import { EMPLOYEE_LOGIN_PATH } from "@/lib/staff-routes";

/** Server gate — non-staff users cannot view internal portal pages. */
export async function InternalStaffGate({ children }: { children: ReactNode }) {
  const internal = await getInternalSession();
  if (!internal) {
    redirect(`${EMPLOYEE_LOGIN_PATH}?error=staff_only`);
  }
  return <>{children}</>;
}
