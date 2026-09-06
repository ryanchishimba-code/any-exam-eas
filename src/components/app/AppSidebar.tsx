"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  BarChart3,
  Bone,
  Clock,
  FileText,
  LayoutGrid,
  Lock,
  PenLine,
  RefreshCw,
  SlidersHorizontal,
  Square,
  type LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SubscribeToContinueHint } from "@/components/app/SubscribeToContinueHint";
import { GlobalExamSwitcher } from "@/components/navigation/GlobalExamSwitcher";
import { useUserAccess } from "@/lib/client/use-user-access";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import { anatomyHref, questionBankHref } from "@/lib/edtech/practice-links-core";
import { STUDY_NAV_COLOR } from "@/lib/layout/nav-motion";
import { isExamPracticeLockedRoute } from "@/lib/navigation/app-shell";
import { ROUTES, fullExamHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  clinicalOnly?: boolean;
};

type NavSection = {
  id: string;
  label: string | null;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    id: "primary",
    label: null,
    items: [
      {
        id: "dashboard",
        href: ROUTES.dashboard,
        label: "Dashboard",
        icon: SlidersHorizontal,
        exact: true,
      },
      {
        id: "question-bank",
        href: "__question_bank__",
        label: "Question Bank",
        icon: PenLine,
      },
    ],
  },
  {
    id: "study-tools",
    label: "Study Tools",
    items: [
      {
        id: "high-yield",
        href: ROUTES.highYieldTopics,
        label: "High-Yield Topics",
        icon: Square,
      },
      { id: "library", href: ROUTES.library, label: "Library", icon: FileText },
    ],
  },
  {
    id: "clinical",
    label: "Clinical",
    items: [
      {
        id: "anatomy",
        href: "__anatomy__",
        label: "Anatomy Explorer",
        icon: Bone,
        clinicalOnly: true,
      },
      {
        id: "top-500",
        href: ROUTES.drugs300,
        label: "Top 500 Drugs",
        icon: RefreshCw,
        clinicalOnly: true,
      },
    ],
  },
  {
    id: "practice",
    label: "Practice",
    items: [
      { id: "full-exam", href: "__full_exam__", label: "Full Exam", icon: Clock },
      { id: "analytics", href: ROUTES.analytics, label: "Analytics", icon: BarChart3 },
    ],
  },
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
  if (path.startsWith(`${ROUTES.fullExam}/`)) {
    return pathname === path || pathname.startsWith(`${path}/`);
  }
  return exact ? pathname === path : pathname === path || pathname.startsWith(`${path}/`);
}

function resolveHref(item: NavItem, examSlug: string | null | undefined): string {
  if (item.href === "__question_bank__") {
    return examSlug ? questionBankHref(examSlug) : ROUTES.questionBank;
  }
  if (item.href === "__full_exam__") {
    return examSlug ? fullExamHref(examSlug) : ROUTES.fullExam;
  }
  if (item.href === "__anatomy__") {
    return examSlug ? anatomyHref(examSlug) : ROUTES.anatomy;
  }
  return item.href;
}

function SidebarNavLink({
  item,
  active,
  locked,
  onNavigate,
}: {
  item: Pick<NavItem, "href" | "label" | "icon">;
  active: boolean;
  locked?: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  if (locked) {
    return (
      <span
        aria-disabled="true"
        title="Subscribe to continue studying"
        className={cn(
          "study-nav-link cursor-not-allowed opacity-45",
          "text-[var(--color-ink-muted)]"
        )}
      >
        <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      data-active={active ? "true" : "false"}
      className={cn(
        "study-nav-link",
        STUDY_NAV_COLOR,
        active
          ? "text-[var(--color-accent)]"
          : "text-[var(--color-ink)] hover:bg-[color-mix(in_srgb,var(--color-ink)_4%,transparent)]"
      )}
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0",
          active ? "text-[var(--color-accent)]" : "text-[var(--color-ink-muted)]"
        )}
        strokeWidth={active ? 2 : 1.75}
        aria-hidden
      />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
    </Link>
  );
}

function SidebarSectionLabel({ label }: { label: string }) {
  return (
    <p className="mb-1.5 mt-5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)] first:mt-0">
      {label}
    </p>
  );
}

export function AppSidebar({ embedded = false, onNavigate }: Props) {
  const pathname = usePathname();
  const { examSlug } = useAppPreferences();
  const { hasStudyAccess, hasFreeTierAccess, loading: accessLoading } = useUserAccess();
  const clinical = hasClinicalStudyTools(examSlug);
  const examSwitchLocked = isExamPracticeLockedRoute(pathname);
  const studyLocked = !accessLoading && hasFreeTierAccess && !hasStudyAccess;

  const sections = useMemo(
    () =>
      NAV_SECTIONS.map((section) => ({
        ...section,
        items: section.items
          .filter((item) => !item.clinicalOnly || clinical)
          .map((item) => ({
            ...item,
            href: resolveHref(item, examSlug),
          })),
      })).filter((section) => section.items.length > 0),
    [clinical, examSlug]
  );

  return (
    <aside className={cn(embedded ? "block w-full" : "w-60 shrink-0")}>
      {embedded ? (
        <div className="mb-4">
          <GlobalExamSwitcher variant="mobile" onNavigate={onNavigate} />
        </div>
      ) : null}
      <nav
        className={cn(
          "study-nav-panel rounded-2xl px-2.5 py-4",
          embedded ? "static" : "sticky top-[calc(var(--nav-height)+1rem)]"
        )}
        aria-label="Study navigation"
      >
        <div className="mb-5 flex items-center gap-2.5 px-2.5">
          <BrandLogo href={ROUTES.dashboard} variant="nav" className="h-9 w-auto" />
          <Link
            href={ROUTES.dashboard}
            onClick={onNavigate}
            className="truncate text-[15px] font-bold tracking-tight text-[var(--color-ink)]"
          >
            AnyExamEasy
          </Link>
        </div>

        <div className="space-y-0.5">
          {sections.map((section) => (
            <div key={section.id}>
              {section.label ? <SidebarSectionLabel label={section.label} /> : null}
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <SidebarNavLink
                      item={item}
                      active={isNavActive(pathname, item.href, item.exact)}
                      locked={studyLocked && item.id !== "dashboard"}
                      onNavigate={onNavigate}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {studyLocked ? (
          <div className="mt-4 rounded-xl border border-dashed border-[var(--color-border)]/80 bg-[var(--color-surface)] px-3 py-2.5">
            <SubscribeToContinueHint />
          </div>
        ) : null}
        {embedded && !examSwitchLocked && !studyLocked ? (
          <Link
            href={`${ROUTES.selectExam}?switch=1`}
            onClick={onNavigate}
            className={cn(
              "study-nav-link mt-3 border border-dashed border-[var(--color-border)]/70 text-[var(--color-ink-muted)]",
              STUDY_NAV_COLOR,
              "hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
            )}
          >
            <LayoutGrid className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
            Switch exam
          </Link>
        ) : null}
      </nav>
    </aside>
  );
}
