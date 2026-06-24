"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  BarChart3,
  BookMarked,
  BookOpen,
  Bone,
  Clock,
  LayoutGrid,
  Layers,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { GlobalExamSwitcher } from "@/components/navigation/GlobalExamSwitcher";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import { questionBankHref } from "@/lib/edtech/practice-links";
import { STUDY_NAV_COLOR, STUDY_NAV_SPRING } from "@/lib/layout/nav-motion";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  clinicalOnly?: boolean;
};

const BASE_NAV_ITEMS: NavItem[] = [
  { id: "dashboard", href: ROUTES.dashboard, label: "Dashboard", icon: LayoutGrid, exact: true },
  { id: "library", href: ROUTES.library, label: "Library", icon: BookMarked },
  { id: "full-exam", href: ROUTES.fullExam, label: "Full Exam", icon: Clock },
  { id: "question-bank", href: "__question_bank__", label: "Question Bank", icon: BookOpen },
  {
    id: "anatomy",
    href: ROUTES.anatomy,
    label: "Anatomy Explorer",
    icon: Bone,
    clinicalOnly: true,
  },
  { id: "analytics", href: ROUTES.analytics, label: "Analytics", icon: BarChart3 },
  { id: "high-yield", href: ROUTES.highYieldTopics, label: "High-Yield Topics", icon: Sparkles },
  { id: "top-500", href: ROUTES.drugs300, label: "Top 500", icon: Layers, clinicalOnly: true },
];

type Props = {
  embedded?: boolean;
  onNavigate?: () => void;
};

function navPath(href: string) {
  return href.split("?")[0]!;
}

function isNavActive(pathname: string, href: string, exact?: boolean) {
  const path = navPath(href);
  return exact ? pathname === path : pathname === path || pathname.startsWith(`${path}/`);
}

function SidebarNavLink({
  item,
  active,
  onNavigate,
  layoutId,
}: {
  item: Pick<NavItem, "href" | "label" | "icon">;
  active: boolean;
  onNavigate?: () => void;
  layoutId: string;
}) {
  const reduceMotion = useReducedMotion();
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium",
        STUDY_NAV_COLOR,
        active
          ? "text-[var(--color-accent)]"
          : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
      )}
    >
      {active ? (
        reduceMotion ? (
          <span
            className="absolute inset-0 rounded-xl bg-[var(--color-accent)]/10 ring-1 ring-inset ring-[var(--color-accent)]/15"
            aria-hidden
          />
        ) : (
          <motion.span
            layoutId={layoutId}
            className="absolute inset-0 rounded-xl bg-[var(--color-accent)]/10 ring-1 ring-inset ring-[var(--color-accent)]/15 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            transition={STUDY_NAV_SPRING}
            aria-hidden
          />
        )
      ) : null}
      <Icon
        className={cn(
          "relative h-4 w-4 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          active && "scale-[1.06]"
        )}
        aria-hidden
      />
      <span className="relative min-w-0 flex-1 truncate">{item.label}</span>
    </Link>
  );
}

export function AppSidebar({ embedded = false, onNavigate }: Props) {
  const pathname = usePathname();
  const { examSlug } = useAppPreferences();
  const clinical = hasClinicalStudyTools(examSlug);
  const pillId = embedded ? "study-sidebar-pill-mobile" : "study-sidebar-pill-desktop";

  const navItems = useMemo(
    () =>
      BASE_NAV_ITEMS.filter((item) => !item.clinicalOnly || clinical).map((item) =>
        item.href === "__question_bank__"
          ? {
              ...item,
              href: examSlug ? questionBankHref(examSlug) : ROUTES.questionBank,
            }
          : item
      ),
    [clinical, examSlug]
  );

  return (
    <aside className={cn(embedded ? "block w-full" : "hidden w-56 shrink-0 lg:block")}>
      {embedded ? (
        <div className="mb-4">
          <GlobalExamSwitcher variant="mobile" onNavigate={onNavigate} />
        </div>
      ) : null}
      <nav
        className={cn(
          "rounded-2xl border border-black/[0.06] bg-white p-3 shadow-[var(--shadow-apple-sm)]",
          embedded ? "static" : "sticky top-[calc(var(--nav-height)+1rem)]"
        )}
        aria-label="Study navigation"
      >
        <LayoutGroup id={pillId}>
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.id}>
                <SidebarNavLink
                  item={item}
                  active={isNavActive(pathname, item.href, item.exact)}
                  onNavigate={onNavigate}
                  layoutId={`${pillId}-indicator`}
                />
              </li>
            ))}
          </ul>
        </LayoutGroup>
        {embedded ? (
          <Link
            href={`${ROUTES.selectExam}?switch=1`}
            onClick={onNavigate}
            className={cn(
              "mt-2 flex items-center gap-2.5 rounded-xl border border-dashed border-black/[0.08] px-3 py-2.5 text-sm font-medium text-[var(--color-ink-muted)]",
              STUDY_NAV_COLOR,
              "hover:border-teal-300 hover:bg-[var(--color-surface)] hover:text-teal-700"
            )}
          >
            <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden />
            Switch exam
          </Link>
        ) : null}
      </nav>
    </aside>
  );
}
