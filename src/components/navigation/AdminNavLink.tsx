"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { useIsAdmin } from "@/lib/client/admin-access";
import { ROUTES } from "@/lib/routes";
import { usePathname } from "next/navigation";

type AdminNavLinkProps = {
  className?: string;
  variant?: "pill" | "compact";
};

/** Top-right admin entry — only rendered for admin+ roles. */
export function AdminNavLink({ className = "", variant = "pill" }: AdminNavLinkProps) {
  const { isAdmin, loading } = useIsAdmin();
  const pathname = usePathname();

  if (loading || !isAdmin) return null;

  const active = pathname === ROUTES.admin.root || pathname.startsWith(`${ROUTES.admin.root}/`);

  if (variant === "compact") {
    return (
      <Link
        href={ROUTES.admin.root}
        className={`inline-flex items-center gap-1.5 text-xs font-medium text-teal-800 hover:text-teal-950 dark:text-teal-200 dark:hover:text-teal-50 ${className}`}
        aria-current={active ? "page" : undefined}
      >
        <Shield className="h-3.5 w-3.5" aria-hidden />
        Admin
      </Link>
    );
  }

  return (
    <Link
      href={ROUTES.admin.root}
      className={`aee-nav-admin inline-flex items-center gap-1.5 rounded-full border border-teal-200/80 bg-teal-50/90 px-3 py-1.5 text-xs font-semibold text-teal-900 shadow-sm transition hover:border-teal-300 hover:bg-teal-100 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-100 dark:hover:bg-teal-500/20 ${active ? "ring-2 ring-teal-600/30" : ""} ${className}`}
      aria-current={active ? "page" : undefined}
    >
      <Shield className="h-3.5 w-3.5" aria-hidden />
      <span className="hidden sm:inline">Admin</span>
    </Link>
  );
}
