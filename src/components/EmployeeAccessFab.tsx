"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";
import { EMPLOYEE_LOGIN_PATH } from "@/lib/staff-routes";

/** Homepage-only floating access — unobtrusive for students. */
export function EmployeeAccessFab() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <Link
      href={EMPLOYEE_LOGIN_PATH}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/90 px-4 py-2.5 text-xs font-medium text-[var(--color-ink-muted)] shadow-[var(--shadow-apple-sm)] backdrop-blur-md transition-all duration-300 hover:border-black/[0.12] hover:text-[var(--color-ink)] hover:shadow-md md:bottom-8 md:right-8"
      aria-label="Employee portal login"
    >
      <Shield size={14} strokeWidth={1.75} className="opacity-70" />
      <span className="hidden sm:inline">Employee</span>
    </Link>
  );
}
