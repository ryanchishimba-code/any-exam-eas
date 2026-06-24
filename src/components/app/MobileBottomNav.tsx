"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  BarChart3,
  BookMarked,
  BookOpen,
  Clock,
  LayoutGrid,
  Layers,
  Sparkles,
} from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import { highYieldTopicsHref, questionBankHref } from "@/lib/edtech/practice-links";
import { SHELL_CHROME_SPRING, STUDY_NAV_COLOR, STUDY_NAV_SPRING } from "@/lib/layout/nav-motion";
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
  const clinical = hasClinicalStudyTools(examSlug);
  const reduceMotion = useReducedMotion();

  const items = useMemo((): NavItem[] => {
    const bankHref = examSlug ? questionBankHref(examSlug) : ROUTES.questionBank;
    const examHref = examSlug ? fullExamHref(examSlug) : ROUTES.fullExam;
    const topicsHref = highYieldTopicsHref(examSlug ?? "nclex");

    const core: NavItem[] = [
      { href: ROUTES.dashboard, label: "Home", icon: LayoutGrid, exact: true },
      { href: bankHref, label: "Bank", icon: BookOpen, ariaLabel: "Question Bank" },
      { href: examHref, label: "Exam", icon: Clock, ariaLabel: "Full Exam" },
      { href: ROUTES.analytics, label: "Stats", icon: BarChart3, ariaLabel: "Analytics" },
    ];

    if (clinical) {
      return [
        ...core,
        { href: ROUTES.drugs300, label: "Drugs", icon: Layers, ariaLabel: "Top 500 Drugs" },
        { href: topicsHref, label: "Topics", icon: Sparkles, ariaLabel: "High-Yield Topics" },
      ];
    }

    return [
      ...core,
      { href: topicsHref, label: "Topics", icon: Sparkles, ariaLabel: "High-Yield Topics" },
      { href: ROUTES.library, label: "Library", icon: BookMarked, ariaLabel: "Library" },
    ];
  }, [clinical, examSlug]);

  return (
    <motion.nav
      initial={false}
      animate={{
        y: concealed ? "100%" : "0%",
        opacity: concealed ? 0 : 1,
      }}
      transition={reduceMotion ? { duration: 0 } : SHELL_CHROME_SPRING}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/[0.06] bg-white/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-lg lg:hidden"
      style={{ pointerEvents: concealed ? "none" : "auto" }}
      aria-label="Mobile study navigation"
      aria-hidden={concealed}
    >
      <LayoutGroup id="mobile-bottom-nav">
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
                  {active ? <MobileNavPill /> : null}
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
      </LayoutGroup>
    </motion.nav>
  );
}

function MobileNavPill() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return (
      <span
        className="absolute inset-x-1 top-1 bottom-1 rounded-xl bg-[var(--color-accent)]/10"
        aria-hidden
      />
    );
  }
  return (
    <motion.span
      layoutId="mobile-nav-pill"
      className="absolute inset-x-1 top-1 bottom-1 rounded-xl bg-[var(--color-accent)]/10 ring-1 ring-inset ring-[var(--color-accent)]/12"
      transition={STUDY_NAV_SPRING}
      aria-hidden
    />
  );
}
