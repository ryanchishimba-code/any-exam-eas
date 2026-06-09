"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookMarked, BookOpen, Clock, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: ROUTES.dashboard, label: "Home", icon: LayoutGrid, exact: true },
  { href: ROUTES.questionBank, label: "Bank", icon: BookOpen },
  { href: ROUTES.reference, label: "Ref", icon: BookMarked, ariaLabel: "Reference" },
  { href: ROUTES.fullExam, label: "Exam", icon: Clock },
  { href: ROUTES.analytics, label: "Stats", icon: BarChart3 },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/[0.06] bg-white/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-lg lg:hidden"
      aria-label="Mobile study navigation"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-1">
        {ITEMS.map((item) => {
          const { href, label, icon: Icon } = item;
          const exact = "exact" in item && item.exact;
          const ariaLabel = "ariaLabel" in item ? item.ariaLabel : undefined;
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-label={ariaLabel}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-[3rem] flex-col items-center justify-center gap-0.5 px-2 py-2 text-[10px] font-semibold transition-colors",
                  active ? "text-[var(--color-accent)]" : "text-[var(--color-ink-muted)]"
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="mobile-nav-pill"
                    className="absolute inset-x-1 top-1 bottom-1 rounded-xl bg-[var(--color-accent)]/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <Icon className="relative h-5 w-5" aria-hidden />
                <span className="relative">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
