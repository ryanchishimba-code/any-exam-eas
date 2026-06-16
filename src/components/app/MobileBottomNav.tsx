"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BarChart3, BookMarked, BookOpen, Bone, Clock, LayoutGrid, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import { highYieldTopicsHref } from "@/lib/edtech/practice-links";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const BASE_ITEMS = [
  { href: ROUTES.dashboard, label: "Home", icon: LayoutGrid, exact: true },
  { href: ROUTES.reference, label: "Ref", icon: BookMarked, ariaLabel: "Study Reference" },
  { href: ROUTES.anatomy, label: "Anatomy", icon: Bone, ariaLabel: "Anatomy Explorer", clinicalOnly: true },
  { href: ROUTES.fullExam, label: "Exam", icon: Clock },
  { href: ROUTES.questionBank, label: "Bank", icon: BookOpen, ariaLabel: "Question Bank" },
  { href: ROUTES.analytics, label: "Stats", icon: BarChart3 },
] as const;

function navHrefPath(href: string) {
  return href.split("?")[0]!;
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { examSlug } = useAppPreferences();
  const clinical = hasClinicalStudyTools(examSlug);

  const items = useMemo(() => {
    if (clinical) return BASE_ITEMS;
    return BASE_ITEMS.map((item) =>
      "clinicalOnly" in item && item.clinicalOnly
        ? {
            href: highYieldTopicsHref(examSlug ?? "nclex"),
            label: "Topics",
            icon: Sparkles,
            ariaLabel: "High-Yield Topics",
          }
        : item
    );
  }, [clinical, examSlug]);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/[0.06] bg-white/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-lg lg:hidden"
      aria-label="Mobile study navigation"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-1">
        {items.map((item) => {
          const { href, label, icon: Icon } = item;
          const exact = "exact" in item && item.exact;
          const ariaLabel = "ariaLabel" in item ? item.ariaLabel : undefined;
          const hrefPath = navHrefPath(href);
          const active = exact
            ? pathname === hrefPath
            : pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
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
