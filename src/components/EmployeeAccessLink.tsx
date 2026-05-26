import Link from "next/link";
import { EMPLOYEE_LOGIN_PATH } from "@/lib/staff-routes";

/** Subtle employee portal entry — nav & footer. */
export function EmployeeAccessLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href={EMPLOYEE_LOGIN_PATH}
      className={`text-xs text-[var(--color-ink-muted)] transition-colors duration-200 hover:text-[var(--color-ink)] ${className}`}
    >
      Employee login
    </Link>
  );
}
