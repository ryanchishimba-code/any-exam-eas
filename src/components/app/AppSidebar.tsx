"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BarChart3, BookMarked, BookOpen, Bone, Clock, LayoutGrid, Layers, Sparkles } from "lucide-react";
import { GlobalExamSwitcher } from "@/components/navigation/GlobalExamSwitcher";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import { questionBankHref } from "@/lib/edtech/practice-links";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const BASE_NAV_ITEMS = [
  { href: ROUTES.dashboard, label: "Dashboard", icon: LayoutGrid, exact: true },
  { href: ROUTES.library, label: "Library", icon: BookMarked },
  { href: ROUTES.fullExam, label: "Full Exam", icon: Clock },
  { href: "__question_bank__", label: "Question Bank", icon: BookOpen },
  { href: ROUTES.anatomy, label: "Anatomy Explorer", icon: Bone, clinicalOnly: true },
  { href: ROUTES.analytics, label: "Analytics", icon: BarChart3 },
  { href: ROUTES.highYieldTopics, label: "High-Yield Topics", icon: Sparkles },
  { href: ROUTES.drugs300, label: "Top 500", icon: Layers, clinicalOnly: true },
] as const;

type Props = {
  embedded?: boolean;
  onNavigate?: () => void;
};

export function AppSidebar({ embedded = false, onNavigate }: Props) {
  const pathname = usePathname();
  const { examSlug } = useAppPreferences();
  const clinical = hasClinicalStudyTools(examSlug);

  const navItems = useMemo(
    () =>
      BASE_NAV_ITEMS.filter((item) => !("clinicalOnly" in item && item.clinicalOnly) || clinical).map(
        (item) =>
          item.href === "__question_bank__"
            ? { ...item, href: examSlug ? questionBankHref(examSlug) : ROUTES.questionBank }
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
          "space-y-1 rounded-2xl border border-black/[0.06] bg-white p-3 shadow-[var(--shadow-apple-sm)]",
          embedded ? "static" : "sticky top-[calc(var(--nav-height)+1rem)]"
        )}
        aria-label="Study navigation"
      >
        {navItems.map((item) => {
          const { href, label, icon: Icon } = item;
          const exact = "exact" in item && item.exact;
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
        {embedded ? (
          <Link
            href={`${ROUTES.selectExam}?switch=1`}
            onClick={onNavigate}
            className="mt-2 flex items-center gap-2.5 rounded-xl border border-dashed border-black/[0.08] px-3 py-2.5 text-sm font-medium text-[var(--color-ink-muted)] transition hover:border-teal-300 hover:text-teal-700"
          >
            <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden />
            Switch exam
          </Link>
        ) : null}
      </nav>
    </aside>
  );
}
