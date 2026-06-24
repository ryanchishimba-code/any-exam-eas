"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BarChart3, BookMarked, BookOpen, Bone, Clock, LayoutGrid, Sparkles } from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import { highYieldTopicsHref, questionBankHref } from "@/lib/edtech/practice-links";
import { STUDY_NAV_COLOR, STUDY_NAV_SPRING } from "@/lib/layout/nav-motion";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const BASE_ITEMS = [
  { href: ROUTES.dashboard, label: "Home", icon: LayoutGrid, exact: true },
  { href: ROUTES.library, label: "Library", icon: BookMarked, ariaLabel: "Library" },
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
    const bankHref = examSlug ? questionBankHref(examSlug) : ROUTES.questionBank;
    const withBank = BASE_ITEMS.map((item) =>
      item.href === ROUTES.questionBank ? { ...item, href: bankHref } : item
    );
    if (clinical) return withBank;
    return withBank.map((item) =>
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
      <LayoutGroup id="mobile-bottom-nav">
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
                    "relative flex min-h-[3rem] flex-col items-center justify-center gap-0.5 px-2 py-2 text-[10px] font-semibold",
                    STUDY_NAV_COLOR,
                    active ? "text-[var(--color-accent)]" : "text-[var(--color-ink-muted)]"
                  )}
                >
                  {active ? (
                    <MobileNavPill />
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
      </LayoutGroup>
    </nav>
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
