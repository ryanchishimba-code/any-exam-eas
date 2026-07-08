"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  BarChart3,
  BookOpen,
  Clock,
  LayoutGrid,
  Map,
} from "lucide-react";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { questionBankHref } from "@/lib/edtech/practice-links-core";
import { STUDY_NAV_COLOR } from "@/lib/layout/nav-motion";
import { ROUTES, fullExamHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutGrid;
  exact?: boolean;
  ariaLabel?: string;
};

function navHrefPath(href: string) {
  return href.split("?")[0]!;
}

export function MobileBottomNav({ concealed = false }: { concealed?: boolean }) {
  const pathname = usePathname();
  const { examSlug } = useAppPreferences();

  const items = useMemo((): NavItem[] => {
    const bankHref = examSlug ? questionBankHref(examSlug) : ROUTES.questionBank;
    const examHref = examSlug ? fullExamHref(examSlug) : ROUTES.fullExam;

    return [
      { href: ROUTES.dashboard, label: "Home", icon: LayoutGrid, exact: true },
      { href: ROUTES.roadmap, label: "Plan", icon: Map, ariaLabel: "Study Roadmap" },
      { href: bankHref, label: "Bank", icon: BookOpen, ariaLabel: "Question Bank" },
      { href: examHref, label: "Exam", icon: Clock, ariaLabel: "Full Exam" },
      { href: ROUTES.analytics, label: "Stats", icon: BarChart3, ariaLabel: "Analytics" },
    ];
  }, [examSlug]);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-black/[0.06] bg-white/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-lg transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
        concealed ? "pointer-events-none translate-y-full opacity-0" : "translate-y-0 opacity-100"
      )}
      aria-label="Mobile study navigation"
      aria-hidden={concealed}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-1">
        {items.map((item) => {
          const { href, label, icon: Icon } = item;
          const exact = item.exact;
          const ariaLabel = item.ariaLabel;
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
                  "relative flex min-h-[3rem] flex-col items-center justify-center gap-0.5 px-2 py-2 text-[10px] font-semibold",
                  STUDY_NAV_COLOR,
                  active ? "text-[var(--color-accent)]" : "text-[var(--color-ink-muted)]"
                )}
              >
                {active ? (
                  <span
                    className="absolute inset-x-1 top-1 bottom-1 rounded-xl bg-[var(--color-accent)]/10 ring-1 ring-inset ring-[var(--color-accent)]/12"
                    aria-hidden
                  />
                ) : null}
                <Icon
                  className={cn(
                    "relative h-5 w-5 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    active && "scale-110"
                  )}
                  aria-hidden
                />
                <span className="relative">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
